// --------------------
// GLOBAL SOUND STORAGE
// --------------------
let notes = [];       // array for instrument notes
let ambient;          // background ambient music
let soundStarted = false; // autoplay unlock

// --------------------
// LOAD ALL SOUNDS
// Called from bloom.js → preload()
// --------------------
function loadAllSounds() {
  // Load instrument notes from /Sounds/ folder
  // Currently from 8.wav to 15.wav
  for (let i = 8; i <= 15; i++) {
    let filename = `Sound/${i}.mp3`;
    notes.push(
      loadSound(
        filename,
        () => console.log("✅ loaded", filename),
        () => console.log("❌ error loading", filename)
      )
    );
  }

  // Load ambient background music
  ambient = loadSound(
    "Sound/music3.mp3",
    () => console.log("✅ loaded ambient music3.mp3"),
    () => console.log("❌ error loading ambient music3.mp3")
  );
}

// --------------------
// START AMBIENT MUSIC
// (must be triggered by user click due to browser rules)
// --------------------
function startAmbientMusic() {
  if (!soundStarted) {
    if (ambient && !ambient.isPlaying()) {
      ambient.loop();        // loop forever
      ambient.setVolume(0.02); // faint background music
    }
    soundStarted = true;
  }
}

// --------------------
// PLAY RANDOM NOTE
// --------------------
function playRandomNote() {
  if (notes.length === 0) return; // safety

  let s = random(notes);
  s.setVolume(0.4); // adjust as needed
  s.play();
}

