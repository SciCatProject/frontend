import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IngestorUserMetadataDialogPageComponent } from "./ingestor.user-metadata-dialog-page.component";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("IngestorUserMetadataDialogPageComponent", () => {
  let component: IngestorUserMetadataDialogPageComponent;
  let fixture: ComponentFixture<IngestorUserMetadataDialogPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngestorUserMetadataDialogPageComponent],
      imports: [StoreModule.forRoot({})],
      providers: [provideMockStore()],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngestorUserMetadataDialogPageComponent);
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
