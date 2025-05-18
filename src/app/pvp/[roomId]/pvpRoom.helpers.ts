// src/app/pvp/[roomId]/pvpRoom.helpers.ts

export function getLeagueByName(name: string) {
  switch (name) {
    case 'Byte':
      return { name: 'Byte', time: 120, difficulty: 'Easy', win: 50, loss: -50 };
    case 'Kilobyte':
      return { name: 'Kilobyte', time: 120, difficulty: 'Easy', win: 50, loss: -50 };
    case 'Megabyte':
      return { name: 'Megabyte', time: 180, difficulty: 'Medium', win: 50, loss: -50 };
    case 'Gigabyte':
      return { name: 'Gigabyte', time: 300, difficulty: 'Hard', win: 100, loss: -100 };
    case 'Terabyte':
      return { name: 'Terabyte', time: 300, difficulty: 'Hard', win: 100, loss: -100 };
    default:
      return { name: 'Byte', time: 120, difficulty: 'Easy', win: 50, loss: -50 };
  }
}

export function getLeagueWindows(name: string) {
  if (name === 'Byte' || name === 'Kilobyte') {
    return {
      chaosStart: 30,
      chaosEnd: 90,
      sabotageWindows: [{ start: 60, end: 100 }],
      maxSabotageUses: 1
    };
  }

  if (name === 'Megabyte') {
    return {
      chaosStart: 30,
      chaosEnd: 145,
      sabotageWindows: [{ start: 115, end: 155 }],
      maxSabotageUses: 1
    };
  }

  if (name === 'Gigabyte' || name === 'Terabyte') {
    return {
      chaosStart: 45,
      chaosEnd: 240,
      sabotageWindows: [
        { start: 105, end: 150 },
        { start: 210, end: 255 }
      ],
      maxSabotageUses: 2
    };
  }

  return {
    chaosStart: 30,
    chaosEnd: 90,
    sabotageWindows: [],
    maxSabotageUses: 1
  };
}

export function getLevelByLeague(name: string): number {
  return ['Byte', 'Kilobyte', 'Megabyte', 'Gigabyte', 'Terabyte'].indexOf(name) + 1;
}