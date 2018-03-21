import { Component, Input } from '@angular/core';
import { Proposal } from 'state-management/models';

@Component({
    selector: 'proposals-list',
    templateUrl: 'proposals-list.component.html',
    styleUrls: ['proposals-list.component.css']
})
export class ProposalsListComponent {
    @Input() proposals: Proposal[];
};