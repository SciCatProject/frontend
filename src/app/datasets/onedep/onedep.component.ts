import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";
import { AppConfigService, AppConfig } from "app-config.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";

import { Store } from "@ngrx/store";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import { selectDepID } from "state-management/selectors/onedep.selectors";
import * as fromActions from "state-management/actions/onedep.actions";
import {
  createMethodsList,
  EmFile,
  DepositionFiles,
  OneDepUserInfo,
  OneDepCreate,
} from "./types/methods.enum";
import { Depositor } from "shared/sdk/apis/onedep-depositor.service";
import { Observable, Subscription, fromEvent } from "rxjs";
import { filter, map, take } from "rxjs/operators";

@Component({
  selector: "onedep",
  templateUrl: "./onedep.component.html",
  styleUrls: ["./onedep.component.scss"],
})
export class OneDepComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private _hasUnsavedChanges = false;

  config: AppConfig;

  dataset: OutputDatasetObsoleteDto | undefined;
  user: ReturnedUserDto | undefined;
  form: FormGroup;
  showAssociatedMapQuestion = false;
  methodsList = createMethodsList();
  selectedFile: { [key: string]: File | null } = {};
  emFile = EmFile;
  detailsOverflow = "hidden";
  additionalMaps = 0;
  showPassword = false;
  fileTypes: DepositionFiles[];
  mainContour = 0.0;
  connectedDepositionBackend = "";
  connectedDepositionBackendVersion = "";
  connectingToDepositionBackend = false;
  lastUsedDepositionBackends: string[] = [];
  forwardDepositionBackend = "";
  errorMessage = "";
  depID$: Observable<string>;
  @ViewChild("fileInput") fileInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private depositor: Depositor,
  ) {
    this.config = this.appConfigService.getConfig();
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      jwtToken: ["", Validators.required],
      password: new FormControl(""),
      metadata: ["", Validators.required],
      orcid: this.fb.array([
        this.fb.group({
          orcidId: ["", [Validators.required, this.orcidValidator()]],
        }),
      ]),
      emMethod: ["", Validators.required],
      deposingCoordinates: new FormControl("false", Validators.required),
      associatedMap: new FormControl("false", Validators.required),
      compositeMap: new FormControl("false", Validators.required),
      emdbId: new FormControl(""),
      files: this.fb.array([]),
    });
  }

  ngOnInit() {
    // initialize an array for the files to be uploaded
    this.fileTypes = [];
    this.mainContour = 0.0;
    //  connect to the depositor

    this.store.dispatch(fromActions.connectToDepositor());

    this.store.select(selectCurrentDataset).subscribe((dataset) => {
      this.dataset = dataset;
      if (dataset) {
        this.form.patchValue({
          metadata: this.dataset.scientificMetadata,
        });
      }
    });
    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((user) => {
        if (user) {
          this.user = user;
          this.form.patchValue({
            email: this.user?.email || "",
          });
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }
  onHasUnsavedChanges($event: boolean) {
    this._hasUnsavedChanges = $event;
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  orcidValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.replace(/-/g, "");
      if (!value) {
        return null;
      }
      const isValid = /^\d+$/.test(value);
      return isValid ? null : { notNumeric: true };
    };
  }
  orcidArray(): FormArray {
    return this.form.get("orcid") as FormArray;
  }
  addOrcidField() {
    const orcidField = this.fb.group({
      orcidId: ["", [Validators.required, this.orcidValidator()]],
    });
    this.orcidArray().push(orcidField);
  }
  removeOrcidField(index: number) {
    if (index === 0) {
      this.orcidArray().at(0).reset({ orcidId: "" });
    } else if (this.orcidArray().length > 1) {
      this.orcidArray().removeAt(index);
    }
  }
  addFilesToForm(files: DepositionFiles[]) {
    const filesArray = this.form.get("files") as FormArray;
    filesArray.clear();
    files.forEach((file) => {
      filesArray.push(
        this.fb.group({
          emName: [file.emName],
          id: [file.id],
          nameFE: [file.nameFE],
          type: [file.type],
          fileName: [file.fileName],
          file: [file.file],
          required: [file.required],
          contour: [file.contour],
          details: [file.details],
          explanation: [file.explanation],
        }),
      );
    });
  }
  addFileToForm(file: DepositionFiles) {
    const filesArray = this.form.get("files") as FormArray;
    filesArray.push(
      this.fb.group({
        emName: [file.emName],
        id: [file.id],
        nameFE: [file.nameFE],
        type: [file.type],
        fileName: [file.fileName],
        file: [file.file],
        required: [file.required],
        contour: [file.contour],
        details: [file.details],
        explanation: [file.explanation],
      }),
    );
  }
  onMethodChange() {
    this.methodsList = createMethodsList(); // Reset the methods list to be empty
    this.fileTypes = this.methodsList.find(
      (mL) => mL.value === this.form.value["emMethod"],
    ).files;
    this.fileTypes.forEach((fT) => {
      fT.required =
        fT.emName === this.emFile.MainMap || fT.emName === this.emFile.Image;
    });
    switch (this.form.value["emMethod"]) {
      case "helical":
        this.fileTypes.forEach((fT) => {
          if (
            fT.emName === this.emFile.HalfMap1 ||
            fT.emName === this.emFile.HalfMap2
          ) {
            fT.required = true;
          }
        });
        break;
      case "single-particle":
        this.fileTypes.forEach((fT) => {
          if (
            fT.emName === this.emFile.HalfMap1 ||
            fT.emName === this.emFile.HalfMap2 ||
            fT.emName === this.emFile.MaskMap
          ) {
            fT.required = true;
          }
        });
        break;
      case "tomogram":
        this.form.get("deposingCoordinates")?.setValue("false");
        this.form.get("associatedMap")?.setValue("false");
        break;
    }
    const filesArray = this.form.get("files") as FormArray;
    filesArray.clear();
    this.fileTypes.forEach((file) => {
      this.addFileToForm(file);
    });
  }
  get files() {
    return (this.form.get("files") as FormArray).controls;
  }

  onPDB(event: MatRadioChange) {
    // fix me : add removal on
    const input = event.value;
    if (input === "true") {
      this.fileTypes.forEach((fT) => {
        if (fT.emName === this.emFile.Coordinates) {
          fT.required = true; // update the co-cif required status
          this.addFileToForm(fT);
        }
      });
    }
  }

  autoGrow(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const maxLines = 3;

    // Reset height to auto to calculate scrollHeight
    textarea.style.height = "auto";

    // Set the height based on the scrollHeight but limit it
    const newHeight = Math.min(textarea.scrollHeight, lineHeight * maxLines);
    textarea.style.height = `${newHeight}px`;

    // Update overflow property based on height
    this.detailsOverflow =
      textarea.scrollHeight > newHeight ? "auto" : "hidden";
  }
  onChooseFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }
  onFileSelected(event: Event, controlName: EmFile) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile[controlName] = input.files[0];
      this.files.forEach((fT) => {
        if (fT.value.emName === controlName) {
          fT.value.file = this.selectedFile[controlName];
          fT.value.fileName = this.selectedFile[controlName].name;
          if (
            this.mainContour !== 0.0 &&
            (fT.value.emName === EmFile.MainMap ||
              fT.value.emName === EmFile.HalfMap1 ||
              fT.value.emName === EmFile.HalfMap2)
          ) {
            fT.value.contour = this.mainContour;
          }
        }
      });
    }
  }

  onFileAddMapSelected(event: Event, id: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Use the ID to store the file uniquely for each "add-map"
      this.selectedFile[`add-map-${id}`] = input.files[0];
      this.files.forEach((fT) => {
        if (fT.value.emName === this.emFile.AddMap && fT.value.id === id) {
          fT.value.file = this.selectedFile[`add-map-${id}`];
          fT.value.fileName = this.selectedFile[`add-map-${id}`].name;
        }
      });
    }
  }
  isRequired(controlName: string): boolean {
    let value: boolean;
    this.files.forEach((fT) => {
      if (fT.value.emName === controlName) {
        value = fT.value.required;
      }
    });
    return value;
  }
  updateContourLevelMain(event: Event) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(",", ".");
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.mainContour = parsedValue;
      this.files.forEach((fT) => {
        if (
          fT.value.file &&
          (fT.value.emName === EmFile.MainMap ||
            fT.value.emName === EmFile.HalfMap1 ||
            fT.value.emName === EmFile.HalfMap2)
        ) {
          fT.value.contour = this.mainContour;
        }
      });
    }
  }
  updateContourLevelAddMap(event: Event, id: number) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(",", ".");
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.files.forEach((fT) => {
        if (fT.value.emName === this.emFile.AddMap && fT.value.id === id) {
          fT.value.contour = parsedValue;
        }
      });
    }
  }
  updateContourLevel(event: Event, controlName: EmFile) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(",", ".");
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.files.forEach((fT) => {
        if (fT.value.emName === controlName) {
          fT.value.contour = parsedValue;
        }
      });
    }
  }
  updateDetails(event: Event, controlName: EmFile) {
    const textarea = event.target as HTMLTextAreaElement; // Cast to HTMLTextAreaElement
    const value = textarea.value;
    this.files.forEach((fT) => {
      if (fT.value.emName === controlName) {
        fT.value.details = value;
      }
    });
  }
  updateDetailsAddMap(event: Event, id: number) {
    const textarea = event.target as HTMLTextAreaElement; // Cast to HTMLTextAreaElement
    const value = textarea.value;
    this.files.forEach((fT) => {
      if (fT.value.emName === this.emFile.AddMap && fT.value.id === id) {
        fT.value.details = value;
      }
    });
  }
  addMap() {
    const nextId =
      this.files
        .filter((file) => file.value.emName === EmFile.AddMap)
        .reduce(
          (maxId, file) => (file.value.id > maxId ? file.value.id : maxId),
          0,
        ) + 1;

    const newMap: DepositionFiles = {
      emName: EmFile.AddMap,
      id: nextId,
      nameFE: "Additional Map ( " + (nextId + 1).toString() + " )",
      type: "add-map",
      fileName: "",
      file: null,
      contour: 0.0,
      details: "",
      required: false,
    };
    // update the co-cif required status
    this.addFileToForm(newMap);
  }
  addFSC() {
    const nextId =
      this.files
        .filter((file) => file.value.emName === EmFile.FSC)
        .reduce(
          (maxId, file) => (file.value.id > maxId ? file.value.id : maxId),
          0,
        ) + 1;

    const newFSC: DepositionFiles = {
      emName: EmFile.FSC,
      id: nextId,
      nameFE: "FSC-XML ( " + (nextId + 1).toString() + " )",
      type: "fsc-xml",
      fileName: "",
      file: null,
      contour: 0.0,
      details: "",
      required: false,
    };
    // update the co-cif required status
    this.addFileToForm(newFSC);
  }

  onDepositClick() {
    let body: OneDepUserInfo;
    if (this.form.value.password) {
      body = {
        email: this.form.value.email,
        orcidIds: this.orcidArray().value.map((item) => item.orcidId),
        country: "United States",
        method: this.form.value.emMethod,
        jwtToken: this.form.value.jwtToken,
        password: this.form.value.password,
      };
    } else {
      body = {
        email: this.form.value.email,
        orcidIds: this.orcidArray().value.map((item) => item.orcidId),
        country: "United States",
        method: this.form.value.emMethod,
        jwtToken: this.form.value.jwtToken,
      };
    }
    let metadataAdded = false;

    const filesToUpload = this.files
      .filter((fT) => fT.value.file)
      .map((fT) => {
        const formDataFile = new FormData();
        formDataFile.append("jwtToken", this.form.value.jwtToken);
        formDataFile.append("file", fT.value.file);
        if (fT.value.emName === this.emFile.Coordinates) {
          formDataFile.append(
            "scientificMetadata",
            JSON.stringify(this.form.value.metadata),
          );
          metadataAdded = true;
        } else {
          formDataFile.append(
            "fileMetadata",
            JSON.stringify({
              name: fT.value.fileName,
              type: fT.value.type,
              contour: fT.value.contour,
              details: fT.value.details,
            }),
          );
        }
        return { form: formDataFile, fileType: fT.value.emName };
      });
    // if (!metadataAdded) {
    //   const formDataFile = new FormData();

    //   formDataFile.append("jwtToken", this.form.value.jwtToken);
    //   formDataFile.append(
    //     "scientificMetadata",
    //     JSON.stringify(this.form.value.metadata),
    //   );
    //   // FIXME: This is a temporary fix, the metadata fileType should be specified as such, once supported by OneDep API
    //   filesToUpload.push({ form: formDataFile, fileType: EmFile.Coordinates });
    // }

    this.store.dispatch(
      fromActions.submitDeposition({
        deposition: body as OneDepUserInfo,
        files: filesToUpload,
      }),
    );
  }
  onDownloadClick() {
    if (this.form.value.deposingCoordinates === "true") {
      const fileEntry = this.files.find(
        (fileType) => fileType.value.emName === this.emFile.Coordinates,
      );

      if (fileEntry) {
        const file = fileEntry.value.file;
        this.depositor
          .downloadCoordinatesWithMetadata(file, this.form.value.metadata)
          .subscribe({
            next: (response: Blob) => {
              this.triggerDownload(response, "coordinatesWithMetadata.cif");
            },
            // error: (error) => {
            //   console.error("Error downloading file from /onedep/pdb", error);
            // },
          });
      }
    } else {
      this.depositor.downloadMetadata(this.form.value.metadata).subscribe({
        next: (response: Blob) => {
          this.triggerDownload(response, "metadata.cif");
        },
        // error: (error) => {
        //   console.error("Error downloading file from /onedep/metadata", error);
        // },
      });
    }
  }

  triggerDownload(response: Blob, filename: string) {
    const downloadUrl = window.URL.createObjectURL(response);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
