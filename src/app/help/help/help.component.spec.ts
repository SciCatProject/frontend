import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { HelpComponent } from "./help.component";
import { APP_CONFIG } from "app-config.module";
import { MatCardModule } from "@angular/material/card";

describe("HelpComponent", () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(waitForAsync(() => {
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
