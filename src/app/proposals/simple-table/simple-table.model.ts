import { TableRow } from "shared/modules/dynamic-material-table/models/table-row.model";

export interface TestElement extends TableRow {
  row: number;
  name: string;
  weight: string;
  color: string;
  brand: string;
}

export function getData(n = 1000): TestElement[] {
  return Array.from({ length: n }, (v, i) => ({
    row: i + 1,
    name: `Element #${i + 1}`,
    weight: Math.floor(Math.random() * 100) + " KG",
    color: ["Red", "Green", "Blue", "Yellow", "Magenta"][
      Math.floor(Math.random() * 5)
    ],
    brand: [
      "Irankhodro",
      "SAIPA",
      "Kerman Khodro",
      "Zanjan Benz",
      "Tehran PIKEY",
    ][Math.floor(Math.random() * 5)],
    type: ["SUV", "Truck", "Sedan", "Van", "Coupe", "Sports Car"][
      Math.floor(Math.random() * 6)
    ],
    longText: [
      "Overdub: Correct your voice recordings by simply typing. Powered by Lyrebird AI.",
      "Multitrack recording — Descript dynamically generates a single combined transcript.",
      "Our style of podcasting and editing wouldn’t be possible without Descript.",
      "Live Collaboration: Real time multiuser editing and commenting.",
      "Use the Timeline Editor for fine-tuning with fades and volume editing.",
      "Edit audio by editing text. Drag and drop to add music and sound effects.",
    ][Math.floor(Math.random() * 6)],
  }));
}

export const DATA: TestElement[] = getData(20);
