import { PidFilterComponent } from "./pid-filter.component";
import { Component } from "@angular/core";

@Component({
  selector: "app-pid-startsWith-filter",
  templateUrl: "./pid-filter.component.html",
  styleUrls: ["./pid-filter.component.scss"],
})
export class PidFilterStartsWithComponent extends PidFilterComponent {
  static kLabel = "PID filter (Starts With)";

  protected buildPidTermsCondition(terms: string): { $regex: string } {
    return { $regex: `^${terms}` };
  }
}
