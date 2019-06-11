import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Store } from "@ngrx/store";

import { ReduceComponent } from "./reduce.component";
import { MockStore, MockRouter } from "shared/MockStubs";
import { MatCardModule } from "@angular/material";
import { Router } from "@angular/router";

describe("ReduceComponent", () => {
  let component: ReduceComponent;
  let fixture: ComponentFixture<ReduceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatCardModule],
      declarations: [ReduceComponent]
    });
    TestBed.overrideComponent(ReduceComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
