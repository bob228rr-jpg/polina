const firstLine = "что блин... у моей любимой девушки день рождения. надо поздравить. йошки-кошки.";
const correctPasscode = "1506";

const typedText = document.querySelector("#typedText");
const heroActions = document.querySelector("#heroActions");
const showGreeting = document.querySelector("#showGreeting");
const stopFlash = document.querySelector("#stopFlash");
const passcodeScreen = document.querySelector("#passcodeScreen");
const videoScreen = document.querySelector("#videoScreen");
const birthdayVideo = document.querySelector("#birthdayVideo");
const soundStart = document.querySelector("#soundStart");
const scrollCue = document.querySelector("#scrollCue");
const afterVideo = document.querySelector("#afterVideo");
const digitButtons = document.querySelectorAll("[data-digit]");
const dots = document.querySelectorAll(".passcode__dots span");

let passcode = "";
let videoStarted = false;

function typeText(target, text, speed = 38) {
  target.textContent = "";

  return new Promise((resolve) => {
    let index = 0;

    const timer = window.setInterval(() => {
      target.textContent += text[index];
      index += 1;

      if (index >= text.length) {
        window.clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

async function startIntro() {
  await typeText(typedText, firstLine, 34);
  showGreeting.disabled = false;
  heroActions.classList.add("is-visible");
}

showGreeting.addEventListener("click", async () => {
  showGreeting.disabled = true;
  document.body.classList.add("is-locked");
  stopFlash.classList.add("is-active");

  window.setTimeout(() => {
    passcodeScreen.hidden = false;
    requestAnimationFrame(() => passcodeScreen.classList.add("is-visible"));
  }, 760);

  window.setTimeout(() => {
    stopFlash.classList.remove("is-active");
  }, 1500);
});

async function startBirthdayVideo() {
  if (videoStarted) {
    return;
  }

  videoStarted = true;
  passcodeScreen.classList.add("is-done");
  document.body.classList.remove("is-locked");
  document.body.classList.add("birthday-started");
  document.body.classList.add("video-mode");
  videoScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: "auto" });

  birthdayVideo.loop = false;
  birthdayVideo.muted = false;
  birthdayVideo.volume = 0.45;
  birthdayVideo.currentTime = 0;

  try {
    await birthdayVideo.play();
  } catch {
    birthdayVideo.pause();
    birthdayVideo.currentTime = 0;
    soundStart.hidden = false;
    requestAnimationFrame(() => soundStart.classList.add("is-visible"));
  }
}

birthdayVideo.addEventListener("ended", () => {
  birthdayVideo.muted = true;
  birthdayVideo.loop = true;
  birthdayVideo.currentTime = 0;
  birthdayVideo.play().catch(() => {});

  afterVideo.hidden = false;
  scrollCue.hidden = false;
  requestAnimationFrame(() => scrollCue.classList.add("is-visible"));
});

soundStart.addEventListener("click", async () => {
  soundStart.classList.remove("is-visible");
  soundStart.hidden = true;
  birthdayVideo.muted = false;
  birthdayVideo.volume = 0.45;
  birthdayVideo.currentTime = 0;
  try {
    await birthdayVideo.play();
  } catch {
    soundStart.hidden = false;
    requestAnimationFrame(() => soundStart.classList.add("is-visible"));
  }
});

scrollCue.addEventListener("click", () => {
  afterVideo.scrollIntoView({ behavior: "smooth" });
});

digitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (passcode.length >= dots.length) {
      passcode = "";
    }

    passcode += button.dataset.digit;
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-filled", index < passcode.length);
    });

    if (passcode.length === dots.length && passcode !== correctPasscode) {
      window.setTimeout(() => {
        passcode = "";
        dots.forEach((dot) => dot.classList.remove("is-filled"));
      }, 450);
    }

    if (passcode === correctPasscode) {
      startBirthdayVideo();
    }
  });
});

startIntro();
