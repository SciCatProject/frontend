import { DatePipe } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import { PrettyUnitPipe } from "shared/pipes/pretty-unit.pipe";
import { ScientificMetadataTreeModule } from "../scientific-metadata-tree.modules";

import { TreeViewComponent } from "./tree-view.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("TreeViewComponent", () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeViewComponent],
      imports: [ScientificMetadataTreeModule, BrowserAnimationsModule],
      providers: [DatePipe, PrettyUnitPipe, FormatNumberPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    component.metadata = {
      motors: {
        sampx: -0.03949844939218141,
        sampy: 0.003037629787175808,
        phi: 85.62724999999955,
        zoom: 35007.46875,
        focus: -0.2723789062500003,
        phiz: 0.18436550301217358,
        phiy: 0.21792454481296603,
      },
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
