import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Router, ActivatedRoute} from '@angular/router';
import { RawDatasetApi, DatablockApi } from 'shared/sdk/services';

import {DataTableModule} from 'primeng/primeng';

import {MockActivatedRoute, MockDatablockApi, MockDatasetApi, MockDatasetService, MockRouter} from 'shared/MockStubs';

import { DatablocksComponent } from './datablocks-table.component';

import { DatasetService } from 'datasets/dataset.service';

describe('DatablocksComponent', () => {
  let component: DatablocksComponent;
  let fixture: ComponentFixture<DatablocksComponent>;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
      imports: [ DataTableModule ],
      declarations: [ DatablocksComponent ]
    });
     TestBed.overrideComponent(DatablocksComponent, {
    set: {
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
        { provide: RawDatasetApi, useClass: MockDatasetApi },
        { provide: DatablockApi, useClass: MockDatablockApi },
        { provide : DatasetService, useClass: MockDatasetService }
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
