import { type Prisma } from '@prisma/client';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}

export const formStandardCallbacks = {
  onSuccess: (got: Prisma.BatchPayload) => {
    console.log(got);
  },
  onError: (error: unknown) => {
    console.log(error);
  }
}
