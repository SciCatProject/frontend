import { PidFilterComponent } from "./pid-filter.component";
import { Component } from "@angular/core";

@Component({
  selector: "app-pid-startsWith-filter",
  templateUrl: "./pid-filter-startsWith.component.html",
  styleUrls: ["./pid-filter-startsWith.component.scss"],
})
export class PidFilterStartsWithComponent extends PidFilterComponent {
  static kLabel = "PID filter (Starts With)";

  buildPidTermsCondition(terms: string): { $regex: string } {
    return { $regex: `^${terms}` };
  }
}
