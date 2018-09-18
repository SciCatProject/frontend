import { Component, Input, OnInit } from "@angular/core";
import { Proposal, Dataset } from "state-management/models";

import {
  faAt,
  faCalendarAlt,
  faCertificate, faChessQueen,
  faCoins,
  faDownload,
  faFileAlt,
  faFolder, faGem, faGlobe,
  faIdBadge, faImages,
  faUpload, faUserAlt,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

interface Proposer {
  name: string;
  email: string;
  isPresent: boolean;
}

@Component({
  selector: "proposal-detail",
  templateUrl: "proposal-detail.component.html",
  styleUrls: ["proposal-detail.component.scss"]
})
export class ProposalDetailComponent implements OnInit {
  @Input()
  proposal: Proposal;
  @Input()
  datasets: Dataset[];

  private mainProposer: Proposer;
  private principalInvestigator: Proposer;
  faAt = faAt;
  faIdBadge = faIdBadge;
  faFolder = faFolder;
  faCoins = faCoins;
  faChessQueen = faChessQueen;
  faCalendarAlt = faCalendarAlt;
  faFileAlt = faFileAlt;
  faImages = faImages;
  faGem = faGem;
  faGlobe = faGlobe;
  faCertificate = faCertificate;
  faUserAlt = faUserAlt;
  faUsers = faUsers;
  faUpload = faUpload;
  faDownload = faDownload;

  displayedColumns: string[] = [
    "pid",
    "sourceFolder",
    "size",
    "creationTime",
    // 'type',
    "owner",
    // 'ownerEmail',
    "creationLocation"
    // 'dataFormat',
    // 'version'
  ];

  ngOnInit() {
    if (this.proposal == null) return;

    // Set up fallback values for main proposer
    const { firstname, lastname } = this.proposal;
    const mpName =
      firstname && lastname ? `${firstname} ${lastname}` : this.proposal.email; // Email is mandatory so we can rely on it being present.

    this.mainProposer = {
      name: mpName,
      email: this.proposal.email,
      isPresent: true
    };

    // Set up fallback values for principalInvestigator
    const { pi_firstname, pi_lastname } = this.proposal;
    const piFullName =
      pi_firstname && pi_lastname ? `${pi_firstname} ${pi_lastname}` : null;
    const piEmail = this.proposal.pi_email || null;

    this.principalInvestigator = {
      name: piFullName || piEmail,
      email: piEmail,
      isPresent: piFullName !== null || piEmail !== null
    };
  }

  calculateRowClasses(row: Dataset) {
    return row.size === 0 ? { "row-empty": true } : { "row-generic": true };
  }
}
