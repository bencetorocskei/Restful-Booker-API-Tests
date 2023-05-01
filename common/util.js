
function getRandom(max){
    return Math.floor(Math.random() * max);
}

export let url = 'https://restful-booker.herokuapp.com/booking';
let firstNames = ["B", "Bob", "Billy", "23", "Jacob🤔️", ""]
let lastNames = ["Cool", "D'Angelo", "Thorton", "32", "👿️", ""]
let needs = ["vegetarian", "massage", "early checkin", "breakfast", null];

export let firstname = firstNames[getRandom(firstNames.length-1)];
export let lastname = lastNames[getRandom(lastNames.length-1)];
let additionalneeds = needs[getRandom(needs.length-1)];
let depostipaid = Boolean(getRandom(2) === 1);
let totalprice = getRandom(30, 300);

export let updateName = "update_name";

export let date = new Date().toISOString().slice(0, 10);

export const payloadValid = JSON.stringify({
    "firstname": firstname,
    "lastname": lastname,
    "totalprice": totalprice,
    "depositpaid": depostipaid,
    "bookingdates": {
        "checkin": date,
        "checkout": date,
    },
    "additionalneeds": additionalneeds
});



