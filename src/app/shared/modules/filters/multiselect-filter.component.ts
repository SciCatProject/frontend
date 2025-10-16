import { Component, EventEmitter, Input, Output } from "@angular/core";
import { createSuggestionObserver, getFacetCount } from "./utils";
import { BehaviorSubject, Observable } from "rxjs";
import { ClearableInputComponent } from "./clearable-input.component";
import { AppConfigService } from "app-config.service";
import { FacetCount } from "state-management/state/datasets.store";

export type MultiSelectFilterValue = {
  key: string;
  value: { _id: string; label?: string };
  event: "add" | "remove";
};

@Component({
  selector: "multiselect-filter",
  templateUrl: "multiselect-filter.component.html",
  styleUrls: ["multiselect-filter.component.scss"],
  standalone: false,
})
export class MultiSelectFilterComponent extends ClearableInputComponent {
  protected readonly getFacetCount = getFacetCount;
  @Input() key = "";
  @Input() label = "";
  @Input() tooltip = "";
  @Input() facetCounts$: Observable<FacetCount[]>;
  @Input() currentFilter$: Observable<string[]>;
  @Output() selectionChange = new EventEmitter<MultiSelectFilterValue>();

  appConfig = this.appConfigService.getConfig();

  input$ = new BehaviorSubject<string>("");
  suggestions$: Observable<FacetCount[]>;

  labelById = new Map<string, string>();

  constructor(public appConfigService: AppConfigService) {
    super();
  }

  ngOnInit() {
    this.suggestions$ = createSuggestionObserver(
      this.facetCounts$,
      this.input$,
      this.currentFilter$,
    );

    this.facetCounts$.subscribe((facets) => {
      this.labelById.clear();
      facets?.forEach((fc) => {
        this.labelById.set(fc._id, fc.label ?? fc._id);
      });
    });
  }

  itemSelected(value: { _id: string; label?: string } | null) {
    this.selectionChange.emit({ key: this.key, value: value, event: "add" });
    this.input$.next("");
  }

  itemRemoved(value: string | null) {
    this.selectionChange.emit({
      key: this.key,
      value: { _id: value },
      event: "remove",
    });
  }

  onInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.input$.next(value);
  }

  getLabel(id: string): string {
    return this.labelById.get(id) ?? id;
  }
}
