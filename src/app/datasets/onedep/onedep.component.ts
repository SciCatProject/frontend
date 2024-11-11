import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
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
import { MethodsList, OneDepExperiment, Experiments, EmFile, EmFiles } from "./types/methods.enum"
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
  // experiments = Experiments;
  experiment: OneDepExperiment
  selectedFile: { [key: string]: File | null } = {};
  emFile = EmFile;
  files = EmFiles;
  detailsOverflow: string = 'hidden';

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  fileTypes = [
    { header: 'Main Map', key: this.emFile.MainMap },
    { header: 'Half Map (1)', key: this.emFile.HalfMap1 },
    { header: 'Half Map (2)', key: this.emFile.HalfMap2 },
    { header: 'Mask Map', key: this.emFile.MaskMap },
    { header: 'Additional Map', key: this.emFile.AddMap },
    { header: 'Coordinates', key: this.emFile.Coordinates },
    { header: 'Public Image', key: this.emFile.Image },
    { header: 'FSC-XML', key: this.emFile.FSC },
  ];

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
      metadata: this.dataset.scientificMetadata,
      experiments: this.fb.array([]),
      emMethod: new FormControl(""),
      deposingCoordinates: new FormControl(true),
      associatedMap: new FormControl(false),
      compositeMap: new FormControl(false),
      emdbId: new FormControl(""),
      email: this.user.email
    })
  }

  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }
  onHasUnsavedChanges($event: boolean) {
    this._hasUnsavedChanges = $event;
  }

  autoGrow(event: Event): void {
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
  onChooseFile(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileSelected(event: Event, controlName: EmFile) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile[controlName] = input.files[0];
      this.files[controlName].file = this.selectedFile[controlName];
      this.files[controlName].name = this.selectedFile[controlName].name;
    }
  }
  updateContourLevel(event: Event, controlName: EmFile) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(',', '.');
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.files[controlName].contour = parsedValue;
    } else {
      console.warn('Invalid number format:', input);
    }
  }
  updateDetails(event: Event, controlName: EmFile) {
    const textarea = event.target as HTMLTextAreaElement; // Cast to HTMLTextAreaElement
    const value = textarea.value;
    if (this.files[controlName]) {
      this.files[controlName].details = value;
    }
  }
  onDepositClick() {
    const formDataToSend = new FormData();
    formDataToSend.append('email', this.form.value.email);
    formDataToSend.append('metadata', JSON.stringify(this.form.value.metadata));
    formDataToSend.append('experiments', this.form.value.emMethod);
    // emdbId: this.form.value.emdbId, 
    var fileMetadata = []

    for (const key in this.files) {
      if (this.files[key].file) {
        formDataToSend.append('file', this.files[key].file);
        fileMetadata.push({ name: this.files[key].name, type: this.files[key].type, contour: this.files[key].contour, details: this.files[key].details });
      }
    }
    console.log(fileMetadata);
    formDataToSend.append('fileMetadata', JSON.stringify(fileMetadata));


    console.log("Creating deposition", formDataToSend);
    this.http.post("http://localhost:8080/onedep", formDataToSend, {
      headers: {}
    }).subscribe(
      response => {
        console.log('Created deposition in OneDep', response);
      },
      error => {
        console.error('Request failed', error.error);
      }
    );

  }
}
