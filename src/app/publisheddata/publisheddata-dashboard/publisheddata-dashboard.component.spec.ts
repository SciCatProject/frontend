import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { PublisheddataDashboardComponent } from "./publisheddata-dashboard.component";
import { MockStore, createMock, mockPublishedData } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { StoreModule, Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { CheckboxEvent } from "shared/modules/table/table.component";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { of } from "rxjs";
import { Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { ExportExcelService } from "shared/services/export-excel.service";
import { PublishedData } from "@scicatproject/scicat-sdk-ts";

const getConfig = () => ({});

describe("PublisheddataDashboardComponent", () => {
  let component: PublisheddataDashboardComponent;
  let fixture: ComponentFixture<PublisheddataDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        StoreModule.forRoot({}),
      ],
      declarations: [PublisheddataDashboardComponent],
    });
    TestBed.overrideComponent(PublisheddataDashboardComponent, {
      set: {
        providers: [
          {
            provide: Router,
            useValue: router,
          },
          {
            provide: AppConfigService,
            useValue: { getConfig },
          },
          { provide: ScicatDataService, useValue: {} },
          { provide: ExportExcelService, useValue: {} },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisheddataDashboardComponent);
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

  describe("#onShareClick()", () => {
    it("should copy the selected DOI's to the users clipboard and dispatch a showMessageAction", () => {
      const commandSpy = spyOn(document, "execCommand");
      dispatchSpy = spyOn(store, "dispatch");

      const message = new Message(
        "The selected DOI's have been copied to your clipboard",
        MessageType.Success,
        5000,
      );

      component.onShareClick();

      expect(commandSpy).toHaveBeenCalledTimes(1);
      expect(commandSpy).toHaveBeenCalledWith("copy");
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(showMessageAction({ message }));
    });
  });

  describe("#onRowClick", () => {
    it("should navigate to a Published Dataset", () => {
      const published = mockPublishedData;
      const id = encodeURIComponent(published.doi);
      component.onRowClick(published);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/publishedDatasets/" + id,
      );
    });
  });

  describe("#onSelectAll()", () => {
    it("should add all DOI's to selectedDOIs if checked is true", () => {
      const published = createMock<PublishedData>({
        doi: "test",
        creator: ["test"],
        publisher: "test",
        publicationYear: 2021,
        title: "test",
        abstract: "test",
        dataDescription: "test",
        resourceType: "test",
        pidArray: [],
        createdAt: "",
        registeredTime: "",
        status: "",
        updatedAt: "",
      });

      spyOn(component.vm$, "pipe").and.returnValue(
        of({ publishedData: [published] }),
      );

      const event = {
        event: {
          checked: true,
        },
        selection: { selected: [published] },
      };

      component.onSelectAll(event as any);

      expect(component.selectedDOIs.length).toEqual(1);
    });

    it("should remove all DOI's from selectedDOIs if checked is false", () => {
      component.selectedDOIs.push(
        component.doiBaseUrl + "test1",
        component.doiBaseUrl + "test2",
      );

      const event = {
        event: {
          checked: false,
        },
        selection: [],
      };

      component.onSelectAll(event as any);

      expect(component.selectedDOIs.length).toEqual(0);
    });
  });

  describe("#onSelectOne()", () => {
    it("should add the selected DOI to selectedDOIs if checked is true", () => {
      const checkboxEvent: CheckboxEvent = {
        event: { checked: true } as MatCheckboxChange,
        row: { doi: "test" },
      };

      component.onSelectOne(checkboxEvent);

      expect(component.selectedDOIs).toContain(
        component.doiBaseUrl + checkboxEvent.row.doi,
      );
    });

    it("should remove the deselected DOI from selectedDOIs if checked is false", () => {
      const checkboxEvent: CheckboxEvent = {
        event: { checked: false } as MatCheckboxChange,
        row: { doi: "test" },
      };

      component.selectedDOIs.push(component.doiBaseUrl + checkboxEvent.row.doi);

      component.onSelectOne(checkboxEvent);

      expect(component.selectedDOIs.length).toEqual(0);
    });
  });
});
