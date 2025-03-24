import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
import { selectInstruments } from "state-management/selectors/instruments.selectors";
import { selectCurrentProposal } from "state-management/selectors/proposals.selectors";
import { take } from "rxjs/operators";
import { combineLatest } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NomadViewerService {
  constructor(private store: Store) {}

  openNomadLogs(): void {
    console.log("Opening Nomad logs");
    // Get required data from store
    combineLatest([
      this.store.select(selectCurrentDataset),
      this.store.select(selectInstruments),
      this.store.select(selectCurrentProposal),
    ])
      .pipe(take(1))
      .subscribe(([dataset, instruments, proposal]) => {
        if (dataset && instruments?.length && proposal) {
          const url = `https://betalogs.ill.fr/elogs/proposalSearch/fromSciCat/${
            instruments[0]?.uniqueName
          }/${dataset.creationTime.split("-")[0]}/${proposal.proposalId}`;
          window.open(url, "_blank", "noopener,noreferrer");
        }
      });
  }

  openNomadCharts(): void {
    console.log("Opening Nomad charts");
    combineLatest([
      this.store.select(selectCurrentDataset),
      this.store.select(selectInstruments),
      this.store.select(selectCurrentProposal),
    ])
      .pipe(take(1))
      .subscribe(([dataset, instruments, proposal]) => {
        if (dataset && instruments?.length && proposal) {
          const url = `https://betalogs.ill.fr/elogs/survey/fromSciCat/${
            instruments[0]?.uniqueName
          }/${dataset.creationTime.split("-")[0]}/${proposal.proposalId}`;
          window.open(url, "_blank", "noopener,noreferrer");
        }
      });
  }
}
