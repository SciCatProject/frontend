import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelpComponent } from "./help.component";
import { MatCardModule } from "@angular/material/card";
import { AppConfigService, HelpMessages } from "app-config.service";

const getConfig = () => ({
  facility: "ESS",
  gettingStarted: true,
  ingestManual: true,
});

const helpMessages = new HelpMessages();

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

  it("should have default messages", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain(helpMessages.gettingStarted);
    expect(compiled.innerHTML).toContain(helpMessages.ingestManual);
  });

  describe("should have custom messages", () => {
    let customHelpMessages: HelpMessages;
    beforeEach(() => {
      fixture = TestBed.createComponent(HelpComponent);
      component = fixture.componentInstance;
      customHelpMessages = {
        gettingStarted: "someGettingStart",
        ingestManual: "someOtherIngest",
      };
      component.appConfig.helpMessages = customHelpMessages;
      fixture.detectChanges();
    });

    it("should have custom messages", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.innerHTML).toContain(customHelpMessages.gettingStarted);
      expect(compiled.innerHTML).toContain(customHelpMessages.ingestManual);
    });
  });

  describe("should set only one custom message", () => {
    let customHelpMessages: HelpMessages;
    beforeEach(() => {
      fixture = TestBed.createComponent(HelpComponent);
      component = fixture.componentInstance;
      customHelpMessages = new HelpMessages("someGettingStart");
      component.appConfig.helpMessages = customHelpMessages;
      fixture.detectChanges();
    });

    it("should set only one custom message", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.innerHTML).toContain(customHelpMessages.gettingStarted);
      expect(compiled.innerHTML).toContain(helpMessages.ingestManual);
    });
  });
});
