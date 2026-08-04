import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { maskitoNumber } from "@maskito/kit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const   maskitoCurrencyOptions = maskitoNumber({
  locale: "id-ID",
  min: 0,
  prefix: 'Rp. ',
});

export const maskitoPercentOptions = maskitoNumber({
    postfix: "%",
    min: 0,
    max: 100,
    maximumFractionDigits: 2,
});