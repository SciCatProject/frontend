import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PublisheddataTableComponent } from "./publisheddata-table.component";
import { MatTableModule } from "@angular/material";
import { Store } from "@ngrx/store";
import { MockStore, MockPublishedDataApi, MockRouter } from "shared/MockStubs";
import { PublishedDataApi } from "shared/sdk";

describe("PublisheddataTableComponent", () => {
  let component: PublisheddataTableComponent;
  let fixture: ComponentFixture<PublisheddataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublisheddataTableComponent],
      imports: [MatTableModule]
    });
    TestBed.overrideComponent(PublisheddataTableComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          { provide: Router, useClass: MockRouter },
          { provide: PublishedDataApi, useClass: MockPublishedDataApi }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisheddataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
