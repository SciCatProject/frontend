import { Component, Input, OnInit } from "@angular/core";
import { RelationshipClass } from "@scicatproject/scicat-sdk-ts-angular";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { TableRow } from "shared/modules/dynamic-material-table/models/table-row.model";
import {
  DynamicMatTableComponent,
  IDynamicCell,
} from "shared/modules/dynamic-material-table/table/dynamic-mat-table.component";

@Component({
  selector: "app-related-identifier-cell",
  templateUrl: "./related-identifier-cell.component.html",
  styleUrl: "./related-identifier-cell.component.scss",
  standalone: false,
})
export class RelatedIdentifierCellComponent implements IDynamicCell, OnInit {
  @Input() row: TableRow;
  @Input() column: TableField<any>;
  @Input() parent: DynamicMatTableComponent<any>;

  entry: RelationshipClass;
  ngOnInit() {
    this.entry = this.row as RelationshipClass;
  }
  doiUrl(doi: string) {
    return `https://doi.org/${doi}`;
  }
}
