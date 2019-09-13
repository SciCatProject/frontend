import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"]
})
export class SearchBarComponent implements OnInit {
  private query: string;

  @Output() change = new EventEmitter<string>();

  onChange(event: string) {
    this.change.emit(event);
  }

  constructor() {}

  ngOnInit() {}
}
