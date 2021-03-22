import { NO_ERRORS_SCHEMA } from "@angular/compiler";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SharedCatanieModule } from "shared/shared.module";
import { JobsDashboardNewComponent } from "./jobs-dashboard-new.component";

describe("JobsDashboardNewComponent", () => {
  let component: JobsDashboardNewComponent;
  let fixture: ComponentFixture<JobsDashboardNewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [JobsDashboardNewComponent],
        imports: [SharedCatanieModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsDashboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
