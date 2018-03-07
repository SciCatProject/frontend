import { Component, OnInit, Input } from '@angular/core';
import * as selectors from 'state-management/selectors';
import { Store } from '@ngrx/store';
@Component({
  selector: 'selected-dataset-list',
  templateUrl: './selected-list.component.html',
  styleUrls: ['./selected-list.component.css']
})
export class SelectedListComponent implements OnInit {

  @Input() datasets = [];

  sets$;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.sets$ = this.store.select(selectors.datasets.getSelectedSets);
  }

}
