import { Component, Input, OnInit } from "@angular/core";
import { Datablock } from "shared/sdk/models";
import { MatTableDataSource } from "@angular/material";

@Component({
  selector: "datablocks-table",
  templateUrl: "./datablocks-table.component.html",
  styleUrls: ["./datablocks-table.component.scss"]
})
export class DatablocksComponent implements OnInit {
  @Input()
  datablocks: Array<Datablock>;

  blockSource: MatTableDataSource<any> | null;

  displayedColumns = ["id", "size", "files"];

  constructor() {}

  ngOnInit() {
    this.blockSource = new MatTableDataSource(this.datablocks);
  }

  onSelect(event) {
    console.log(event);
  }
}
