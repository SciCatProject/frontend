import { PidFilterComponent } from "./pid-filter.component";
import { Component } from "@angular/core";

@Component({
  selector: "app-pid-contains-filter",
  templateUrl: "./pid-filter-contains.component.html",
  styleUrls: ["./pid-filter-contains.component.scss"],
})
export class PidFilterContainsComponent extends PidFilterComponent {
  readonly componentName: string = "PidFilter";
  readonly label: string = "PID filter (Contains)- Not implemented";

  buildPidTermsCondition(terms: string): { $regex: string } {
    return { $regex: terms };
  }
}
