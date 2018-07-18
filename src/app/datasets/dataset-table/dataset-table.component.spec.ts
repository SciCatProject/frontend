import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { rootReducer } from 'state-management/reducers/root.reducer';
import { AppConfigModule } from 'app-config.module';


describe('DatasetTableComponent', () => {
  let component: DatasetTableComponent;
  let fixture: ComponentFixture<DatasetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule, MatDialogModule, FormsModule, ReactiveFormsModule, StoreModule.forRoot(rootReducer), AppConfigModule],
      declarations: [DatasetTableComponent]
    });
    TestBed.overrideComponent(DatasetTableComponent, {
      set: {
        providers: [
          {provide: UserApi, useClass: MockUserApi},
          {provide: HttpClient, useClass: MockHttp},
          {provide: Router, useClass: MockRouter},
          {provide: ActivatedRoute, useClass: MockActivatedRoute},
          {provide: ConfigService, useClass: MockConfigService},
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

  it('should contain an export button', () => {
    const compiled = fixture.debugElement.nativeElement;
    console.log(compiled);
    expect(compiled.querySelectorAll('.export-csv')).toBeTruthy();
  });
});
