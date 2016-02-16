//TODO : finish
var frisby = require('frisby');
var domain = 'http://localhost:8080/',
apiPath = domain + 'api/',
googleAccessToken = domain + 'googleLogin',
deleteUser = apiPath + 'user',

token = "your id_token from google";

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