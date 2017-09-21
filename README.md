# REST-API

Simple-REST-API is a express REST API working with MongoDB and providing users managment with JWT (JSON Web Token) 
## Set up 
1. Install Node js : https://nodejs.org/en/ 
2. Install MongoDB : https://www.mongodb.org/
3. In cmd type ```npm install``` to load all dependencies
4. Enter the righ path for MongoDB in config.js
5. Run ```npm start```

## Testing
Spec folder contain all test to run using the command ```npm test```. Test use Frsiby, a REST API Endpoint Testing built on Jasmine.
You can test google authentification by modifying the token_id in google-auth-spec.js
```javascript 
var token = "your id_token from google"; 
```
You can get a correct token on https://developers.google.com/oauthplayground/ with https://www.googleapis.com/auth/userinfo.profile as scope
