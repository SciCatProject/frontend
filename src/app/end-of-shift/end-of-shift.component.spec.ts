import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { EndOfShiftComponent } from './end-of-shift.component';
import { HttpModule } from '@angular/http';
import {Headers, Http, RequestOptions} from '@angular/http';
import {ConfigService} from '../shared/services/config.service';
import {Datablock, RawDataset, Job, User} from '../shared/sdk/models';
import {DatablockApi, RawDatasetApi, JobApi, UserApi, ProposalApi} from '../shared/sdk/services';
import {DatasetService} from 'datasets/dataset.service';
import {Store, StoreModule} from '@ngrx/store';
import {
    MockActivatedRoute,
    MockAuthService,
    MockConfigService,
    MockDatablockApi,
    MockDatasetApi,
    MockDatasetService,
    MockHttp,
    MockJobApi,
    MockProposalApi,
    MockRouter,
    MockStore,
    MockUserApi,
    MockUserMsgService,
} from '../shared/MockStubs';

import {DataTableModule, SharedModule, TreeModule,
        TreeTableModule, AutoCompleteModule, DropdownModule, TabViewModule} from 'primeng/primeng';

describe('EndOfShiftComponent', () => {
  let component: EndOfShiftComponent;
  let fixture: ComponentFixture<EndOfShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas : [ NO_ERRORS_SCHEMA ],
      imports: [DropdownModule, StoreModule.forRoot({})],
      declarations: [ EndOfShiftComponent ]
    });
    TestBed.overrideComponent(EndOfShiftComponent, {
      set : {
        providers : [
          {provide : RawDatasetApi, useClass : MockDatasetApi},
          {provide : JobApi, useClass : MockJobApi},
          {provide : UserApi, useClass : MockUserApi},
          {provide : DatablockApi, useClass : MockDatablockApi},
          {provide : RawDatasetApi, useClass : MockDatasetApi},
          {provide : ProposalApi, useClass : MockProposalApi},
          {provide : Http, useClass : MockHttp},
          {provide: DatasetService, useClass: MockDatasetService},
          {provide : ConfigService, useClass : MockConfigService},
          {provide: Store, useClass: MockStore}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndOfShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
