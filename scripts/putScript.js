import http from 'k6/http';
import {check, sleep, group} from 'k6';
import {
    firstname,
    lastname,
    payloadValid,
    updateName,
    url
} from '/home/bence/codecool/Projects/Tester/Week7/DemoQATest/K6tutorial/common/util.js';

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
    let createRes = http.post(url, payloadValid, headers);
    let res = JSON.parse(createRes.body).booking;
    const id = JSON.parse(createRes.body).bookingid;
    //console.log("putscript setup" + authToken);
    sleep(1);
    check(createRes, {
        'status is 200': (r) => r.status === 200,
    })
    let data = {
        "id": id, "firstname": firstname, "authtoken": authToken, "lastname": lastname,
        "totalprice": res.totalprice,
        "depositpaid": res.depositpaid,
        "checkin": res.bookingdates.checkin,
        "checkout": res.bookingdates.checkout,
        "additionalneeds": res.additionalneeds
    };
    return data;
}

export function validUpdate(data) {
    group("Valid Update", function () {
        let authToken = data.authtoken;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Cookie': `token=${authToken}`,
            },
        };

        const payloadValidUpdate = JSON.stringify({
            "firstname": updateName,
            "lastname": data.lastname,
            "totalprice": data.totalprice,
            "depositpaid": data.depositpaid,
            "bookingdates": {
                "checkin": data.checkin,
                "checkout": data.checkout,
            },
            "additionalneeds": data.additionalneeds
        });


        let id = data.id;
        let res = http.put(url + `/${id}`, payloadValidUpdate, headers)
        let jsonResponse = JSON.parse(res.body);
        check(jsonResponse, {
            'Response status is 200': res.status === 200,
            'Firstname is updated': jsonResponse.firstname === updateName,
            'Lastname is correct': jsonResponse.lastname === data.lastname,
        })

    })

}

export function invalidUpdate(data) {
    group("Invalid Update", function () {
        let headers = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Cookie': `token=${data.authtoken}`,
            },
        };

        const payloadInvalidUpdate = JSON.stringify({
            "firstname": null,
            "lastname": data.lastname,
            "totalprice": data.totalprice,
            "depositpaid": data.depositpaid,
            "bookingdates": {
                "checkin": data.checkin,
                "checkout": data.checkout,
            },
            "additionalneeds": data.additionalneeds
        });
        sleep(1);
        check(http.put(url + `/${data.id}`, payloadInvalidUpdate, headers), {
            'Update fails': (r) => r.status === 400,
        })
        sleep(1);
        let res = http.get(url + `/${data.id}`, headers);
        //let jsonRes = JSON.parse(res.body)
        //console.log("getres firstname " + JSON.parse(res.body).firstname);
        //console.log("before update" + data.firstname);

        check(res, {
            'Firstname is unchanged': (r) => JSON.parse(r.body).firstname === updateName,
        })
    })
}

