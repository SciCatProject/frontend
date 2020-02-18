import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UnitsService {
  private UNITS = {
    area: ["cm^2", "m^2", "mm^2"],
    charge: ["C"],
    current: ["A"],
    energy: ["J"],
    length: ["Å", "cm", "dm", "eV", "keV", "m", "µm", "mm", "nm"],
    magnetism: ["G", "Mx", "Oe", "T", "Wb"],
    mass: ["g", "kg", "mg"],
    pressure: ["atm", "bar", "mmHg", "Pa"],
    speed: ["Hz", "m/s"],
    temperature: ["°C", "K"],
    time: ["h", "µs", "ms", "ns", "m", "s"],
    volume: ["cm^3", "dm^3", "m^3", "mm^3"]
  };

  getUnits(variable: string): string[] {
    const kind = this.getKind(variable);
    if (kind) {
      return this.UNITS[kind];
    } else {
      return [].concat
        .apply(
          [],
          Object.keys(this.UNITS).map(key => this.UNITS[key])
        )
        .sort();
    }
  }

  private getKind(variable: string): string {
    const kinds = Object.keys(this.UNITS);
    return this.parse(variable).filter(suggestion =>
      kinds.includes(suggestion)
    )[0];
  }

  private parse(variable: string): string[] {
    let variableList: string[];
    if (variable.indexOf("_") !== -1) {
      variableList = variable.split("_");
    } else {
      variableList = [variable];
    }
    return variableList
      .map(part => part.toLowerCase())
      .filter(part => isNaN(Number(part)))
      .map(part => (part.includes("length") ? "length" : part))
      .map(part => part.replace(/\d+/, ""));
  }
}
