import { Component, EventEmitter, Input, Output } from "@angular/core";
import { createSuggestionObserver, getFacetCount, getFacetId } from "./utils";
import { BehaviorSubject, Observable } from "rxjs";
import { ClearableInputComponent } from "./clearable-input.component";
import { AppConfigService } from "app-config.service";
import { FacetCount } from "state-management/state/datasets.store";

export type MultiSelectFilterValue = {
  key: string;
  value: string;
  event: "add" | "remove";
};

@Component({
  selector: "multiselect-filter",
  templateUrl: "multiselect-filter.component.html",
  styleUrls: ["multiselect-filter.component.scss"],
  standalone: false,
})
export class MultiSelectFilterComponent extends ClearableInputComponent {
  protected readonly getFacetId = getFacetId;
  protected readonly getFacetCount = getFacetCount;
  @Input() key = "";
  @Input() label = "";
  @Input() tooltip = "";
  @Input() facetCounts$: Observable<FacetCount[]>;
  @Input() currentFilter$: Observable<string[]>;
  @Output() onSelectionChange = new EventEmitter<MultiSelectFilterValue>();

  appConfig = this.appConfigService.getConfig();

  input$ = new BehaviorSubject<string>("");
  suggestions$: Observable<FacetCount[]>;

  constructor(public appConfigService: AppConfigService) {
    super();
  }

  ngOnInit() {
    this.suggestions$ = createSuggestionObserver(
      this.facetCounts$,
      this.input$,
      this.currentFilter$,
    );
  }

  itemSelected(value: string | null) {
    this.onSelectionChange.emit({ key: this.key, value: value, event: "add" });
    this.input$.next("");
  }

  itemRemoved(value: string) {
    this.onSelectionChange.emit({
      key: this.key,
      value: value,
      event: "remove",
    });
  }

  onInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.input$.next(value);
  }
}
