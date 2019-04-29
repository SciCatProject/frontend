import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCheckboxModule } from "@angular/material";
import { Store, StoreModule } from "@ngrx/store";

import { ContentSelectorComponent } from "./content-selector.component";
import { MockStore } from "shared/MockStubs";

describe("ContentSelectorComponent", () => {
  let component: ContentSelectorComponent;
  let fixture: ComponentFixture<ContentSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatCheckboxModule, StoreModule.forRoot({})],
      declarations: [ContentSelectorComponent]
    });
    TestBed.overrideComponent(ContentSelectorComponent, {
      set: {
        providers: [{ provide: Store, useClass: MockStore }]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSelectorComponent);
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
