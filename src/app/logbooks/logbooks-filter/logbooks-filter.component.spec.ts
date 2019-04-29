import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatFormFieldModule, MatInputModule } from "@angular/material";
import { Store, StoreModule } from "@ngrx/store";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { LogbooksFilterComponent } from "./logbooks-filter.component";
import { MockStore } from "shared/MockStubs";

describe("LogbooksFilterComponent", () => {
  let component: LogbooksFilterComponent;
  let fixture: ComponentFixture<LogbooksFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({})
      ],
      declarations: [LogbooksFilterComponent]
    });
    TestBed.overrideComponent(LogbooksFilterComponent, {
      set: {
        providers: [{ provide: Store, useClass: MockStore }]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksFilterComponent);
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
