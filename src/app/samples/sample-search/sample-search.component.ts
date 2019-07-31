import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sample-search",
  templateUrl: "./sample-search.component.html",
  styleUrls: ["./sample-search.component.scss"]
})
export class SampleSearchComponent implements OnInit {
  query: string;

  constructor() {}

  ngOnInit() {}

  textSearchChanged() {}
}
