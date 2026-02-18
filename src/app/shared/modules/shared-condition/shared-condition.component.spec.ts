import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedConditionComponent } from "./shared-condition.component";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AsyncPipe } from "@angular/common";
import { UnitsService } from "shared/services/units.service";
import { UnitsOptionsService } from "shared/services/units-options.service";
import { of } from "rxjs";

describe("SharedConditionComponent", () => {
  let component: SharedConditionComponent;
  let fixture: ComponentFixture<SharedConditionComponent>;

  let mockStore: jasmine.SpyObj<Store>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockUnitsService: jasmine.SpyObj<UnitsService>;
  let mockUnitsOptionsService: jasmine.SpyObj<UnitsOptionsService>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj("Store", ["select", "dispatch"]);
    mockStore.select.and.returnValue(of([]));

    mockDialog = jasmine.createSpyObj("MatDialog", ["open"]);
    mockSnackBar = jasmine.createSpyObj("MatSnackBar", ["open"]);
    mockUnitsService = jasmine.createSpyObj("UnitsService", ["getUnits"]);
    mockUnitsOptionsService = jasmine.createSpyObj("UnitsOptionsService", [
      "getUnitsOptions",
      "setUnitsOptions",
      "clearUnitsOptions",
    ]);

    await TestBed.configureTestingModule({
      declarations: [SharedConditionComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: AsyncPipe, useClass: AsyncPipe },
        { provide: UnitsService, useValue: mockUnitsService },
        { provide: UnitsOptionsService, useValue: mockUnitsOptionsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
