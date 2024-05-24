import { Component, OnDestroy, OnInit } from "@angular/core";
import { ClearableInputComponent } from "./clearable-input.component";
import { selectSearchTerms } from "../../../state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import {
  setSearchTermsAction,
  setTextFilterAction,
} from "../../../state-management/actions/datasets.actions";
import { debounceTime, distinctUntilChanged, skipWhile } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: "app-text-filter",
  template: `<mat-form-field>
    <mat-label>{{ label }}</mat-label>
    <input
      #input
      matInput
      class="search-input"
      type="search"
      (input)="textSearchChanged($event)"
    />
  </mat-form-field>`,
  styles: [
    `
      .mat-mdc-form-field {
        width: 100%;
      }
    `,
  ],
})
export class TextFilterComponent
  extends ClearableInputComponent
  implements OnDestroy
{
  static kName = "text";

  private textSubject = new Subject<string>();

  searchTerms$ = this.store.select(selectSearchTerms);

  label = "Text filter";

  subscription: Subscription;

  constructor(private store: Store) {
    super();
    this.subscription = this.textSubject
      .pipe(
        skipWhile((terms) => terms === ""),
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((terms) => {
        this.store.dispatch(setTextFilterAction({ text: terms }));
      });
  }

  textSearchChanged(event: any) {
    const pid = (event.target as HTMLInputElement).value;
    this.textSubject.next(pid);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.textSubject.complete();
  }
}
