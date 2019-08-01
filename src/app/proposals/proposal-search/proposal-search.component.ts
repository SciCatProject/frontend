import { Component, OnInit } from "@angular/core";

@Component({
  selector: "proposal-search",
  templateUrl: "./proposal-search.component.html",
  styleUrls: ["./proposal-search.component.scss"]
})
export class ProposalSearchComponent implements OnInit {
  query: string;
  constructor() {}

  ngOnInit() {}


  textSearchChanged(query: string) {
    console.log(query);
    // this.store.dispatch ( new SearchSampleAction (query));
  }
}
