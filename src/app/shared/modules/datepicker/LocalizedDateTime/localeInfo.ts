import {fdowi} from './fdowi';

const fdowiKeys = Object.keys(fdowi);

interface IStringToBoolDict {
    [key: string]: boolean;
}

const cache = {
    hasGregDateTimeFormatSupport: {} as IStringToBoolDict
};
export const hasGregDateTimeFormatSupport = (locale: string) => {
    let retval = null;
    if (cache.hasGregDateTimeFormatSupport.hasOwnProperty(locale)) {
        retval = cache.hasGregDateTimeFormatSupport[locale];
        return retval;
    }
    if (Intl.DateTimeFormat.supportedLocalesOf([locale], {localeMatcher: 'lookup'}).length === 0) {
        retval = false;
    }
    const resolvedOpts = (new Intl.DateTimeFormat(locale)).resolvedOptions();
    retval = resolvedOpts.hasOwnProperty('calendar');
    // added gregorian because Safari doesn't follow specs
    retval = retval && (['gregory', 'gregorian'].indexOf(resolvedOpts.calendar) !== -1);
    cache.hasGregDateTimeFormatSupport[locale] = retval;
    return retval;
};

// ignore locales with non-gregorian calendars or where javascript
//   does not have a matching locale supported for DateTime formatting
export const supportedDateTimeLocales = Intl.DateTimeFormat.supportedLocalesOf(fdowiKeys, {
      localeMatcher: 'lookup'
    })
    .filter(sl => (fdowiKeys.indexOf(sl) !== -1))
    .filter(hasGregDateTimeFormatSupport);

export const getBestMatchingSupportedLocale = (locale: string) => {
    if (supportedDateTimeLocales.indexOf(locale) !== -1) {
        return locale;
    }
    const slCount = supportedDateTimeLocales.length;
    for (let idx = 0; idx < slCount; idx++) {
        const sl = supportedDateTimeLocales[idx];
        if (locale.startsWith(sl + '-')) {
            return sl;
        }
    }
    return null;
};

export const getNavLangs = () => {
    const navLangs: string[] = [];

    if (typeof navigator !== 'undefined') {
      if ((navigator as any).languages) { // chrome only; not an array, so can't use .push.apply instead of iterating
      (navigator as any).languages.forEach((lang) => navLangs.push(lang));
      }
      if ((navigator as any).userLanguage) {
        navLangs.push((navigator as any).userLanguage);
      }
      if ((navigator as any).language) {
        navLangs.push((navigator as any).language);
      }
    }
    return navLangs;
};

export const getSupportedNavLangs = () => {
    return getNavLangs().filter(hasGregDateTimeFormatSupport);
};


export const getDefaultLocale = () => {
  const supportedNavLangs = getSupportedNavLangs();
  return supportedNavLangs.length ? supportedNavLangs[0] : 'en-US';
};

export const getDefaultFirstDayOfWeekIdx = (locale: string = null) => {
    if (locale === null) {
        locale = getDefaultLocale();
    }
    const sl = getBestMatchingSupportedLocale(locale);
    return (sl && fdowi.hasOwnProperty(sl)) ? fdowi[sl] : 1; // 1 is ISO standard (Monday)
};

export const validDayOfWeekIdxs = Array(7).fill(undefined).map((u, i) => i); // [0, ...., 6]
export const getFirstDayOfWeekIdx = (localFirstDayOfWeekJsIdx: number = null, locale: string = null) => {
  if ((validDayOfWeekIdxs as any).indexOf(localFirstDayOfWeekJsIdx) === -1) {
    localFirstDayOfWeekJsIdx = getDefaultFirstDayOfWeekIdx(locale);
  }
  return localFirstDayOfWeekJsIdx;
};

/*
export const getTimeZone = (locale) => {
  return Intl.DateTimeFormat(locale).resolvedOptions().timeZone;
};
*/
