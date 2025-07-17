
import { Component, Input,  OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Store } from "@ngrx/store";
import { Subscription } from 'rxjs';

import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";

import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import { fetchDatasetAction } from "state-management/actions/datasets.actions";
import { accessEmpiarSchema } from "state-management/actions/depositor.actions";
import { selectEmpiarSchema } from "state-management/selectors/depositor.selectors";

@Component({
  selector: 'app-depositor-wrapper',
  template: `
    <ng-container *ngIf="dataset && user">
      <app-onedep *ngIf="method === 'onedep'" [dataset]="dataset" [user]="user" [showFirstCard]="showFirstCard"></app-onedep>
      <app-empiar *ngIf="method === 'empiar'" [dataset]="dataset" [user]="user" [empiarSchemaEncoded]="empiarSchemaEncoded" [showFirstCard]="showFirstCard"></app-empiar>
    </ng-container>
  `,
  standalone:false,
})
export class DepositorWrapperComponent implements OnInit {
  @Input() method!: 'onedep' | 'empiar'; // Allows usage in depositor page too
  dataset!: OutputDatasetObsoleteDto;
  user!: ReturnedUserDto;
  empiarSchemaEncoded!:string | undefined;

  showFirstCard = false;


  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute, 
    private store: Store, 
    private router: Router) {}

  ngOnInit() {
    const pid = this.route.snapshot.paramMap.get('id');
    this.method = this.route.snapshot.data['method'] ?? this.method; 
    this.store.dispatch(fetchDatasetAction({ pid }));
    this.store.select(selectCurrentDataset).subscribe((dataset) => {
      this.dataset = dataset;
    });
    this.store.select(selectCurrentUser).subscribe((user) => {
      this.user = user;
    });
    
    const currentUrl = this.router.url;
    if (currentUrl.includes('/empiar') || currentUrl.includes('/onedep')) {
      this.showFirstCard = true;
    } else {
      this.showFirstCard = false;
    }
    this.store.dispatch(accessEmpiarSchema());
    this.subscriptions.push(
      this.store.select(selectEmpiarSchema).subscribe((schema) => {
        this.empiarSchemaEncoded = schema;
      })
    );
  }
}