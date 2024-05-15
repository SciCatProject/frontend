import {
  Component,
  Input,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {
  fetchDatasetsAction,
  fetchFacetCountsAction,
  setSearchTermsAction,
} from "../../../state-management/actions/datasets.actions";
import { Store } from "@ngrx/store";

@Component({
  selector: "full-text-search-bar",
  template: `
    <mat-form-field appearance="fill" class="full-text-search-field">
      <mat-label>Search</mat-label>
      <input matInput placeholder="Type to search..."
             type="search"
             [(ngModel)]="searchTerm"
             (ngModelChange)="onSearchTermChange($event)"
      >
    </mat-form-field>
    <span>
  <button mat-flat-button
          color="accent"
          data-cy="search-button"
          (click)="onSearch()">
  <mat-icon>search</mat-icon>
  Search
</button>
<button mat-flat-button
        (click)="onClear()">
  <mat-icon>close</mat-icon>
  Clear
</button>

  </span>`,
  styles: [`.full-text-search-field {
    max-width: 80%;
    width: 100%;
    margin-left: 5em;
  }

  .full-text-search-field + span {
    margin-left: 5em;
  }`],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class FullTextSearchBarComponent {
  @Input() prefilledValue = "";
  @Input() placeholder = "Text Search";
  @Input() clear: boolean;

  searchTerm = "";

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.searchTerm = this.prefilledValue;
  }

  onSearch(): void {
    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
  }


  onSearchTermChange(terms: string) {
    this.store.dispatch(setSearchTermsAction({ terms }));
  }

  onClear(): void {
    this.searchTerm = "";
    this.store.dispatch(setSearchTermsAction({ terms: "" }));
    // this.onSearch(); // Optionally trigger search on clear
  }
}
