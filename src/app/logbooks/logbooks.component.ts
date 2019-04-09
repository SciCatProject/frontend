import { Component, OnInit } from "@angular/core";

import { Logbook } from "shared/sdk/models";
import { LogbookService } from "./logbook.service";

@Component({
  selector: "app-logbooks",
  templateUrl: "./logbooks.component.html",
  styleUrls: ["./logbooks.component.scss"]
})
export class LogbooksComponent implements OnInit {
  logbooks: Logbook[];

  columnsToDisplay: string[] = ["name", "latestEntry"];

  constructor(private logbookService: LogbookService) {}

  ngOnInit() {
    this.getLogbooks();
  }

  getLogbooks(): void {
    this.logbookService
      .getLogbooks()
      .subscribe(logbooks => (this.logbooks = logbooks));
  }
}
