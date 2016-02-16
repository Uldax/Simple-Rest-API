//TODO : finish
var frisby = require('frisby');
var domain = 'http://localhost:8080/',
apiPath = domain + 'api/',
googleAccessToken = domain + 'googleLogin',
deleteUser = apiPath + 'user',

token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNhMTJmNTM4Zjc3ODAzMWM1MDBmMjFlNDgzYTQ2OGRhMTljMzUwMTAifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhdWQiOiIxMDcyNDYzNzM4MjU4LWRzNG51NWhlYzA3ZXU1a3NrN3BlMnVjZDNjbjVkMWZpLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAyOTE3NDM5NDY3NDg3ODgyNjQxIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjEwNzI0NjM3MzgyNTgtdmQ3dnEwcGJrZTVtc2RxODB1N2J1ZnNybWs0NnVkOGguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJlbWFpbCI6InRlc3RwaG9uZTI3MDlAZ21haWwuY29tIiwiaWF0IjoxNDU1NTk3NTgxLCJleHAiOjE0NTU2MDExODEsIm5hbWUiOiJ0ZXN0IHBob25lIiwiZ2l2ZW5fbmFtZSI6InRlc3QiLCJmYW1pbHlfbmFtZSI6InBob25lIiwibG9jYWxlIjoiZnIifQ.P_chyGoxuxRvEXrpRVwW53BQ7iGF2S5iMG3aDXxwaDc3hVWhdfxnauq_YBu0t8xI1uDgDMxGjFu9tdrXnhOgNe1iSi36MsVVP9SNX2oSEdf4aMO3l_IzjyQ_g8ABLAGkYNqVLpEBiytoVeELYuMfJc038eU_fkMORkqSnZhcCgbj7qG29kO_6jglwIiX5WISWP7FImC6GRB99l3qx8KYqL7auriRWlWKR6VboUx6R9S5t-bg1Ew8dVxcD1YiJm76FCZqtNv7bt1sVKKj7JbvD4C1PpctOkUJU32J4iOvEZptUAGLB46ZNnWZ4IdzqkakM6-frV-tBfCga2gC5VB0gg";

frisby.create('Get access token from google token')
    .post(googleAccessToken, {
        token: token
    })
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes({
        token: String,
        user: Object
    })
    .afterJSON(function(json) {
        /* include auth token in the header of all future requests */
        frisby.globalSetup({
            request: {
                headers: {
                    'x-access-token': json.token
                }
            }
        });
        frisby.create('Delete user')
            .delete(deleteUser)
            .expectStatus(204)
            .toss();
    }).toss()