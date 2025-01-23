import { Component, Input } from "@angular/core";

@Component({
  selector: "ingestor-dialog-stepper",
  templateUrl: "./ingestor.dialog-stepper.component.html",
  styleUrls: ["./ingestor.dialog-stepper.component.css"],
})
export class IngestorDialogStepperComponent {
  @Input() activeStep = 0;

  // Save a template of metadata
  onSave() {
    console.log("Save action triggered");
  }

  // Upload a template of metadata
  onUpload() {
    console.log("Upload action triggered");
  }
}
