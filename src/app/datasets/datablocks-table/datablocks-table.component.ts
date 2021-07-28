import { Component, Input } from "@angular/core";
import { Datablock } from "shared/sdk/models";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "datablocks-table",
  templateUrl: "./datablocks-table.component.html",
  styleUrls: ["./datablocks-table.component.scss"],
})
export class DatablocksComponent {
  @Input()
  datablocks: Datablock[] = [];

  blockSource: MatTableDataSource<Datablock>;

  displayedColumns = ["id", "size", "files"];

  constructor() {
    this.blockSource = new MatTableDataSource(this.datablocks);
  }

  onSelect(row: Record<string, unknown>) {
    console.log(row);
  }
}
