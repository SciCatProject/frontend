import {NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTableModule, SharedModule, TreeModule,
        TreeTableModule, AutoCompleteModule, DropdownModule, ConfirmationService, TabViewModule} from 'primeng/primeng';

import { DatasetTableComponent } from './dataset-table.component';
import {Store, StoreModule} from '@ngrx/store';
import {ConfigService} from 'shared/services/config.service';
import {
  MockConfigService,
  MockHttp,
  MockUserApi,
  MockJobApi,
  MockRouter,
  MockUserMsgService, MockDatasetService, MockDatasetApi, MockStore
} from 'shared/MockStubs';
import {JobApi, UserApi, RawDatasetApi} from 'shared/sdk/services';
import {DatasetService} from 'datasets/dataset.service';



describe('DatasetTableComponent', () => {
  let component: DatasetTableComponent;
  let fixture: ComponentFixture<DatasetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [DataTableModule, SharedModule, TreeTableModule, FormsModule, ReactiveFormsModule, StoreModule.forRoot({})],
      declarations: [ DatasetTableComponent ]
    });
    TestBed.overrideComponent(DatasetTableComponent, {
      set : {
        providers : [
          {provide : JobApi, useClass : MockJobApi},
          {provide : UserApi, useClass : MockUserApi},
          {provide : Http, useClass : MockHttp},
          {provide : Router, useClass : MockRouter},
          {provide : ConfigService, useClass : MockConfigService},
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
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
