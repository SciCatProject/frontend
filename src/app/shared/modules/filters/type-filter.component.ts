import { Component } from "@angular/core";
import { ClearableInputComponent } from "./clearable-input.component";
import {
  createSuggestionObserver,
  getFacetCount,
  getFacetId,
  getFilterLabel,
} from "./utils";
import {
  selectTypeFacetCounts,
  selectTypeFilter,
} from "state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import {
  addTypeFilterAction,
  removeTypeFilterAction,
} from "state-management/actions/datasets.actions";
import { AppConfigService } from "app-config.service";
import { FilterComponentInterface } from "./interface/filter-component.interface";

@Component({
  selector: "app-type-filter",
  templateUrl: "type-filter.component.html",
  styleUrls: ["type-filter.component.scss"],
  standalone: false,
})
export class TypeFilterComponent
  extends ClearableInputComponent
  implements FilterComponentInterface
{
  protected readonly getFacetCount = getFacetCount;
  protected readonly getFacetId = getFacetId;
  readonly componentName: string = "TypeFilter";
  readonly label: string = "Type Filter";
  readonly tooltipText: string = "Filters datasets by type";

  appConfig = this.appConfigService.getConfig();

  typeFacetCounts$ = this.store.select(selectTypeFacetCounts);

  typeFilter$ = this.store.select(selectTypeFilter);
  typeInput$ = new BehaviorSubject<string>("");

  typeSuggestions$ = createSuggestionObserver(
    this.typeFacetCounts$,
    this.typeInput$,
    this.typeFilter$,
  );

  constructor(
    private store: Store,
    public appConfigService: AppConfigService,
  ) {
    super();

    const filters = this.appConfig.labelMaps?.filters;
    this.label = getFilterLabel(filters, this.componentName, this.label);
  }
  onTypeInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.typeInput$.next(value);
  }

  typeSelected(type: string) {
    this.store.dispatch(addTypeFilterAction({ datasetType: type }));
    this.typeInput$.next("");
  }

  typeRemoved(type: string) {
    this.store.dispatch(removeTypeFilterAction({ datasetType: type }));
  }
}
