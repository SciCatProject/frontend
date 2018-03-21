import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Proposal } from 'state-management/models';

@Component({
	selector: 'proposal-detail',
	templateUrl: 'proposal-detail.component.html',
	styleUrls: ['proposal-detail.component.css']
})
export class ProposalDetailComponent {
	@Input() proposal: Proposal;
};
