import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SampleApi } from "shared/sdk/services";
import { Sample } from "shared/sdk/models";

@Injectable({
  providedIn: "root"
})
export class SampleService {
  constructor(private sampleApi: SampleApi) {}

  getSamples(): Observable<Sample[]> {
    return this.sampleApi.find();
  }

  getSample(sampleId: string): Observable<Sample> {
    console.log ("get sample service: sampleId", sampleId);
    return this.sampleApi.findOne({ where: { "sampleId": sampleId } });
  }

  addSample(sample: Sample): Observable<Sample[]> {
    return this.sampleApi.create([sample]);
  }

  getSampleCount() {
    return this.sampleApi.count();
  }

}
