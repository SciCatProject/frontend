import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RelationshipsComponent } from "./relationships.component";
import { provideMockStore } from "@ngrx/store/testing";
import { selectCurrentRelationships } from "state-management/selectors/datasets.selectors";
import { DynamicMatTableModule } from "shared/modules/dynamic-material-table/table/dynamic-mat-table.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { AppConfigService } from "app-config.service";
import { TranslateService } from "@ngx-translate/core";

describe("RelationshipsComponent", () => {
  let component: RelationshipsComponent;
  let fixture: ComponentFixture<RelationshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelationshipsComponent],
      imports: [
        BrowserAnimationsModule,
        DynamicMatTableModule.forRoot({}),
        SharedScicatFrontendModule,
      ],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectCurrentRelationships, value: [] }],
        }),
        { provide: AppConfigService, useValue: { getConfig: () => ({}) } },
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
