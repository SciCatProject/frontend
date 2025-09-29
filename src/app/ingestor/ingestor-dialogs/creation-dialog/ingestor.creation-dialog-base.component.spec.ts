import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorCreationDialogBaseComponent } from "./ingestor.creation-dialog-base.component";
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { IngestorMetadataSSEService } from "ingestor/ingestor-page/helper/ingestor.metadata-sse-service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";

describe("IngestorCreationDialogBaseComponent", () => {
  let component: IngestorCreationDialogBaseComponent;
  let fixture: ComponentFixture<IngestorCreationDialogBaseComponent>;

  const mockDialog = {
    open: jasmine.createSpy("open"),
  };

  const mockSSEService = {
    connect: jasmine.createSpy("connect"),
    disconnect: jasmine.createSpy("disconnect"),
    getMessages: jasmine.createSpy("getMessages").and.returnValue(of({})),
  };

  const mockDialogData = {
    someData: "someValue",
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorCreationDialogBaseComponent],
      imports: [
        MatDialogModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: mockDialog },
        { provide: IngestorMetadataSSEService, useValue: mockSSEService },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorCreationDialogBaseComponent);
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