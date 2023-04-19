import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetPidSelectionComponent } from "./dataset-pid-selection.component";
//import { SharedScicatFrontendModule } from "../../shared/shared.module";
import { RouterModule } from "@angular/router";
import { AppConfigService } from "../../app-config.service";
import { DatasetApi } from "../../shared/sdk";
import { MockDatasetApi } from "../../shared/MockStubs";

describe("DatasetPidSelectionComponent", () => {
  let component: DatasetPidSelectionComponent;
  let fixture: ComponentFixture<DatasetPidSelectionComponent>;
  const getConfig = () => ({});


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetPidSelectionComponent ],
      imports: [
        RouterModule,
        RouterModule.forRoot([], { relativeLinkResolution: "legacy" }),
      ]
    })
    .compileComponents();
    TestBed.overrideComponent(DatasetPidSelectionComponent, {
      set: {
        providers: [
          {
            provide: AppConfigService,
            useValue: { getConfig },
          },
          { provide: DatasetApi, useClass: MockDatasetApi },
        ],
      },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetPidSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
