import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorExtractorMetadataDialogPageComponent } from "./ingestor.extractor-metadata-dialog-page.component";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("IngestorExtractorMetadataDialogPageComponent", () => {
  let component: IngestorExtractorMetadataDialogPageComponent;
  let fixture: ComponentFixture<IngestorExtractorMetadataDialogPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorExtractorMetadataDialogPageComponent],
      imports: [StoreModule.forRoot({})],
      providers: [provideMockStore()],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      IngestorExtractorMetadataDialogPageComponent,
    );
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
