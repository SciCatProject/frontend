import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTableModule } from "@angular/material";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";

import { LogbooksDetailComponent } from "./logbooks-detail.component";
import { MockStore, MockActivatedRoute } from "shared/MockStubs";

describe("LogbooksDetailComponent", () => {
  let component: LogbooksDetailComponent;
  let fixture: ComponentFixture<LogbooksDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule],
      declarations: [LogbooksDetailComponent]
    });
    TestBed.overrideComponent(LogbooksDetailComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Store, useClass: MockStore }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksDetailComponent);
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
