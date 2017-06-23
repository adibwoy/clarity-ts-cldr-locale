import fs = require("fs");
import {TSLocaleCreator} from "./ts-locale-creator";

export class Main {

    localeCreator: TSLocaleCreator;

    constructor() {
        console.log("Main");
        this.localeCreator = new TSLocaleCreator();
        this.localeCreator.generateLocaleData();
        //console.log(this.localeCreator.getFormattedData("ar-AE", "AE"));
    }
}

new Main();