export const scenarios = {
    scenarios: {
        smoke: {
            executor: "constant-vus",
            exec: "smoke",
            vus: 1
        },
        load: {
            executor: "ramping-vus",
            exec: "load",
            startVUS: 0,
            startTime: "1m",
            stages: [
                {
                    duration: "1m",
                    target: 50
                },
                {
                    duration: "2m",
                    target: 100
                },
                {
                    duration: "1m",
                    target: 50
                }
            ]
        },
        stress: {
            executor: "ramping-arrival-rate",
            exec: "stress",
            preAllocatedVUs: 500,
            timeUnit: "1s",
            startTime: "5m",
            stages: [
                {
                    duration: "2m",
                    target: 10
                },
                {
                    duration: "2m",
                    target: 50
                },
                {
                    duration: "2m",
                    target: 100
                },
                {
                    duration: "2m",
                    target: 150
                },
                {
                    duration: "2m",
                    target: 200
                }
            ]
        }
    },

    thresholds: {
        "http_req_duration{scenario: load}": ['99 < 275']
    }
};