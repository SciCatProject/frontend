import { Component, OnInit, ViewChild } from "@angular/core";
import { AppConfigService, HelpMessages } from "app-config.service";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
// import { OneDepComponent } from '../onedep/onedep.component';


@Component({
    selector: "emexport",
    templateUrl: "./emexport.component.html",
    styleUrls: ["./emexport.component.scss"],
})
export class EmExportComponent implements OnInit {

    // @ViewChild(OneDepComponent) metadataEditor: OneDepComponent;

    appConfig = this.appConfigService.getConfig();
    facility: string | null = null;
    ingestManual: string | null = null;
    gettingStarted: string | null = null;
    shoppingCartEnabled = false;
    helpMessages: HelpMessages;


    constructor(public appConfigService: AppConfigService, private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.facility = this.appConfig.facility;
        this.helpMessages = new HelpMessages(
        this.appConfig.helpMessages?.gettingStarted,
        this.appConfig.helpMessages?.ingestManual,
        );
        this.gettingStarted = this.appConfig.gettingStarted;
    }
    goToOneDep(){
        this.router.navigateByUrl("/emexport/onedep");
    }
    goToEMPIAR(){
        this.router.navigateByUrl("/emexport/empiar");
    }
}