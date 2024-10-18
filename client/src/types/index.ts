export interface CPUUsage {
  time: string;
  value: number;
}

export type EventVariants = 'critical' | 'warning' | 'info';

// Тип для события
export interface EventType {
  event: string;
  type: EventVariants;
  date: string; // Формат: DD.MM.YYYY
  time: string; // Формат: HH:MM
}
