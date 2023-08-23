npm install -> npm start

check API with Postman:

  login userName: admin, password: 123456 in order to have full permissions
  login userName: user1, password: 123456 have limit permissions

  copy access_token to pass check bearer token on header for the requested permissions

  choose api, method, body or params what needs to be done

  #example: API Create a new store
    - login method POST, api http://localhost:5000/api/v1/auth/login -> send -> copy access_token
    - method POST, api http://localhost:5000/api/v1/stores -> Authorization - Bearrer token - paste access_token -> Body - Raw - Json:
  {
  "_id": {
    "$oid": "64871701c7573fac797f83ea"
  },
  "storeName": "coffeestore",
  "phoneNumber": "0909000123",
  "address": "quan 1, TPHCM",
  "description": "Thanh lap nam 2018. Chuyen cung cap si le ca phe nguyen chat dong doi",
  "logo": "coffeestore.png",
  "createdBy": {
    "_id": "64e2d0a218f2ee655e1732cf",
    "userName": "admin"
  },
  "isDeleted": false,
  "deletedAt": null,
  "createdAt": {
    "$date": {
      "$numberLong": "1686574849558"
    }
  },
  "updatedAt": {
    "$date": {
      "$numberLong": "1686574849558"
    }
  },
  "__v": 0
}
-> Send
  

  

check API with Swagger: http://localhost:5000/api


