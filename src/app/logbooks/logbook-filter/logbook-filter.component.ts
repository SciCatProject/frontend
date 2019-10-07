import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";
import { Logbook } from "shared/sdk";
import { LogbookFilters } from "state-management/models";

@Component({
  selector: "logbook-filter",
  templateUrl: "./logbook-filter.component.html",
  styleUrls: ["./logbook-filter.component.scss"]
})
export class LogbookFilterComponent {
  @Input() logbook: Logbook;
  @Input() filters: LogbookFilters;

  @Output() onSelect = new EventEmitter<LogbookFilters>();

  public entries = ["Bot Messages", "User Messages", "Images"];

  isSelected(entry: string): boolean {
    return true;
  }

  doSelect(event: MatCheckboxChange, entry: string): void {
    if (event.checked) {
      switch (entry) {
        case "Bot Messages": {
          this.filters.showBotMessages = true;
          break;
        }
        case "User Messages": {
          this.filters.showUserMessages = true;
          break;
        }
        case "Images": {
          this.filters.showImages = true;
          break;
        }
        default: {
          break;
        }
      }
    } else {
      switch (entry) {
        case "Bot Messages": {
          this.filters.showBotMessages = false;
          break;
        }
        case "User Messages": {
          this.filters.showUserMessages = false;
          break;
        }
        case "Images": {
          this.filters.showImages = false;
          break;
        }
        default: {
          break;
        }
      }
    }
    this.onSelect.emit(this.filters);
  }
}
