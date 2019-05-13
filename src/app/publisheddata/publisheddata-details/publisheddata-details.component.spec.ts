import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PublisheddataDetailsComponent } from "./publisheddata-details.component";
import { MockStore, MockPublishedDataApi, MockRouter } from "shared/MockStubs";
import { Store } from "@ngrx/store";
import { PublishedDataApi } from "shared/sdk";
import { MatCardModule } from "@angular/material";
import { NgxJsonViewerComponent } from "ngx-json-viewer";
import { Router } from "@angular/router";

describe("PublisheddataDetailsComponent", () => {
  let component: PublisheddataDetailsComponent;
  let fixture: ComponentFixture<PublisheddataDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublisheddataDetailsComponent],
      imports: [MatCardModule, NgxJsonViewerComponent]
    });
    TestBed.overrideComponent(PublisheddataDetailsComponent, {
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
    fixture = TestBed.createComponent(PublisheddataDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
