mport { IngestorWrapperComponent } from "./ingestor.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AppConfigInterface, AppConfigService } from "app-config.service";
import { IngestorTransferComponent } from "./ingestor-transfer.component";
import { IngestorCreationComponent } from "./ingestor-creation.component";
import {
  ComponentFixture,
  TestBed,
} from "@angular/core/testing";

describe("IngestorComponent", () => {
  let component: IngestorWrapperComponent;
  let fixture: ComponentFixture<IngestorWrapperComponent>;
  let appConfigService: jasmine.SpyObj<AppConfigService>;

  // const getConfig = () => ({
  //   ingestorInTransferMode: false,
  // });

  beforeEach(() => {
    const appConfigServiceSpy = jasmine.createSpyObj("AppConfigService", [
      "getConfig",
    ]);


    TestBed.configureTestingModule({
      declarations: [IngestorWrapperComponent, 
      ],
      providers: [{ provide: AppConfigService, useValue: appConfigServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();


    fixture = TestBed.createComponent(IngestorWrapperComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.inject(
      AppConfigService,
    ) as jasmine.SpyObj<AppConfigService>;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {   
    appConfigService.getConfig.and.returnValue({
      ingestorComponent: {
        ingestorEnabled: true,
      },
    } as AppConfigInterface);

    expect(component).toBeTruthy();
  });

  it("should load IngestorTransferComponent when config specifies ingestorInTransferMode as true", () => {
    appConfigService.getConfig.and.returnValue({
          ingestorComponent: {
            ingestorEnabled: true,
            ingestorInTransferMode: true,
          },
        } as AppConfigInterface);

        const componentInstance = component.getIngestorComponent();
        expect(componentInstance).toBe(IngestorTransferComponent);
  });

  it("should load IngestorCreationComponent when config specifies ingestorInTransferMode as false", () => {
    appConfigService.getConfig.and.returnValue({
          ingestorComponent: {
            ingestorInTransferMode: false,
          },
        } as AppConfigInterface);

        const componentInstance = component.getIngestorComponent();
        expect(componentInstance).toBe(IngestorCreationComponent);
  });
  });