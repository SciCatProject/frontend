import { PidFilterComponent } from "./pid-filter.component";
import { Component } from "@angular/core";

@Component({
  selector: "app-pid-startsWith-filter",
  templateUrl: "./pid-filter-startsWith.component.html",
  styleUrls: ["./pid-filter-startsWith.component.scss"],
})
export class PidFilterStartsWithComponent extends PidFilterComponent {
  readonly componentName: string = "PidFilterStartsWith";
  readonly label: string = "PID filter (Starts With)- Not implemented";
  readonly tooltipText: string = "Not implemented";

  buildPidTermsCondition(terms: string): { $regex: string } {
    return { $regex: `^${terms}` };
  }
}
