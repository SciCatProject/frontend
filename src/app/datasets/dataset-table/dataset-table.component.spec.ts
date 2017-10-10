import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmationService, DataTableModule, SharedModule, TreeTableModule} from 'primeng/primeng';

import {DatasetTableComponent} from './dataset-table.component';
import {Store, StoreModule} from '@ngrx/store';
import {ConfigService} from 'shared/services/config.service';
import {MockConfigService, MockHttp, MockJobApi, MockRouter, MockStore, MockUserApi} from 'shared/MockStubs';
import {JobApi, UserApi} from 'shared/sdk/services';


describe('DatasetTableComponent', () => {
  let component: DatasetTableComponent;
  let fixture: ComponentFixture<DatasetTableComponent>;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [DataTableModule, SharedModule, TreeTableModule, FormsModule, ReactiveFormsModule, StoreModule.forRoot({})],
      declarations: [DatasetTableComponent]
    });
    TestBed.overrideComponent(DatasetTableComponent, {
      set: {
        providers: [
          {provide: JobApi, useClass: MockJobApi},
          {provide: UserApi, useClass: MockUserApi},
          {provide: Http, useClass: MockHttp},
          {provide: Router, useClass: MockRouter},
          {provide: ConfigService, useClass: MockConfigService},
          {provide: ConfirmationService, useClass: ConfirmationService},
          {provide: Store, useClass: MockStore}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTableComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(Store);
    fixture.detectChanges();
  });

  it('should be created', () => {
    component.archiveOrRetrieve(true, '/somewhereonthedisk');

    // store.select(state => state.root.jobs.jobSubmission).subscribe(result => {
    //   expect(result).toEqual(expectedResult);
    // });


    expect(component).toBeTruthy();
  });
});
