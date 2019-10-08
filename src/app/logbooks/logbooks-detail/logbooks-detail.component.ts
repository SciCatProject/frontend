import { Component, Input } from "@angular/core";
import { Logbook } from "state-management/models";

@Component({
  selector: "app-logbooks-detail",
  templateUrl: "./logbooks-detail.component.html",
  styleUrls: ["./logbooks-detail.component.scss"]
})
export class LogbooksDetailComponent {
  @Input() logbook: Logbook;

  displayedColumns: string[] = ["timestamp", "sender", "entry"];
}
