function subtractDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);

  const currentDate = new Date(Date.UTC(year, month - 1, day));
  currentDate.setUTCDate(currentDate.getUTCDate() - days);

  return currentDate.toISOString().slice(0, 10);
}

export function calculateCurrentStreak(
  completions: string[],
  today = new Date().toISOString().slice(0, 10),
): number {
  const uniqueCompletions = Array.from(new Set(completions)).sort();

  if (!uniqueCompletions.includes(today)) {
    return 0;
  }

  let streak = 0;
  let dayOffset = 0;

  while (uniqueCompletions.includes(subtractDays(today, dayOffset))) {
    streak += 1;
    dayOffset += 1;
  }

  return streak;
}
