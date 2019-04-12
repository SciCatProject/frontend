import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

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

  constructor(private logbookService: LogbookService, private router: Router) {}

  ngOnInit() {
    this.getLogbooks();
  }

  getLogbooks(): void {
    this.logbookService.getLogbooks().subscribe(logbooks => {
      logbooks.forEach(logbook => {
        let descendingMessages = logbook.messages.reverse();
        logbook.messages = descendingMessages;
      });
      this.logbooks = logbooks;
    });
  }

  onClick(logbook: Logbook): void {
    this.router.navigateByUrl("/logbooks/" + logbook.name);
  }
}
