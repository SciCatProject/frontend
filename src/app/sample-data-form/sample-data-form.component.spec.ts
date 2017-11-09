import {NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Store, StoreModule} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { SampleDataFormComponent } from './sample-data-form.component';
import { ConfigFormComponent} from 'shared/components/config-form/config-form.component';
import {MockConfigService, MockStore} from 'shared/MockStubs';
import {ObjKeysPipe, TitleCasePipe} from 'shared/pipes/index';
import {ConfigService} from 'shared/services';
describe('SampleDataFormComponent', () => {
  let component: SampleDataFormComponent;
  let fixture: ComponentFixture<SampleDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports : [ FormsModule, ReactiveFormsModule ],
      declarations: [ SampleDataFormComponent, ConfigFormComponent, ObjKeysPipe, TitleCasePipe ]
    });
    TestBed.overrideComponent(SampleDataFormComponent, {
      set : {
        providers : [
          // needed for config form sub component
          {provide : ConfigService, useClass : MockConfigService},
          {provide : Store, useClass : MockStore},
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // console.log(component);
    expect(component).toBeTruthy();
  });
});
