import { IngestorTransferComponent } from "./ingestor-transfer.component";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MockActivatedRoute, MockUserApi } from "shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockStore } from "@ngrx/store/testing";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { AppConfigService } from "app-config.service";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";

describe("IngestorTransferComponent", () => {
  let component: IngestorTransferComponent;
  let fixture: ComponentFixture<IngestorTransferComponent>;
  let store: MockStore;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  const getConfig = () => ({
    ingestorInTransferMode: true,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorTransferComponent],
      imports: [MatCardModule, MatListModule, StoreModule.forRoot({})],
    });
    TestBed.overrideComponent(IngestorTransferComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: AppConfigService,
            useValue: {
              getConfig,
            },
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: UsersService, useClass: MockUserApi },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
