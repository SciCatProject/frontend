import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Store, StoreModule} from '@ngrx/store';
import {DatasetTableComponent} from 'datasets/dataset-table/dataset-table.component';
import {DatasetsFilterComponent} from 'datasets/datasets-filter/datasets-filter.component';
import {ConfirmationService} from 'primeng/primeng';
import {UserApi} from 'shared/sdk/services';
import {ConfigService} from 'shared/services/config.service';
import {rootReducer} from 'state-management/reducers/root.reducer';
import { MatAutocompleteModule, MatTableModule, MatDialogModule} from '@angular/material';
import { ParamsService } from 'params.service';
import {
  MockActivatedRoute,
  MockConfigService,
  MockHttp,
  MockRouter,
  MockStore,
  MockUserApi,
  MockParamsService
} from '../../shared/MockStubs';
import {DashboardComponent} from './dashboard.component';

/* tslint:disable:no-unused-variable */
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatAutocompleteModule, MatTableModule, MatDialogModule,
        FormsModule, ReactiveFormsModule, StoreModule.forRoot({rootReducer})
      ],
      declarations: [
        DashboardComponent, DatasetsFilterComponent, DatasetTableComponent
      ]
    });
    TestBed.overrideComponent(DashboardComponent, {
      set: {
        providers: [
          {provide: ActivatedRoute, useClass: MockActivatedRoute},
          {provide: Router, useClass: MockRouter},
          {provide: ParamsService, useClass : MockParamsService},
          {provide: Store, useClass: MockStore},
          {provide: UserApi, useClass: MockUserApi},
          {provide: Http, useClass: MockHttp},
          {provide: ConfigService, useClass: MockConfigService},
          {provide: ConfirmationService, useClass: ConfirmationService},
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
