import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AboutComponent } from "./about.component";
import { MatCardModule } from "@angular/material/card";
import { LinkyModule } from "ngx-linky";
import { AppConfigService } from "app-config.service";

describe("AboutComponent", () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  const getConfig = () => ({
    facility: "",
    aboutEnabled: true,
    aboutHtmlContent: "Default about content",
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
      imports: [MatCardModule, LinkyModule],
    });
    TestBed.overrideComponent(AboutComponent, {
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
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create about for ESS", () => {
    const compare = component.htmlContent;
    component.appConfig.aboutHtmlContent = "ESS about content";
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.htmlContent).not.toEqual(compare);
  });

  it("should create about for PSI", () => {
    const compare = component.htmlContent;
    component.appConfig.aboutHtmlContent = "PSI about content";
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.htmlContent).not.toEqual(compare);
  });

  it("should create about for MAX IV", () => {
    const compare = component.htmlContent;
    component.appConfig.aboutHtmlContent = "MAX IV about content";
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.htmlContent).not.toEqual(compare);
  });
});
