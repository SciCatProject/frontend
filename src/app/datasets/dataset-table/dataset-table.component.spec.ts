import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmationService, DataTableModule, SharedModule, TreeTableModule} from 'primeng/primeng';
import {MatTableModule, MatDialogModule} from '@angular/material';
import {DatasetTableComponent} from './dataset-table.component';
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
  let component: DatasetTableComponent;
  let fixture: ComponentFixture<DatasetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule, MatDialogModule, TreeTableModule, FormsModule, ReactiveFormsModule, StoreModule.forRoot({})],
      declarations: [DatasetTableComponent]
    });
    TestBed.overrideComponent(DatasetTableComponent, {
      set: {
        providers: [
          {provide: UserApi, useClass: MockUserApi},
          {provide: Http, useClass: MockHttp},
          {provide: Router, useClass: MockRouter},
          {provide: ActivatedRoute, useClass: MockActivatedRoute},
          {provide: ConfigService, useClass: MockConfigService},
          {provide: ConfirmationService, useClass: ConfirmationService},
          {provide: Store, useClass: MockStore}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain mode switching buttons', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.archive')).toBeTruthy();
    expect(compiled.querySelector('.archive').textContent).toContain('Archive');
    expect(compiled.querySelector('.retrieve')).toBeTruthy();
    expect(compiled.querySelector('.retrieve').textContent).toContain('Retrieve');
    expect(compiled.querySelector('.view')).toBeTruthy();
    expect(compiled.querySelector('.view').textContent).toContain('View');
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
