import { Component, Input, OnInit } from "@angular/core";
import { Datablock } from "shared/sdk/models";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "datablocks-table",
  templateUrl: "./datablocks-table.component.html",
  styleUrls: ["./datablocks-table.component.scss"]
})
export class DatablocksComponent implements OnInit {
  @Input()
  datablocks: Datablock[] = [];

  blockSource: MatTableDataSource<any> | null = null;

  displayedColumns = ["id", "size", "files"];

  constructor() {}

  ngOnInit() {
    this.blockSource = new MatTableDataSource(this.datablocks);
  }

  onSelect(row: Record<string, unknown>) {
    console.log(row);
  }
}
