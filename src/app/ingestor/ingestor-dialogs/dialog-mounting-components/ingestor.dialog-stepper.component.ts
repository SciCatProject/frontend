import { Component, Input, Injector, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  IngestionRequestInformation,
  IngestorHelper,
} from "../../ingestor-page/helper/ingestor.component-helper";
import { IngestorConfirmationDialogComponent } from "../confirmation-dialog/ingestor.confirmation-dialog.component";
import {
  ExportOptions,
  ExportTemplateHelperComponent,
} from "./ingestor.export-helper.component";
import { Store } from "@ngrx/store";
import {
  selectIngestionObject,
  selectIngestorRenderView,
} from "state-management/selectors/ingestor.selector";
import { renderView } from "ingestor/ingestor-metadata-editor/ingestor-metadata-editor.component";
import * as fromActions from "state-management/actions/ingestor.actions";
import { Subscription } from "rxjs";
import { CreateDatasetDto } from "@scicatproject/scicat-sdk-ts-angular";

@Component({
  selector: "ingestor-dialog-stepper",
  templateUrl: "./ingestor.dialog-stepper.component.html",
  styleUrls: ["./ingestor.dialog-stepper.component.css"],
  standalone: false,
})
export class IngestorDialogStepperComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() activeStep = 0;

  testMessageComponent = ExportTemplateHelperComponent;

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();
  renderView$ = this.store.select(selectIngestorRenderView);
  ingestionObject$ = this.store.select(selectIngestionObject);
  activeRenderView: renderView | null = null;

  exportValueOptions: ExportOptions = {
    exportSciCat: true,
    exportOrganizational: false,
    exportSample: false,
    exportAll: false,
    exportAsJSON: false,
  };

  injector = Injector.create({
    providers: [
      {
        provide: "data",
        useValue: this.exportValueOptions,
      },
    ],
  });

  constructor(
    private dialog: MatDialog,
    private store: Store,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ingestionObject$.subscribe((ingestionObject) => {
        if (ingestionObject) {
          this.createNewTransferData = ingestionObject;
        }
      }),
    );

    this.subscriptions.push(
      this.renderView$.subscribe((renderView) => {
        if (renderView) {
          this.activeRenderView = renderView;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onChangeViewMode() {
    if (this.activeRenderView) {
      switch (this.activeRenderView) {
        case "requiredOnly":
          this.store.dispatch(
            fromActions.setRenderViewFromThirdParty({ renderView: "all" }),
          );
          break;
        case "all":
          this.store.dispatch(
            fromActions.setRenderViewFromThirdParty({
              renderView: "requiredOnly",
            }),
          );
          break;
        default:
          console.error("Unknown mode");
      }
    }
  }

  updateIngestionObject(updatedObject: IngestionRequestInformation) {
    this.store.dispatch(
      fromActions.updateIngestionObjectFromThirdParty({
        ingestionObject: updatedObject,
      }),
    );
  }

  // Save a template of metadata
  onSave() {
    const dialogRef = this.dialog.open(IngestorConfirmationDialogComponent, {
      data: {
        header: "Confirm template",
        message: "Do you really want to apply the following values?",
        messageComponent: this.testMessageComponent,
        injector: this.injector,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.createNewTransferData) {
          const sciCatHeaderWithoutSourcePath = {
            ...this.createNewTransferData.scicatHeader,
          } as CreateDatasetDto;
          delete sciCatHeaderWithoutSourcePath.sourceFolder;

          const exportData = {};
          if (this.exportValueOptions.exportSciCat) {
            exportData["scicatHeader"] = { ...sciCatHeaderWithoutSourcePath };
          }

          if (
            this.exportValueOptions.exportOrganizational ||
            this.exportValueOptions.exportSample
          ) {
            exportData["userMetaData"] = {};
          }

          if (this.exportValueOptions.exportAll) {
            exportData["extractorMetaData"] = {};
          }

          if (this.exportValueOptions.exportOrganizational) {
            exportData["userMetaData"]["organizational"] = {
              ...this.createNewTransferData.userMetaData.organizational,
            };
          }

          if (this.exportValueOptions.exportSample) {
            exportData["userMetaData"]["sample"] = {
              ...this.createNewTransferData.userMetaData.sample,
            };
          }

          if (this.exportValueOptions.exportAll) {
            exportData["extractorMetaData"]["instrument"] = {
              ...this.createNewTransferData.extractorMetaData.instrument,
            };
            exportData["extractorMetaData"]["acquisition"] = {
              ...this.createNewTransferData.extractorMetaData.acquisition,
            };
          }

          let exportString = "";
          if (this.exportValueOptions.exportAsJSON) {
            exportString = IngestorHelper.createMetaDataString(
              exportData as IngestionRequestInformation,
            );
          } else {
            exportString = JSON.stringify(exportData);
          }

          // Default file name is the current date and method name
          const currentDate = new Date();
          const formattedDate = currentDate
            .toISOString()
            .replace(/:/g, "-")
            .replace(/\..+/, "");
          const methodName =
            this.createNewTransferData.selectedMethod.name ?? "no_method";
          const ending = this.exportValueOptions.exportAsJSON
            ? ".json"
            : ".ingestor.template";

          const fileName = formattedDate + "_" + methodName + ending;

          const dataStr =
            "data:text/json;charset=utf-8," + encodeURIComponent(exportString);
          const downloadAnchorNode = document.createElement("a");
          downloadAnchorNode.setAttribute("href", dataStr);
          downloadAnchorNode.setAttribute("download", fileName);
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
        }
      }
    });
  }

  // Upload a template of metadata
  onUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".ingestor.template,.json";
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;

          const dialogRef = this.dialog.open(
            IngestorConfirmationDialogComponent,
            {
              data: {
                header: "Confirm template",
                message: "Do you really want to apply the following values?",
              },
            },
          );
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              try {
                const parsedData = JSON.parse(content);
                const newTransferData = {
                  ...this.createNewTransferData,
                  scicatHeader: {
                    ...this.createNewTransferData.scicatHeader,
                    ...parsedData.scicatHeader,
                  },
                  userMetaData: {
                    ...this.createNewTransferData.userMetaData,
                    ...parsedData.userMetaData,
                  },
                };

                this.updateIngestionObject(newTransferData);
              } catch (error) {
                console.error("Error parsing JSON file:", error);
              }
            }
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  onSwitchEditorMode(mode: string) {
    if (this.createNewTransferData) {
      switch (mode) {
        case "INGESTION":
          this.createNewTransferData.editorMode = "INGESTION";
          break;
        case "EDITOR":
          this.createNewTransferData.editorMode = "EDITOR";
          break;
        default:
          console.error("Unknown mode");
      }

      const newTransferData = { ...this.createNewTransferData };
      // Clean selected file and selected method
      newTransferData.selectedPath = "";
      newTransferData.selectedMethod = null;

      this.updateIngestionObject(newTransferData);
    }
  }
}
