import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SampleApi } from "shared/sdk/services";
import { Sample } from "shared/sdk/models";

@Injectable({
  providedIn: "root"
})
export class SampleService {
  constructor(private sampleApi: SampleApi) {
  }

  getSamples(): Observable<Sample[]> {
    const ret = this.sampleApi.find();
    console.log("ret: ", ret);
    return this.sampleApi.find();
  }

  getSample(id: string): Observable<Sample> {
    return this.sampleApi.findOne({ where: { id } });
  }
}
