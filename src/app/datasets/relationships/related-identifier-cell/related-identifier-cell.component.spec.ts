import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RelatedIdentifierCellComponent } from "./related-identifier-cell.component";
import { TableRow } from "shared/modules/dynamic-material-table/models/table-row.model";

describe("RelatedIdentifierCellComponent", () => {
  let component: RelatedIdentifierCellComponent;
  let fixture: ComponentFixture<RelatedIdentifierCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedIdentifierCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedIdentifierCellComponent);
    component = fixture.componentInstance;
    component.row = {
      identifier: "test-prefix/test-doi",
      identifierType: "DOI",
      relationship: "IsReferencedBy",
      entityType: "JournalArticle",
    } as unknown as TableRow;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
