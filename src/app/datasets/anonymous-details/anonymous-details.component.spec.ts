import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AnonymousDetailsComponent } from "./anonymous-details.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AppConfigModule } from "app-config.module";
import { LinkyPipe } from "ngx-linky";
import { SharedCatanieModule } from "shared/shared.module";

describe("AnonymousDetailsComponent", () => {
  let component: AnonymousDetailsComponent;
  let fixture: ComponentFixture<AnonymousDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AnonymousDetailsComponent, LinkyPipe],
      imports: [AppConfigModule, SharedCatanieModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onClickKeyword()", () => {
    it("should emit an event", () => {
      spyOn(component.clickKeyword, "emit");

      const keyword = "test";
      component.onClickKeyword(keyword);

      expect(component.clickKeyword.emit).toHaveBeenCalledTimes(1);
      expect(component.clickKeyword.emit).toHaveBeenCalledWith(keyword);
    });
  });
});
