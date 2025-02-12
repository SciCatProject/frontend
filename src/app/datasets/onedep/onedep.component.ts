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
import * as fromActions from "state-management/actions/onedep.actions";
import {
  createMethodsList,
  EmFile,
  DepositionFile,
  OneDepUserInfo,
  isMap,
} from "./types/methods.enum";
import { Depositor } from "shared/sdk/apis/onedep-depositor.service";
import { Observable, Subscription } from "rxjs";
import { isNumeric } from "mathjs";

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
  fileTypes: DepositionFile[]; // required to keep the initial set of files based on EM method
  mainContour = 0.0;
  isMap = isMap;
  connectedDepositionBackend = "";
  connectedDepositionBackendVersion = "";
  connectingToDepositionBackend = false;
  lastUsedDepositionBackends: string[] = [];
  forwardDepositionBackend = "";
  errorMessage = "";
  depositClicked = false;
  privacyTermsTicked = false;
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
      privacyTermsTicked: new FormControl(false, Validators.requiredTrue),
      email: ["", [Validators.required, Validators.email]],
      jwtToken: ["", Validators.required],
      password: new FormControl(""),
      metadata: ["", Validators.required],
      orcid: this.fb.array([
        this.fb.group({
          orcidId: [
            "",
            [
              Validators.required,
              this.orcidValidatorNumeric(),
              this.orcidValidator16digits(),
            ],
          ],
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  // custom validator of the ORCID ids
  orcidValidatorNumeric(): (
    control: AbstractControl,
  ) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.replace(/-/g, "");
      if (!value) {
        return null;
      }
      const isValid = /^\d+$/.test(value);
      return isValid ? null : { notNumeric: true };
    };
  }
  orcidValidator16digits(): (
    control: AbstractControl,
  ) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.replace(/-/g, "");
      if (!value) {
        return null;
      }
      return value.length === 16 ? null : { not16digits: true };
    };
  }
  orcidArray(): FormArray {
    return this.form.get("orcid") as FormArray;
  }
  addOrcidField() {
    // adds an empty ORCID field to the form
    const orcidField = this.fb.group({
      orcidId: [
        "",
        [
          Validators.required,
          this.orcidValidatorNumeric(),
          this.orcidValidator16digits(),
        ],
      ],
    });
    this.orcidArray().push(orcidField);
  }
  removeOrcidField(index: number) {
    // removes an ORCID field from the form; if it's first entry, just wipes the field
    if (index === 0) {
      this.orcidArray().at(0).reset({ orcidId: "" });
    } else if (this.orcidArray().length > 1) {
      this.orcidArray().removeAt(index);
    }
  }
  addFileToForm(file: DepositionFile, index?: number) {
    // adds a depositionFile to the form
    const fileValidators = [this.correctExtension];
    const contourValidators = [this.numericContourValidator];
    if (file.required) {
      // add-map is not required and hence excluded
      if (this.isMap(file.emName)) {
        contourValidators.push(Validators.required);
      }
      fileValidators.push(Validators.required);
    }

    const filesArray = this.form.get("files") as FormArray;
    const fileGroup = this.fb.group({
      emName: [file.emName],
      id: [file.id],
      nameFE: [file.nameFE],
      type: [file.type],
      fileName: [file.fileName],
      file: [file.file, fileValidators],
      required: [file.required],
      contour: [file.contour, contourValidators],
      details: [file.details],
      fileFormat: [file.fileFormat],
      explanation: [file.explanation],
    });
    if (index !== undefined) {
      filesArray.insert(index, fileGroup);
    } else {
      filesArray.push(fileGroup);
    }
  }

  //remove a file from the form; only used for co-cif (yes/no toggle). On method change a new files array will be generated
  removeFileFromForm(controlName: EmFile) {
    const filesArray = this.form.get("files") as FormArray;
    const index = filesArray.value.findIndex(
      (file: DepositionFile) => file.emName === controlName,
    );
    if (index > -1) {
      filesArray.removeAt(index);
    }
  }
  onMethodChange() {
    // generates a form array with predefined types of depositionFiles with empty peoperties and specified required tag
    const filesArray = this.form.get("files") as FormArray;
    filesArray.clear(); // clear files form

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
        // these questions in questionnaire are not relevant for tomogram but required for other methods
        this.form.get("deposingCoordinates")?.setValue("false");
        this.form.get("associatedMap")?.setValue("false");
        break;
    }
    // let sortedfileType = new Array<DepositionFile>(this.fileTypes.length);
    this.fileTypes.forEach((file) => {
      if (file.emName !== this.emFile.Coordinates) {
        this.addFileToForm(file);
      }
    });
  }
  get files() {
    return (this.form.get("files") as FormArray).controls;
  }

  getContourControl(fileType: AbstractControl): FormControl {
    return fileType.get("contour") as FormControl;
  }
  onPDB(event: MatRadioChange) {
    const input = event.value;
    if (input === "true") {
      this.fileTypes.forEach((fT) => {
        if (fT.emName === this.emFile.Coordinates) {
          fT.required = true; // update the co-cif required status
          this.addFileToForm(fT, 1);
        }
      });
    } else {
      this.removeFileFromForm(this.emFile.Coordinates);
    }
  }

  autoGrow(event: Event) {
    // function to auto-grow the textarea
    const textarea = event.target as HTMLTextAreaElement;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const maxLines = 3;

    textarea.style.height = "auto";

    const newHeight = Math.min(textarea.scrollHeight, lineHeight * maxLines);
    textarea.style.height = `${newHeight}px`;

    this.detailsOverflow =
      textarea.scrollHeight > newHeight ? "auto" : "hidden";
  }
  onChooseFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }
  onFileSelected(event: Event, controlName: EmFile) {
    // once the file is selected, adds it to the form
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile[controlName] = input.files[0];

      const filesArray = this.form.get("files") as FormArray;
      const fileControl = filesArray.controls.find(
        (control) => control.get("emName")?.value === controlName,
      );
      if (fileControl) {
        fileControl.get("file")?.setValue(this.selectedFile[controlName]);
        fileControl
          .get("fileName")
          ?.setValue(this.selectedFile[controlName].name);
        if (
          this.mainContour !== 0.0 &&
          [EmFile.MainMap, EmFile.HalfMap1, EmFile.HalfMap2].includes(
            controlName,
          )
        ) {
          fileControl.get("contour").setValue(this.mainContour);
        }
      }
    }
  }
  onFileAddMore(event: Event, id: number, fileType: string) {
    // once the file is selected, adds it to the form. Only for additional maps and FSC inputs, as they can include multiple files
    const input = event.target as HTMLInputElement;
    let fileControl;
    if (input.files && input.files.length > 0) {
      this.selectedFile[`${fileType}-${id}`] = input.files[0];

      const filesArray = this.form.get("files") as FormArray;
      if (fileType === "add-map") {
        fileControl = filesArray.controls.find(
          (control) =>
            control.get("emName")?.value === this.emFile.AddMap &&
            control.get("id")?.value === id,
        );
        if (fileControl) {
          const contourControl = fileControl.get("contour");
          contourControl.setValidators([
            Validators.required,
            ...(contourControl?.validator ? [contourControl.validator] : []),
          ]);
          contourControl?.updateValueAndValidity();
        }
      } else {
        fileControl = filesArray.controls.find(
          (control) =>
            control.get("emName")?.value === this.emFile.FSC &&
            control.get("id")?.value === id,
        );
      }
      if (fileControl) {
        fileControl
          .get("file")
          ?.setValue(this.selectedFile[`${fileType}-${id}`]);
        fileControl
          .get("fileName")
          ?.setValue(this.selectedFile[`${fileType}-${id}`].name);
      }
    }
  }

  clearFile(controlName: EmFile, id?: number) {
    // clear the selected file from form
    const key =
      controlName === "add-map" || controlName === "fsc-xml"
        ? `${controlName}-${id}`
        : controlName;
    this.selectedFile[key] = null;

    let index = -1;
    const filesArray = this.form.get("files") as FormArray;
    if (controlName !== "add-map" && controlName !== "fsc-xml") {
      index = filesArray.value.findIndex(
        (file: DepositionFile) => file.emName === controlName,
      );
    } else {
      for (let i = 0; i < filesArray.length; i++) {
        if (
          filesArray.at(i).value.emName === controlName &&
          filesArray.at(i).value.id === id
        ) {
          index = i;
          break;
        }
      }
    }
    if (index > -1) {
      filesArray.at(index).patchValue({ file: null });
    }
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
      const filesArray = this.form.get("files") as FormArray;
      const fileControl = filesArray.controls.find(
        (control) =>
          control.get("emName")?.value === this.emFile.AddMap &&
          control.get("id")?.value === id,
      );
      if (fileControl) {
        fileControl.get("contour")?.patchValue(parsedValue);
      }
    }
  }
  updateContourLevel(event: Event, controlName: EmFile) {
    const input = (event.target as HTMLInputElement).value.trim();
    const normalizedInput = input.replace(",", ".");
    const parsedValue = parseFloat(normalizedInput);
    if (!isNaN(parsedValue)) {
      const filesArray = this.form.get("files") as FormArray;
      const fileControl = filesArray.controls.find(
        (control) => control.get("emName")?.value === controlName,
      );
      if (fileControl) {
        fileControl.get("contour")?.patchValue(parsedValue);
      }
    }
  }
  updateDetails(event: Event, controlName: EmFile) {
    // function to update details for a map
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;

    const filesArray = this.form.get("files") as FormArray;
    const fileControl = filesArray.controls.find(
      (control) => control.get("emName")?.value === controlName,
    );
    if (fileControl) {
      fileControl.get("details")?.patchValue(value);
    }
  }
  updateDetailsAddMap(event: Event, id: number) {
    // function to update details for additional maps
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;
    const filesArray = this.form.get("files") as FormArray;
    const fileControl = filesArray.controls.find(
      (control) =>
        control.get("emName")?.value === this.emFile.AddMap &&
        control.get("id")?.value === id,
    );
    if (fileControl) {
      fileControl.get("details")?.patchValue(value);
    }
  }
  addMap() {
    // adds an empty DepositionFile of type Add-Map to the form
    const nextId =
      this.files
        .filter((file) => file.value.emName === EmFile.AddMap)
        .reduce(
          (maxId, file) => (file.value.id > maxId ? file.value.id : maxId),
          0,
        ) + 1;

    const newMap: DepositionFile = {
      emName: EmFile.AddMap,
      id: nextId,
      nameFE: "Additional Map ( " + (nextId + 1).toString() + " )",
      type: "add-map",
      fileName: "",
      file: null,
      contour: null,
      details: "",
      required: false,
      fileFormat: [".mrc", ".ccp4", ".mrc.gz", ".ccp4.gz"],
      explanation:
        "Difference maps, maps showing alternative conformations and/or compositions, maps with differential processing (e.g. filtering, sharpening and masking)",
    };
    // get the index of last map in the files array and insert as next
    const filesArray = this.form.get("files") as FormArray;
    const index = filesArray.value.findIndex(
      (file: DepositionFile) =>
        file.emName === EmFile.AddMap && file.id === nextId - 1,
    );
    this.addFileToForm(newMap, index + 1);
  }
  addFSC() {
    // adds an empty DepositionFile of type FSC to the form
    const nextId =
      this.files
        .filter((file) => file.value.emName === EmFile.FSC)
        .reduce(
          (maxId, file) => (file.value.id > maxId ? file.value.id : maxId),
          0,
        ) + 1;

    const newFSC: DepositionFile = {
      emName: EmFile.FSC,
      id: nextId,
      nameFE: "FSC-XML ( " + (nextId + 1).toString() + " )",
      type: "fsc-xml",
      fileName: "",
      file: null,
      required: false,
      fileFormat: [".xml"],
      explanation: "Half-map FSC, Map-model FSC, Cross-validation FSCs",
    };
    // get the index of last fsc in the files array and insert as next
    const filesArray = this.form.get("files") as FormArray;
    const index = filesArray.value.findIndex(
      (file: DepositionFile) =>
        file.emName === EmFile.FSC && file.id === nextId - 1,
    );
    this.addFileToForm(newFSC, index + 1);
  }

  correctExtension(controlFile: AbstractControl): ValidationErrors | null {
    // checks if the provided files has a correct extension
    const fileValue = controlFile.value;
    if (!fileValue) {
      return null;
    }
    const allowedExtensions = controlFile.parent?.get("fileFormat")?.value;
    const fileName = fileValue.name || fileValue;
    const fileExtension = fileName.endsWith(".gz")
      ? "." + fileName.split(".").slice(-2).join(".")
      : "." + fileName.split(".").pop();

    if (allowedExtensions && allowedExtensions.includes(fileExtension)) {
      return null;
    }
    return { correctExtension: true };
  }

  numericContourValidator(
    controlFile: AbstractControl,
  ): ValidationErrors | null {
    const value = controlFile.value;

    if (value === null || value === undefined) {
      return null;
    }

    return isNumeric(value) ? null : { notNumeric: true };
  }

  onDepositClick() {
    // Mark the form as submitted (trigger validation)
    this.depositClicked = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.submit();
  }
  submit() {
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
