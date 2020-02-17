import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UnitsService {
  private UNITS = {
    area: ["cm^2", "m^2", "mm^2"],
    charge: ["coulomb"],
    current: ["ampere"],
    energy: ["joule"],
    length: [
      "angstrom",
      "centimeter",
      "decimeter",
      "eV",
      "keV",
      "meter",
      "micrometer",
      "millimeter",
      "nanometer"
    ],
    magnetism: ["gauss", "maxwell", "oersted", "tesla", "weber"],
    mass: ["gram", "kilogram", "milligram"],
    pressure: ["atm", "bar", "mmHg", "pascal"],
    speed: ["hertz", "m/s"],
    temperature: ["celsius", "kelvin"],
    time: [
      "hour",
      "microsecond",
      "millisecond",
      "nanosecond",
      "minute",
      "second"
    ],
    volume: ["cm^3", "m^3", "mm^3"]
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
