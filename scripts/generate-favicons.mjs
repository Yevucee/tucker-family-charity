#!/usr/bin/env node
/**
 * Generate favicon assets from the site logo tree (top crop of header logo PNG).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const logoPath = path.resolve("src/assets/4920ca320ce31a579ec4c3d0fcc360b4528a2024.png");
const publicDir = path.resolve("public");

const tree = await sharp(logoPath)
  .extract({ left: 280, top: 8, width: 520, height: 270 })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .trim({ threshold: 15 })
  .toBuffer();

const png128 = await sharp(tree)
  .resize(128, 128, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(tree).resize(16, 16).png().toFile(path.join(publicDir, "favicon-16.png"));
await sharp(tree).resize(32, 32).png().toFile(path.join(publicDir, "favicon-32.png"));
await sharp(tree).resize(180, 180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));

const b64 = png128.toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="#fff"/>
  <image width="128" height="128" href="data:image/png;base64,${b64}"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, "favicon.svg"), svg);

console.log("Generated favicon.svg, favicon-16.png, favicon-32.png, apple-touch-icon.png");
