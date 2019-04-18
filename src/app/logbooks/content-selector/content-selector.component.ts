import { Component, OnInit, Inject } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";

@Component({
  selector: "app-content-selector",
  templateUrl: "./content-selector.component.html",
  styleUrls: ["./content-selector.component.scss"]
})
export class ContentSelectorComponent implements OnInit {
  public entries = ["Bot Messages", "User Messages", "Images"];

  constructor() {}

  ngOnInit() {}

  isSelected(entry: string): boolean {
    // console.log("entry: " + entry);
    return true;
  }

  onSelect(event: MatCheckboxChange, entry: string): void {
    if (event.checked) {
      console.log("checked: " + entry);
    } else {
      console.log("unchecked: " + entry);
    }
  }
}
