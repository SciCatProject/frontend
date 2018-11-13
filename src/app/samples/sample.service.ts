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

  getSample(samplelId: string): Observable<Sample> {
    return this.sampleApi.findOne({ where: { samplelId } });
  }
}
