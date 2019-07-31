import { APP_CONFIG } from './../../../app-config.module';
import { Store } from '@ngrx/store';
import { MockStore } from './../../../shared/MockStubs';
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ProposalsListComponent } from "./proposals-list.component";
import { MatListModule, MatTableModule, MatPaginatorModule } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { MockRouter } from "shared/MockStubs";

describe("ProposalsListComponent", () => {
  let component: ProposalsListComponent;
  let fixture: ComponentFixture<ProposalsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProposalsListComponent],
      imports: [MatListModule, MatTableModule, MatPaginatorModule, RouterTestingModule]
    });
    TestBed.overrideComponent(ProposalsListComponent, {
      set: {
        providers: [
          { provide: Router, useClass: MockRouter },
          { provide: Store, useClass: MockStore },
          {
            provide: APP_CONFIG,
            useValue: {
              disabledDatasetColumns: [],
              archiveWorkflowEnabled: true
            }
          },
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalsListComponent);
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
