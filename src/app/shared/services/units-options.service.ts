import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UnitsOptionsService {
  // private unitsOptionsMap: Record<string, string[]> = {};

  setUnitsOptions(lhs: string, unitsOptions: string[]) {
    localStorage.setItem(`unitsOptions_${lhs}`, JSON.stringify(unitsOptions));
  }

  getUnitsOptions(lhs: string): string[] | undefined {
    const stored = localStorage.getItem(`unitsOptions_${lhs}`);
    if (stored) {
      const unitsOptions = JSON.parse(stored);
      return unitsOptions;
    }
    return undefined;
  }

  clearUnitsOptions(lhs: string) {
    localStorage.removeItem(`unitsOptions_${lhs}`);
  }
}
