import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { FacetCount } from "../../../state-management/state/datasets.store";
import { map } from "rxjs/operators";

export function createSuggestionObserver(
  facetCounts$: Observable<FacetCount[]>,
  input$: BehaviorSubject<string>,
  currentFilters$: Observable<string[]>,
): Observable<FacetCount[]> {
  return combineLatest([facetCounts$, input$, currentFilters$]).pipe(
    map(([counts, filterString, currentFilters]) => {
      if (!counts) {
        return [];
      }
      return counts.filter(
        (count) =>
          typeof count._id === "string" &&
          count._id.toLowerCase().includes(filterString.toLowerCase()) &&
          currentFilters.indexOf(count._id) < 0,
      );
    }),
  );
}

export function getFacetId(facetCount: FacetCount, fallback = ""): string {
  const id = facetCount._id;
  return id ? String(id) : fallback;
}

export function getFacetCount(facetCount: FacetCount): number {
  return facetCount.count;
}

export function getFilterLabel(
  filters: Record<string, string> | undefined,
  componentName: string,
  defaultLabel: string,
): string {
  if (!filters || !componentName || !filters[componentName]) {
    return defaultLabel;
  }

  return filters[componentName];
}
