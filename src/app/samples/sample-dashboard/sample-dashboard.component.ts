import { Component, OnInit, Inject } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Store } from "@ngrx/store";
import { Sample } from "shared/sdk";
import { SearchSampleAction } from "state-management/actions/samples.actions";

@Component({
  selector: "sample-dashboard",
  templateUrl: "./sample-dashboard.component.html",
  styleUrls: ["./sample-dashboard.component.scss"]
})
export class SampleDashboardComponent implements OnInit {
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store<Sample>
  ) {}

  onTextSearchChange(query) {
    this.store.dispatch(new SearchSampleAction(query));
  }

  ngOnInit() {}
}
