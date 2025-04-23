import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { MockStore } from "shared/MockStubs";
import { BreadcrumbComponent } from "./breadcrumb.component";
import { Store } from "@ngrx/store";

describe("BreadcrumbComponent", () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      imports: [],
      providers: [
        { provide: Store, useClass: MockStore },
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
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
