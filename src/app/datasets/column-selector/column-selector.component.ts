import { Component, OnInit } from "@angular/core";

@Component({
  selector: "column-selector",
  templateUrl: "./column-selector.component.html",
  styleUrls: ["./column-selector.component.scss"]
})
export class ColumnSelectorComponent implements OnInit {
  public columns = [ "datasetName", "sourceFolder"];
  constructor() {}

  ngOnInit() {}
}
