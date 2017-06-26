import fs = require("fs");
import {CLDRDataFetcher} from "./cldr-data-fetcher";

const OUTPUT_PATH = "dist/output/";

const JSON_FORMAT = "export const ${OBJECT_NAME}: any = {\n    \"locale\": \"${LOCALE}\",\n    \"months\": ${MONTHS},\n    \"days\": ${DAYS},\n    \"firstDay\": \"${FIRSTDAY}\"\n}";

const WORLD_TERRITORY = "001";

export class TSLocaleCreator {

    cldrFetcher: CLDRDataFetcher;

    constructor() {
        this.cldrFetcher = new CLDRDataFetcher();
    }

    generateLocaleFile(locale: string, data: string): void {
        const filePath: string = OUTPUT_PATH + locale + ".ts";
        if (fs.exists(filePath)) {
            fs.unlink(filePath);
        } else {
            fs.writeFile(filePath, data);
        }
    }

    generateLocaleData(): void {
        const locales: string[] = this.cldrFetcher.availableLocales;
        locales.forEach(locale => {
            const territory = this.cldrFetcher.fetchTerritory(locale);
            if (territory) {
                if (this.cldrFetcher.firstDayOfTheWeek[territory]) {
                    this.generateLocaleFile(locale, this.getFormattedData(locale, territory));
                } else {
                    console.warn(`Warning 1: Territory "${territory}" found but first day not found. Searching for a fallback for Locale: "${locale}"`);
                    this.generateFallbackData(locale, 1);
                }
            } else {
                console.warn(`Warning 2: Territory "${territory}" not found. Searching for a fallback for Locale: "${locale}"`);
                this.generateFallbackData(locale, 2);
            }
        });
    }

    generateFallbackData(locale: string, errorCode: number): void {
        const fallbackTerritory: string = this.cldrFetcher.fetchMissingTerritory(locale);
        if (this.cldrFetcher.firstDayOfTheWeek[fallbackTerritory]) {
            this.generateLocaleFile(locale, this.getFormattedData(locale, fallbackTerritory));
        } else {
            console.error(`ERROR${errorCode}: NO MAPPING FOR FALLBACK TERRITORY: "${fallbackTerritory}" Falling back to 001. LOCALE: "${locale}"`);
            this.generateLocaleFile(locale, this.getFormattedData(locale, WORLD_TERRITORY));
        }
    }

    getFormattedData(locale: string, territory: string): string {
        const months: any = JSON.stringify(this.transformData(this.cldrFetcher.fetchMonths(locale)), null, 8);
        const days: any = JSON.stringify(this.transformData(this.cldrFetcher.fetchDays(locale)), null, 8);
        const weekData: any = this.cldrFetcher.firstDayOfTheWeek;
        let formattedData = JSON_FORMAT.replace("${OBJECT_NAME}", this.convertLocaleToObjectName(locale));
        formattedData = formattedData.replace("${LOCALE}", locale);
        formattedData = formattedData.replace("${MONTHS}", months);
        formattedData = formattedData.replace("${DAYS}", days);
        formattedData = formattedData.replace("${FIRSTDAY}", weekData[territory]);
        return formattedData;
    }

    transformData(data: any): any {
        Object.keys(data).forEach(key => {
            data[key] = this.mapToArray(data[key]);
        });
        return data;
    }

    mapToArray(arr: any) {
        return Object.keys(arr).map(key => arr[key]);
    }

    convertLocaleToObjectName(locale: string): string {
        const splitLocale: string[] = locale.split("-");
        let finalName: string = "";
        for (let split=0; split < splitLocale.length; split++) {
            finalName = finalName + splitLocale[split];
        }
        return finalName;
    }

}