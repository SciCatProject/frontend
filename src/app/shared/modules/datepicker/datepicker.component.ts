import 'rxjs/add/operator/let';
import 'rxjs/add/operator/take';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { createSelector, OutputSelector } from 'reselect';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/distinctUntilChanged';

import TimeRange from './LocalizedDateTime/TimeRange';
import { Day, MultiDayRange, Week, Month, Year, MultiYearRange } from './LocalizedDateTime/timeRanges';
import CalSuperMonth from './LocalizedDateTime/CalSuperMonth';

import * as dpa from './datepicker.actions';
import * as dpr from './datepicker.reducer';
import {DatepickerState, SelectionModes, CalModes} from './datepicker.reducer';
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
    // const joinStr = '/';
    // return [mm, dd, yyyy].join(joinStr);
    const joinStr = '-';
    return [yyyy, mm, dd].join(joinStr);
  };
  // const joinStr = ' — '; //note this is longer than a normal dash in non-monospace fonts
  // const joinStr = '/';
  // const joinStr = ' - ';
  const joinStr = ' -- ';
  return selectedRanges.map((sr: Day | MultiDayRange) => {
    if (sr instanceof Day) {
      return getDayStr(sr);
    } else if (sr instanceof MultiDayRange) {
      return [sr.firstDay, sr.lastDay].map(getDayStr).join(joinStr);
    }
  }).join(', ');
};

@Component ({
  selector : 'datepicker',
  templateUrl : './datepicker.component.html',
  styleUrls : [ './datepicker.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit, OnDestroy {
  // @Input() storeSlicePath: string[] = []; // must be an array of strings specifying path from Store to datepicker slice
  private subscriptions: any[] = [];
  @Input() datepickerSelector: OutputSelector<any, DatepickerState, (res: any) => DatepickerState>;
  @Input() datepickerSelectionMode: SelectionModes = SelectionModes.range;
  @Input() selectionTextFormatter: ((selectedRanges: TimeRange[]) => string) = defaultSelectionTextFormatter;
  @Input() placeholder: string;
  @Output() selectedRanges: EventEmitter<TimeRange[]> = new EventEmitter();
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

    const selectFromDatepickerStore = (fn: (state: DatepickerState) => any) => {
      return this.store.select(createSelector(this.datepickerSelector, fn));
    };

    this.showCal$ = selectFromDatepickerStore(dpr.getShowCal);
    this.today$ = selectFromDatepickerStore(dpr.getToday);
    this.focusMonth$ = selectFromDatepickerStore(dpr.getFocusMonth);
    this.weekdayNames$ = selectFromDatepickerStore(dpr.getWeekdayNames);
    this.selectedRanges$ = selectFromDatepickerStore(dpr.getSelectedRanges);
    this.titleTextNow$ = selectFromDatepickerStore(dpr.getTitleTextNow);
    this.titleTextPrev$ = selectFromDatepickerStore(dpr.getTitleTextPrev);
    this.titleTextNext$ = selectFromDatepickerStore(dpr.getTitleTextNext);
    this.monthDisplayText$ = selectFromDatepickerStore(dpr.getMonthDisplayText);
    this.yearDisplayText$ = selectFromDatepickerStore(dpr.getYearDisplayText);
    this.calMode$ = selectFromDatepickerStore(dpr.getCalMode);
    this.minYear$ = selectFromDatepickerStore(dpr.getMinYear);
    this.maxYear$ = selectFromDatepickerStore(dpr.getMaxYear);
    this.calYearMonths$ = selectFromDatepickerStore(dpr.getCalYearMonths);
    this.calSuperMonth$ = selectFromDatepickerStore(dpr.getCalSuperMonth);
    this.numFormatter$ = selectFromDatepickerStore(dpr.getNumFormatter);
    this.sliderYear$ = selectFromDatepickerStore(dpr.getFocusYear).map(y => y.fullYear);

    this.arrowDir$ = this.calMode$.map(calMode => (calMode === 'moty' ? 'up' : 'down'));
    this.selectionsText$ = this.selectedRanges$.map(this.selectionTextFormatter);

    const emitSelectedRange = (selectedRanges: TimeRange[]): void => {
      this.selectedRanges.emit(selectedRanges);
    };
    this.subscriptions.push(this.selectedRanges$
      .subscribe(emitSelectedRange));

    // auto-resync today at start of each day (assuming that user is not changing system time/timezone)
    const self = this;
    const resyncAfterTimeout = (today: Day) : void => {
      const timeLeftToday = 1 + today.nextDay.startTime - new Date().getTime();
      console.log('starting next day in about ' + timeLeftToday + ' milliseconds'); // TODO: remove
      setTimeout(() => {
        self.resyncToday();
      }, timeLeftToday);
    };
    // Observable.of([1, 2, 3]).takeLast(2).subscribe((x) => console.log(x));
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
    const classes = [];

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
