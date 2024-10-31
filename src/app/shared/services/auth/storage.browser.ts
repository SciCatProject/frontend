import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageBrowser {
  private parse(value: string) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  get(key: string) {
    const data: string = localStorage.getItem(key);
    return this.parse(data);
  }

  set(key: string, value: string): void {
    localStorage.setItem(
      key,
      typeof value === "object" ? JSON.stringify(value) : value,
    );
  }

  delete(key: string): void {
    if (localStorage[key]) {
      localStorage.removeItem(key);
    } else {
      throw new Error(`Cannot remove non-existent key: ${key}`);
    }
  }
}
