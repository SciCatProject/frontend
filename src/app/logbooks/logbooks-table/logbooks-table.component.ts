import { Component, OnInit } from "@angular/core";

import { Logbook } from "shared/sdk/models";
import { LogbookService } from "../logbook.service";

@Component({
  selector: "app-logbooks-table",
  templateUrl: "./logbooks-table.component.html",
  styleUrls: ["./logbooks-table.component.scss"]
})
export class LogbooksTableComponent implements OnInit {
  logbooks: Logbook[];

  columnsToDisplay: string[] = ["name", "latestEntry", "sender", "entry"];

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
