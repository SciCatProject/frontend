import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { DatafilesComponent } from 'datasets/datafiles/datafiles.component';
import { ConfigFormComponent } from 'shared/modules/config-form/config-form.component';
import { MockActivatedRoute, MockStore } from 'shared/MockStubs';
import { ObjKeysPipe, TitleCasePipe } from 'shared/pipes/index';
import { rootReducer } from 'state-management/reducers/root.reducer';
import { MatTableModule} from '@angular/material';
import { FileDropzoneComponent  } from './file-dropzone.component';
import {APP_CONFIG, AppConfig} from '../../app-config.module';
import * as lb from 'shared/sdk/services';

let mockConfig = {};


describe('FileDropzoneComponent', () => {
  let component: FileDropzoneComponent ;
  let fixture: ComponentFixture<FileDropzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas : [ NO_ERRORS_SCHEMA ],
      imports : [ ReactiveFormsModule, MatTableModule, StoreModule.forRoot({rootReducer}) ],
      declarations : [
        FileDropzoneComponent, DatafilesComponent, ConfigFormComponent,
        ObjKeysPipe, TitleCasePipe
      ]
    });
    TestBed.overrideComponent(FileDropzoneComponent, {
      set : {
        providers : [
          {provide : ActivatedRoute, useClass : MockActivatedRoute},
          { provide: APP_CONFIG, useValue: mockConfig },
          { provide: lb.DatasetAttachmentApi, useValue: mockConfig },
          {provide : Store, useClass : MockStore}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
});
