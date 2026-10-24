import { Injectable } from "@angular/core";
import { MetadataKeysV4Service } from "@scicatproject/scicat-sdk-ts-angular";
import { Observable, map, take } from "rxjs";
import { MetadataKey } from "state-management/models";
import { escapeRegex } from "./advanced-search.utils";

/** How many keys are listed at first, and how many more when scrolling. */
export const KEY_PAGE_SIZE = 20;

/** Loads a page of the scientific metadata keys that match the search term. */
export type ConditionKeySource = (
  term: string,
  skip: number,
  limit: number,
) => Observable<MetadataKey[]>;

/** The keys of datasets, loaded page by page from the backend. */
@Injectable({ providedIn: "root" })
export class MetadataKeySearchService {
  constructor(private metadataKeysService: MetadataKeysV4Service) {}

  search(term: string, skip: number, limit: number): Observable<MetadataKey[]> {
    const search = escapeRegex(term.trim());
    const match = { $regex: search, $options: "i" };
    const filter = {
      where: search
        ? { $or: [{ key: match }, { humanReadableName: match }] }
        : {},
      fields: ["key", "humanReadableName"],
      // sorted by key so that the pages follow each other
      limits: { skip, limit, sort: { key: "asc" } },
    };

    return this.metadataKeysService
      .metadataKeysV4ControllerFindAllV4(JSON.stringify(filter))
      .pipe(
        map((keys) =>
          keys.map(({ key, humanReadableName }) => ({
            key,
            humanReadableName,
          })),
        ),
      );
  }
}

/** For keys that are all loaded already, e.g. the ones of samples. */
export function staticKeySource(
  keys$: Observable<MetadataKey[]>,
): ConditionKeySource {
  return (term, skip, limit) =>
    keys$.pipe(
      take(1),
      map((keys) => {
        const search = term.trim().toLowerCase();
        return keys
          .filter(
            ({ key, humanReadableName }) =>
              !search ||
              key.toLowerCase().includes(search) ||
              humanReadableName?.toLowerCase().includes(search),
          )
          .slice(skip, skip + limit);
      }),
    );
}
