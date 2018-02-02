import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Router, ActivatedRoute} from '@angular/router';

import { MatTableModule} from '@angular/material';

import {MockActivatedRoute, MockDatablockApi, MockDatasetApi, MockDatasetService, MockRouter} from 'shared/MockStubs';

import { DatablocksComponent } from './datablocks-table.component';

import { DatasetService } from 'datasets/dataset.service';

describe('DatablocksComponent', () => {
  let component: DatablocksComponent;
  let fixture: ComponentFixture<DatablocksComponent>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
      imports: [ MatTableModule ],
      declarations: [ DatablocksComponent ]
    });
     TestBed.overrideComponent(DatablocksComponent, {
    set: {
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
      ]
    }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatablocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
