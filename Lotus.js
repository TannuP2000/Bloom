// Lotus class and radial gradient helper

class Lotus {
  constructor(x, y, centerRadius) {
    // Original position where the mouse was clicked
    this.baseX = x;
    this.baseY = y;
    this.centerRadius = centerRadius;

    // Bloom tracking for ripple
    this.hasBloomed = false;   // becomes true once
    this.rippleProgress = 0;   // 0 → 1
    this.rippleDuration = 40;  // frames for main ripple animation

    // Bloom animation
    this.bloomProgress = 0;
    this.maxProgress = random(0.8, 1.2);
    this.petalCount = 12;

    // --- Center gradient colors ---
    let innerStart = color("#DEA500"); // bright golden
    let innerEnd   = color("#E0811B"); // warm yellow
    let outerStart = color("#FFCC47"); // warm orange
    let outerEnd   = color("#FFE566"); // soft peach

    this.centerInner = color(
      red(lerpColor(innerStart, innerEnd, random())),
      green(lerpColor(innerStart, innerEnd, random())),
      blue(lerpColor(innerStart, innerEnd, random())),
      100
    );
    this.centerOuter = color(
      red(lerpColor(outerStart, outerEnd, random())),
      green(lerpColor(outerStart, outerEnd, random())),
      blue(lerpColor(outerStart, outerEnd, random())),
      190
    );

    // --- Petal gradient colors ---
    let baseStart = color("#370EBE");
    let baseEnd   = color("#EB2A50");
    let baseRaw   = lerpColor(baseStart, baseEnd, random());

    let finalStart = color("#EB2626");
    let finalEnd   = color("#2410BF");
    let finalRaw   = lerpColor(finalStart, finalEnd, random());

    this.baseColor  = color(red(baseRaw),  green(baseRaw),  blue(baseRaw), 80);
    this.finalColor = color(red(finalRaw), green(finalRaw), blue(finalRaw), 70);

    // --- Wind animation parameters for petals ---
    this.windPhaseOffset = random(TWO_PI);
    this.windStrength = random(0.03, 0.07); // small angular twist

    // --- Floating motion parameters (for whole flower) ---
    this.floatPhaseX = random(TWO_PI);
    this.floatPhaseY = random(TWO_PI);
    this.floatAmount = random(3.0, 7.0);
    this.floatSpeed  = random(0.02, 0.05);
  }

  update() {
    // Animate bloom until fully open
    if (this.bloomProgress < this.maxProgress) {
      this.bloomProgress += 0.02;
      if (this.bloomProgress > this.maxProgress) {
        this.bloomProgress = this.maxProgress;
      }
    }

    // Trigger ripples exactly once when bloom finishes
    if (!this.hasBloomed && this.bloomProgress >= this.maxProgress) {
      this.hasBloomed = true;
      this.rippleProgress = 0; // start ripple animation
    }

    // Advance ripple animation (0 → 1)
    if (this.hasBloomed && this.rippleProgress < 1) {
      this.rippleProgress += 1 / this.rippleDuration;
      if (this.rippleProgress > 1) {
        this.rippleProgress = 1;
      }
    }
  }

  display() {
    // Compute gentle floating offset around original click position
    let tFloat = frameCount * this.floatSpeed;
    let fx = sin(tFloat + this.floatPhaseX) * this.floatAmount;
    let fy = cos(tFloat + this.floatPhaseY) * this.floatAmount;

    push();
    translate(this.baseX + fx, this.baseY + fy);

    // ---------- EASED CONCENTRIC WATER RIPPLES ----------
    if (this.hasBloomed && this.rippleProgress < 1) {
      let baseRadius = this.centerRadius * 1.0; // starting ripple size
      let maxExtra   = this.centerRadius * 2.0; // how far it can grow
      let layers     = 3; // number of concentric ripples
      let rippleColor = color("#0047A6"); // bluish tint

      noFill();

      for (let i = 0; i < layers; i++) {
        // Offset each ripple in time so they appear staggered
        let offset = i * 0.3;
        let p = this.rippleProgress + offset;

        if (p < 0 || p > 1) continue; // ignore ripples outside [0,1]

        // Ease-out: slow at the end, fast at start
        let eased = 1 - (1 - p) * (1 - p); // easeOutQuad

        let r = baseRadius + eased * maxExtra;

        // Fade alpha as it grows
        let alpha = map(1 - p, 0, 1, 0, 70);

        stroke(red(rippleColor), green(rippleColor), blue(rippleColor), alpha);
        strokeWeight(1.8);
        ellipse(0, 0, r * 2, r * 2);
      }
    }

    let maxPetalRadius = this.centerRadius * 3.0;
    let currentR = lerp(0, maxPetalRadius, this.bloomProgress);

    // ---------- PETALS ----------
    noStroke();
    let windTime = frameCount * 0.02;

    for (let i = 0; i < this.petalCount; i++) {
      let baseAngle = (TWO_PI * i) / this.petalCount;

      // Windy twist: small extra rotation per petal
      let windAngle =
        this.windStrength * sin(windTime + this.windPhaseOffset + i * 0.4);

      push();
      rotate(baseAngle + windAngle);

      // Radial gradient along the petal: from baseColor → finalColor
      let steps = 12; // more steps = smoother gradient
      for (let s = 0; s <= steps; s++) {
        let tt = s / steps; // 0 → 1 along petal
        let r = currentR * tt;

        // Don't draw inside the center circle region
        if (r < this.centerRadius * 1.1) continue;

        let c = lerpColor(this.baseColor, this.finalColor, tt);
        fill(c);

        // Layered ellipses along the radius
        ellipse(r / 2.0, 0, r, r * 0.45);
      }

      pop();
    }

    // ---------- CENTER GRADIENT (ON TOP OF PETALS) ----------
    drawRadialGradient(this.centerRadius, this.centerInner, this.centerOuter);

    pop();
  }
}

// Helper for the center gradient
function drawRadialGradient(radius, innerCol, outerCol) {
  let steps = 20; // more steps = smoother gradient
  noStroke();

  for (let i = steps; i >= 1; i--) {
    let t = i / steps; // 1 → 0 as we go inward
    let c = lerpColor(innerCol, outerCol, 1 - t);
    fill(c);

    // draw a circle that shrinks as t goes from 1 → 0
    ellipse(0, 0, radius * 2 * t, radius * 2 * t);
  }
}
