# TaxAce AI Agent Hub

Static internal guide and access hub for the TaxAce AI agents MarGine, Newella, Vidora, and Webtrix.

## Repository contents

- `index.html` — complete self-contained website. All CSS, JavaScript, TaxAce branding, favicon, and agent avatar assets are embedded in this file.

## Deploy to Vercel

1. Create a new GitHub repository and upload `index.html` to the repository root.
2. In Vercel, choose **Add New > Project** and import the GitHub repository.
3. Use **Framework Preset: Other**.
4. Leave **Build Command** empty.
5. Leave **Output Directory** empty.
6. Deploy.

No environment variables, package manager, framework, database, Neon project, API key, or build process is required.

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static file server.

## Routing

The hub uses URL hashes (`#dashboard`, `#margine`, `#newella`, `#vidora`, and `#webtrix`), so no Vercel rewrites are required. Browser refreshes and direct hash links resolve through the root `index.html`.

## Access note

This static site does not implement authentication. Access to linked ChatGPT and Claude agents/projects is controlled by those platforms. Do not place confidential TaxAce information in the HTML unless it is acceptable for anyone with the deployed site URL to read it.
