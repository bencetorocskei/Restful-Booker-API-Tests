import http from 'k6/http';
import {check} from 'k6';
import {getRandom, url} from "/home/bence/codecool/Projects/Tester/Week7/Restful Booker API Tests/common/util.js"


export const options = {
    scenarios: {
        loadForGetById: {
            executor: "ramping-vus",
            stages: [
                {duration: '10s', target: 100}, // traffic ramp-up from 1 to 100 users over 5 minutes.
                {duration: '10s', target: 100}, // stay at 100 users for 10 minutes
                {duration: '10s', target: 0}, // ramp-down to 0 users
            ],
        }
    },
    thresholds: {
        http_req_duration: ['avg<150', 'p(95)<170'],
        http_req_failed: ["rate<0.01"]
    },
};


export function setup() {
    const headersGet = {
        headers: {
            'Accept': 'application/json'
        }
    }
    const res = http.get(url, headersGet);
    check(res, {
        'Response status is 200': (r) => r.status === 200,
    })
    console.log(res.status);
    const ids = JSON.parse(res.body).map(x => x["bookingid"]);
    return ids
}

export default function getById(ids) {
    const headersGet = {
        headers: {
            'Accept': 'application/json'
        }
    }
    const index = getRandom(ids.length-1);
    const id = ids[index];
    console.log("id " + id);
    check(http.get(url + `/${id}`, headersGet), {
        'Response satus is 200': (r) => r.status === 200,
    })
}
