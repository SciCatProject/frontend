import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BatchViewComponent } from "./batch-view.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import {
  MockStore,
  MockRouter,
  MockArchivingService,
  MockDatasetApi,
  MockShareGroupApi,
} from "shared/MockStubs";
import { ArchivingService } from "../archiving.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { MatDialog, MatDialogModule } from "@angular/material/dialog";

import { ShareGroupApi, DatasetApi } from "shared/sdk";
import { SharedCatanieModule } from "shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { APP_CONFIG } from "app-config.module";

describe("BatchViewComponent", () => {
  let component: BatchViewComponent;
  let fixture: ComponentFixture<BatchViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BatchViewComponent],
      imports: [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatTableModule,
        SharedCatanieModule,
      ],
    });

    TestBed.overrideComponent(BatchViewComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          { provide: ArchivingService, useClass: MockArchivingService },
          { provide: Router, useClass: MockRouter },
          { provide: ShareGroupApi, useClass: MockShareGroupApi },
          { provide: DatasetApi, useClass: MockDatasetApi },
          { provide: MatDialog, useValue: {} },
          { provide: APP_CONFIG, useValue: { archiveWorkflowEnabled: true } },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
