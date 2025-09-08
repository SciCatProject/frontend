import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class JsonformsAccordionRendererService {
  private panelOpenState: { [key: string]: boolean } = {};

  constructor() {}

  setPanelOpenState(key: string, isOpen: boolean): void {
    this.panelOpenState[key] = isOpen;
  }

  removePanelOpenState(key: string): void {
    delete this.panelOpenState[key];
  }

  getPanelOpenState(key: string): boolean {
    return this.panelOpenState[key] || false;
  }

  getState() {
    return this.panelOpenState;
  }
}
