import http from 'k6/http';
import {sleep, check, group} from 'k6';
import {Rate} from 'k6/metrics';
import {
    payloadValid,
    url
} from '/home/bence/codecool/Projects/Tester/Week7/DemoQATest/K6tutorial/common/util.js';

export const errorRate = new Rate('errors');

export function setup() {
    const urlForAuth = 'https://restful-booker.herokuapp.com/auth'
    const payloadForAuth = JSON.stringify({
        "username": "admin",
        "password": "password123"
    })
    const params = {
        headers: {

            'Content-Type': 'application/json',
        },
    };
    //receiving an Auth token
    let tokenRes = http.post(urlForAuth, payloadForAuth, params);
    let authToken = JSON.parse(tokenRes.body).token;
    check(authToken, {'Token created': () => authToken !== ''});
    return authToken;

}

export function createBooking(authToken) {
    const headers = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Cookie': `token=${authToken}`,
        },
    };
    let createRes = http.post(url, payloadValid, headers);
    const id = JSON.parse(createRes.body).bookingid;
    sleep(1);
    check(createRes, {
        'Booking created': (r) => r.status === 200,
    } || errorRate.add(1));
    sleep(1);
    //deleting booking
    check(http.del(url + `/${id}`, null, headers), {
        'Booking deleted': (r) => r.status === 201,
    }) || errorRate.add(1);
}


export function booking() {
    group("Post request", function () {
        const token = setup();
        createBooking(token);
    })
}
