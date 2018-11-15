import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { rootReducer } from "state-management/reducers/root.reducer";
import { DatasetsFilterComponent } from "datasets/datasets-filter/datasets-filter.component";
import {
  MockActivatedRoute,
  MockRouter,
  MockStore
} from "../../shared/MockStubs";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
} from "@angular/material";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ScientificConditionDialogComponent } from "datasets/scientific-condition-dialog/scientific-condition-dialog.component";

describe("DatasetsFilterComponent", () => {
  let component: DatasetsFilterComponent;
  let fixture: ComponentFixture<DatasetsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatAutocompleteModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({ rootReducer })
      ],
      declarations: [
        DatasetsFilterComponent,
        ScientificConditionDialogComponent
      ],
      providers: [{ provide: Store, useClass: MockStore }]
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

  afterEach(() => {
    fixture.destroy();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should contain a date range field", () => {
    const compiled = fixture.debugElement.nativeElement;
    const beamline = compiled.querySelector(".date-input");
    expect(beamline).toBeTruthy();
    expect(
      beamline.attributes.getNamedItem("placeholder").textContent
    ).toContain("Select a date range");
  });

  it("should contain a beamline input", () => {
    const compiled = fixture.debugElement.nativeElement;
    const beamline = compiled.querySelector(".location-input");
    expect(beamline).toBeTruthy();
    expect(
      beamline.attributes.getNamedItem("placeholder").textContent
    ).toContain("Location");
  });

  it("should contain a groups input", () => {
    const compiled = fixture.debugElement.nativeElement;
    const group = compiled.querySelector(".group-input");
    expect(group).toBeTruthy();
    expect(group.attributes.getNamedItem("placeholder").textContent).toContain(
      "Group"
    );
  });

  it("should contain a type input", () => {
    const compiled = fixture.debugElement.nativeElement;
    const type = compiled.querySelector(".type-input");
    expect(type).toBeTruthy();
    expect(type.attributes.getNamedItem("placeholder").textContent).toContain(
      "Type"
    );
  });

  it("should contain a clear button", () => {
    const compiled = fixture.debugElement.nativeElement;
    const btn = compiled.querySelector(".clear-button");
    expect(btn.textContent).toContain("Clear");
  });
});
