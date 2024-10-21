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

  methodsList: EmMethod[] = [
    {value:'helical', viewValue: 'Helical'},
    {value:'single-particle', viewValue:'Single Particle'},
    {value:'subtomogram-averaging',viewValue: 'Subtomogram Averaging'},
    {value:'tomogram', viewValue: 'Tomogram'},
    {value:'electron-cristallography', viewValue:'Electron Crystallography'},
  ];
  emMethod: string;
  constructor(public appConfigService: AppConfigService,
    private store: Store,
    // private http: HttpClient,
    // private route: ActivatedRoute,
    // private router: Router,
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
        deposingCoordinates:new FormControl(true),
        associatedMap: new FormControl(false),
        compositeMap:new FormControl(false), 
        emdbId:new FormControl(false),

      })
    }
    showValue(){
      console.log(this.form['deposingCoordinates'])
    }
}
