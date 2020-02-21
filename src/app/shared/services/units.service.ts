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
      "centimeters",
      "decimeters",
      "eV",
      "keV",
      "meters",
      "micrometers",
      "millimeters",
      "nanometers"
    ],
    magnetism: ["tesla", "weber"],
    mass: ["grams", "kilograms", "milligrams"],
    pressure: ["atm", "bar", "mmHg", "Pa"],
    speed: ["hertz", "m/s"],
    temperature: ["celsius", "kelvin"],
    time: [
      "hours",
      "microseconds",
      "milliseconds",
      "nanoseconds",
      "minutes",
      "seconds"
    ],
    volume: ["cm^3", "dm^3", "m^3", "mm^3"]
  };

  private SYMBOLS = {
    "cm^2": "cm\u00B2",
    "m^2": "m\u00B2",
    "mm^2": "mm\u00B2",
    coulomb: "C",
    ampere: "A",
    joule: "J",
    angstrom: "Å",
    centimeters: "cm",
    decimeters: "dm",
    meters: "m",
    micrometers: "µm",
    millimeters: "mm",
    nanometers: "nm",
    tesla: "T",
    weber: "Wb",
    grams: "g",
    kilograms: "kg",
    milligrams: "mg",
    hertz: "Hz",
    celsius: "°C",
    kelvin: "K",
    hours: "h",
    microseconds: "µs",
    milliseconds: "ms",
    nanoseconds: "ns",
    minutes: "min",
    seconds: "s",
    "cm^3": "cm\u00B3",
    "dm^3": "dm\u00B3",
    "m^3": "m\u00B3",
    "mm^3": "mm\u00B3"
  };

  getSymbol(unit: string): string {
    const symbol = this.SYMBOLS[unit];
    return symbol ? symbol : unit;
  }

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
        .sort((a: string, b: string) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        );
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
