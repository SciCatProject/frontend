import {Component, EventEmitter, Input, Output, SimpleChange} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'full-text-search-bar',
  templateUrl: './full-text-search-bar.component.html',
  styleUrls: ['./full-text-search-bar.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule],
})
export class FullTextSearchBarComponent {
  @Input() prefilledValue: string = '';
  @Input() placeholder: string = 'Text Search';
  @Input() clear: boolean;
  @Output() search = new EventEmitter<string>();
  @Output() searchBarFocus = new EventEmitter<void>();

  searchTerm: string = '';

  constructor() {}

  ngOnInit(): void {
    this.searchTerm = this.prefilledValue;
  }

  onSearch(): void {
    console.log(this.searchTerm);
    this.search.emit(this.searchTerm);
  }

  onFocus(): void {
    this.searchBarFocus.emit();
  }

  onClear(): void {
    this.searchTerm = '';
    this.onSearch(); // Optionally trigger search on clear
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "clear" && changes[propName].currentValue === true) {
        this.searchTerm = "";
      }
    }
  }
}

