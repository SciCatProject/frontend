import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";
import { provideMockStore } from "@ngrx/store/testing";
import { BehaviorSubject } from "rxjs";
import { DynamicMatTableModule } from "./dynamic-mat-table.module";
import { DynamicMatTableComponent } from "./dynamic-mat-table.component";

describe("DynamicMatTableComponent pagination position", () => {
  let fixture: ComponentFixture<DynamicMatTableComponent<any>>;
  let config: { paginationPosition?: "top" | "bottom" | "both" };

  beforeEach(async () => {
    config = { paginationPosition: "both" };
    await TestBed.configureTestingModule({
      imports: [DynamicMatTableModule.forRoot({})],
      providers: [
        provideMockStore(),
        provideNoopAnimations(),
        { provide: AppConfigService, useValue: { getConfig: () => config } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicMatTableComponent);
    (fixture.componentInstance as any).dataSource = new BehaviorSubject([]);
    fixture.componentInstance.pagination = {
      length: 10,
      pageIndex: 0,
      pageSize: 5,
      pageSizeOptions: [5, 10],
    };
    fixture.detectChanges();
  });

  ["top", "bottom", "both"].forEach((position) => {
    it(`renders pagination at ${position}`, () => {
      config.paginationPosition = position as "top" | "bottom" | "both";
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;
      const header = element.querySelector(".datasets-header-paginator");
      const footer = element.querySelector(".datasets-footer-paginator");

      expect(!!header).toBe(position === "top" || position === "both");
      expect(!!footer).toBe(position === "bottom" || position === "both");
    });
  });
});
