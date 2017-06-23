import {Months} from "./model/months";
import {Days} from "./model/days";
export class CLDRDataFetcher {

    availableLocales: string[];
    firstDayOfTheWeek: any;

    private fetchAvailableLocales() {
        return require("cldr-core/availableLocales.json").availableLocales.modern;
    }

    private fetchWeekData(): any {
        const week_data = require("cldr-core/supplemental/weekData.json").supplemental.weekData;
        return week_data.firstDay;
    }

    fetchMonths(locale: string): Months {
        const locale_data = require("cldr-dates-modern/main/" + locale + "/ca-gregorian.json").main[locale];
        return locale_data.dates.calendars.gregorian.months.format;
    }

    fetchDays(locale: string): Days {
        const locale_data = require("cldr-dates-modern/main/" + locale + "/ca-gregorian.json").main[locale];
        return locale_data.dates.calendars.gregorian.days.format;
    }

    fetchTerritory(locale: string): string {
        const locale_data = require("cldr-dates-modern/main/" + locale + "/ca-gregorian.json").main[locale];
        return locale_data.identity.territory;
    }

    constructor() {
        this.availableLocales = this.fetchAvailableLocales();
        this.firstDayOfTheWeek = this.fetchWeekData();
    }
}