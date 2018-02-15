import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AutoCompleteModule, DataTableModule, SharedModule, TreeModule } from 'primeng/primeng';
import { rootReducer } from 'state-management/reducers/root.reducer';
import { DatasetsFilterComponent } from 'datasets/datasets-filter/datasets-filter.component';
import { MockStore, MockActivatedRoute, MockRouter } from '../../shared/MockStubs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteModule, MatSelectModule } from '@angular/material';

describe('DatasetsFilterComponent', () => {
  let component: DatasetsFilterComponent;
  let fixture: ComponentFixture<DatasetsFilterComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          TreeModule, MatAutocompleteModule, SharedModule, DataTableModule, MatSelectModule,
          StoreModule.forRoot({ rootReducer })
        ],
        declarations: [DatasetsFilterComponent],
        providers: [
          { provide: Store, useClass: MockStore },
        ]
      });
    TestBed.overrideComponent(DatasetsFilterComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          { provide: Router, useClass: MockRouter },
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => { expect(component).toBeTruthy(); });

  it('should contain a date range field', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('form').textContent).toContain('Date Range');
  });

  it('should contain a beamline input', () => {
    const compiled = fixture.debugElement.nativeElement;
    const beamline = compiled.querySelector('.beamline-input');
    expect(beamline.childNodes[1].attributes.getNamedItem('placeholder').textContent).toContain('Beamline');
  });

  it('should contain a groups input', () => {
    const compiled = fixture.debugElement.nativeElement;
    const group = compiled.querySelector('.group-input');
    expect(group.childNodes[1].attributes.getNamedItem('placeholder').textContent).toContain('Group');
  });

  it('should contain a clear button', () => {
    const compiled = fixture.debugElement.nativeElement;
    const btn = compiled.querySelector('.clear-filters-btn');
    expect(btn.textContent).toContain('Clear');
  });
});
