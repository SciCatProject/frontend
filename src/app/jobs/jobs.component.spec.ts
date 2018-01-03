import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Store, StoreModule} from '@ngrx/store';
import { JobsComponent } from './jobs.component';
import { MatTableModule, MatPaginatorModule } from '@angular/material';
import {MockStore} from '../shared/MockStubs';

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas : [ NO_ERRORS_SCHEMA ],
      imports: [ MatTableModule, MatPaginatorModule, StoreModule.forRoot({}) ],
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
