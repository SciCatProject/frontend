import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorFileBrowserComponent } from "./ingestor.file-browser.component";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("IngestorFileBrowserComponent", () => {
  let component: IngestorFileBrowserComponent;
  let fixture: ComponentFixture<IngestorFileBrowserComponent>;

  const mockDialog = {
    open: jasmine.createSpy("open"),
  };

  const mockDialogData = {
    someData: "someValue",
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorFileBrowserComponent],
      imports: [MatDialogModule, StoreModule.forRoot({})],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorFileBrowserComponent);
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
