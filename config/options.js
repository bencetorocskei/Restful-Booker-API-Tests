export let options = {
    scenarios: {
        smoke: {
            executor: "constant-vus",
            exec: "smoke",
            vus: 1,
            duration: "1m"
        }
    },
    thresholds: {
        "http_req_duration": [ "p(95)<4000" ]
    }
}