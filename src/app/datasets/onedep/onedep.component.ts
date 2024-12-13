import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from "@angular/forms";

import { Store } from "@ngrx/store";
import { Dataset } from "shared/sdk/models";
import {
  selectCurrentDataset,
} from "state-management/selectors/datasets.selectors";
import {
  selectCurrentUser
} from "state-management/selectors/user.selectors";
import { User } from "shared/sdk";
import { MethodsList, EmFile, DepositionFiles, DepositionAddMap } from "./types/methods.enum"
import { Subscription, fromEvent } from "rxjs";


@Component({
  selector: 'onedep',
  templateUrl: './onedep.component.html',
  styleUrls: ['./onedep.component.scss']
})
export class OneDepComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  private _hasUnsavedChanges = false;

  appConfig = this.appConfigService.getConfig();
  dataset: Dataset | undefined;
  user: User | undefined;
  form: FormGroup;
  showAssociatedMapQuestion: boolean = false;
  methodsList = MethodsList;
  selectedFile: { [key: string]: File | null } = {};
  emFile = EmFile;
  fileTypes: DepositionFiles[];
  detailsOverflow: string = 'hidden';
  additionalMaps = 0;


  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

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
    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      }),
    );
    // Prevent user from reloading page if there are unsave changes
    this.subscriptions.push(
      fromEvent(window, "beforeunload").subscribe((event) => {
        if (this.hasUnsavedChanges()) {
          event.preventDefault();
        }
      }),
    );
    this.form = this.fb.group({
      email: this.user.email,
      jwtToken: new FormControl(""),
      metadata: this.dataset.scientificMetadata,
      emMethod: new FormControl(""),
      deposingCoordinates: new FormControl(null, Validators.required),
      associatedMap: new FormControl(null, Validators.required),
      compositeMap: new FormControl(null, Validators.required),
      emdbId: new FormControl(""),
      orcid: this.fb.array([
        this.fb.group({
          orcidId: ['', [Validators.required, Validators.pattern(/^(\d{4}-){3}\d{4}$/)]],
        })
      ]),
    })
  }
  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }
  onHasUnsavedChanges($event: boolean) {
    this._hasUnsavedChanges = $event;
  }
  orcidArray(): FormArray {
    return this.form.get('orcid') as FormArray;
  }
  addOrcidField() {
    const orcidField = this.fb.group({
      orcidId: ['', [Validators.required, Validators.pattern(/^(\d{4}-){3}\d{4}$/)]],
    });
    this.orcidArray().push(orcidField);
  }
  removeOrcidField(index: number) {
    if (this.orcidArray().length > 1) {
      this.orcidArray().removeAt(index);
    }
  }
  onMethodChange() {
    this.fileTypes = this.methodsList.find(mL => mL.value === this.form.value['emMethod']).files;
    this.fileTypes.forEach((fT) => {
      if (fT.emName === this.emFile.MainMap || fT.emName === this.emFile.Image) {
        fT.required = true;
      } else {
        fT.required = false;
      }
    });
    switch (this.form.value['emMethod']) {
      case 'helical':
        this.fileTypes.forEach((fT) => {
          if (fT.emName === this.emFile.HalfMap1 || fT.emName === this.emFile.HalfMap2) {
            fT.required = true;
          }
        });
        break;
      case "single-particle":
        this.fileTypes.forEach((fT) => {
          if (fT.emName === this.emFile.HalfMap1 || fT.emName === this.emFile.HalfMap2 || fT.emName === this.emFile.MaskMap) {
            fT.required = true;
          }
        });
        break;
    }

  }

  onPDB(event: any) {
    const input = event.value;
    if (input === 'true') {
      this.fileTypes.forEach((fT) => {
        if (fT.emName === this.emFile.Coordinates) {
          fT.required = true;
        }
      });
    }
  }

  autoGrow(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const maxLines = 5;

    // Reset height to auto to calculate scrollHeight
    textarea.style.height = 'auto';

    // Set the height based on the scrollHeight but limit it
    const newHeight = Math.min(textarea.scrollHeight, lineHeight * maxLines);
    textarea.style.height = `${newHeight}px`;

    // Update overflow property based on height
    this.detailsOverflow = textarea.scrollHeight > newHeight ? 'auto' : 'hidden';
  }
  onChooseFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }
  onFileSelected(event: Event, controlName: EmFile) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile[controlName] = input.files[0];
      this.fileTypes.forEach((fT) => {
        if (fT.emName === controlName) {
          fT.file = this.selectedFile[controlName];
          fT.fileName = this.selectedFile[controlName].name;
        }
      });
    }
  }
  onFileAddMapSelected(event: Event, id: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Use the ID to store the file uniquely for each "add-map"
      this.selectedFile[`add-map-${id}`] = input.files[0];
      this.fileTypes.forEach((fT) => {
        if (fT.emName === this.emFile.AddMap && fT.id === id) {
          fT.file = this.selectedFile[`add-map-${id}`];
          fT.fileName = this.selectedFile[`add-map-${id}`].name;
        }
      });
    }
  }
  isRequired(controlName: string): boolean {
    let value: boolean;
    this.fileTypes.forEach((fT) => {
      if (fT.emName === controlName) {
        value = fT.required;
      }
    });
    return value;
  }
  updateContourLevelMain(event: Event) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(',', '.');
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.fileTypes.forEach((fT) => {
        if (fT.emName === EmFile.MainMap || fT.emName === EmFile.HalfMap1 || fT.emName === EmFile.HalfMap2) {
          fT.contour = parsedValue;
        }
      });
    } else {
      console.warn('Invalid number format:', input);
    }
  }
  updateContourLevelAddMap(event: Event, id: number) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(',', '.');
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.fileTypes.forEach((fT) => {
        if (fT.emName === this.emFile.AddMap && fT.id === id) {
          fT.contour = parsedValue;
        }
      });
    } else {
      console.warn('Invalid number format:', input);
    }
  }
  updateContourLevel(event: Event, controlName: EmFile) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(',', '.');
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.fileTypes.forEach((fT) => {
        if (fT.emName === controlName) {
          fT.contour = parsedValue;
        }
      });
    } else {
      console.warn('Invalid number format:', input);
    }
  }
  updateDetails(event: Event, controlName: EmFile) {
    const textarea = event.target as HTMLTextAreaElement; // Cast to HTMLTextAreaElement
    const value = textarea.value;
    this.fileTypes.forEach((fT) => {
      if (fT.emName === controlName) {
        fT.details = value;
      }
    });

  }
  updateDetailsAddMap(event: Event, id: number) {
    const textarea = event.target as HTMLTextAreaElement; // Cast to HTMLTextAreaElement
    const value = textarea.value;
    this.fileTypes.forEach((fT) => {
      if (fT.emName === this.emFile.AddMap && fT.id === id) {
        fT.details = value;
      }
    });

  }
  addMap() {
    const nextId = this.fileTypes
      .filter(file => file.emName === EmFile.AddMap)
      .reduce((maxId, file) => (file.id > maxId ? file.id : maxId), 0) + 1;

    const newMap: DepositionFiles = {
      emName: EmFile.AddMap,
      id: nextId,
      nameFE: 'Additional Map ( ' + (nextId + 1).toString() + ' )',
      type: "add-map",
      fileName: "",
      file: null,
      contour: 0.0,
      details: "",
      required: false,
    };

    this.fileTypes.push(newMap);
  }
  sendFile(depID: string, form: FormData, fileType: string) {
    this.http.post("http://localhost:8080/onedep/" + depID + "/file", form).subscribe({
      next: (res) => console.log('Uploaded', fileType, res),
      error: (error) => console.error('Could not upload File and Metadata', error),
    });
  }
  sendCoordFile(depID: string, form: FormData) {
    this.http.post("http://localhost:8080/onedep/" + depID + "/pdb", form).subscribe({
      next: (res) => console.log('Uploaded Coordinates and Metadata', res),
      error: (error) => console.error('Could not upload Coordinates and Metadata', error),
    });
  }
  sendMetadata(depID: string, form: FormData) {
    // missing token!
    this.http.post("http://localhost:8080/onedep/" + depID + "/metadata", form).subscribe({
      next: (res) => console.log('Uploaded Metadata', res),
      error: (error) => console.error('Could not upload Metadata', error),
    });
  }
  onDepositClick() {
    //  Create a deposition
    const body = JSON.stringify(
      {
        "email": "sofya.laskina@epfl.ch",  // for now
        "orcidIds": this.orcidArray().value.map(item => item.orcidId),
        "country": "United States",
        "method": this.form.value.emMethod,
        "jwtToken": this.form.value.jwtToken,
      }
    );
    let depID: string;
    let metadataAdded = false;
    this.http.post("http://localhost:8080/onedep", body, {
     headers: { 'Content-Type': 'application/json' },
    }).subscribe({
      next: (response: any) => {
        depID = response.depID; // Update the outer variable
        console.log('Created deposition in OneDep', depID);

    //     // Call subsequent requests
    this.fileTypes.forEach((fT) => { 
      if (fT.file) {
        const formDataFile = new FormData()
        formDataFile.append('jwtToken', this.form.value.jwtToken)
        formDataFile.append('file', fT.file);
        if (fT.emName === this.emFile.Coordinates) {
          formDataFile.append('scientificMetadata', JSON.stringify(this.form.value.metadata));
          this.sendCoordFile(depID, formDataFile);
          metadataAdded = true
        } else {
          formDataFile.append('fileMetadata', JSON.stringify({ name: fT.fileName, type: fT.type, contour: fT.contour, details: fT.details }))
          this.sendFile(depID, formDataFile, fT.type);
        }
      }
    });
    if (! metadataAdded){
      const formDataFile = new FormData()

      formDataFile.append('jwtToken', this.form.value.jwtToken)
      formDataFile.append('scientificMetadata', JSON.stringify(this.form.value.metadata));
      this.sendMetadata(depID, formDataFile);
    }
      },
      error: (error) => console.error('Request failed', error.error),
    });

    // const formDataFile = new FormData();
    // formDataToSend.append('jwtToken', this.form.value.jwtToken);
    // 

    // var fileMetadata = []
    // // for (const fI in this.fileTypes) {
    // 
    // formDataToSend.append('fileMetadata', JSON.stringify(fileMetadata));
    // this.http.post("http://localhost:8080/onedep", formDataToSend, {
    //   headers: {}
    // }).subscribe(
    //   response => {
    //     console.log('Created deposition in OneDep', response);
    //   },
    //   error => {
    //     console.error('Request failed', error.error);
    //   }
    // );

  }

  //   onCreateClick() {
  //     let bearer = 'Bearer ' + this.form.value['jwtToken'];
  //     const headers = new HttpHeaders()
  //       .append(
  //         'Content-Type',
  //         'application/json'
  //       )
  //       .append(
  //         'Authorization',
  //         bearer
  //       );

  //     const body = JSON.stringify(
  //       {
  //         "email": "sofya.laskina@epfl.ch",
  //         "users": ["0009-0003-3665-5367"],
  //         "country": "United States",
  //         "experiments": [Experiments[this.form.value.emMethod]],
  //       }
  //     );

  //     this.http
  //       .post('https://onedep-depui-test.wwpdb.org/deposition/api/v1/depositions/new', body, {
  //         headers: headers,
  //       })
  //       .subscribe((res) => console.log(res));

  //   }

}


