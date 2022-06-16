import { DatePipe } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { provideMockStore } from "@ngrx/store/testing";
import { Dataset } from "shared/sdk";
import { selectRelatedDatasets } from "state-management/selectors/datasets.selectors";

import { RelatedDatasetsComponent } from "./related-datasets.component";

describe("RelatedDatasetsComponent", () => {
  let component: RelatedDatasetsComponent;
  let fixture: ComponentFixture<RelatedDatasetsComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedDatasetsComponent],
      providers: [
        DatePipe,
        provideMockStore({
          selectors: [{ selector: selectRelatedDatasets, value: [] }],
        }),
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = new Dataset();

      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledOnceWith(
        "/datasets/" + encodeURIComponent(dataset.pid)
      );
    });
  });
});
