import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DatablocksComponent } from "./datablocks-table.component";
import { MatTableModule } from "@angular/material/table";
import { SharedScicatFrontendModule } from "shared/shared.module";

describe("DatablocksComponent", () => {
  let component: DatablocksComponent;
  let fixture: ComponentFixture<DatablocksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, SharedScicatFrontendModule],
      declarations: [DatablocksComponent],
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
