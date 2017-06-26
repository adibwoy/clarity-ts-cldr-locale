import {Months} from "./model/months";
import {Days} from "./model/days";

const AVAILABLE_LOCALES: string = "cldr-core/availableLocales.json";
const DEFAULT_TERRITORIES: string = "cldr-core/defaultContent.json";

export class CLDRDataFetcher {

    availableLocales: string[];
    firstDayOfTheWeek: any;
    defaultTerritories: Map<string, string> = new Map<string, string>();

    private fetchAvailableLocales() {
        return require(AVAILABLE_LOCALES).availableLocales.modern;
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

    fetchDefaultTerritories(): Map<string, string> {
        const defaultData: string[] = require(DEFAULT_TERRITORIES).defaultContent;
        const testMap: Map<string, string> = new Map<string, string>();
        defaultData.forEach(val => {
            const index = val.lastIndexOf("-");
            testMap.set(val.substr(0, index), val.substr(index + 1));
        });
        return testMap;
    }

    fetchMissingTerritory(locale: string): string {
        const index = locale.lastIndexOf("-");
        let key: string = "";
        if (index > -1) {
            key = locale.substr(0, index);
        } else {
            key = locale;
        }
        const val: string = this.defaultTerritories.get(key);
        if (val) {
            return val;
        } else {
            //For values like zh-Hans we might not want to split and search
            return this.defaultTerritories.get(locale);
        }
    }

    constructor() {
        this.availableLocales = this.fetchAvailableLocales();
        this.firstDayOfTheWeek = this.fetchWeekData();
        this.defaultTerritories = this.fetchDefaultTerritories();
    }
}