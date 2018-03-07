
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { createSelector, OutputSelector } from 'reselect';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';

import TimeRange from './LocalizedDateTime/TimeRange';
import { Day, MultiDayRange, Week, Month, Year, MultiYearRange } from './LocalizedDateTime/timeRanges';
import CalSuperMonth from './LocalizedDateTime/CalSuperMonth';

import { DatepickerState, SelectionModes, CalModes } from './datepicker.store';
import * as dps from './datepicker.store';
import * as dpa from './datepicker.actions';

const datepickerActionTypes = dpa.datepickerActionTypes;
interface WeekdayNameObject {
  long: string;
  short: string;
  narrow: string;
}

const defaultSelectionTextFormatter = (selectedRanges: TimeRange[]) => {
  const getDayStr = (d: Day) => {
    const isoSubStr = d.isoSubstr;
    // return isoSubStr;
    const isoUTCMidnightStr = isoSubStr + 'T00:00:00.000Z';
    const d2 = new Date(isoUTCMidnightStr);
    const mm = ('0' + (d2.getUTCMonth() + 1).toString()).substr(-2);
    const dd = ('0' + d2.getUTCDate().toString()).substr(-2);
    const yyyy = d2.getUTCFullYear().toString();
    // const dateJoinStr = '/';
    // return [mm, dd, yyyy].join(dateJoinStr);
    const dateJoinStr = '-';
    return [yyyy, mm, dd].join(dateJoinStr);
  };
  // const rangeJoinStr = ' — '; //note this is longer than a normal dash in non-monospace fonts
  // const rangeJoinStr = '/';
  // const rangeJoinStr = ' - ';
  const rangeJoinStr = ' -- ';
  return selectedRanges.map((sr: Day | MultiDayRange) => {
    if (sr instanceof Day) {
      return getDayStr(sr);
    } else if (sr instanceof MultiDayRange) {
      return [sr.firstDay, sr.lastDay].map(getDayStr).join(rangeJoinStr);
    }
  }).join(', ');
};

const defaultSpecialDayClassGetter = (day: Day) => {
  return [];
};

const defaultSpecialDayTitleAttribGetter = (day: Day) => {
  return '';
};

const defaultSelections = [];

@Component ({
  selector : 'datepicker',
  templateUrl : './datepicker.component.html',
  styleUrls : [ './datepicker.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit, OnDestroy {
  // @Input() storeSlicePath: string[] = []; // must be an array of strings specifying path from Store to datepicker slice
  private subscriptions: Subscription[] = [];

  private _selections: TimeRange[] = defaultSelections;
  @Input()
  set selections(newSelections: TimeRange[]) {
    this._selections = newSelections;
    this.store.dispatch(new dpa.SetSelectionsAction(this.selections));
  }
  get selections() {
    return this._selections;
  }
  @Output() selectionsChange: EventEmitter<TimeRange[]> = new EventEmitter();

  @Input() datepickerSelector: OutputSelector<any, DatepickerState, (res: any) => DatepickerState>;
  @Input() datepickerSelectionMode: SelectionModes = SelectionModes.range;
  @Input() selectionTextFormatter: ((selectedRanges: TimeRange[]) => string) = defaultSelectionTextFormatter;
  @Input() placeholder: string;
  @Input() specialDayClassGetter: ((day: Day) => string[]) = defaultSpecialDayClassGetter;
  @Input() specialDayTitleAttribGetter: ((day: Day) => string) = defaultSpecialDayTitleAttribGetter;


  CalModes = CalModes;

  // private datepickerSelector: (state: any) => DatepickerState;
  selectionsText$: Observable<string>;
  showCal$: Observable<boolean>;
  today$: Observable<Day>;
  focusMonth$: Observable<Month>;
  weekdayNames$: Observable<WeekdayNameObject[]>;
  selectedRanges$: Observable<TimeRange[]>;
  titleTextNow$: Observable<string>;
  titleTextPrev$: Observable<string>;
  titleTextNext$: Observable<string>;
  monthDisplayText$: Observable<string>;
  yearDisplayText$: Observable<string>;
  calMode$: Observable<string>;
  arrowDir$: Observable<string>;
  minYear$: Observable<number>;
  maxYear$: Observable<number>;
  sliderYear$: Observable<number>;
  calYearMonths$: Observable<Month[]>;
  calSuperMonth$: Observable<CalSuperMonth>;
  focusYearMonthClasses$: Observable<string[][]>;
  numFormatter$: Observable<(number) => string>;

  constructor (private store: Store<any>) {
  }

  ngOnInit() {
    this.store.dispatch(new dpa.SetSelectionModeAction(this.datepickerSelectionMode));
    this.store.dispatch(new dpa.SetSelectionsAction(this.selections));

    const selectFromDatepickerStore = <T>(fn: (state: DatepickerState) => T): Observable<T> => {
      return this.store.select(createSelector(this.datepickerSelector, fn));
    };

    this.showCal$ = selectFromDatepickerStore(dps.getShowCal);
    this.today$ = selectFromDatepickerStore(dps.getToday);
    this.focusMonth$ = selectFromDatepickerStore(dps.getFocusMonth);
    this.weekdayNames$ = selectFromDatepickerStore(dps.getWeekdayNames);
    this.selectedRanges$ = selectFromDatepickerStore(dps.getSelectedRanges);
    this.titleTextNow$ = selectFromDatepickerStore(dps.getTitleTextNow);
    this.titleTextPrev$ = selectFromDatepickerStore(dps.getTitleTextPrev);
    this.titleTextNext$ = selectFromDatepickerStore(dps.getTitleTextNext);
    this.monthDisplayText$ = selectFromDatepickerStore(dps.getMonthDisplayText);
    this.yearDisplayText$ = selectFromDatepickerStore(dps.getYearDisplayText);
    this.calMode$ = selectFromDatepickerStore(dps.getCalMode);
    this.minYear$ = selectFromDatepickerStore(dps.getMinYear);
    this.maxYear$ = selectFromDatepickerStore(dps.getMaxYear);
    this.calYearMonths$ = selectFromDatepickerStore(dps.getCalYearMonths);
    this.calSuperMonth$ = selectFromDatepickerStore(dps.getCalSuperMonth);
    this.numFormatter$ = selectFromDatepickerStore(dps.getNumFormatter);
    this.sliderYear$ = selectFromDatepickerStore(dps.getFocusYear).map(y => y.fullYear);

    this.arrowDir$ = this.calMode$.map(calMode => (calMode === 'moty' ? 'up' : 'down'));
    this.selectionsText$ = this.selectedRanges$.map(this.selectionTextFormatter);

    const hasSameTimeRangeSelections = (selectionsA: TimeRange[], selectionsB: TimeRange[]) => {
      if (selectionsA.length !== selectionsB.length) {
        return false;
      }
      for (let idx = 0; idx < selectionsA.length; idx++) {
        const selA = selectionsA[idx];
        const selB = selectionsB[idx];
        if (!!(selA instanceof TimeRange) !== !!(selB instanceof TimeRange)) {
          return false;
        }
        if (selA instanceof TimeRange) {
          if (!selA.isTemporallyEqualTo(selB)) {
            return false;
          }
        } else if (selA !== selB) {
          return false;
        }
      }
      return true;
    };

    const updateSelections = (selectedRanges: TimeRange[]): void => {
      this.selections = selectedRanges;
      this.selectionsChange.emit(this.selections);
    };
    this.subscriptions.push(this.selectedRanges$
      .distinctUntilChanged(hasSameTimeRangeSelections)
      .subscribe(updateSelections));

    // auto-resync today at start of each day (assuming that user is not changing system time/timezone)
    const self = this;
    const resyncAfterTimeout = (today: Day): void => {
      const timeLeftToday = 1 + today.nextDay.startTime - new Date().getTime();
      // ('starting next day in about ' + timeLeftToday + ' milliseconds'); // TODO: remove
      setTimeout(() => {
        self.resyncToday();
      }, timeLeftToday);
    };
    this.subscriptions.push(this.today$
      .takeLast(1)
      .subscribe(resyncAfterTimeout));
    this.subscriptions.push(this.today$
      .distinctUntilChanged((dayA, dayB) => dayA.isTemporallyEqualTo(dayB))
      .subscribe(resyncAfterTimeout));

    this.resyncToday();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  makeRange(n: number): number[] {
    return Array(n).fill(undefined).map((x, i) => i);
  }

  monthClasses(m: Month, focusMonth: Month, today: Day, selectedRanges: TimeRange[]): string[] {
    const thisMonth = today.month;
    const thisYear = thisMonth.year;
    const classes = [];
    if (focusMonth.isTemporallyEqualTo(m)) {
      classes.push('cal-month');
    }
    if (thisYear.contains(m)) {
      classes.push('this-year');
      if (thisMonth.isTemporallyEqualTo(m)) {
        classes.push('this-month');
      }
    }
    if (selectedRanges.some((selectedRange:  TimeRange) => selectedRange && selectedRange.contains(m))) {
      classes.push('selected');
    } else if (selectedRanges.some((selectedRange:  TimeRange) => selectedRange && selectedRange.hasOverlapWith(m))) {
      classes.push('partly-selected');
    }
    return classes;
  }
  dayClasses(d: Day, focusMonth: Month, today: Day, selectedRanges: TimeRange[]): string[] {
    const thisMonth = today.month;
    const thisYear = today.year;
    const focusYear = focusMonth.year;
    const isoSubstr = d.isoSubstr;
    const classes = [].concat(this.specialDayClassGetter(d));

    if (thisYear.contains(d)) {
      classes.push('this-year');
      if (thisMonth.contains(d)) {
        classes.push('this-month');
        if (today.isTemporallyEqualTo(d)) {
          classes.push('today');
        }
      }
    }

    if (focusYear.contains(d)) {
      classes.push('cal-year');
      if (focusMonth.contains(d)) {
        classes.push('cal-month');
      }
    }

    if (selectedRanges.some((selectedRange: TimeRange) => selectedRange && selectedRange.contains(d))) {
      classes.push('selected');
    } else if (selectedRanges.some((selectedRange: TimeRange) => selectedRange && selectedRange.hasOverlapWith(d))) {
      classes.push('partly-selected');
    }
    return classes;
  }

  getDayDisplayText(d: Day, numFormatter: (number) => string) {
    const isoSubstr = d.isoSubstr;
    const utcDate = (new Date(isoSubstr + 'T00:00:00.000Z')).getUTCDate();
    return numFormatter(utcDate);
  }




  toggleCalDisp() {
    this.store.dispatch(new dpa.ToggleCalDispAction());
  }
  toggleCalMode() {
    this.store.dispatch(new dpa.ToggleCalModeAction());
  }
  resyncToday() {
    this.store.dispatch(new dpa.ResyncTodayAction());
  }
  setFocusNow() {
    this.store.dispatch(new dpa.RefocusToCurrentMonthAction());
  }
  stepFocusBack() {
    this.store.dispatch(new dpa.StepFocusBackAction());
  }
  stepFocusForward() {
    this.store.dispatch(new dpa.StepFocusForwardAction());
  }
  updateFocusMonth(newFocusMonth: Month) {
    this.store.dispatch(new dpa.UpdateFocusMonthAction(newFocusMonth));
  }
  updateSelections(clickedDay: Day) {
    this.store.dispatch(new dpa.UpdateSelectionsAction(clickedDay));
  }
  focusOnMonth(clickedMonth: Month) {
    this.store.dispatch(new dpa.FocusOnMonthAction(clickedMonth));
  }

  updateSliderYear(newYear) {
    this.store.dispatch(new dpa.SetFocusYearAction(newYear));
  }
}
