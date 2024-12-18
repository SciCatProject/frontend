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
} from "@angular/forms";

import { Store } from "@ngrx/store";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import { methodsList, EmFile, DepositionFiles } from "./types/methods.enum";
import { Subscription, fromEvent } from "rxjs";

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
  methodsList = methodsList;
  selectedFile: { [key: string]: File | null } = {};
  emFile = EmFile;
  fileTypes: DepositionFiles[];
  detailsOverflow = "hidden";
  additionalMaps = 0;
  showPassword = false;

  connectedDepositionBackend = "";
  connectedDepositionBackendVersion = "";
  connectingToDepositionBackend = false;
  lastUsedDepositionBackends: string[] = [];
  forwardDepositionBackend = "";
  errorMessage = "";

  @ViewChild("fileInput") fileInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.config = this.appConfigService.getConfig();
  }

  ngOnInit() {
    //  connect to the depositor
    this.connectingToDepositionBackend = true;
    this.connectToDepositionBackend();

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
      password: new FormControl(),
      metadata: this.dataset.scientificMetadata,
      emMethod: new FormControl(""),
      deposingCoordinates: new FormControl(null, Validators.required),
      associatedMap: new FormControl(null, Validators.required),
      compositeMap: new FormControl(null, Validators.required),
      emdbId: new FormControl(""),
      orcid: this.fb.array([
        this.fb.group({
          orcidId: [
            "",
            [Validators.required, Validators.pattern(/^(\d{4}-){3}\d{4}$/)],
          ],
        }),
      ]),
    });
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
  orcidArray(): FormArray {
    return this.form.get("orcid") as FormArray;
  }
  addOrcidField() {
    const orcidField = this.fb.group({
      orcidId: [
        "",
        [Validators.required, Validators.pattern(/^(\d{4}-){3}\d{4}$/)],
      ],
    });
    this.orcidArray().push(orcidField);
  }
  removeOrcidField(index: number) {
    if (this.orcidArray().length > 1) {
      this.orcidArray().removeAt(index);
    }
  }
  onMethodChange() {
    this.fileTypes = this.methodsList.find(
      (mL) => mL.value === this.form.value["emMethod"],
    ).files;
    this.fileTypes.forEach((fT) => {
      if (
        fT.emName === this.emFile.MainMap ||
        fT.emName === this.emFile.Image
      ) {
        fT.required = true;
      } else {
        fT.required = false;
      }
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
    }
  }

  onPDB(event: MatRadioChange) {
    const input = event.value;
    if (input === "true") {
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
    const normalizedInput = input.replace(",", ".");
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.fileTypes.forEach((fT) => {
        if (
          fT.emName === EmFile.MainMap ||
          fT.emName === EmFile.HalfMap1 ||
          fT.emName === EmFile.HalfMap2
        ) {
          fT.contour = parsedValue;
        }
      });
    } else {
      console.warn("Invalid number format:", input);
    }
  }
  updateContourLevelAddMap(event: Event, id: number) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(",", ".");
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.fileTypes.forEach((fT) => {
        if (fT.emName === this.emFile.AddMap && fT.id === id) {
          fT.contour = parsedValue;
        }
      });
    } else {
      console.warn("Invalid number format:", input);
    }
  }
  updateContourLevel(event: Event, controlName: EmFile) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(",", ".");
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      this.fileTypes.forEach((fT) => {
        if (fT.emName === controlName) {
          fT.contour = parsedValue;
        }
      });
    } else {
      console.warn("Invalid number format:", input);
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
    const nextId =
      this.fileTypes
        .filter((file) => file.emName === EmFile.AddMap)
        .reduce((maxId, file) => (file.id > maxId ? file.id : maxId), 0) + 1;

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

    this.fileTypes.push(newMap);
  }
  sendFile(depID: string, form: FormData, fileType: string) {
    this.http
      .post(this.connectedDepositionBackend + "onedep/" + depID + "/file", form)
      .subscribe({
        next: (res) => console.log("Uploaded", fileType, res),
        error: (error) =>
          console.error("Could not upload File and Metadata", error),
      });
  }
  sendCoordFile(depID: string, form: FormData) {
    this.http
      .post(this.connectedDepositionBackend + "onedep/" + depID + "/pdb", form)
      .subscribe({
        next: (res) => console.log("Uploaded Coordinates and Metadata", res),
        error: (error) =>
          console.error("Could not upload Coordinates and Metadata", error),
      });
  }
  sendMetadata(depID: string, form: FormData) {
    // missing token!
    this.http
      .post(
        this.connectedDepositionBackend + "onedep/" + depID + "/metadata",
        form,
      )
      .subscribe({
        next: (res) => console.log("Uploaded Metadata", res),
        error: (error) => console.error("Could not upload Metadata", error),
      });
  }
  onDepositClick() {
    //  Create a deposition
    let body: string;
    if (this.form.value.password) {
      body = JSON.stringify({
        email: "sofya.laskina@epfl.ch", // for now
        orcidIds: this.orcidArray().value.map((item) => item.orcidId),
        country: "United States",
        method: this.form.value.emMethod,
        jwtToken: this.form.value.jwtToken,
        password: this.form.value.password,
      });
    } else {
      body = JSON.stringify({
        email: "sofya.laskina@epfl.ch", // for now
        orcidIds: this.orcidArray().value.map((item) => item.orcidId),
        country: "United States",
        method: this.form.value.emMethod,
        jwtToken: this.form.value.jwtToken,
      });
    }
    let depID: string;
    let metadataAdded = false;

    interface OneDepCreate {
      depID: string;
    }
    this.http
      .post(this.connectedDepositionBackend + "onedep", body, {
        headers: { "Content-Type": "application/json" },
      })
      .subscribe({
        next: (response: OneDepCreate) => {
          depID = response.depID;
          console.log("Created deposition in OneDep", depID);

          // Call subsequent requests
          this.fileTypes.forEach((fT) => {
            if (fT.file) {
              const formDataFile = new FormData();
              formDataFile.append("jwtToken", this.form.value.jwtToken);
              formDataFile.append("file", fT.file);
              if (fT.emName === this.emFile.Coordinates) {
                formDataFile.append(
                  "scientificMetadata",
                  JSON.stringify(this.form.value.metadata),
                );
                this.sendCoordFile(depID, formDataFile);
                metadataAdded = true;
              } else {
                formDataFile.append(
                  "fileMetadata",
                  JSON.stringify({
                    name: fT.fileName,
                    type: fT.type,
                    contour: fT.contour,
                    details: fT.details,
                  }),
                );
                this.sendFile(depID, formDataFile, fT.type);
              }
            }
          });
          if (!metadataAdded) {
            const formDataFile = new FormData();

            formDataFile.append("jwtToken", this.form.value.jwtToken);
            formDataFile.append(
              "scientificMetadata",
              JSON.stringify(this.form.value.metadata),
            );
            this.sendMetadata(depID, formDataFile);
          }
        },
        error: (error) => console.error("Request failed", error.error),
      });
  }
  onDownloadClick() {
    if (this.form.value.deposingCoordinates === "true") {
      const formDataFile = new FormData();
      const fT = this.fileTypes.find(
        (fileType) => fileType.emName === this.emFile.Coordinates,
      );
      formDataFile.append("file", fT.file);
      formDataFile.append(
        "scientificMetadata",
        JSON.stringify(this.form.value.metadata),
      );
      this.http
        .post(this.connectedDepositionBackend + "onedep/pdb", formDataFile, {
          responseType: "blob",
        })
        .subscribe({
          next: (response: Blob) => {
            this.triggerDownload(response, "coordinatesWithMmetadata.cif");
          },
          error: (error) => {
            console.error("Error downloading file from onedep/pdb", error);
          },
        });
    } else {
      const body = JSON.stringify(this.form.value.metadata);
      this.http
        .post(this.connectedDepositionBackend + "onedep/metadata", body, {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        })
        .subscribe({
          next: (response: Blob) => {
            this.triggerDownload(response, "metadata.cif");
          },
          error: (error) => {
            console.error("Error downloading file from onedep/metadata", error);
          },
        });
    }
  }
  triggerDownload(response: Blob, filename: string) {
    const downloadUrl = window.URL.createObjectURL(response);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename; // Set the file name here
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  connectToDepositionBackend(): boolean {
    const depositionBackendUrl = this.config.depositorURL;
    let depositionBackendUrlCleaned = depositionBackendUrl.slice();
    // Check if last symbol is a slash and add version endpoint
    if (!depositionBackendUrlCleaned.endsWith("/")) {
      depositionBackendUrlCleaned += "/";
    }

    const depositionBackendUrlVersion = depositionBackendUrlCleaned + "version";

    // Try to connect to the facility backend/version to check if it is available
    console.log("Connecting to OneDep backend: " + depositionBackendUrlVersion);
    this.http.get(depositionBackendUrlVersion).subscribe(
      (response) => {
        console.log("Connected to OneDep backend", response);
        // If the connection is successful, store the connected facility backend URL
        this.connectedDepositionBackend = depositionBackendUrlCleaned;
        this.connectingToDepositionBackend = false;
        this.connectedDepositionBackendVersion = response["version"];
      },
      (error) => {
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
        console.error("Request failed", error);
        this.connectedDepositionBackend = "";
        this.connectingToDepositionBackend = false;
      },
    );

    return true;
  }
}
