import { DatePipe } from "@angular/common";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import { PrettyUnitPipe } from "shared/pipes/pretty-unit.pipe";

import { TreeViewComponent } from "./tree-view.component";

describe("TreeViewComponent", () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TreeViewComponent],
        imports: [
          BrowserAnimationsModule,
          MatButtonModule,
          MatButtonToggleModule,
          MatFormFieldModule,
          MatIconModule,
          MatInputModule,
          MatTreeModule,
        ],
        providers: [DatePipe, PrettyUnitPipe, FormatNumberPipe],
      }).compileComponents();
    })
  );

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
