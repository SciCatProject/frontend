import { Component } from "@angular/core";
import {
  selectLocationFacetCounts,
  selectLocationFilter,
} from "state-management/selectors/datasets.selectors";
import {
  createSuggestionObserver,
  getFacetCount,
  getFacetId,
  getFilterLabel,
} from "./utils";
import { BehaviorSubject } from "rxjs";
import {
  addLocationFilterAction,
  removeLocationFilterAction,
} from "state-management/actions/datasets.actions";
import { ClearableInputComponent } from "./clearable-input.component";
import { Store } from "@ngrx/store";
import { FilterComponentInterface } from "./interface/filter-component.interface";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "app-location-filter",
  templateUrl: "location-filter.component.html",
  styleUrls: ["location-filter.component.scss"],
  standalone: false,
})
export class LocationFilterComponent
  extends ClearableInputComponent
  implements FilterComponentInterface
{
  protected readonly getFacetId = getFacetId;
  protected readonly getFacetCount = getFacetCount;
  readonly componentName: string = "LocationFilter";
  readonly label: string = "Location Filter";
  readonly tooltipText: string = "Filters datasets by location";

  appConfig = this.appConfigService.getConfig();

  locationFacetCounts$ = this.store.select(selectLocationFacetCounts);
  locationFilter$ = this.store.select(selectLocationFilter);

  locationInput$ = new BehaviorSubject<string>("");

  locationSuggestions$ = createSuggestionObserver(
    this.locationFacetCounts$,
    this.locationInput$,
    this.locationFilter$,
  );

  constructor(
    private store: Store,
    public appConfigService: AppConfigService,
  ) {
    super();

    const filters = this.appConfig.labelMaps?.filters;
    this.label = getFilterLabel(filters, this.componentName, this.label);
  }

  locationSelected(location: string | null) {
    const loc = location || "";
    this.store.dispatch(addLocationFilterAction({ location: loc }));
    this.locationInput$.next("");
  }

  locationRemoved(location: string) {
    this.store.dispatch(removeLocationFilterAction({ location }));
  }

  onLocationInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.locationInput$.next(value);
  }
}
