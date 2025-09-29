import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorCustomMetadataDialogPageComponent } from "./ingestor.custom-metadata-dialog-page.component";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("IngestorCustomMetadataDialogPageComponent", () => {
  let component: IngestorCustomMetadataDialogPageComponent;
  let fixture: ComponentFixture<IngestorCustomMetadataDialogPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorCustomMetadataDialogPageComponent],
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore(),
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorCustomMetadataDialogPageComponent);
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