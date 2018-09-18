import {Component, Input, OnInit, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {OrigDatablock} from 'shared/sdk/models';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {APP_CONFIG, AppConfig} from 'app-config.module';
import { getIsAdmin } from 'state-management/selectors/users.selectors';

@Component({
  selector: 'datafiles',
  templateUrl: './datafiles.component.html',
  styleUrls: ['./datafiles.component.css']
})
export class DatafilesComponent implements OnInit, AfterViewInit {

  @Input() dataBlocks: Array<OrigDatablock>;

  urlPrefix: string;
  count: number = 0;
  files: Array<JSON> = [];
  selectedDF;
  dsId: string;
  dataFiles: Array<any> = [];

  displayedColumns = ['name', 'size', 'path'];

  dataSource: MatTableDataSource<any> | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  admin$: Observable<boolean>;

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
  ) {
    this.urlPrefix = appConfig.fileserverBaseURL;
  }

  ngOnInit() {
    this.admin$ = this.store.pipe(select(getIsAdmin));
    if (this.dataBlocks) {
      this.getDatafiles(this.dataBlocks);
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
    // this.dataSource.sort = this.sort;
  }

  /**
   * Load datafiles and add to source for table viewing
   * @param datablocks
   */
  getDatafiles(datablocks: Array<OrigDatablock>) {
    const self = this;
    datablocks.forEach(block => {
      self.files = self.files.concat(block.dataFileList);
      self.count += block.dataFileList.length;
    });
    this.dataSource = new MatTableDataSource(this.files);
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
