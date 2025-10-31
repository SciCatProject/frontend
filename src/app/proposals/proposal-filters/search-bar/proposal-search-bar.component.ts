import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { addProposalFilterAction } from "state-management/actions/proposals.actions";

@Component({
  selector: "proposal-search-bar",
  templateUrl: "./proposal-search-bar.component.html",
  styleUrls: ["./proposal-search-bar.component.scss"],
  standalone: false,
})
export class ProposalSearchBarComponent {
  textSearch = "";

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onTextChange(term: string) {
    this.textSearch = term;
  }

  getTextSearchParam() {
    const { queryParams } = this.route.snapshot;
    const searchQuery = JSON.parse(queryParams.searchQuery || "{}");

    return searchQuery.text;
  }

  onSearchAction() {
    const { queryParams } = this.route.snapshot;
    const searchQuery = JSON.parse(queryParams.searchQuery || "{}");
    this.router.navigate([], {
      queryParams: {
        searchQuery: JSON.stringify({
          ...searchQuery,
          text: this.textSearch || undefined,
        }),
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
    this.store.dispatch(
      addProposalFilterAction({
        key: "text",
        value: this.textSearch || undefined,
        filterType: "text",
      }),
    );
  }
}
