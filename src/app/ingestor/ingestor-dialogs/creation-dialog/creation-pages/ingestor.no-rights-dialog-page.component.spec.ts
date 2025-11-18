import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorNoRightsDialogPageComponent } from "./ingestor.no-rights-dialog-page.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("IngestorNoRightsDialogPageComponent", () => {
  let component: IngestorNoRightsDialogPageComponent;
  let fixture: ComponentFixture<IngestorNoRightsDialogPageComponent>;

  const mockDialog = {
    open: jasmine.createSpy("open"),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorNoRightsDialogPageComponent],
      imports: [MatDialogModule, StoreModule.forRoot({})],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: mockDialog },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorNoRightsDialogPageComponent);
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
