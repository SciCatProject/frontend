import { APP_CONFIG, AppConfigModule } from "app-config.module";
import { DatafilesComponent } from "datasets/datafiles/datafiles.component";
import { DatasetDetailComponent } from "./dataset-detail.component";
import { LinkyPipe } from "ngx-linky";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedCatanieModule } from "shared/shared.module";
import { MatTableModule, MatChipInputEvent } from "@angular/material";

describe("DatasetDetailComponent", () => {
  let component: DatasetDetailComponent;
  let fixture: ComponentFixture<DatasetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [AppConfigModule, MatTableModule, SharedCatanieModule],
      declarations: [DatasetDetailComponent, DatafilesComponent, LinkyPipe]
    });
    TestBed.overrideComponent(DatasetDetailComponent, {
      set: {
        providers: [
          {
            provide: APP_CONFIG,
            useValue: {
              editMetadataEnabled: true
            }
          }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetDetailComponent);
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

  describe("#onAddKeyword()", () => {
    it("should not emit an event if value is an empty string", () => {
      spyOn(component.addKeyword, "emit");

      const event = {
        value: ""
      };
      component.onAddKeyword(event as MatChipInputEvent);

      expect(component.addKeyword.emit).toHaveBeenCalledTimes(0);
    });

    it("should emit an event if value is not an empty string", () => {
      spyOn(component.addKeyword, "emit");

      const event = {
        value: "test"
      };
      component.onAddKeyword(event as MatChipInputEvent);

      expect(component.addKeyword.emit).toHaveBeenCalledTimes(1);
      expect(component.addKeyword.emit).toHaveBeenCalledWith(event.value);
    });
  });

  describe("#onRemoveKeyword()", () => {
    it("should emit an event", () => {
      spyOn(component.removeKeyword, "emit");

      const keyword = "test";
      component.onRemoveKeyword(keyword);

      expect(component.removeKeyword.emit).toHaveBeenCalledTimes(1);
      expect(component.removeKeyword.emit).toHaveBeenCalledWith(keyword);
    });
  });

  describe("#onClickProposal()", () => {
    it("should emit an event", () => {
      spyOn(component.clickProposal, "emit");

      const proposalId = "test";
      component.onClickProposal(proposalId);

      expect(component.clickProposal.emit).toHaveBeenCalledTimes(1);
      expect(component.clickProposal.emit).toHaveBeenCalledWith(proposalId);
    });
  });

  describe("#onClickSample()", () => {
    it("should emit an event", () => {
      spyOn(component.clickSample, "emit");

      const sampleId = "test";
      component.onClickSample(sampleId);

      expect(component.clickSample.emit).toHaveBeenCalledTimes(1);
      expect(component.clickSample.emit).toHaveBeenCalledWith(sampleId);
    });
  });

  describe("#onSaveMetadata()", () => {
    it("should emit en event", () => {
      spyOn(component.saveMetadata, "emit");

      const metadata = {};
      component.onSaveMetadata(metadata);

      expect(component.saveMetadata.emit).toHaveBeenCalledTimes(1);
      expect(component.saveMetadata.emit).toHaveBeenCalledWith(metadata);
    });
  });
});
