import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {DataTableModule, SharedModule} from 'primeng/primeng';
import {Store, StoreModule} from '@ngrx/store';
import { JobsComponent } from './jobs.component';

import {Job} from '../shared/sdk/models';

import {MockJobApi, MockDatasetApi, MockStore} from '../shared/MockStubs';

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas : [ NO_ERRORS_SCHEMA ],
      imports: [ DataTableModule, SharedModule, StoreModule.forRoot({}) ],
      declarations: [ JobsComponent ]
    });
    TestBed.overrideComponent(JobsComponent, {
    set: {
      providers: [
        {provide: Store, useClass: MockStore}
      ]
    }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
