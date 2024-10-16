import { Component, OnInit, ViewChild } from "@angular/core";
import { AppConfigService, HelpMessages } from "app-config.service";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'empiar',
  templateUrl: './empiar.component.html',
  styleUrls: ['./empiar.component.scss']
})
export class EmpiarComponent implements OnInit {

    empiar : boolean;

    ngOnInit() {
        this.empiar = true;
    }
}