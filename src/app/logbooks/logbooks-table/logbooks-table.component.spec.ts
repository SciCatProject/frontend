import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTableModule } from "@angular/material";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";

import { LogbooksTableComponent } from "./logbooks-table.component";
import { MockStore } from "shared/MockStubs";
import { Logbook } from "shared/sdk";

describe("LogbooksTableComponent", () => {
  let component: LogbooksTableComponent;
  let fixture: ComponentFixture<LogbooksTableComponent>;

  let router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule],
      declarations: [LogbooksTableComponent]
    });
    TestBed.overrideComponent(LogbooksTableComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          { provide: Store, useClass: MockStore }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onClick()", () => {
    it("should navigate to a logbook", () => {
      const name = "testName";
      const logbook = new Logbook();
      logbook.name = name;

      component.onClick(logbook);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith("/logbooks/" + name);
    });
  });
});
