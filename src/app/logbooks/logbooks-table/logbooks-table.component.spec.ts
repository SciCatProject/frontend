import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTableModule } from "@angular/material";
import { StoreModule } from "@ngrx/store";
import { Router } from "@angular/router";

import { LogbooksTableComponent } from "./logbooks-table.component";
import { MockRouter } from "shared/MockStubs";

describe("LogbooksTableComponent", () => {
  let component: LogbooksTableComponent;
  let fixture: ComponentFixture<LogbooksTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule, StoreModule.forRoot({})],
      declarations: [LogbooksTableComponent]
    });
    TestBed.overrideComponent(LogbooksTableComponent, {
      set: {
        providers: [{ provide: Router, useClass: MockRouter }]
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
});
