import { Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { AppConfigService } from "../../app-config.service";

@Component({
  selector: "dataset-pid-selection",
  templateUrl: "./dataset-pid-selection.component.html",
  styleUrls: ["./dataset-pid-selection.component.scss"]
})
export class DatasetPidSelectionComponent  {

  pidInput$ = new BehaviorSubject<string>("");
  appConfig = this.appConfigService.getConfig();
  constructor(private router: Router,public appConfigService: AppConfigService) { }



  onPIDInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.pidInput$.next(value);
  }


  openPID() {
    const value = this.pidInput$.value;
    if (!this.appConfig.prefix) {
      const pid = encodeURIComponent(value);
      this.router.navigateByUrl(`/datasets/${pid}`);
      return;
    }
    if (value.startsWith(this.appConfig.prefix)) {
      const pid = encodeURIComponent(value);
      this.router.navigateByUrl(`/datasets/${pid}`);
    } else {
      const pid = encodeURIComponent(`${this.appConfig.prefix}/${value}`);
      this.router.navigateByUrl(`/datasets/${pid}`);
    }
  }
}
