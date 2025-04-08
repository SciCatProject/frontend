import {
  Component,
  Input,
  Output,
  EventEmitter,
  Injector,
  OnInit,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  IngestionRequestInformation,
  SciCatHeader,
} from "../../helper/ingestor.component-helper";
import { IngestorConfirmationDialogComponent } from "../confirmation-dialog/ingestor.confirmation-dialog.component";
import {
  ExportOptions,
  ExportTemplateHelperComponent,
} from "./ingestor.export-helper.component";

@Component({
  selector: "ingestor-dialog-stepper",
  templateUrl: "./ingestor.dialog-stepper.component.html",
  styleUrls: ["./ingestor.dialog-stepper.component.css"],
})
export class IngestorDialogStepperComponent {
  @Input() activeStep = 0;
  @Input() createNewTransferData: IngestionRequestInformation;
  @Output() createNewTransferDataChange =
    new EventEmitter<IngestionRequestInformation>();

  testMessageComponent = ExportTemplateHelperComponent;

  exportValueOptions: ExportOptions = {
    exportSciCat: true,
    exportOrganizational: false,
    exportSample: false,
  };

  injector = Injector.create({
    providers: [
      {
        provide: "data",
        useValue: this.exportValueOptions,
      },
    ],
  });

  constructor(private dialog: MatDialog) {}

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
          } as SciCatHeader;
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

          const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(exportData));
          const downloadAnchorNode = document.createElement("a");
          downloadAnchorNode.setAttribute("href", dataStr);
          downloadAnchorNode.setAttribute("download", "ingestor-template.json");
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
    input.accept = ".json";
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
                this.createNewTransferData = {
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
                this.createNewTransferDataChange.emit(
                  this.createNewTransferData,
                );
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

      // Clean selected file and selected method
      this.createNewTransferData.selectedPath = "";
      this.createNewTransferData.selectedMethod = null;
      this.createNewTransferDataChange.emit(this.createNewTransferData);
    }
  }
}
