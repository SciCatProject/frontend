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
    aboutSettings: {
      enabled: true,
      htmlContent: "Default about content",
    },
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

  it("should display htmlContent when aboutEnabled is true", () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.innerHTML).toContain("Default about content");
  });

  it("should create about for ESS", () => {
    const compare = component.htmlContent;
    component.appConfig.aboutSettings.htmlContent = "ESS about content";
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.htmlContent).not.toEqual(compare);
  });

  it("should create about for PSI", () => {
    const compare = component.htmlContent;
    component.appConfig.aboutSettings.htmlContent = "PSI about content";
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.htmlContent).not.toEqual(compare);
  });

  it("should create about for MAX IV", () => {
    const compare = component.htmlContent;
    component.appConfig.aboutSettings.htmlContent = "MAX IV about content";
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.htmlContent).not.toEqual(compare);
  });
});
