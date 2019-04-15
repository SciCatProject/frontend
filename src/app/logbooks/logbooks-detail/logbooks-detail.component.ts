import { Component, OnInit, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { ActivatedRoute } from "@angular/router";

import { Dataset, Logbook, Proposal } from "shared/sdk/models";
import { LogbookService } from "../logbook.service";

@Component({
  selector: "app-logbooks-detail",
  templateUrl: "./logbooks-detail.component.html",
  styleUrls: ["./logbooks-detail.component.scss"]
})
export class LogbooksDetailComponent implements OnInit {
  logbook: Logbook;
  dataSource: MatTableDataSource<Object[]>;
  displayedColumns: string[] = ["timestamp", "sender", "entry"];
  @Input() dataset: Dataset;
  @Input() proposal: Proposal;

  constructor(
    private logbookService: LogbookService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getLogbook();
  }

  getLogbook(): void {
    let name = this.route.snapshot.paramMap.get("name");
    if (name === null) {
      name = "ERIC";
    }
    // console.log("Logbook name: " + name);
    this.logbookService.getLogbook(name).subscribe(logbook => {
      logbook.messages.forEach(message => {
        if (message.content.msgtype === "m.image") {
          let externalThumbnailUrl = message.content.info.thumbnail_url.replace(
            "mxc://",
            "https://scicat03.esss.lu.se:8448/_matrix/media/r0/download/"
          );
          message.content.info.thumbnail_url = externalThumbnailUrl;
          let externalFullsizeUrl = message.content.url.replace(
            "mxc://",
            "https://scicat03.esss.lu.se:8448/_matrix/media/r0/download/"
          );
          message.content.url = externalFullsizeUrl;
        }
      });
      this.logbook = logbook;
      this.dataSource = new MatTableDataSource(this.logbook.messages);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
