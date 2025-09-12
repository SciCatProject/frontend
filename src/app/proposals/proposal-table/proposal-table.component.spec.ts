import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfigService } from "app-config.service";
import {
  MockActivatedRoute,
  MockRouter,
  MockStore,
  MockDatasetApi,
  MockHttp,
} from "shared/MockStubs";
import { ExportExcelService } from "shared/services/export-excel.service";
import { Store, StoreModule } from "@ngrx/store";

import { ProposalTableComponent } from "./proposal-table.component";
import { ProposalsModule } from "proposals/proposals.module";
import { EffectsModule } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  DatasetsService,
  ProposalClass,
} from "@scicatproject/scicat-sdk-ts-angular";
import { BehaviorSubject } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

describe("ProposalTableComponent", () => {
  let component: ProposalTableComponent;
  let fixture: ComponentFixture<ProposalTableComponent>;

  const getConfig = () => ({});
  const dataSource = new BehaviorSubject<ProposalClass[]>([]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalTableComponent],
      imports: [
        ProposalsModule,
        EffectsModule.forRoot([]),
        StoreModule.forRoot({}),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: HttpClient, useClass: MockHttp },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: AppConfigService, useValue: { getConfig } },
        { provide: ExportExcelService, useValue: {} },
        { provide: Router, useClass: MockRouter },
        { provide: Store, useClass: MockStore },
        { provide: DatasetsService, useClass: MockDatasetApi },
        { provide: ScicatDataService, useValue: {} },
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalTableComponent);
    component = fixture.componentInstance;
    component.dataSource = dataSource;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
