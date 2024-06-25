interface FORMATTED_COLOR {
  exactMatch: boolean;
  name: string;
  rgb: string | null;
}
type COLOR = Array<string | number>;
declare module "ntc-ts" {
  export function getColorName(color: string): FORMATTED_COLOR;
  export function getRGB(color: string, divider = 1): number[];
  export function getHSL(color: string): number[];
  export function initColors(_colors: COLOR[]): void;
  export const ORIGINAL_COLORS: COLOR[];
}
