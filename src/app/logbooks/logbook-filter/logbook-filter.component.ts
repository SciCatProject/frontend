import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { LogbookFilters } from "state-management/models";

@Component({
  selector: "logbook-filter",
  templateUrl: "./logbook-filter.component.html",
  styleUrls: ["./logbook-filter.component.scss"],
  standalone: false,
})
export class LogbookFilterComponent {
  @Input() filters: LogbookFilters | null = {
    textSearch: "",
    showBotMessages: true,
    showImages: true,
    showUserMessages: true,
    sortField: "",
    skip: 0,
    limit: 25,
  };

  @Output() filterSelect = new EventEmitter<LogbookFilters>();

  public entries = ["Bot Messages", "User Messages", "Images"];

  isSelected(entry: string): boolean {
    if (!this.filters) {
      return true;
    }
    switch (entry) {
      case "Bot Messages": {
        return this.filters.showBotMessages;
      }
      case "User Messages": {
        return this.filters.showUserMessages;
      }
      case "Images": {
        return this.filters.showImages;
      }
      default: {
        return true;
      }
    }
  }

  doSelect(event: MatCheckboxChange, entry: string): void {
    if (this.filters) {
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
      this.filterSelect.emit(this.filters);
    }
  }
}
