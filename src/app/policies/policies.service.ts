import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { PolicyApi } from "shared/sdk/services";
import { Policy } from "shared/sdk/models";

@Injectable()
export class PoliciesService {
  constructor(private policyApi: PolicyApi) {}

  getPolicies(): Observable<Policy[]> {
    return this.policyApi.find();
  }

  getPolicy(id: string): Observable<Policy> {
    return this.policyApi.findOne({ where: { id } });
  }

  updatePolicies(idList: string[], attributes: {}) {
    const or = [];
    for (const idx of idList) {
      or.push({ id: idx });
    }
    const where = { or };
    return this.policyApi
      .updatewhere(where, attributes);
  }


}
