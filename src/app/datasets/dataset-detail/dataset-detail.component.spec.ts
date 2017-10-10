import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { DatafilesComponent } from 'datasets/datafiles/datafiles.component';
import { ConfigFormComponent } from 'shared/components/config-form/config-form.component';
import { MockActivatedRoute, MockStore } from 'shared/MockStubs';
import { ObjKeysPipe, TitleCasePipe } from 'shared/pipes/index';
import { rootReducer } from 'state-management/reducers/root.reducer';

import { DatasetDetailComponent } from './dataset-detail.component';


describe('DatasetDetailComponent', () => {
  let component: DatasetDetailComponent;
  let fixture: ComponentFixture<DatasetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas : [ NO_ERRORS_SCHEMA ],
      imports : [ ReactiveFormsModule, StoreModule.forRoot({rootReducer}) ],
      declarations : [
        DatasetDetailComponent, DatafilesComponent, ConfigFormComponent,
        ObjKeysPipe, TitleCasePipe
      ]
    });
    TestBed.overrideComponent(DatasetDetailComponent, {
      set : {
        providers : [
          {provide : ActivatedRoute, useClass : MockActivatedRoute},
          {provide : Store, useClass : MockStore}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
});
