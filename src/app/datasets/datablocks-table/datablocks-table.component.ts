import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {Datablock} from 'shared/sdk/models';
import {RawDatasetApi} from 'shared/sdk/services';

import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {DatasetService} from '../dataset.service';
import {MatTableDataSource, MatPaginator} from '@angular/material';

@Component({
  selector: 'datablocks-table',
  templateUrl: './datablocks-table.component.html',
  styleUrls: ['./datablocks-table.component.css']
})
export class DatablocksComponent implements OnInit {

  @Input() datasetId: number;
  datablocks: Array<Datablock>;
  dataSource: MatTableDataSource<any> | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private cds: DatasetService, private ds: RawDatasetApi, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const self = this;
    if (typeof(this.datasetId) !== 'undefined') {
      self.getDatablocks(self.datasetId);
    } else {
      this.route.params.subscribe(params => {
        if (params.id) {
          self.getDatablocks(params.id);
        } else {
          const navigationExtras: NavigationExtras = {
              queryParams: {
                  'message': 'No Dataset Specified'
              }
          };
          this.router.navigate(['error'], navigationExtras);
        }
      });
    }
  }

  /**
   * Link to dataset detail page with ID on click of table row
   * @param event
   */
  onUserClick(event) {
    this.router.navigateByUrl('/dataset/' + encodeURIComponent(event.data['datasetId']) + '/datafiles');
  }

  /**
   * Datablock relation does not work/exist so must go through
   * client service.
   * @param datasetID
   */
  getDatablocks(datasetID) {
    const self = this;
    this.cds.getBlockObservable(datasetID).subscribe(datablocks => {
      console.log(datablocks);
      if (datablocks.length > 0) {
        self.datablocks = datablocks;
        self.dataSource = new MatTableDataSource(this.datablocks);
      }
    });
  }

  onSelect(event) {
    console.log(event);
  }

}
