import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function parseJSONL<T>(jsonl: string): T[] {
  const lines = jsonl.split('\n').filter(line => line.trim() !== '');
  return lines.map(line => JSON.parse(line) as T);
}