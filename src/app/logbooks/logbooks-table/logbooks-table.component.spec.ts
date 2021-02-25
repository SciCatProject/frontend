import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";

import { LogbooksTableComponent } from "./logbooks-table.component";
import { MockStore } from "shared/MockStubs";
import { Logbook } from "shared/sdk";
import { MatTableModule } from "@angular/material/table";

describe("LogbooksTableComponent", () => {
  let component: LogbooksTableComponent;
  let fixture: ComponentFixture<LogbooksTableComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };

  beforeEach(waitForAsync(() => {
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
