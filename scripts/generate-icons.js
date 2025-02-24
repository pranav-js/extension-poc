import sharp from 'sharp';
const sizes = [16, 32, 48, 128];

async function convertToPng() {
  for (const size of sizes) {
    await sharp('public/icons/icon.svg')
      .resize(size, size)
      .png()
      .toFile(`public/icons/icon-${size}.png`);
  }
}

convertToPng().catch(console.error); 