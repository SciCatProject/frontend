import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelpComponent } from "./help.component";
import { MatCardModule } from "@angular/material/card";
import { AppConfigService } from "app-config.service";

const getConfig = () => ({
  facility: "ESS",
});

describe("HelpComponent", () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(
    waitForAsync(() => {
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
