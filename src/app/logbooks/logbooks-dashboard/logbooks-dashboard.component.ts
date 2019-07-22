import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Logbook } from "shared/sdk";
import { Subscription } from "rxjs";
import { getLogbook } from "state-management/selectors/logbooks.selector";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-logbooks-dashboard",
  templateUrl: "./logbooks-dashboard.component.html",
  styleUrls: ["./logbooks-dashboard.component.scss"]
})
export class LogbooksDashboardComponent implements OnInit, OnDestroy {
  logbook: Logbook;
  logbookSubscription: Subscription;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private store: Store<Logbook>
  ) {
    iconRegistry.addSvgIcon(
      "riot-im",
      sanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/riot-im-logo-black-text.svg"
      )
    );
  }

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
  }
}
