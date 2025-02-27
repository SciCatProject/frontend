import { ThemePalette } from "@angular/material/core";

export interface ContextMenuItem {
  name: string;
  text: string;
  color: ThemePalette;
  icon?: string;
  disabled?: boolean;
  visible?: boolean;
  divider?: boolean;
}
