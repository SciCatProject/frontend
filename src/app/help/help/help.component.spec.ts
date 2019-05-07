import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HelpComponent } from "./help.component";
import { MatCardModule } from "@angular/material";
import { APP_CONFIG } from "app-config.module";
import { USE_VALUE } from "@angular/core/src/di/injector";

describe("HelpComponent", () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpComponent],
      imports: [MatCardModule]
    });
    TestBed.overrideComponent(HelpComponent, {
      set: {
        providers: [
          {
            provide: APP_CONFIG,
            useValue: {
              facility: "ESS"
            }
          }
        ]
      }
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
});
