import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'selected-dataset-list',
  templateUrl: './selected-list.component.html',
  styleUrls: ['./selected-list.component.css']
})
export class SelectedListComponent implements OnInit {

  @Input() datasets = [];

  constructor() { }

  ngOnInit() {
  }

}
