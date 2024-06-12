interface FORMATTED_COLOR {
  exactMatch: boolean;
  name: string;
  rgb: string | null;
}
type COLOR = Array<string | number>;
declare module "ntc-ts" {
  export function getColorName(color: string): FORMATTED_COLOR;
  export function initColors(_colors: COLOR[]): void;
  export const ORIGINAL_COLORS: COLOR[];
}
