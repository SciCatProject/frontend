import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "proposal-search-bar",
  templateUrl: "./proposal-search-bar.component.html",
  styleUrls: ["./proposal-search-bar.component.scss"],
  standalone: false,
})
export class ProposalSearchBarComponent implements OnInit, OnDestroy {
  textSearch = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

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
  }

  ngOnDestroy() {}
}
