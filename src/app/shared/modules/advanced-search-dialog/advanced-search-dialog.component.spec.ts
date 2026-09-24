import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdvancedSearchDialogComponent } from "./advanced-search-dialog.component";
import { UnitsService } from "shared/services/units.service";
import { UnitsOptionsService } from "shared/services/units-options.service";

describe("AdvancedSearchDialogComponent", () => {
  let component: AdvancedSearchDialogComponent;
  let fixture: ComponentFixture<AdvancedSearchDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AdvancedSearchDialogComponent>>;
  let mockUnitsService: jasmine.SpyObj<UnitsService>;
  let mockUnitsOptionsService: jasmine.SpyObj<UnitsOptionsService>;

  beforeEach(waitForAsync(() => {
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["close"]);
    mockUnitsService = jasmine.createSpyObj("UnitsService", ["getUnits"]);
    mockUnitsService.getUnits.and.returnValue(["deg", "rad"]);
    mockUnitsOptionsService = jasmine.createSpyObj("UnitsOptionsService", [
      "getUnitsOptions",
      "setUnitsOptions",
      "clearUnitsOptions",
    ]);
    mockUnitsOptionsService.getUnitsOptions.and.returnValue([]);

    TestBed.configureTestingModule({
      declarations: [AdvancedSearchDialogComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            conditions: [],
            metadataKeys: ["scientificMetadata.wavelength.value", "sample_env"],
            dialogTitle: "Advanced Search",
          },
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: UnitsService, useValue: mockUnitsService },
        { provide: UnitsOptionsService, useValue: mockUnitsOptionsService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add condition when addCondition is called", () => {
    component.addCondition("scientificMetadata.wavelength.value");
    expect(component.configuredConditions.length).toBe(1);
    expect(component.configuredConditions[0].condition.lhs).toBe(
      "scientificMetadata.wavelength.value",
    );
  });

  it("should close dialog with applied data on apply()", () => {
    component.addCondition("sample_env");
    component.apply();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      applied: true,
      conditions: component.configuredConditions,
    });
  });

  it("should close dialog with applied: false on cancel()", () => {
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith({ applied: false });
  });

  it("should clear all configured conditions on clearAll()", () => {
    component.addCondition("sample_env");
    expect(component.configuredConditions.length).toBe(1);
    component.clearAll();
    expect(component.configuredConditions.length).toBe(0);
  });
});
