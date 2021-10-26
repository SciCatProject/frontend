import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AboutComponent } from "./about.component";
import { APP_CONFIG } from "app-config.module";
import { MatCardModule } from "@angular/material/card";
import { LinkyModule } from "ngx-linky";

describe("AboutComponent", () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
      imports: [MatCardModule, LinkyModule]
    });
    TestBed.overrideComponent(AboutComponent, {
      set: {
        providers: [
          {
            provide: APP_CONFIG,
            useValue: {
              facility: ""
            }
          }
        ]
      }
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
    const compare = component.aboutText;
    component.appConfig.facility = "ESS";
    component.ngOnInit();

    expect(component.aboutText).not.toEqual(compare);
  });

  it("should create about for PSI", () => {
    const compare = component.aboutText;
    component.appConfig.facility = "PSI";
    component.ngOnInit();

    expect(component.aboutText).not.toEqual(compare);
  });

  it("should create about for MAX IV", () => {
    const compare = component.aboutText;
    component.appConfig.facility = "MAX IV";
    component.ngOnInit();

    expect(component.aboutText).not.toEqual(compare);
  });
});
