import { phases, moodNames, phaseFromHour, nextPhase, getPlaceholderTrack } from './audio.js';
import { RelaxVisualizer } from './visualizer.js';

const root = document.documentElement;
const moodRow = document.querySelector('#moodRow');
const phaseLabel = document.querySelector('#phaseLabel');
const trackTitle = document.querySelector('#trackTitle');
const trackSubtitle = document.querySelector('#trackSubtitle');
const playButton = document.querySelector('#playButton');
const timeTravelButton = document.querySelector('#timeTravelButton');
const sleepTimerButton = document.querySelector('#sleepTimerButton');
const timerPanel = document.querySelector('#timerPanel');
const volumeSlider = document.querySelector('#volumeSlider');
const audioPlayer = document.querySelector('#audioPlayer');
const breathLabel = document.querySelector('#breathLabel');
const visualizer = new RelaxVisualizer(document.querySelector('#visualizer'));

let currentPhase = phaseFromHour();
let currentMood = 'Rustig';
let isPlaying = false;
let sleepTimer = null;
let fadeTimer = null;
let blackoutTimer = null;

function applyPhase(phase) {
  currentPhase = phase;
  root.setAttribute('data-theme', phase);

  const phaseInfo = phases[phase];
  const track = getPlaceholderTrack(phase, currentMood);

  phaseLabel.textContent = phaseInfo.label;
  trackTitle.textContent = track.title;
  trackSubtitle.textContent = track.subtitle;

  audioPlayer.src = track.src;
  audioPlayer.loop = true;
  audioPlayer.load();

  renderMoods();

  if (isPlaying) {
    audioPlayer.play().catch(console.warn);
  }
}

function renderMoods() {
  moodRow.innerHTML = '';

  moodNames.forEach((mood) => {
    const button = document.createElement('button');
    button.className = `mood-chip${mood === currentMood ? ' active' : ''}`;
    button.textContent = mood;

    button.addEventListener('click', () => {
      currentMood = mood;
      applyPhase(currentPhase);
    });

    moodRow.appendChild(button);
  });
}

async function togglePlayback() {
  if (!isPlaying) {
    try {
      await audioPlayer.play();
      isPlaying = true;
      playButton.textContent = 'Ⅱ';
      visualizer.start();
    } catch (error) {
      console.warn('Audio kon niet starten:', error);
    }
  } else {
    isPlaying = false;
    playButton.textContent = '▶';
    audioPlayer.pause();
    visualizer.stop();
  }
}

function startSleepTimer(minutes) {
  clearTimeout(sleepTimer);
  clearInterval(fadeTimer);
  clearTimeout(blackoutTimer);

  root.setAttribute('data-theme', currentPhase);
  sleepTimerButton.textContent = `☾ Slaaptimer ${minutes} min`;
  timerPanel.hidden = true;

  const totalMs = minutes * 60 * 1000;
  const fadeStartMs = Math.max(0, totalMs - 5 * 60 * 1000);
  const initialVolume = Number(volumeSlider.value) || 0.6;

  sleepTimer = setTimeout(() => {
    fadeTimer = setInterval(() => {
      const newVolume = Math.max(0, audioPlayer.volume - initialVolume / 300);
      audioPlayer.volume = newVolume;
      volumeSlider.value = String(newVolume);
      visualizer.setIntensity(newVolume);
    }, 1000);
  }, fadeStartMs);

  blackoutTimer = setTimeout(() => {
    clearInterval(fadeTimer);
    isPlaying = false;
    visualizer.stop();
    audioPlayer.pause();
    audioPlayer.volume = 0;
    volumeSlider.value = '0';
    playButton.textContent = '▶';
    root.setAttribute('data-theme', 'blackout');
  }, totalMs);
}

setInterval(() => {
  breathLabel.textContent = breathLabel.textContent === 'Adem in' ? 'Adem uit' : 'Adem in';
}, 4000);

playButton.addEventListener('click', togglePlayback);

timeTravelButton.addEventListener('click', () => {
  applyPhase(nextPhase(currentPhase));
});

sleepTimerButton.addEventListener('click', () => {
  timerPanel.hidden = !timerPanel.hidden;
});

volumeSlider.addEventListener('input', (event) => {
  audioPlayer.volume = Number(event.target.value);
  visualizer.setIntensity(audioPlayer.volume);
});

timerPanel.addEventListener('click', (event) => {
  const button = event.target.closest('[data-minutes]');
  if (button) startSleepTimer(Number(button.dataset.minutes));
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(console.warn);
}

audioPlayer.volume = Number(volumeSlider.value);
applyPhase(currentPhase);
