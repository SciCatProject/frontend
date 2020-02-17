import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { Dataset } from "shared/sdk";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { DatePipe } from "@angular/common";

export interface HistoryItem {
  property: string;
  value: any;
  updatedBy: string;
  updatedAt: string;
}

@Component({
  selector: "dataset-lifecycle",
  templateUrl: "./dataset-lifecycle.component.html",
  styleUrls: ["./dataset-lifecycle.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class DatasetLifecycleComponent implements OnInit, OnChanges {
  @Input() dataset: Dataset;
  historyItems: HistoryItem[];
  displayedColumns = ["property", "updatedBy", "updatedAt"];
  expandedItem: any | null;

  private parseHistoryItems(): HistoryItem[] {
    if (this.dataset) {
      return this.dataset.history.map(item => {
        const property = Object.keys(item)
          .filter(key => key !== "id")
          .filter(key => !key.includes("updated"))
          .pop();

        return {
          property,
          value: item[property],
          updatedBy: item.updatedBy.replace("ldap.", ""),
          updatedAt: this.datePipe.transform(
            item.updatedAt,
            "yyyy-MM-dd, EEE HH:mm"
          )
        };
      });
    }
  }

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.historyItems = this.parseHistoryItems();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "dataset") {
        this.dataset = changes[propName].currentValue;
        this.historyItems = this.parseHistoryItems();
      }
    }
  }
}
