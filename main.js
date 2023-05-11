
export { smokeTest } from '/home/bence/codecool/Projects/Tester/Week7/Restful Booker API Tests/scenarios/smoke.js';
export { post } from '/home/bence/codecool/Projects/Tester/Week7/Restful Booker API Tests/scenarios/post.js';
//export {getById} from '/home/bence/codecool/Projects/Tester/Week7/Restful Booker API Tests/scenarios/getById.js';
export {getAll} from '/home/bence/codecool/Projects/Tester/Week7/Restful Booker API Tests/scenarios/getAll.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


/*const configFile =  './config/test.json';
const testConfig = JSON.parse(open(configFile));
export const options = testConfig;*/

/*
if (__ENV.scenario) {
    // Use just a single scenario if `--env scenario=whatever` is used
    options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
    // Use all scenrios
    options.scenarios = scenarios;
}
// used to store global variables
globalThis.VARS = [];

// global min/max sleep durations (in seconds):
globalThis.PAUSE_MIN =  5;
globalThis.PAUSE_MAX = 15;*/

export default async function() {
    console.log("No scenarios found in config/test.json. Executing default function...");
}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}

