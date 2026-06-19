# IFT 302 eBook Library (static)

This is a small static ebook library that lists the PDF files found in the project folder and lets you view or download them.

Files created:
- `index.html` — main UI
- `css/styles.css` — styling
- `js/app.js` — client logic (loads `ebooks.json`)
- `ebooks.json` — catalog generated from the PDFs in the folder

How to run (PowerShell / Windows):

Option A — Python built-in HTTP server (requires Python 3.x):

```powershell
# from project folder
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Option B — Node (serve) if you have Node.js installed:

```powershell
# install once
npm install -g serve
# then from project folder
serve -p 8000
```

Option C — built-in Node script (no global install):

```powershell
# from project folder
npm install        # optional, no deps required but creates node_modules if needed
npm start
# then open http://localhost:8000 in your browser
```

Notes:
- Do not open `index.html` via file:// in some browsers; use a local server as above to allow the JSON to be fetched.
- PDFs are referenced by filename; if you move them, update `ebooks.json` accordingly.

Next steps (optional):
- Auto-generate thumbnails for each PDF.
- Add categories/tags and pagination.
- Add a backend to index PDFs automatically.
