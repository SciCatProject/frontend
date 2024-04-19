import {Component, EventEmitter, Input, Output, SimpleChange} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { ApmService } from '@elastic/apm-rum-angular';

@Component({
  selector: 'full-text-search-bar',
  templateUrl: './full-text-search-bar.component.html',
  styleUrls: ['./full-text-search-bar.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatButtonModule
  ],
})
export class FullTextSearchBarComponent {
  @Input() prefilledValue: string = '';
  @Input() placeholder: string = 'Text Search';
  @Input() clear: boolean;
  @Output() search = new EventEmitter<{
    searchTerm: string,
    transaction: any
  }>();

  searchTerm: string = '';

  constructor(private apmService: ApmService) {}

  ngOnInit(): void {
    this.searchTerm = this.prefilledValue;
  }

  onSearch(): void {
    const transaction = this.apmService.apm.startTransaction('Search Clicked', 'user-interaction');
    // you can add more contextual information if necessary
    transaction.addLabels({ buttonId: 'full-width-search' });
    this.search.emit({
        searchTerm: this.searchTerm,
        transaction
      }
    );

    //TODO transaction.end();
  }

  onClear(): void {
    this.searchTerm = '';
    this.onSearch(); // Optionally trigger search on clear
  }
}

