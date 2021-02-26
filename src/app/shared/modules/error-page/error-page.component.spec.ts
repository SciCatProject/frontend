import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ErrorPageComponent } from "./error-page.component";

import { ActivatedRoute } from "@angular/router";

import { MockActivatedRoute } from "shared/MockStubs";

describe("ErrorPageComponent", () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideComponent(ErrorPageComponent, {
      set: {
        providers: [{ provide: ActivatedRoute, useClass: MockActivatedRoute }]
      }
    });
    TestBed.configureTestingModule({
      declarations: [ErrorPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
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
