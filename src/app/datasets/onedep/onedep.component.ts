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
import { MethodsList, Experiment, OneDepFile } from "./types/methods.enum"
import { Subscription } from "rxjs";
import { string } from "mathjs";


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
  methodsList = MethodsList;
  experiment = Experiment;
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
      datasetName: this.dataset.datasetName,
      description: this.dataset.description,
      keywords: this.fb.array(this.dataset.keywords),
      metadata: this.dataset.scientificMetadata,
      emMethod: new FormControl(""),
      deposingCoordinates: new FormControl(true),
      associatedMap: new FormControl(false),
      compositeMap: new FormControl(false),
      emdbId: new FormControl(""),

      mainMap: {
        name: "",
        type: "vo-map",
        pathToFile: "",
        contour: 0.0,
        details: "",
      },
      halfMap1: {
        name: "",
        type: "half-map",
        pathToFile: "",
        contour: 0.0,
        details: "",
      },
      halfMap2: {
        name: "",
        type: "half-map",
        pathToFile: "",
        contour: 0.0,
        details: "",
      },
      mask: {
        name: "",
        type: "mask-map",
        pathToFile: "",
        contour: 0.0,
        details: "",
      },
      addMap: {
        name: "",
        type: "add-map",
        pathToFile: "",
        contour: 0.0,
        details: "",
      },
      coordinates: {
        name: "",
        type: "co-cif",
        pathToFile: "",
        details: "",
      },
      image: {
        name: "",
        type: "img-emdb",
        pathToFile: "",
        details: "",
      },
      // pathToCif: {  --> should be extracted from this.dataset.scientificMetadata
      //   name: "",
      //   type: "undef",
      //   pathToFile: "",
      //   details: "",
      // },
      fsc: {
        name: "",
        type: "fsc-xml",
        pathToFile: "",
        details: "",
      },
    })
  }


  onFileSelected(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    console.log(input);
    if (input.files && input.files.length > 0) {
      this.selectedFile[controlName] = input.files[0];
      this.form.get(controlName)?.setValue({
        ...this.form.get(controlName)?.value,
        pathToFile: this.selectedFile[controlName].name
      });
    }
  }
  onDepositClick() {
    const formData = this.form.value;
    // need to properly catch the dataset details
    console.log("creating deposition", formData)
    this.http.post("http://localhost:8080/onedep", formData).subscribe(
      response => {
        console.log('created deposition in OneDep', response);
      },
      error => {
        console.error('Request failed esf', error);
      }
    );
  }

}
