import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ProposalApi } from 'shared/sdk/services';
import { Proposal } from 'shared/sdk/models';

@Injectable()
export class ProposalsService {
	constructor(private proposalApi: ProposalApi) {}

	getProposals(): Observable<Proposal[]> {
		return Observable.of([
			new Proposal({
				proposalId: '123456789',
				email: 'e@mail.com',
				title: 'My first proposal',
				abstract: 'Investigate something interesting',
				ownerGroup: '123456789-group'
			}),
			new Proposal({
				proposalId: '34234234',
				email: 'sddfs@sdfsd.com',
				title: 'Another proposal',
				abstract: 'Another abstract blablabla',
				ownerGroup: '34234234-group'
			})
		]);
	}
}