import { Component, OnInit } from "@angular/core";
import { SearchProposalAction } from "state-management/actions/proposals.actions";
import { Store } from "@ngrx/store";

@Component({
  selector: "proposal-search",
  templateUrl: "./proposal-search.component.html",
  styleUrls: ["./proposal-search.component.scss"]
})
export class ProposalSearchComponent implements OnInit {
  query: string;
  constructor(
    private store: Store<any>
  ) {}

  ngOnInit() {}


  textSearchChanged(query: string) {
    console.log(query);
    this.store.dispatch ( new SearchProposalAction (query));
  }
}
