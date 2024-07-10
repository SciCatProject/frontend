import { PidFilterComponent } from "./pid-filter.component";
import { Component } from "@angular/core";

@Component({
  selector: "app-pid-contains-filter",
  templateUrl: "./pid-filter.component.html",
  styleUrls: ["./pid-filter.component.scss"],
})
export class PidFilterContainsComponent extends PidFilterComponent {
  static kLabel = "PID filter (Contains)";

  protected buildPidTermsCondition(terms: string): { $regex: string } {
    return { $regex: terms };
  }
}
