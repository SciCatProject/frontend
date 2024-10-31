import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { AppConfigService, HelpMessages } from "app-config.service";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { Dataset } from "shared/sdk/models";
import {

  selectCurrentDataset,
} from "state-management/selectors/datasets.selectors";

import { Subscription } from "rxjs";
import { string } from "mathjs";

interface EmMethod {
  value: string;
  viewValue:string;
}

@Component({
  selector: 'onedep',
  templateUrl: './onedep.component.html',
  styleUrls: ['./onedep.component.scss']
})
export class OneDepComponent implements OnInit {

  appConfig = this.appConfigService.getConfig();
  dataset: Dataset | undefined;
  form: FormGroup;
  private subscriptions: Subscription[] = [];
  showAssociatedMapQuestion: boolean = false;

  connectedDepositionBackend: string = '';
  connectedDepositionBackendVersion: string = '';
  connectingToDepositionBackend: boolean = false;
  lastUsedDepositionBackends: string[] = [];
  forwardDepositionBackend: string = '';
  errorMessage: string = '';


  methodsList: EmMethod[] = [
    {value:'helical', viewValue: 'Helical'},
    {value:'single-particle', viewValue:'Single Particle'},
    {value:'subtomogram-averaging',viewValue: 'Subtomogram Averaging'},
    {value:'tomogram', viewValue: 'Tomogram'},
    {value:'electron-cristallography', viewValue:'Electron Crystallography'},
  ];

  selectedFile: { [key: string]: File | null } = {}; 


  constructor(public appConfigService: AppConfigService,
    private store: Store,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    ) { }

  
    ngOnInit() {
      this.store.select(selectCurrentDataset).subscribe((dataset) => {
        this.dataset = dataset;
      });
      this.form = this.fb.group({
        datasetName: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        keywords: this.fb.array([]),
        emMethod: new FormControl(""),
        deposingCoordinates:new FormControl(true),
        associatedMap: new FormControl(false),
        compositeMap:new FormControl(false), 
        emdbId:new FormControl(""),

        pathToMainMap: new FormControl(""), 
        pathToHalfMap1: new FormControl(""), 
        pathToHalfMap2: new FormControl(""), 
        pathToMask: new FormControl(""), 
        pathToAdditionalMap: new FormControl(""), 
        pathToCoordinates: new FormControl(""), 
        pathToImage: new FormControl(""), 
        pathToCif: new FormControl(""), 
        pathToFSC: new FormControl(""), 
      })

      this.connectingToDepositionBackend = true;
      // Get the GET parameter 'backendUrl' from the URL
      // this.route.queryParams.subscribe(params => {
      //   const backendUrl = params['backendUrl'];
      //   if (backendUrl) {
      //     this.connectToDepositionBackend(backendUrl);
      //   }
      //   else {
      //     this.connectingToDepositionBackend = false;
      //   }
      // });
    }

    connectToDepositionBackend(): boolean {
      var DepositionBackendUrl = "http://localhost:8080"
      let DepositionBackendUrlCleaned = DepositionBackendUrl.slice();
      // Check if last symbol is a slash and add version endpoint
      if (!DepositionBackendUrlCleaned.endsWith('/')) {
        DepositionBackendUrlCleaned += '/';
      }
  
      let DepositionBackendUrlVersion = DepositionBackendUrlCleaned;
  
      // Try to connect to the facility backend/version to check if it is available
      console.log('Connecting to facility backend: ' + DepositionBackendUrlVersion);
      this.http.get(DepositionBackendUrlVersion).subscribe(
        response => {
          console.log('Connected to facility backend', response);
          // If the connection is successful, store the connected facility backend URL
          this.connectedDepositionBackend = DepositionBackendUrlCleaned;
          this.connectingToDepositionBackend = false;
          this.connectedDepositionBackendVersion = response['version'];
        },
        error => {
          this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
          console.error('Request failed', error);
          this.connectedDepositionBackend = '';
          this.connectingToDepositionBackend = false;
        }
      );
  
      return true;
    }

    onFileSelected(event: Event, controlName: string) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile[controlName] = input.files[0];
        this.form.get(controlName)?.setValue(this.selectedFile[controlName].name);
      }
    }
    onDepositClick(){
      const formData = this.form.value;
    }
    
}
