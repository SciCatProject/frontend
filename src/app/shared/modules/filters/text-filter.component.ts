import { Component, OnDestroy, OnInit } from "@angular/core";
import { ClearableInputComponent } from "./clearable-input.component";
import { Store } from "@ngrx/store";
import { setTextFilterAction } from "state-management/actions/datasets.actions";
import { debounceTime, distinctUntilChanged, skipWhile } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { AppConfigService } from "app-config.service";
import { FilterComponentInterface } from "./interface/filter-component.interface";
import { getFilterLabel } from "./utils";

@Component({
  selector: "app-text-filter",
  templateUrl: "text-filter.component.html",
  styleUrls: ["text-filter.component.scss"],
})
export class TextFilterComponent
  extends ClearableInputComponent
  implements FilterComponentInterface, OnDestroy
{
  private textSubject = new Subject<string>();
  readonly componentName: string = "TextFilter";
  readonly label: string = "Text Filter";
  readonly tooltipText: string = "Search across dataset name and description";

  appConfig = this.appConfigService.getConfig();
  subscription: Subscription;

  constructor(
    private store: Store,
    public appConfigService: AppConfigService,
  ) {
    super();

    const filters = this.appConfig.labelMaps?.filters;
    this.label = getFilterLabel(filters, this.componentName, this.label);
    this.subscription = this.textSubject
      .pipe(
        skipWhile((terms) => terms === ""),
        debounceTime(200),
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
