# download-sharepoint-files

Codex skill and reusable automation script for downloading SharePoint, OneDrive, and Office Online shared files, including links that require Microsoft login.

一個可重用的 Codex skill 與自動化腳本，用來下載 SharePoint、OneDrive、Office Online 的分享檔案，特別是那些需要 Microsoft 登入的連結。

## What It Does

This project captures a workflow that works reliably when direct `curl` downloads return SharePoint `403` errors or Microsoft login redirects:

1. Probe the link.
2. Fall back to a temporary browser profile for Microsoft login.
3. Use the authenticated browser context to download the files.
4. Save clear, user-provided filenames locally.

## 功能說明

這個專案整理了一套實用流程，適合處理直接用 `curl` 下載時遇到 SharePoint `403`、Microsoft 登入導向，或 Office Online 檢視器頁面的情境：

1. 先測試分享連結是否能直接下載。
2. 若需要登入，改用臨時瀏覽器 profile 讓使用者自行完成 Microsoft 登入與 MFA。
3. 使用已登入的瀏覽器 session 下載檔案。
4. 依照使用者指定的名稱，把檔案清楚地存到本機。

## Install For Codex

Clone this repository directly into your local Codex skills directory:

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/WonderTool/download-sharepoint-files.git ~/.codex/skills/download-sharepoint-files
```

Restart Codex or start a new session so the skill metadata is reloaded.

## Codex 安裝方式

把這個 repo 直接 clone 到本機 Codex skills 目錄：

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/WonderTool/download-sharepoint-files.git ~/.codex/skills/download-sharepoint-files
```

接著重啟 Codex，或開一個新的 session，讓 Codex 重新載入 skill metadata。

## Use With Other Agents

This repository is useful beyond Codex. For Claude Code, Cursor, Cline, Aider, or another coding agent, ask the agent to read `SKILL.md` first, then adapt `scripts/authenticated_sharepoint_download.cjs` to your link list.

The script expects Node.js and Playwright. In Codex Desktop, use the bundled Node runtime and module path when available. Outside Codex, install Playwright in your local project or adjust `CODEX_NODE_MODULES`.

## 其他 Agent 也可以用

這不只適用於 Codex。Claude Code、Cursor、Cline、Aider 或其他 coding agent 也可以使用：

1. 先請 agent 閱讀 `SKILL.md`。
2. 再請它依照你的分享連結清單，改寫或套用 `scripts/authenticated_sharepoint_download.cjs`。

腳本需要 Node.js 與 Playwright。若在 Codex Desktop 裡使用，可優先使用內建的 Node runtime 與套件路徑；若在其他環境使用，請在本機專案安裝 Playwright，或調整 `CODEX_NODE_MODULES`。

## Discoverability / Keywords

Useful search phrases for people who run into locked SharePoint or Office Online downloads:

- download SharePoint files with Microsoft login
- authenticated SharePoint download automation
- OneDrive shared link downloader
- Office Online file download script
- SharePoint 403 download workaround
- Codex skill for file downloads
- Playwright authenticated download workflow
- Microsoft 365 shared file automation

Hashtags for sharing: `#SharePoint` `#OneDrive` `#Microsoft365` `#OfficeOnline` `#CodexSkill` `#OpenAICodex` `#Playwright` `#Automation` `#DeveloperTools` `#AIWorkflow`

## 搜尋關鍵字 / Hashtags

適合遇到 SharePoint 權限、OneDrive 分享連結、Office Online 預覽頁、Microsoft 登入下載問題的人搜尋：

- SharePoint 下載 403 解法
- OneDrive 分享連結下載工具
- Microsoft 365 檔案下載自動化
- Office Online 檔案下載腳本
- Codex skill 下載 SharePoint 檔案
- Playwright 登入後下載檔案
- AI agent 檔案下載 workflow

分享時可用：`#SharePoint下載` `#OneDrive下載` `#Microsoft365` `#OfficeOnline` `#CodexSkill` `#OpenAICodex` `#Playwright自動化` `#AI工具` `#開發者工具` `#自動化流程`

## Share Copy

Need to download SharePoint, OneDrive, or Office Online shared files that fail with `403` or redirect to Microsoft login? This Codex skill uses a temporary authenticated browser session and Playwright to save shared files with clean local filenames.

## 分享文案

如果你遇到 SharePoint / OneDrive / Office Online 分享檔案無法直接下載、`curl` 回傳 `403`、或一直被導到 Microsoft 登入頁，這個 Codex skill 可以用臨時登入瀏覽器 session 搭配 Playwright，把檔案穩定下載到本機。

## Contents

- `SKILL.md`: The agent workflow and safety rules.
- `scripts/authenticated_sharepoint_download.cjs`: A reusable Node/Playwright template.
- `agents/openai.yaml`: Codex UI metadata.
- `AGENTS.md`, `CLAUDE.md`, `.cursorrules`: Lightweight entry instructions for common agents.

## 檔案內容

- `SKILL.md`：主要 workflow 與安全規則。
- `scripts/authenticated_sharepoint_download.cjs`：可重用的 Node/Playwright 腳本模板。
- `agents/openai.yaml`：Codex UI metadata。
- `AGENTS.md`、`CLAUDE.md`、`.cursorrules`：給常見 agent 使用的簡短入口說明。

## Safety

Do not paste passwords, MFA codes, cookies, or tokens into prompts. Let the browser handle login, and use a temporary browser profile rather than your main browser profile.

## 安全提醒

不要把密碼、MFA 驗證碼、cookies 或 tokens 貼進 prompt。請讓使用者在瀏覽器中自行登入，並使用臨時瀏覽器 profile，不要直接使用主要瀏覽器 profile。
