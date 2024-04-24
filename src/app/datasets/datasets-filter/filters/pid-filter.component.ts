import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { FacetCount } from 'state-management/state/datasets.store';
import { setPidTermsAction } from "../../../state-management/actions/datasets.actions";
// import { addPidFilterAction, removePidFilterAction } from 'state-management/actions/datasets.actions';

@Component({
  selector: 'app-pid-filter',
  template: `
    <mat-form-field>
      <mat-label>PID filter</mat-label>
      <input
        #pidBar
        matInput
        [(ngModel)]="pidInput"
        (input)="onPidInput($event)"
        placeholder="Enter PID terms...">
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>
  `,
  styles: [`
    .mat-mdc-form-field {
      width: 100%;
    }
  `]
})
export class PidFilterComponent implements OnInit {
  @ViewChild("pidBar", { static: true }) pidBar!: ElementRef;

  @Input() facetCounts$: Observable<FacetCount[]>;
  @Output() pidSelected = new EventEmitter<string>();

  pidInput: string = "";

  constructor(private store: Store) {}

  ngOnInit() {
  }

  onPidInput(event: any) {
    const pid = this.pidInput = (event.target as HTMLInputElement).value;
    this.store.dispatch(setPidTermsAction({ pid }));
  }
}
