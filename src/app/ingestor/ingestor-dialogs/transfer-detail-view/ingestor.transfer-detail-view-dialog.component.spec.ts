import { IngestorTransferViewDialogComponent } from "./ingestor.transfer-detail-view-dialog.component";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MockActivatedRoute, MockUserApi } from "shared/MockStubs";
import { StoreModule } from "@ngrx/store";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AppConfigService } from "app-config.service";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";

describe("IngestorTransferViewDialogComponent", () => {
  let component: IngestorTransferViewDialogComponent;
  let fixture: ComponentFixture<IngestorTransferViewDialogComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  const getConfig = () => ({
    ingestorEnabled:true,
  });

  const mockDialogRef = {
    close: jasmine.createSpy("close"),
  };

  const mockDialogData = {
    transferId: "test-transfer-123",
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorTransferViewDialogComponent],
      imports: [
        MatCardModule,
        MatListModule,
        MatDialogModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore(),
        { provide: Router, useValue: router },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        {
          provide: AppConfigService,
          useValue: { getConfig },
        },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: UsersService, useClass: MockUserApi },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorTransferViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
