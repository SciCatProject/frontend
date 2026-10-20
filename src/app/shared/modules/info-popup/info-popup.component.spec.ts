import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { InfoPopupModule } from "./info-popup.module";

@Component({
  template: `<info-popup title="About this"
    ><p id="inside">Some text</p></info-popup
  >`,
  standalone: false,
})
class HostComponent {}

describe("InfoPopupComponent", () => {
  let fixture: ComponentFixture<HostComponent>;

  const popup = () => document.querySelector("[data-cy=info-popup]");
  const trigger = (): HTMLElement =>
    fixture.nativeElement.querySelector("[data-cy=info-popup-trigger]");

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [InfoPopupModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it("should stay closed until the icon is clicked", () => {
    expect(popup()).toBeNull();
  });

  it("should open with the title and the content that was placed inside", () => {
    trigger().click();
    fixture.detectChanges();

    expect(popup()).not.toBeNull();
    expect(popup().textContent).toContain("About this");
    expect(popup().querySelector("#inside").textContent).toBe("Some text");
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  it("should close when the icon is clicked again", () => {
    trigger().click();
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();

    expect(popup()).toBeNull();
  });

  it("should close with its close button", () => {
    trigger().click();
    fixture.detectChanges();

    (popup().querySelector(".popup-close") as HTMLElement).click();
    fixture.detectChanges();

    expect(popup()).toBeNull();
  });
});
