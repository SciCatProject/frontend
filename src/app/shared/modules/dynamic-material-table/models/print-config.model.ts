import { AbstractField } from "./table-field.model";
import { Direction } from "./table-setting.model";

export interface PrintConfig {
  displayedFields?: string[];
  title?: string;
  userPrintParameters?: { key: string; value: string }[];
  tablePrintParameters?: { key: string; value: string }[];
  showParameters?: boolean;
  data?: any[];
  columns?: AbstractField[];
  direction?: Direction;
  pregenerate?: (html: string) => string;
}
