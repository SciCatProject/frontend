import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleTableComponent } from "./sample-table.component";
import { Store } from "@ngrx/store";
import { MatTableModule } from "@angular/material";
import {
  MockHttp,
  MockRouter,
  MockSampleService,
  MockStore
} from "../../shared/MockStubs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SampleService } from "../sample.service";


describe("SampleTableComponent", () => {
  let component: SampleTableComponent;
  let fixture: ComponentFixture<SampleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SampleTableComponent],
      imports: [MatTableModule]
    });
    TestBed.overrideComponent(SampleTableComponent, {
      set: {
        providers: [
          { provide: HttpClient, useClass: MockHttp },
          { provide: Router, useClass: MockRouter },
          { provide: SampleService, useClass: MockSampleService },
          { provide: Store, useClass: MockStore }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
