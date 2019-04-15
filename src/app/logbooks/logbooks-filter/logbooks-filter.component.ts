import { Component, OnInit, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-logbooks-filter",
  templateUrl: "./logbooks-filter.component.html",
  styleUrls: ["./logbooks-filter.component.scss"]
})
export class LogbooksFilterComponent implements OnInit {
  @Input() dataSource: MatTableDataSource<Object[]>;
  constructor() {}

  ngOnInit() {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
