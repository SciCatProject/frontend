import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorNewTransferDialogPageComponent } from "./ingestor.new-transfer-dialog-page.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("IngestorNewTransferDialogPageComponent", () => {
  let component: IngestorNewTransferDialogPageComponent;
  let fixture: ComponentFixture<IngestorNewTransferDialogPageComponent>;

  const mockDialog = {
    open: jasmine.createSpy("open"),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorNewTransferDialogPageComponent],
      imports: [MatDialogModule, StoreModule.forRoot({})],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: mockDialog },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorNewTransferDialogPageComponent);
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
  describe("generateExampleDataForSciCatHeader", () => {
    beforeEach(() => {
      component.userProfile = {
        username: "testuser",
        email: "test@example.com",
      } as any;
      component.userGroups = ["group1", "group2"];
    });

    it("should populate common metadata fields from user profile and groups", () => {
      component.createNewTransferData.editorMode = "CREATION";

      component.generateExampleDataForSciCatHeader();

      const header = component.createNewTransferData.scicatHeader;
      expect(header["license"]).toBe("MIT License");
      expect(header["type"]).toBe("raw");
      expect(header["dataFormat"]).toBe("root");
      expect(header["owner"]).toBe("testuser");
      expect(header["ownerGroup"]).toBe("group1");
      expect(header["principalInvestigator"]).toBe("testuser");
      expect(header["ownerEmail"]).toBe("test@example.com");
      expect(header["contactEmail"]).toBe("test@example.com");
      expect(header["creationTime"]).toBeDefined();
      expect(new Date(header["creationTime"]).toString()).not.toBe(
        "Invalid Date",
      );
    });

    it("should set ownerGroup to undefined when userGroups is empty", () => {
      component.userGroups = [];
      component.createNewTransferData.editorMode = "CREATION";

      component.generateExampleDataForSciCatHeader();

      expect(
        component.createNewTransferData.scicatHeader["ownerGroup"],
      ).toBeUndefined();
    });
  });
});
