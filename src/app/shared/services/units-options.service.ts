import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UnitsOptionsService {
  private unitsOptionsMap: Record<string, string[]> = {};

  setUnitsOptions(lhs: string, unitsOptions: string[]) {
    this.unitsOptionsMap[lhs] = [...unitsOptions];

    localStorage.setItem(`unitsOptions_${lhs}`, JSON.stringify(unitsOptions));
  }

  getUnitsOptions(lhs: string): string[] | undefined {
    if (this.unitsOptionsMap[lhs]) {
      return this.unitsOptionsMap[lhs];
    }
    const stored = localStorage.getItem(`unitsOptions_${lhs}`);
    if (stored) {
      const unitsOptions = JSON.parse(stored);
      this.unitsOptionsMap[lhs] = unitsOptions;
      return unitsOptions;
    }
    return undefined;
  }
}
