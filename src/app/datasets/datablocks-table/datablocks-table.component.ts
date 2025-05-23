import { Component, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Datablock } from "@scicatproject/scicat-sdk-ts-angular";

@Component({
  selector: "datablocks-table",
  templateUrl: "./datablocks-table.component.html",
  styleUrls: ["./datablocks-table.component.scss"],
  standalone: false,
})
export class DatablocksComponent {
  @Input()
  datablocks: Datablock[] = [];

  blockSource: MatTableDataSource<Datablock>;

  displayedColumns = ["id", "size", "files"];

  constructor() {
    this.blockSource = new MatTableDataSource(this.datablocks);
  }

  onSelect(row: Record<string, unknown>) {}
}
