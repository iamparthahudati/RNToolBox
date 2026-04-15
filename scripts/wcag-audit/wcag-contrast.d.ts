declare module 'wcag-contrast' {
  /** Returns the WCAG contrast ratio between two hex color strings (e.g. "#FFFFFF"). */
  export function hex(a: string, b: string): number;
  /** Returns the WCAG contrast ratio from two RGB arrays [[r,g,b], [r,g,b]]. */
  export function rgb(
    a: [number, number, number],
    b: [number, number, number],
  ): number;
  /** Returns the relative luminance of an RGB array. */
  export function luminance(rgb: [number, number, number]): number;
  /** Returns the WCAG AA/AAA grade string for a given ratio and optional font size. */
  export function score(ratio: number, fontSize?: number): string;
}
