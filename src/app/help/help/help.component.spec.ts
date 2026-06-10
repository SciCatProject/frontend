import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelpComponent } from "./help.component";
import { MatCardModule } from "@angular/material/card";
import { AppConfigService } from "app-config.service";

const getConfig = () => ({
  facility: "ESS",
  helpEnabled: true,
  helpHtmlContent: "<p>Default help content</p>",
});

describe("HelpComponent", () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HelpComponent],
      imports: [MatCardModule],
    });
    TestBed.overrideComponent(HelpComponent, {
      set: {
        providers: [
          {
            provide: AppConfigService,
            useValue: {
              getConfig,
            },
          },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display htmlContent when helpEnabled is true", () => {
    expect(component.htmlContent).toContain("Default help content");
  });

  it("should display disabled message when helpEnabled is false", () => {
    component.appConfig.helpEnabled = false;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.htmlContent).toBe("Help page is disabled");
  });

  it("should update htmlContent when helpHtmlContent changes", () => {
    const compare = component.htmlContent;
    component.appConfig.helpHtmlContent = "<p>Updated help content</p>";
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.htmlContent).not.toEqual(compare);
  });
});
