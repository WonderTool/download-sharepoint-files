# download-sharepoint-files

A Codex skill and reusable automation script for downloading SharePoint, OneDrive, and Office Online shared files, including links that require Microsoft login.

It captures the workflow that worked reliably when direct `curl` downloads returned SharePoint `403` or Microsoft login redirects:

1. Probe the link.
2. Fall back to a temporary browser profile for Microsoft login.
3. Use the authenticated browser context to download the files.
4. Save clear, user-provided filenames locally.

## Install For Codex

Clone this repository directly into your local Codex skills directory:

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/WonderTool/download-sharepoint-files.git ~/.codex/skills/download-sharepoint-files
```

Restart Codex or start a new session so the skill metadata is reloaded.

## Use With Other Agents

This repository is useful beyond Codex. For Claude Code, Cursor, Cline, Aider, or another coding agent, ask the agent to read `SKILL.md` first, then adapt `scripts/authenticated_sharepoint_download.cjs` to your link list.

The script expects Node.js and Playwright. In Codex Desktop, use the bundled Node runtime and module path when available. Outside Codex, install Playwright in your local project or adjust `CODEX_NODE_MODULES`.

## Contents

- `SKILL.md`: The agent workflow and safety rules.
- `scripts/authenticated_sharepoint_download.cjs`: A reusable Node/Playwright template.
- `agents/openai.yaml`: Codex UI metadata.

## Safety

Do not paste passwords, MFA codes, cookies, or tokens into prompts. Let the browser handle login, and use a temporary browser profile rather than your main browser profile.
