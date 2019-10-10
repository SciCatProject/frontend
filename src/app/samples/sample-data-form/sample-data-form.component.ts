import { Component } from "@angular/core";

@Component({
  selector: "app-sample-data-form",
  templateUrl: "./sample-data-form.component.html",
  styleUrls: ["./sample-data-form.component.scss"]
})
export class SampleDataFormComponent {
  sample = {
    Name: "Sample Data Entry 1",
    Density: "Some number",
    "Chemical Formula": "Some formula"
  };
}
