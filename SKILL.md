---
name: download-sharepoint-files
description: Batch-download SharePoint, OneDrive, or Office Online shared files into the current workspace, especially when links require Microsoft login, return 403 from curl, open in Excel/Word/PDF web viewers, or need a temporary browser profile to preserve authentication. Use when the user provides multiple SharePoint URLs, asks to download authenticated files, wants files renamed/count-labeled locally, or needs a repeatable download workflow without asking for passwords or cookies.
---

# Download SharePoint Files

## Overview

Download SharePoint/Office shared links safely by trying the simplest path first, then falling back to an authenticated temporary browser profile when SharePoint requires Microsoft login. Never ask the user to paste passwords, MFA codes, or cookies.

## Workflow

1. **Inventory links and desired names.** Preserve the user's requested labels/counts in local filenames, and infer extensions from link type when needed: `:x:` -> `.xlsx`, `:w:` -> `.docx`, `:b:` -> `.pdf`.
2. **Probe direct download.** Try `curl -L -I '<url>&download=1'` or the SharePoint `download.aspx` form. If DNS/network is blocked, request escalation. If the response is `403`, `Authenticate.aspx`, `_forms/default.aspx`, or `login.microsoftonline.com`, switch to browser authentication.
3. **Use browser login without secrets.** Open a visible temporary browser profile, let the user log in and complete MFA themselves, then continue using that profile's session. Do not extract or print tokens/cookies.
4. **Download through the authenticated context.** Prefer Playwright `launchPersistentContext` plus `context.request.get(downloadUrl)` over UI clicking. It is more reliable than Office Online's `File > Create a Copy > Download a Copy`, which may not expose a download event.
5. **Validate output.** List new files with sizes, verify MIME-derived extensions, and report any repeated links or failed items.
6. **Clean up helper artifacts.** Remove ad hoc scripts from the user's working folder unless they explicitly ask to keep them. Leave the temporary browser profile if it may be useful for retrying; remove only when the user asks or after confirming it is safe.

## Download URL Pattern

For links like:

```text
https://tenant.sharepoint.com/:x:/s/site/SHARE_ID?e=TOKEN
```

construct:

```text
https://tenant.sharepoint.com/sites/site/_layouts/15/download.aspx?share=SHARE_ID&e=TOKEN
```

The `site` segment may differ; parse it from the path after `/s/`. Do not hard-code `/sites/2022` unless the input URL uses `/s/2022`.

## Script Template

Use `scripts/authenticated_sharepoint_download.cjs` as a starting point when there are multiple files or login is required. Copy it to the workspace, fill the `items` array, adjust `outDir`, then run it with the bundled Node runtime if available.

Typical run:

```bash
/path/to/node authenticated_sharepoint_download.cjs
```

If the user already logged in once and the profile is still valid, rerun with:

```bash
AUTO_CONTINUE=1 /path/to/node authenticated_sharepoint_download.cjs
```

If Chrome reports that the profile is already in use, close the temporary Chrome window or kill only the process whose command includes the exact temporary `user-data-dir`.

## Safety Rules

- Use a temporary profile under `/private/tmp` or another explicit temp path; do not use the user's main browser profile.
- Confirm before killing browser processes. When killing is approved, target only the process with the exact temporary profile path.
- Do not save credentials, accept account permission changes, alter sharing settings, or upload files unless the user explicitly asked.
- If links still return login HTML after the user authenticated, reopen the first URL in the temporary browser and ask the user to confirm they can see the file.
