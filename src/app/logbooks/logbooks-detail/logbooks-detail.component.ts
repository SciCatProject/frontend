import { Component, OnInit } from "@angular/core";

import { Logbook } from "shared/sdk/models";
import { LogbookService } from "../logbook.service";

@Component({
  selector: "app-logbooks-detail",
  templateUrl: "./logbooks-detail.component.html",
  styleUrls: ["./logbooks-detail.component.scss"]
})
export class LogbooksDetailComponent implements OnInit {
  logbook: Logbook;

  constructor(private logbookService: LogbookService) {}

  ngOnInit() {
    this.getLogbook("ERIC");
  }

  getLogbook(name: string): void {
    this.logbookService
      .getLogbook(name)
      .subscribe(logbook => (this.logbook = logbook));
  }
}
