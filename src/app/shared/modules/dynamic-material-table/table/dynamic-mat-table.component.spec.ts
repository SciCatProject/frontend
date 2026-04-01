import { ChangeDetectorRef, Renderer2 } from "@angular/core";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import {
  Overlay,
  OverlayContainer,
  OverlayPositionBuilder,
} from "@angular/cdk/overlay";

import { DynamicMatTableComponent } from "./dynamic-mat-table.component";
import { TableService } from "./dynamic-mat-table.service";
import { TableField } from "../models/table-field.model";
import { AppConfigService } from "app-config.service";

describe("DynamicMatTableComponent", () => {
  let component: DynamicMatTableComponent<any>;

  const hoverColumn: TableField<any> = {
    name: "scientificMetadata",
    header: "Scientific metadata",
    hoverContent: true,
    type: "hoverContent",
  };

  beforeEach(() => {
    const overlayContainer = {
      getContainerElement: () => document.createElement("div"),
    } as unknown as OverlayContainer;

    component = new DynamicMatTableComponent<any>(
      {} as MatDialog,
      {} as Renderer2,
      new TableService(),
      {
        detectChanges: () => undefined,
      } as ChangeDetectorRef,
      {} as Overlay,
      overlayContainer,
      {} as OverlayPositionBuilder,
      {},
      new DatePipe("en-US"),
      {
        getConfig: () => ({}),
      } as AppConfigService,
    );
  });

  it("pins the hover card and stops click propagation", () => {
    const event = jasmine.createSpyObj<MouseEvent>("event", [
      "stopPropagation",
      "preventDefault",
    ]);
    const row = { id: 1 };

    component.togglePinnedHoverCard(event, row, hoverColumn);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.isHoverCardPinned(row, hoverColumn)).toBeTrue();
    expect(component.isHoverCardOpen(row, hoverColumn)).toBeTrue();
  });

  it("closes a pinned hover card when toggled again", () => {
    const row = { id: 1 };
    const event = jasmine.createSpyObj<MouseEvent>("event", [
      "stopPropagation",
      "preventDefault",
    ]);

    component.togglePinnedHoverCard(event, row, hoverColumn);
    component.togglePinnedHoverCard(event, row, hoverColumn);

    expect(component.isHoverCardPinned(row, hoverColumn)).toBeFalse();
    expect(component.isHoverCardOpen(row, hoverColumn)).toBeFalse();
  });

  it("does not open a second hover card while another one is pinned", () => {
    const row = { id: 1 };
    const otherRow = { id: 2 };

    component.pinnedHoverKey = component.makeKey(row, hoverColumn);
    component.onHoverCardTriggerEnter(otherRow, hoverColumn);

    expect(component.hoverKey).toBeNull();
    expect(component.isHoverCardOpen(row, hoverColumn)).toBeTrue();
    expect(component.isHoverCardOpen(otherRow, hoverColumn)).toBeFalse();
  });

  it("keeps a pinned hover card open after mouseleave until explicitly closed", () => {
    const row = { id: 1 };

    component.pinnedHoverKey = component.makeKey(row, hoverColumn);
    component.hoverKey = component.makeKey(row, hoverColumn);

    component.onHoverCardTriggerLeave(row, hoverColumn);

    expect(component.isHoverCardOpen(row, hoverColumn)).toBeTrue();

    component.closePinnedHoverCard();

    expect(component.isHoverCardOpen(row, hoverColumn)).toBeFalse();
  });

  it("closes a pinned hover card on document click", () => {
    const row = { id: 1 };

    component.pinnedHoverKey = component.makeKey(row, hoverColumn);
    component.hoverKey = component.makeKey(row, hoverColumn);

    component.onDocumentClick();

    expect(component.isHoverCardPinned(row, hoverColumn)).toBeFalse();
    expect(component.isHoverCardOpen(row, hoverColumn)).toBeFalse();
  });

  it("detects scientific metadata content for tree rendering", () => {
    const row = {
      scientificMetadata: {
        nested: {
          value: 42,
        },
      },
    };

    expect(component.isScientificMetadataColumn(hoverColumn)).toBeTrue();
    expect(component.hasScientificMetadata(row)).toBeTrue();
    expect(component.getScientificMetadata(row)).toEqual(
      row.scientificMetadata,
    );
  });
});
