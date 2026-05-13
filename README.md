
  # Tucker Family Charity Website

  **Live site:** https://www.tuckerfamilycharity.co.za

  This is a code bundle for Tucker Family Charity Website. The original project is available at https://www.figma.com/design/lNm41i5wvdoukGVe3SW9K1/Tucker-Family-Charity-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Property partnership listing images

  After you add or change Pam Golding listing URLs in `public/data/properties.json`, refresh card images so they match the **main featured photo** Pam Golding uses on the listing (same URL as `og:image` / first hero image in their HTML):

  ```bash
  npm run sync:pamgolding-images
  ```

  Use `node scripts/sync-pamgolding-listing-images.mjs --dry-run` to preview changes without writing the file.

  ## Property enquiry form → Google Sheet

  Wire **Register your interest** to your Sheet via Google Apps Script (see **`docs/PROPERTY_ENQUIRY_SHEET_SETUP.md`**). Set **`VITE_PROPERTY_ENQUIRY_SUBMIT_URL`** (and optionally **`VITE_PROPERTY_ENQUIRY_SECRET`**) in `.env` locally and in GitHub Actions secrets for production builds.
  