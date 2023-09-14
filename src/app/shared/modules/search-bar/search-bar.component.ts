import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import { Subject } from "rxjs";
import { distinctUntilChanged, debounceTime } from "rxjs/operators";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent implements OnChanges {
  private searchDebounce = 300;
  searchSubject = new Subject<string>();

  @ViewChild("searchBar", { static: true }) searchBar!: ElementRef;
  @Input() prefilledValue: string | null = "";
  @Input() placeholder = "";
  @Input() autocompleteOptions = [];
  @Input() clear = false;

  @Output() search = this.searchSubject.pipe(
    distinctUntilChanged(),
    debounceTime(this.searchDebounce),
  );
  @Output() searchBarFocus = new EventEmitter<string>();

  doSearch() {
    this.searchSubject.next(this.query);
  }

  doFocus() {
    this.searchBarFocus.emit(this.query);
  }

  get query() {
    return this.searchBar.nativeElement.value;
  }

  set query(value: string) {
    this.searchBar.nativeElement.value = value;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "clear" && changes[propName].currentValue === true) {
        this.query = "";
      }
    }
  }
}
