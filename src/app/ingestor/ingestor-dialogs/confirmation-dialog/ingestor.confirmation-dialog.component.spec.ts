import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorConfirmationDialogComponent } from "./ingestor.confirmation-dialog.component";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("IngestorConfirmationDialogComponent", () => {
  let component: IngestorConfirmationDialogComponent;
  let fixture: ComponentFixture<IngestorConfirmationDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy("close"),
  };

  const mockDialogData = {
    message: "Test message",
    header: "Test header",
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorConfirmationDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorConfirmationDialogComponent);
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