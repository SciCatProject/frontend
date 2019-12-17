import { APP_CONFIG } from "app-config.module";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import { MatDialogModule, MatDialog } from "@angular/material";
import {
  MockActivatedRoute,
  MockRouter,
  MockStore
} from "../../shared/MockStubs";
import { DashboardComponent } from "./dashboard.component";
import { of } from "rxjs";
import { addDatasetAction } from "state-management/actions/datasets.actions";
import { DerivedDataset } from "shared/sdk";

class MockMatDialog {
  open() {
    return {
      afterClosed: () =>
        of({
          datasetName: "Test Name",
          description: "Test description",
          ownerGroup: "test",
          sourceFolder: "/nfs/test",
          usedSoftware: "test software"
        })
    };
  }
}

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatDialogModule, StoreModule.forRoot({})],
      declarations: [DashboardComponent]
    });
    TestBed.overrideComponent(DashboardComponent, {
      set: {
        providers: [
          { provide: APP_CONFIG, useValue: { shoppingCartOnHeader: "true" } },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: MatDialog, useClass: MockMatDialog },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#openDialog()", () => {
    it("should dispatch an addDatasetAction when dialog returns a value", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const currentUser = {
        id: "testId",
        username: "ldap.Test User",
        email: "test@email.com",
        realm: "test",
        emailVerified: true,
        password: "testPassword",
        accessTokens: [],
        identities: [],
        credentials: []
      };

      const dataset = new DerivedDataset({
        accessGroups: [],
        contactEmail: currentUser.email,
        createdBy: currentUser.username,
        creationTime: new Date(),
        datasetName: "Test Name",
        description: "Test description",
        inputDatasets: [],
        investigator: currentUser.email,
        isPublished: false,
        keywords: [],
        owner: currentUser.username.replace("ldap.", ""),
        ownerEmail: currentUser.email,
        ownerGroup: "test",
        packedSize: 0,
        scientificMetadata: {},
        size: 0,
        sourceFolder: "/nfs/test",
        type: "derived",
        usedSoftware: ["test software"]
      });

      component.currentUser = currentUser;
      component.userGroups = ["test"];

      component.openDialog();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(addDatasetAction({ dataset }));
    });
  });
});
