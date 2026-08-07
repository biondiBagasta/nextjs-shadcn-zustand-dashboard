import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { maskitoNumber } from "@maskito/kit";
import { maskitoTransform } from "@maskito/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const maskitoCurrencyOptions = maskitoNumber({
  locale: "id-ID",
  min: 0,
  prefix: 'Rp. ',
});

export const maskitoPercentOptions = maskitoNumber({
    postfix: "%",
    min: 0,
    max: 100,
});

export function formatCurrency(value: number): string {
  return maskitoTransform(value.toString(), maskitoCurrencyOptions)
}

export function formatPercent(value: number): string {
  return maskitoTransform(value.toString(), maskitoPercentOptions)
}

export function deformatToNumber(value: string): number {
  return Number(value.replaceAll(/[^0-9]/g, ""))
}

export function formatDateLocal(date: Date): string {
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return formattedDate
}