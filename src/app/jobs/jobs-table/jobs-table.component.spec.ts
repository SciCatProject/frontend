import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmationService, DataTableModule, SharedModule, TreeTableModule} from 'primeng/primeng';

import {JobsTableComponent} from './jobs-table.component';
import {Store, StoreModule} from '@ngrx/store';
import {ConfigService} from 'shared/services/config.service';
import {MockConfigService, MockHttp, MockJobApi, MockRouter, MockStore, MockUserApi} from 'shared/MockStubs';
import {JobApi, UserApi} from 'shared/sdk/services';


describe('JobsTableComponent', () => {
  let component: JobsTableComponent;
  let fixture: ComponentFixture<JobsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [DataTableModule, SharedModule, TreeTableModule, FormsModule, ReactiveFormsModule, StoreModule.forRoot({})],
      declarations: [JobsTableComponent]
    });
    TestBed.overrideComponent(JobsTableComponent, {
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
    fixture = TestBed.createComponent(JobsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
