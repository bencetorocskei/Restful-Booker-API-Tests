import http from 'k6/http';
import {sleep, check, group} from 'k6';
import {Counter} from 'k6/metrics';
import {Rate} from 'k6/metrics';
import {
    payloadValid,
    url
} from "/home/bence/codecool/Projects/Tester/Week7/DemoQATest/K6tutorial/common/util.js";

export const requests = new Counter('http_reqs');
export const errorRate = new Rate('errors');
const headersGet = {
    headers: {
        'Accept': 'application/json'
    }
}

export function setup() {

    //receiving Authtoken
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
    const tokenRes = http.post(urlForAuth, payloadForAuth, params);
    sleep(1);
    const authToken = JSON.parse(tokenRes.body).token;
    const headers = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': '*/*',
        },
    };
    const res = http.post(url, payloadValid, headers);
    const jsonResponse = JSON.parse(res.body);
    sleep(1);
    check(res, {
        'Booking created': (r) => r.status === 200,
    })
    return {body: jsonResponse.booking, id: jsonResponse.bookingid, "authToken": authToken}
}

export function getAllBookings() {
    group("Get All Bookings", function () {
        check(http.get(url, headersGet), {
            'status is 200': (r) => r.status === 200,
        }) || errorRate.add(1);
    });
}

function getBy_Id(data) {
    const id = data.id;
    check(http.get(url + `/${id}`, headersGet), {
        'Response satus is 200': (r) => r.status === 200,
    })
}

export function getById() {
    group("Get by ID", function () {
       // const data = setup();
        getBy_Id(data);
        teardown(data);
    })
}

export function getByFirstName(data) {
    group("Get by firstname", function () {
        let firstname = data.body.firstname;
        check(http.get(url + `?firstname=${firstname}`, headersGet), {
            'Response status is 200': (r) => r.status === 200,
        }) || errorRate.add(1);
    });

}

export default function update(data) {
    group("Update", function () {
        const authToken = data.authToken;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Cookie': `token=${authToken}`,
            },
        };

        const payloadValidUpdate = JSON.stringify({
            "firstname": "updateName",
            "lastname": data.body.lastname,
            "totalprice": data.body.totalprice,
            "depositpaid": data.body.depositpaid,
            "bookingdates": {
                "checkin": data.body.bookingdates.checkin,
                "checkout": data.body.bookingdates.checkout,
            },
            "additionalneeds": data.body.additionalneeds
        });


        const id = data.id;
        check(http.put(url + `/${id}`, payloadValidUpdate, headers), {
            'Response status is 200': (r) => r.status === 200
        });
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

export function deleteBooking(data) {
    group("Delete booking", function () {
        del(data);
    });
}


export function teardown(data) {
    del(data);
}

export function smoke() {
    group("Smoke test", function () {
        //const data = setup();
        getAllBookings()
        getById(data);
        getByFirstName(data)
        update(data)
        deleteBooking(data)
    });
}

export function booking() {
    group("Post test", function () {
    });
}

