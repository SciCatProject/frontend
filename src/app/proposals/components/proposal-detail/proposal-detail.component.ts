import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Proposal } from 'state-management/models';

interface Proposer {
	name: string;
	email: string;
	isPresent: boolean;
}

@Component({
	selector: 'proposal-detail',
	templateUrl: 'proposal-detail.component.html',
	styleUrls: ['proposal-detail.component.css']
})
export class ProposalDetailComponent implements OnInit {
	@Input() proposal: Proposal;	
	private mainProposer: Proposer;
	private principalInvestigator: Proposer;

	ngOnInit() {
		// Set up fallback values for main proposer
		const {firstname, lastname} = this.proposal;
		const mpName = firstname && lastname
			? `${firstname} ${lastname}`
			: this.proposal.email; // Email is mandatory so we can rely on it being present.

		this.mainProposer = {
			name: mpName,
			email: this.proposal.email,
			isPresent: true
		};

		// Set up fallback values for principalInvestigator
		const {pi_firstname, pi_lastname} = this.proposal;
		const piFullName = pi_firstname && pi_lastname ? `${pi_firstname} ${pi_lastname}` : null;
		const piEmail = this.proposal.pi_email || null;

		this.principalInvestigator = {
			name: piFullName || piEmail,
			email: piEmail,
			isPresent: piFullName !== null || piEmail !== null
		}
	}
};
