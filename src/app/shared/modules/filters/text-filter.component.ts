import { Component, OnDestroy, OnInit } from "@angular/core";
import { ClearableInputComponent } from "./clearable-input.component";
import { Store } from "@ngrx/store";
import { setTextFilterAction } from "state-management/actions/datasets.actions";
import { debounceTime, distinctUntilChanged, skipWhile } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: "app-text-filter",
  templateUrl: "text-filter.component.html",
  styleUrls: ["text-filter.component.scss"],
})
export class TextFilterComponent
  extends ClearableInputComponent
  implements OnDestroy
{
  private textSubject = new Subject<string>();

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

  get label() {
    return "Text filter";
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
