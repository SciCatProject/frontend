import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  selectInstrumentFacetCounts,
  selectInstrumentFilter,
} from "state-management/selectors/datasets.selectors";
import { selectInstruments } from "state-management/selectors/instruments.selectors";
import {
  createSuggestionObserver,
  getFacetCount,
  getFacetId,
  getFilterLabel,
} from "./utils";
import { BehaviorSubject, Subscription } from "rxjs";
import {
  addInstrumentFilterAction,
  removeInstrumentFilterAction,
} from "state-management/actions/datasets.actions";
import { ClearableInputComponent } from "./clearable-input.component";
import { Store } from "@ngrx/store";
import { FilterComponentInterface } from "./interface/filter-component.interface";
import { AppConfigService } from "app-config.service";
import { Instrument } from "@scicatproject/scicat-sdk-ts-angular";

@Component({
  selector: "app-instrument-filter",
  templateUrl: "instrument-filter.component.html",
  styleUrls: ["instrument-filter.component.scss"],
})
export class InstrumentFilterComponent
  extends ClearableInputComponent
  implements FilterComponentInterface, OnInit, OnDestroy
{
  private subscriptions: Subscription[] = [];
  protected readonly getFacetId = getFacetId;
  protected readonly getFacetCount = getFacetCount;
  readonly componentName: string = "InstrumentFilter";
  readonly label: string = "Instrument Filter";
  readonly tooltipText: string = "Filters datasets by instrument";

  appConfig = this.appConfigService.getConfig();

  instrumentFacetCounts$ = this.store.select(selectInstrumentFacetCounts);
  instrumentFilter$ = this.store.select(selectInstrumentFilter);

  instrumentInput$ = new BehaviorSubject<string>("");

  instrumentSuggestions$ = createSuggestionObserver(
    this.instrumentFacetCounts$,
    this.instrumentInput$,
    this.instrumentFilter$,
  );

  instrumentMap: { [id: string]: string } = {}; // Map instrument IDs to names

  constructor(
    private store: Store,
    public appConfigService: AppConfigService,
  ) {
    super();

    const filters = this.appConfig.labelMaps?.filters;
    this.label = getFilterLabel(filters, this.componentName, this.label);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(selectInstruments).subscribe((instruments) => {
        this.instrumentMap = {};
        instruments.forEach((instrument) => {
          if (instrument && instrument.pid) {
            this.instrumentMap[instrument.pid] =
              instrument.name || instrument.uniqueName || instrument.pid;
          }
        });
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getInstrumentName(instrumentId: string): string {
    return this.instrumentMap[instrumentId] || instrumentId || "No Instrument";
  }

  instrumentSelected(instrument: string | null) {
    const inst = instrument || "";
    this.store.dispatch(addInstrumentFilterAction({ instrument: inst }));
    this.instrumentInput$.next("");
  }

  instrumentRemoved(instrument: string) {
    this.store.dispatch(removeInstrumentFilterAction({ instrument }));
  }

  onInstrumentInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.instrumentInput$.next(value);
  }
}
