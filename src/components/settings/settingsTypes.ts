import type { JSX } from "react";

export interface OptionItem<T> {
  label: string;
  value: T;
  icon: JSX.Element;
}
