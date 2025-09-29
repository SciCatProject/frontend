import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorDialogStepperComponent } from "./ingestor.dialog-stepper.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("IngestorDialogStepperComponent", () => {
  let component: IngestorDialogStepperComponent;
  let fixture: ComponentFixture<IngestorDialogStepperComponent>;

  const mockDialog = {
    open: jasmine.createSpy("open"),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorDialogStepperComponent],
      imports: [
        MatDialogModule,
        MatMenuModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: mockDialog },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorDialogStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});