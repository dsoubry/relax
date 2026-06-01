export const phases = {
  morning: {
    label: 'Goedemorgen',
    title: 'Morning Calm',
    subtitle: 'Zachte ambient · Vogelgeluiden',
    folder: '01_morning',
    moods: {
      Gespannen: 'Kalmerende, langzame klanken',
      Moe: 'Zachte wake-up soundscape',
      Focus: 'Lichte ritmische ambient',
      Rustig: 'Natuurlijke ochtendrust',
      Gelukkig: 'Lichte, positieve vibes'
    }
  },
  afternoon: {
    label: 'Goedemiddag',
    title: 'Deep Focus',
    subtitle: 'Lo-fi beats · Natuur · Focus',
    folder: '02_afternoon',
    moods: {
      Gespannen: 'Rustige focus zonder pieken',
      Moe: 'Warme energieboost',
      Focus: 'Ritmisch en motiverend',
      Rustig: 'Heldere natuurgeluiden',
      Gelukkig: 'Positieve flow'
    }
  },
  evening: {
    label: 'Goedenavond',
    title: 'Night Drift',
    subtitle: 'Diepe bassen · Piano · Donder',
    folder: '03_evening',
    moods: {
      Gespannen: 'Vertragende diepe tonen',
      Moe: 'Warme slaapvoorbereiding',
      Focus: 'Zeer zachte concentratie',
      Rustig: 'Piano en diepe stilte',
      Gelukkig: 'Zachte avondgloed'
    }
  }
};

export const moodNames = ['Gespannen', 'Moe', 'Focus', 'Rustig', 'Gelukkig'];

export function phaseFromHour(hour = new Date().getHours()) {
  if (hour >= 6 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'afternoon';
  return 'evening';
}

export function nextPhase(phase) {
  const order = ['morning', 'afternoon', 'evening'];
  return order[(order.indexOf(phase) + 1) % order.length];
}

export function getPlaceholderTrack(phase, mood) {
  const phaseInfo = phases[phase];
  return {
    src: `../public/audio/${phaseInfo.folder}/README.md`,
    title: phaseInfo.title,
    subtitle: phaseInfo.moods[mood] || phaseInfo.subtitle
  };
}
