// src/global.d.ts
export {};

declare global {
  interface Window {
    google: any; // You can refine this type if you want more specificity
  }
}
