import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AboutComponent } from "./about.component";
import { APP_CONFIG } from "app-config.module";
import { MatCardModule } from "@angular/material";

describe("AboutComponent", () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
      imports: [MatCardModule]
    });
    TestBed.overrideComponent(AboutComponent, {
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
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
