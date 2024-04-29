import { Component, Input, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject, Subscription } from "rxjs";
import {
  setPidTermsAction,
  setPidTermsFilterAction,
} from "../../../state-management/actions/datasets.actions";
import { debounceTime, distinctUntilChanged, skipWhile } from "rxjs/operators";
import { AppConfigService } from "../../../app-config.service";
import { ClearableInputComponent } from "./clearable-input.component";
// import { addPidFilterAction, removePidFilterAction } from 'state-management/actions/datasets.actions';

enum PidTermsSearchCondition {
  startsWith = "startsWith",
  contains = "contains",
  equals = "equals",
}

@Component({
  selector: "app-pid-filter",
  template: `
    <mat-form-field>
      <mat-label>PID filter</mat-label>
      <input
        #input
        matInput
        (input)="onPidInput($event)"
        placeholder="Enter PID terms..."
      />
    </mat-form-field>
  `,
  styles: [
    `
      .mat-mdc-form-field {
        width: 100%;
      }
    `,
  ],
})
export class PidFilterComponent
  extends ClearableInputComponent<string>
  implements OnDestroy
{
  static kName = "pid";

  private pidSubject = new Subject<string>();
  private subscription: Subscription;

  appConfig = this.appConfigService.getConfig();

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
  ) {
    super();
    this.subscription = this.pidSubject
      .pipe(
        skipWhile((terms) => terms.length < 5),
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((pid) => {
        const condition = this.buildPidTermsCondition(pid);
        this.store.dispatch(setPidTermsFilterAction({ pid: condition }));
      });
  }

  private buildPidTermsCondition(terms: string) {
    if (!terms) return "";
    switch (this.appConfig.pidSearchMethod) {
      case PidTermsSearchCondition.startsWith: {
        return { $regex: `^${terms}` };
      }
      case PidTermsSearchCondition.contains: {
        return { $regex: terms };
      }
      default: {
        return terms;
      }
    }
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
    this.pidSubject.complete();
  }

  onPidInput(event: any) {
    const pid = (event.target as HTMLInputElement).value;
    this.pidSubject.next(pid);
  }

  @Input()
  set clear(value: boolean) {
    super.clear = value;

    if (value) this.store.dispatch(setPidTermsAction({ pid: "" }));
  }
}
