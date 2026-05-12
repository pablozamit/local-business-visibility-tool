import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BRAND_BLACKLIST = [
  "clinica", "dental", "madrid", "restaurante", "pizzeria", "fiorerie", "milano",
  "best", "mejor", "miglior", "services", "servicios", "servizi", "near", "cerca", "vicino",
  "estetica", "avvocato", "dentista", "dentist", "clinic", "restaurant"
];
