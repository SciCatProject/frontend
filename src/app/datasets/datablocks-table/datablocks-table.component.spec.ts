import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTableModule } from "@angular/material";
import { DatablocksComponent } from "./datablocks-table.component";
import { SharedCatanieModule } from "shared/shared.module";

describe("DatablocksComponent", () => {
  let component: DatablocksComponent;
  let fixture: ComponentFixture<DatablocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, SharedCatanieModule],
      declarations: [DatablocksComponent]
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatablocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
