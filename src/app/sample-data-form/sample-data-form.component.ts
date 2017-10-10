import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sample-data-form',
  templateUrl: './sample-data-form.component.html',
  styleUrls: ['./sample-data-form.component.css']
})
export class SampleDataFormComponent implements OnInit {

  sample = {
    'Name': 'Sample Data Entry 1',
    'Density': 'Some number',
    'Chemical Formula': 'Some formula'
  };

  constructor() { }

  ngOnInit() {
  }

}
