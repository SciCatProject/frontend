import { PidFilterComponent } from "./pid-filter.component";
import { Component } from "@angular/core";

@Component({
  selector: "app-pid-contains-filter",
  templateUrl: "./pid-filter-contains.component.html",
  styleUrls: ["./pid-filter-contains.component.scss"],
})
export class PidFilterContainsComponent extends PidFilterComponent {
  readonly componentName: string = "PidFilterContains";
  readonly label: string = "PID filter (Contains)- Not implemented";
  readonly tooltipText: string = "Not implemented";

  buildPidTermsCondition(terms: string): { $regex: string } {
    return { $regex: terms };
  }
}
