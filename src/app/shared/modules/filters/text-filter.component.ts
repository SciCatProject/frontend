import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { setTextFilterAction } from "state-management/actions/datasets.actions";
import { debounceTime, distinctUntilChanged, skipWhile } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { getFilterLabel } from "./utils";

@Component({
  selector: "app-text-filter",
  templateUrl: "text-filter.component.html",
  styleUrls: ["text-filter.component.scss"],
})
export class TextFilterComponent implements OnDestroy {
  private textSubject = new Subject<string>();

  @ViewChild("input", { static: true }) input!: ElementRef;

  subscription: Subscription;

  constructor(private store: Store) {
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
    return getFilterLabel(this.constructor.name);
  }

  @Input()
  set clear(value: boolean) {
    if (value) {
      this.input.nativeElement.value = "";
    }
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
