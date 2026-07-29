import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { CreateRelationshipDto } from "@scicatproject/scicat-sdk-ts-angular";
import { BehaviorSubject, Subscription } from "rxjs";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { TablePagination } from "shared/modules/dynamic-material-table/models/table-pagination.model";
import { selectCurrentRelationships } from "state-management/selectors/datasets.selectors";
import { RelatedIdentifierCellComponent } from "./related-identifier-cell/related-identifier-cell.component";

@Component({
  selector: "app-relationships",
  templateUrl: "./relationships.component.html",
  styleUrl: "./relationships.component.scss",
  standalone: false,
})
export class RelationshipsComponent implements OnInit, OnDestroy {
  relationships$ = this.store.select(selectCurrentRelationships);

  dataSource = new BehaviorSubject<CreateRelationshipDto[]>([]);

  columns: TableField<unknown>[] = [
    { name: "relationship" },
    { name: "entityType" },
    { name: "identifierType" },
    {
      name: "identifier",
      dynamicCellComponent: RelatedIdentifierCellComponent,
    },
  ];

  paginationConfig: TablePagination = {};

  subscription: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.subscription = this.relationships$.subscribe({
      next: (rel) => this.dataSource.next(rel),
      error: (err) => console.log("error in subscription: ", err),
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
