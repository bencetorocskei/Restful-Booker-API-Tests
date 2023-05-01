import * as po from "/home/bence/codecool/Projects/Tester/Week7/DemoQATest/K6tutorial/scripts/postScript.js";
import * as s from "/home/bence/codecool/Projects/Tester/Week7/DemoQATest/K6tutorial/scripts/script.js"



export function smoke() {
    po.booking();
    const data = s.setup();
    s.getAllBookings();
    s.getById(data);
    s.getByFirstName(data);
    s.update(data);
    s.deleteBooking(data);
}