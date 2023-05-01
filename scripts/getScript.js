import http from 'k6/http';
import {sleep, check, group} from 'k6';
import {Counter} from 'k6/metrics';
import {Rate} from 'k6/metrics';

import {
    payloadValid,
    firstname,
    lastname,
    date
} from "/home/bence/codecool/Projects/Tester/Week7/DemoQATest/K6tutorial/common/util.js";

export const requests = new Counter('http_reqs');
export const errorRate = new Rate('errors');


export const options = {
    stages: [
        //{ target: 20, duration: '1m'},
        //{ target: 15, duration: '1m' },
        {target: 1},
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
    },
};
const url = `https://restful-booker.herokuapp.com/booking`;
const headers = {
    headers: {
        'Accept': 'application/json'
    }
}

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
    const headers = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': '*/*',

        },
    };
    //console.log(firstname+ "   "+lastname);
    let createRes = http.post(url, payloadValid, headers);
    const id = JSON.parse(createRes.body).bookingid;
    //console.log("getscript setup" + authToken);
    sleep(1);
    check(createRes, {
        'status is 200': (r) => r.status === 200,
    })
    let data = {"id": id, "firstname": firstname, "lastname": lastname, "date": date}
    return data
}

export function getAllBookings() {
    group("Get All Bookings", function () {
        const res = http.get(url, headers);

        sleep(1);
        const data = JSON.parse(res.body);
        const checkRes = check(res, {
            'status is 200': (r) => r.status === 200,
            'response body is not empty': data.length !== 0,
            'response body contains id': "bookingid" in data[0],
        }) || errorRate.add(1);
    });



}

function getByExistingId(data) {
    let id = data.id;
    let fn = data.firstname;
    check(http.get(url + `/${id}`, headers), {
        'Firstname is correct ': (r) => JSON.parse(r.body).firstname === fn,
    }) || errorRate.add(1);
}

function getByNonExistingId() {
    let id = 0;
    check(http.get(url + `/${id}`, headers), {
        'Status code is 404 ': (r) => r.status === 404,
    }) || errorRate.add(1);
}

function getByFirstName(data) {
    let id = data.id;
    let fn = data.firstname;
    let res = http.get(url + `?firstname=${fn}`, headers);
    sleep(1.0);
    let ids = JSON.parse(res.body).map(x => x.bookingid);
    sleep(1.0);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'Id is among the ids ': ids.includes(id),
    }) || errorRate.add(1);
}

function getByNonExistingName() {
    let firstname = "nameless";
    check(http.get(url + `?firstname=${firstname}`, headers), {
        'Response is empty': (r) => JSON.parse(r.body).length === 0,
    })
}

function getByFullName(data) {
    let id = data.id;
    let fn = data.firstname;
    let ln = data.lastname;
    let res = http.get(url + `?firstname=${fn}&lastname=${ln}`, headers);
    sleep(1);
    let ids = JSON.parse(res.body).map(x => x.bookingid);
    sleep(1);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'Id is among the ids ': ids.includes(id),
    }) || errorRate.add(1);
}


function getByDate(data) {
    let id = data.id;

    console.log(id)
    let date = data.date;
    console.log(typeof date);
    let res = http.get(url + `?checkin=${date}`, headers);
    console.log(res.body);
    let ids = JSON.parse(res.body).map(x => x.bookingid);
    console.log(ids)
    sleep(1);
    check(res, {
        "status is 200": (r) => r.status === 200,
        "Id is among the ids": ids.includes(id),
    }) || errorRate.add(1);
}

export function getById(data) {
    group("Get by Id", function () {
        getByExistingId(data);
    })
}

export function getByName(data) {
    group("Get by Name", function () {
        getByFirstName(data);
        getByFullName(data);
    })
}


function del(data) {
    const id = data.id;
    const authToken = data.authToken;
    const headers = {
        headers: {
            'Cookie': `token=${authToken}`,
        },
    };
    check(http.del(url + `/${id}`, null, headers), {
        'Response status is 201': (r) => r.status === 201,
    }) || errorRate.add(1);
}

export function teardown(data) {
    del(data);
}