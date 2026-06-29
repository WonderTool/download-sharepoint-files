const fs = require("fs");
const path = require("path");
const { createRequire } = require("module");
const readline = require("readline/promises");

const NODE_MODULES =
  process.env.CODEX_NODE_MODULES ||
  "/Users/mbp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/";
const runtimeRequire = createRequire(NODE_MODULES);
const { chromium } = runtimeRequire("playwright");

const outDir = process.env.OUT_DIR || process.cwd();
const profileDir =
  process.env.SHAREPOINT_PROFILE_DIR || "/private/tmp/sharepoint-download-profile";
const executablePath =
  process.env.CHROME_EXECUTABLE ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Fill this array before running.
const items = [
  // { name: "01_example", url: "https://tenant.sharepoint.com/:x:/s/site/SHARE_ID?e=TOKEN" },
];

function parseDownloadUrl(rawUrl) {
  const url = new URL(rawUrl);
  const parts = url.pathname.split("/").filter(Boolean);
  const sIndex = parts.indexOf("s");
  if (sIndex === -1 || !parts[sIndex + 1]) {
    throw new Error(`Cannot parse SharePoint site from URL: ${rawUrl}`);
  }
  const site = parts[sIndex + 1];
  const share = parts[parts.length - 1];
  const e = url.searchParams.get("e");
  const base = `https://${url.host}/sites/${site}/_layouts/15/download.aspx`;
  return `${base}?share=${encodeURIComponent(share)}${e ? `&e=${encodeURIComponent(e)}` : ""}`;
}

function extensionFromHeaders(headers, fallbackUrl) {
  const disposition = headers["content-disposition"] || "";
  const filenameStar = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  const filenamePlain = disposition.match(/filename="?([^";]+)"?/i);
  const filename = filenameStar
    ? decodeURIComponent(filenameStar[1])
    : filenamePlain
      ? filenamePlain[1]
      : "";
  const ext = path.extname(filename);
  if (ext) return ext;

  const sourcePath = new URL(fallbackUrl).pathname;
  if (sourcePath.includes("/:x:/")) return ".xlsx";
  if (sourcePath.includes("/:w:/")) return ".docx";
  if (sourcePath.includes("/:b:/")) return ".pdf";
  return ".bin";
}

function isLoginResponse(response, body) {
  const url = response.url();
  const type = response.headers()["content-type"] || "";
  if (url.includes("login.microsoftonline.com")) return true;
  if (type.includes("text/html") && /sign in|登入|login/i.test(body)) return true;
  return false;
}

async function waitForUser(page) {
  await page.goto(items[0].url, { waitUntil: "domcontentloaded" });
  console.log("Browser opened the first SharePoint file.");
  if (process.env.AUTO_CONTINUE === "1") {
    console.log("AUTO_CONTINUE=1; starting downloads.");
    return;
  }
  console.log("Log in and confirm the file is visible, then press Enter here.");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await rl.question("");
  rl.close();
}

async function main() {
  if (!items.length) {
    throw new Error("Fill the items array before running this script.");
  }
  fs.mkdirSync(outDir, { recursive: true });
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    executablePath,
    acceptDownloads: true,
    downloadsPath: outDir,
    viewport: null,
  });

  try {
    const page = context.pages()[0] || await context.newPage();
    await waitForUser(page);

    const results = [];
    for (const item of items) {
      const response = await context.request.get(parseDownloadUrl(item.url), {
        maxRedirects: 20,
        timeout: 120000,
      });
      const body = await response.body();
      const preview = body.toString("utf8", 0, Math.min(body.length, 2048));
      if (!response.ok() || isLoginResponse(response, preview)) {
        results.push({
          ok: false,
          item: item.name,
          status: response.status(),
          url: response.url(),
          type: response.headers()["content-type"] || "",
        });
        continue;
      }

      const ext = extensionFromHeaders(response.headers(), item.url);
      const outPath = path.join(outDir, `${item.name}${ext}`);
      fs.writeFileSync(outPath, body);
      results.push({ ok: true, item: item.name, path: outPath, bytes: body.length });
      console.log(`Downloaded ${path.basename(outPath)} (${body.length} bytes)`);
    }

    console.log("\nResults:");
    for (const result of results) console.log(JSON.stringify(result));
  } finally {
    await context.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
