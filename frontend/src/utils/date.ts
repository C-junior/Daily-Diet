import { Meal } from '../types/domain';

export function padZero(value: number): string {
  return String(value).padStart(2, '0');
}

export function getNowDateAndTimeInputs(): { date: string; time: string } {
  const now = new Date();
  const date = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`;
  const time = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
  return { date, time };
}

export function isoToLocalInputs(isoString: string): { date: string; time: string } {
  const d = new Date(isoString);
  const date = `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
  const time = `${padZero(d.getHours())}:${padZero(d.getMinutes())}`;
  return { date, time };
}

export function localInputsToIso(date: string, time: string): string {
  const composed = new Date(`${date}T${time}:00`);
  return composed.toISOString();
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return `${padZero(d.getHours())}:${padZero(d.getMinutes())}`;
}

export function formatFullDateTime(isoString: string): string {
  const d = new Date(isoString);
  const day = padZero(d.getDate());
  const month = padZero(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = padZero(d.getHours());
  const minutes = padZero(d.getMinutes());
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

export function getDayGroupKey(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
}

export function formatDayGroupHeading(dateKey: string): { title: string; subtitle: string } {
  const [year, month, day] = dateKey.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedDate = `${padZero(day)}.${padZero(month)}.${String(year).slice(-2)}`;

  if (target.getTime() === today.getTime()) {
    return { title: 'Hoje', subtitle: formattedDate };
  }
  if (target.getTime() === yesterday.getTime()) {
    return { title: 'Ontem', subtitle: formattedDate };
  }

  const weekday = target.toLocaleDateString('pt-BR', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return { title: formattedDate, subtitle: capitalizedWeekday };
}

export interface MealDayGroupData {
  dateKey: string;
  title: string;
  subtitle: string;
  meals: Meal[];
}

export function groupMealsByDay(meals: Meal[]): MealDayGroupData[] {
  const groupsMap = new Map<string, Meal[]>();

  for (const meal of meals) {
    const key = getDayGroupKey(meal.consumedAt);
    const existing = groupsMap.get(key);
    if (existing) {
      existing.push(meal);
    } else {
      groupsMap.set(key, [meal]);
    }
  }

  return Array.from(groupsMap.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([dateKey, dayMeals]) => {
      const { title, subtitle } = formatDayGroupHeading(dateKey);
      return {
        dateKey,
        title,
        subtitle,
        meals: dayMeals.sort(
          (m1, m2) => new Date(m2.consumedAt).getTime() - new Date(m1.consumedAt).getTime(),
        ),
      };
    });
}
