import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material';
import {DatasetTablePureComponent} from './dataset-table-pure.component';
import {ConfigService} from 'shared/services/config.service';
import { MockConfigService} from 'shared/MockStubs';
import { FileSizePipe } from '../filesize.pipe';

describe('DatasetTablePureComponent', () => {
  let component: DatasetTablePureComponent;
  let fixture: ComponentFixture<DatasetTablePureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule, FormsModule, ReactiveFormsModule],
      declarations: [DatasetTablePureComponent, FileSizePipe]
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
    expect(component).toBeDefined();
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
