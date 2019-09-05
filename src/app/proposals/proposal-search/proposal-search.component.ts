import { Component, OnInit } from "@angular/core";
import { SearchProposalAction } from "state-management/actions/proposals.actions";
import { Store } from "@ngrx/store";
import { Proposal } from "shared/sdk";

@Component({
  selector: "proposal-search",
  templateUrl: "./proposal-search.component.html",
  styleUrls: ["./proposal-search.component.scss"]
})
export class ProposalSearchComponent implements OnInit {
  query: string;

  constructor(private store: Store<Proposal>) {}

  ngOnInit() {}

  textSearchChanged(query: string) {
    this.store.dispatch(new SearchProposalAction(query));
  }
}
