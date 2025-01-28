import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IngestionRequestInformation } from "../helper/ingestor.component-helper";
import { IngestorConfirmationDialogComponent } from "./confirmation-dialog/ingestor.confirmation-dialog.component";
import { ExportTemplateHelperComponent } from "./checkbox/checkbox.component";

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

  constructor(private dialog: MatDialog) {}

  // Save a template of metadata
  onSave() {
    const dialogRef = this.dialog.open(IngestorConfirmationDialogComponent, {
      data: {
        header: "Confirm template",
        message: "Do you really want to apply the following values?",
        messageComponent: ExportTemplateHelperComponent,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.createNewTransferData) {
          const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(this.createNewTransferData));
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
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;

          const dialogRef = this.dialog.open(
            IngestorConfirmationDialogComponent,
            {
              data: {
                header: "Confirm template",
                message: "Do you really want to apply the following values?",
                //messageComponent: CheckboxComponent,
              },
            },
          );
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              try {
                this.createNewTransferData = JSON.parse(content as string);
                console.log(this.createNewTransferData.scicatHeader);
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
}
