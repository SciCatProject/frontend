import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatCardModule } from "@angular/material";
import {
  MockActivatedRoute,
  MockHttp,
  MockStore
} from "../../shared/MockStubs";
import { SampleDetailComponent } from "./sample-detail.component";
import { Store } from "@ngrx/store";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgxJsonViewerModule } from "ngx-json-viewer";

describe("SampleDetailComponent", () => {
  let component: SampleDetailComponent;
  let fixture: ComponentFixture<SampleDetailComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SampleDetailComponent],
      imports: [MatCardModule, NgxJsonViewerModule]
    });
    TestBed.overrideComponent(SampleDetailComponent, {
      set: {
        providers: [
          { provide: HttpClient, useClass: MockHttp },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Store, useClass: MockStore }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onClickDataset()", () => {
    it("should navigate to a dataset", () => {
      const datasetId = "testId";

      component.onClickDataset(datasetId);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/datasets/" + datasetId
      );
    });
  });
});
