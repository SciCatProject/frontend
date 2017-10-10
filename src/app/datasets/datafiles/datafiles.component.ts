import {Component, Input, OnInit} from '@angular/core';
import {OrigDatablock} from 'shared/sdk/models';

@Component({
  selector : 'datafiles',
  templateUrl : './datafiles.component.html',
  styleUrls : [ './datafiles.component.css' ]
})
export class DatafilesComponent implements OnInit {

  @Input() dataBlocks: Array<OrigDatablock>;
  count = 0;
  files: Array < JSON >= [];
  selectedDF;
  dsId: string;
  dataFiles: Array<any> = [];

  constructor() {}

  ngOnInit() {
    if (this.dataBlocks) {
      this.getDatafiles(this.dataBlocks);
    }
  }

  /**
   * Load datafiles and add to source for table viewing
   * @param datablocks
   */
  getDatafiles(datablocks: Array<OrigDatablock>) {
    const self = this;
    datablocks.map(function(block) {
      self.files = self.files.concat(block.dataFileList);
      self.count += block.dataFileList.length;
    });
  }

  /**
   * Handle clicks of rows
   * and select a datatfile to be viewed
   * @param event
   */
  onSelect(event) {
    console.log(event);
    this.selectedDF = event.data;
  }
}
