var frisby = require('frisby');
var domain = 'http://localhost:8080/',
    apiPath = domain + 'api/',
    createUser = domain + 'user',
    deleteUser = apiPath + 'user',
    doesntExist = apiPath + "doNotExist",
    adminAccess = apiPath + "admin/users/all'",
    accessToken = domain + 'login',
    email = 'test@test.test.com',
    password = 'password'

frisby.create('User creation login')
    .post(createUser, {
        email: email,
        password: password
    })
    .expectStatus(204)
    .after(function(err, res, body) {
        frisby.create('Get access token')
            .post(accessToken, {
                email: email,
                password: password,
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
                frisby.create('wrong route')
                    .get(doesntExist)
                    .expectStatus(404)
                    .toss();

                frisby.create('wrong admin access')
                    .get(adminAccess)
                    .expectStatus(403)
                    .after(function(err, res, body) {
                        frisby.create('Delete user')
                            .delete(deleteUser)
                            .expectStatus(204)
                            .toss();
                    })
                    .toss();
            }).toss()
    })
    .toss(); //generates the final Jasmine test spec