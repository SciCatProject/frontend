import { Component, Input } from '@angular/core';
import { Dataset } from 'shared/sdk';

@Component({
  selector: 'selected-dataset-list',
  templateUrl: './selected-list.component.html',
  styleUrls: ['./selected-list.component.css']
})

export class SelectedListComponent {
  @Input() datasets: Dataset[] = [];
}
