import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute, MockRouter, MockStore } from "shared/MockStubs";
import { FilesDashboardComponent } from "./files-dashboard.component";
import { DatePipe } from "@angular/common";
import { Store } from "@ngrx/store";

describe("FilesDashboardComponent", () => {
  let component: FilesDashboardComponent;
  let fixture: ComponentFixture<FilesDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FilesDashboardComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
        { provide: Store, useClass: MockStore },
        DatePipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesDashboardComponent);
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
