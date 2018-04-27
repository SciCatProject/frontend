import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule, MatDialogModule} from '@angular/material';
import {DatasetTablePureComponent} from './dataset-table-pure.component';
import {Store, StoreModule} from '@ngrx/store';
import {ConfigService} from 'shared/services/config.service';
import {
  MockActivatedRoute,
  MockConfigService,
  MockHttp,
  MockRouter,
  MockStore,
  MockUserApi
} from 'shared/MockStubs';
import {UserApi} from 'shared/sdk/services';


describe('DatasetTableComponent', () => {
  let component: DatasetTablePureComponent;
  let fixture: ComponentFixture<DatasetTablePureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule, FormsModule, ReactiveFormsModule],
      declarations: [DatasetTablePureComponent]
    });
    TestBed.overrideComponent(DatasetTablePureComponent, {
      set: {
        providers: [
          {provide: ConfigService, useClass: MockConfigService},
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTablePureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a material table', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.dataset-table')).toBeTruthy();
  });

  it('should contain 2 paginators', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.dataset-paginator').length).toBe(2);
  });
});
