import { Component } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { DynamicDatafilesComponent } from "./dynamic-datafiles/dynamic-datafiles.component";
import { DatafilesComponent } from "./static-datafiles/datafiles.component";

@Component({
  selector: "app-datafiles-wrapper",
  template: ` <ng-container *ngComponentOutlet="getDatafilesComponent()" /> `,
  standalone: false,
})
export class DatafilesWrapperComponent {
  constructor(private appConfigService: AppConfigService) {}

  getDatafilesComponent() {
    return this.appConfigService.getConfig().dynamicDatafilesViewEnabled
      ? DynamicDatafilesComponent
      : DatafilesComponent;
  }
}
