import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject, Subscription } from "rxjs";
import {
  setPidTermsAction,
  setPidTermsFilterAction,
} from "state-management/actions/datasets.actions";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "app-pid-filter",
  templateUrl: `./pid-filter.component.html`,
  styleUrls: [`./pid-filter.component.scss`],
})
export class PidFilterComponent implements OnDestroy {
  static kLabel = "PID filter (Equals)";

  private pidSubject = new Subject<string>();
  private subscription: Subscription;

  @ViewChild("input", { static: true }) input!: ElementRef;

  appConfig = this.appConfigService.getConfig();

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
  ) {
    this.subscription = this.pidSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((pid) => {
        const condition = !pid ? "" : this.buildPidTermsCondition(pid);
        this.store.dispatch(setPidTermsFilterAction({ pid: condition }));
      });
  }

  get label() {
    return (this.constructor as typeof PidFilterComponent).kLabel;
  }

  buildPidTermsCondition(terms: string): string | { $regex: string } {
    return terms;
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
    if (value) this.store.dispatch(setPidTermsAction({ pid: "" }));
  }
}
