const scraper = require('./webScraperMain.js');
const notifier = require('./../globalErrorNotifier.js');
const { scraperLog } = require('./helperFunctionsScraper.js');
const config = require('./../loadConfig.js');

const conf = config.getData();

let interval = null;
let resetTimeout = null;

// Provjeri je li scraper pokrenut
exports.active = () => {
    return interval !== null;
}

// Pokreni scraper
exports.run = () => {
    let strugacInterval = 30;

    if (!interval)
        interval = setInterval(async () => {
            try {
                await scraper.run();
            } catch (err) {
                scraperLog(`Scraper error occurred, stopping scraper for next ${conf.scraper.errorSleepTime} s`);

                if (interval)
                    clearInterval(interval);
                interval = null;

                if (!resetTimeout)
                    resetTimeout = setTimeout(() => {
                        scraperLog(`Retrying to run scraper again in ${conf.scraper.scraperInterval} s`);
                        resetTimeout = null;
                        this.run();
                    }, conf.scraper.errorSleepTime * 1000);

                await notifier.handle(err);
            }
        }, conf.scraper.scraperInterval * 1000);
}

// Zaustavi scraper ako radi
exports.stop = () => {
    if (interval)
        clearInterval(interval);
    interval = null;
    if (resetTimeout)
        clearTimeout(resetTimeout);
    resetTimeout = null;
}