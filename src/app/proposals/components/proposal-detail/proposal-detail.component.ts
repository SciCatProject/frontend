import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Proposal } from 'state-management/models';
import {Dataset, OrigDatablock} from "../../../shared/sdk/models";
import {MatTableDataSource} from "@angular/material";
import {getSelectedProposalDatasets} from "../../../state-management/selectors/datasets.selectors";
import {DatasetService} from "../../../datasets/dataset.service";
import {Observable} from "rxjs/Rx";
import {MatTableModule} from '@angular/material';
import {select, Store} from "@ngrx/store";
import {AppState} from "../../../state-management/state/app.store";
import {ActivatedRoute} from "@angular/router";
import * as selectors from "../../../state-management/selectors";
import {ConfigService} from "../../../shared/services/config.service";
import {DatePipe} from "@angular/common";
import {config} from "../../../../config/config";
import * as filesize from 'filesize';


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
    @Input() datasets: Dataset[];
  @Input() dataSource: MatTableDataSource<any> | null;
  displayedColumns = ['pid', 'sourceFolder', 'size', 'creationTime', 'type', 'owner', 'ownerEmail',  'creationLocation',  'dataFormat', 'version'];
  cols = [];
  displayedColumns2 = [];


  constructor(
    private configSrv: ConfigService,
    private store: Store<AppState>, private route: ActivatedRoute
  ) {}

    ngOnInit() {

      this.configSrv.getConfigFile('Dataset').subscribe(conf => {
        if (conf) {
          for (const prop in conf) {
            if (prop in conf && 'table' in conf[prop]) {
              this.cols.push(conf[prop]['table']);
              this.displayedColumns2.push(conf[prop]['table']['field']);
            }
          }
        }
      });


        if (this.proposal) {
            // Set up fallback values for main proposer
            const { firstname, lastname } = this.proposal;
            const mpName = firstname && lastname
                ? `${firstname} ${lastname}`
                : this.proposal.email; // Email is mandatory so we can rely on it being present.

            this.mainProposer = {
                name: mpName,
                email: this.proposal.email,
                isPresent: true
            };

            // Set up fallback values for principalInvestigator
            const { pi_firstname, pi_lastname } = this.proposal;
            const piFullName = pi_firstname && pi_lastname ? `${pi_firstname} ${pi_lastname}` : null;
            const piEmail = this.proposal.pi_email || null;

            this.principalInvestigator = {
                name: piFullName || piEmail,
                email: piEmail,
                isPresent: piFullName !== null || piEmail !== null
            };

            const {proposalId } = this.proposal;
          this.store.select(selectors.datasets.getSelectedProposalDatasets(proposalId)).subscribe(
            data => {
              var dsets = data;
              this.dataSource = new MatTableDataSource(dsets);
            },
            error => {
              console.error(error);
            });
        }
    }

  getRowValue(row, col) {
    const field = col.field;
    const value = row[field];

    if (field === 'createdAt') {
      const date = new Date(value);
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(date, 'dd/MM/yyyy HH:mm');
      return formattedDate;
    }

    if (field === 'size') {
      return filesize(value || 0);
    }

    if (field === 'datasetlifecycle.archiveStatusMessage') {
      const val = row.datasetlifecycle ? row.datasetlifecycle.archiveStatusMessage : '';
      return config.datasetStatusMessages[val] || val;
    }

    if (field === 'datasetlifecycle.retrieveStatusMessage') {
      const val = row.datasetlifecycle ? row.datasetlifecycle.retrieveStatusMessage : '';
      return config.datasetStatusMessages[val] || val;
    }
    return value;
  }

  calculateRowClasses(row) {
    if (row.size === 0) {
      return {
        'row-empty': true
      };
    } else {
      return {
        'row-generic': true
      };
    }
  }

}


