import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Proposal } from 'state-management/models';
/*import { AppState } from 'state-management/state/app.store';
import { ProposalState } from 'state-management/state/proposal.store';*/

@Component({
	selector: 'proposal-detail',
	templateUrl: 'proposal-detail.component.html',
	styleUrls: ['proposal-detail.component.css']
})
export class ProposalDetailComponent {
	@Input() proposal: Proposal;
};