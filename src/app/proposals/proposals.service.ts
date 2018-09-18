import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ProposalApi, DatasetApi } from "shared/sdk/services";
import { Proposal, Dataset } from "shared/sdk/models";

@Injectable()
export class ProposalsService {
  constructor(
    private proposalApi: ProposalApi,
    private datasetApi: DatasetApi
  ) {}

  getProposals(): Observable<Proposal[]> {
    return this.proposalApi.find();
  }

  getProposal(proposalId: string): Observable<Proposal> {
    return this.proposalApi.findOne({ where: { proposalId } });
  }

  getDatasetsForProposal(proposalId: string): Observable<Dataset[]> {
    return this.datasetApi.find({ where: { proposalId } });
  }
}
