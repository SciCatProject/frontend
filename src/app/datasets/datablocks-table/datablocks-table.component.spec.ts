import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ActivatedRoute, Router } from "@angular/router";

import { MatTableModule } from "@angular/material";

import { MockActivatedRoute, MockRouter } from "shared/MockStubs";

import { DatablocksComponent } from "./datablocks-table.component";
import { SharedCatanieModule } from "shared/shared.module";

describe("DatablocksComponent", () => {
  let component: DatablocksComponent;
  let fixture: ComponentFixture<DatablocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, SharedCatanieModule],
      declarations: [DatablocksComponent]
    });
    TestBed.overrideComponent(DatablocksComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatablocksComponent);
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
