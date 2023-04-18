import { Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "dataset-pid-selection",
  templateUrl: "./dataset-pid-selection.component.html",
  styleUrls: ["./dataset-pid-selection.component.scss"]
})
export class DatasetPidSelectionComponent  {

  pidInput$ = new BehaviorSubject<string>("");
  constructor(private router: Router) { }



  onPIDInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.pidInput$.next(value);
  }


  openPID() {
    const pid = encodeURIComponent(this.pidInput$.value);
    this.router.navigateByUrl(`/datasets/${pid}`);
  }
}
