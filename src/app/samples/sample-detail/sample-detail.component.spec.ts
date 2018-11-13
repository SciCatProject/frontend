import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleDetailComponent } from "./sample-detail.component";
import { HttpClient } from "@angular/common/http";
import {
  MockActivatedRoute,
  MockHttp,
  MockRouter,
  MockSampleService,
  MockStore
} from "../../shared/MockStubs";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { SampleService } from "../../samples/sample.service";

describe("SampleDetailComponent", () => {
  let component: SampleDetailComponent;
  let fixture: ComponentFixture<SampleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SampleDetailComponent]
    });
    TestBed.overrideComponent(SampleDetailComponent, {
      set: {
        providers: [
          { provide: HttpClient, useClass: MockHttp },
          { provide: Router, useClass: MockRouter },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: SampleService, useClass: MockSampleService },
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
});
