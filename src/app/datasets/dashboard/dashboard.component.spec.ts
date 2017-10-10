import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { DatasetTableComponent } from 'datasets/dataset-table/dataset-table.component';
import { DatasetService } from 'datasets/dataset.service';
import { DatasetsFilterComponent } from 'datasets/datasets-filter/datasets-filter.component';
import { ConfirmationService } from 'primeng/primeng';
import { JobApi, UserApi } from 'shared/sdk/services';
import { ConfigService } from 'shared/services/config.service';
import { rootReducer } from 'state-management/reducers/root.reducer';

import {
    MockConfigService,
    MockDatablockApi,
    MockDatasetService,
    MockHttp,
    MockJobApi,
    MockRouter,
    MockStore,
    MockUserApi,
} from '../../shared/MockStubs';
import { OrigDatablockApi } from '../../shared/sdk';
import { DashboardComponent } from './dashboard.component';

/* tslint:disable:no-unused-variable */
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas : [ NO_ERRORS_SCHEMA ],
      imports : [
        FormsModule, ReactiveFormsModule, StoreModule.forRoot({rootReducer})
      ],
      declarations : [
        DashboardComponent, DatasetsFilterComponent, DatasetTableComponent
      ]
    });
    TestBed.overrideComponent(DashboardComponent, {
      set : {
        providers : [
          {provide : Router, useClass : MockRouter},
          {provide : Http, useClass : MockHttp},
          {provide : DatasetService, useClass : MockDatasetService},
          {provide : Store, useClass : MockStore},
          {provide : UserApi, useClass : MockUserApi},
          {provide : OrigDatablockApi, useClass : MockDatablockApi},
          {provide : ConfigService, useClass : MockConfigService},
          {provide : JobApi, useClass : MockJobApi},
          {provide : ConfirmationService, useClass : ConfirmationService}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
});
