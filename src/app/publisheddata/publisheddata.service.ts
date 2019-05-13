import { Injectable } from "@angular/core";
import { PublishedData, PublishedDataApi } from "shared/sdk";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PublisheddataService {
  constructor(
    private pubApi: PublishedDataApi
  ) {}


  getPublishedAll(): Observable<PublishedData[]> {
    return this.pubApi.find({limit: 5});
  }

  getPublished(pubId: string): Observable<PublishedData> {
    return this.pubApi.findOne({ where: { "doi": pubId } });
  }
}
