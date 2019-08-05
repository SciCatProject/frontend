import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SampleApi, DatasetApi } from "shared/sdk/services";
import { Sample, Dataset } from "shared/sdk/models";

@Injectable({
  providedIn: "root"
})
export class SampleService {
  constructor(private sampleApi: SampleApi, private datasetApi: DatasetApi) {}

  getSamples(): Observable<Sample[]> {
    return this.sampleApi.find();
  }

  getSample(sampleId: string): Observable<Sample> {
    console.log("get sample service: sampleId", sampleId);
    return this.sampleApi.findOne({ where: { sampleId: sampleId } });
  }

  addSample(sample: Sample): Observable<Sample[]> {
    return this.sampleApi.create([sample]);
  }

  getSampleCount() {
    return this.sampleApi.count();
  }

  getDatasetsForSample(sampleId: string): Observable<Dataset[]> {
    console.log("gm: fetch datasets for ", sampleId);
    return this.datasetApi.find({ where: { sampleId: sampleId } });
  }
}
