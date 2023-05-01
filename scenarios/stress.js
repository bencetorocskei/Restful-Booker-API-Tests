import * as g from '/home/bence/codecool/Projects/Tester/Week7/DemoQATest/K6tutorial/scripts/getScript.js';
import {getById} from "/home/bence/codecool/Projects/Tester/Week7/DemoQATest/K6tutorial/scripts/getScript.js";

export function stress() {
   let data = g.setup();
   getById(data);

}