import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ProposalApi } from 'shared/sdk/services';
import { Proposal } from 'shared/sdk/models';

@Injectable()
export class ProposalsService {
	constructor(private proposalApi: ProposalApi) {}

	getProposals(): Observable<Proposal[]> {
		return this.proposalApi.find();
	}

	getProposal(proposalId: string): Observable<Proposal> {
		return this.proposalApi.findOne({where: {proposalId}});
	}
}
