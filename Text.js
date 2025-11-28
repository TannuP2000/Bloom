// Text-related functions: color + drawing

function pickBloomTextColor() {
  // Use HSL just for these calculations
  colorMode(HSL, 360, 100, 100, 1);

  let bloomStart = color("#FF795B");
  let bloomEnd   = color("#CF276C");

  // Rich mid tones only
  let t = random(0.2, 1.0);
  bloomColor = lerpColor(bloomStart, bloomEnd, t);

  // IMPORTANT: switch back for the rest of the sketch
  colorMode(RGB, 255, 255, 255, 255);
}

function drawBloomText() {
  // Physical scaling fix for high-density screens
  let densityFix = 1 / pixelDensity();

  // Padding for text box based on screen size
  let pad = min(width, height) * 0.2 * densityFix;
  let boxH = height - pad * 2;

  // Slightly larger fonts on big screens, smaller on phones
  let sizeFactor = width >= 1080 ? 0.32 : 0.16;

  // Final dynamic text size
  dynamicTextSize = boxH * sizeFactor * densityFix;

  // ---------- MAIN "bloom" TEXT ----------
  textAlign(CENTER, CENTER);
  textFont(currentFont);
  textSize(dynamicTextSize);
  fill(bloomColor);
  noStroke();

  let centerX = width / 2;
  let centerY = height / 2;

  text("bloom", centerX, centerY);

  // ---------- WATERMARK "by Tannistha" ----------
  let watermarkFont = "Petit Formal Script"; // can swap if you like
  let watermarkSize = dynamicTextSize * 0.28; // smaller than main text

  textFont(watermarkFont);
  textSize(watermarkSize);

  // Faint color based on bloomColor
  let sigColor = color(
    red(bloomColor),
    green(bloomColor),
    blue(bloomColor),
    110 // low alpha so it's soft
  );
  fill(sigColor);

  let watermarkY = centerY + dynamicTextSize * 0.48;
  text("by Tannistha", centerX, watermarkY);
}
