import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function formatTime(isoString: string): string {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(isoString: string): string {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleDateString();
}
