const usersData = [
  {
    "name": {
      "first": "John",
      "last": "Doe",
    },
    "phone": "0501111111",
    "email": "john_doe@gmail.com",
    "password": "Aa123456&",
    "isBusiness": false,
    "isAdmin": false,
    "address": {
      "state": "New York",
      "country": "USA",
      "city": "New York",
      "street": "Main Street",
      "houseNumber": "30",
    },
  },
  {
    "name": {
      "first": "Israel",
      "last": "Israeli",
    },
    "phone": "0503333333",
    "email": "israel_israeli@gmail.com",
    "password": "Aa123456&",
    "isBusiness": true,
    "isAdmin": true,
    "address": {
      "state": "",
      "country": "Israel",
      "city": "Tel Aviv",
      "street": "Frishman",
      "houseNumber": "20",
    },
  },
  {
    "name": {
      "first": "Jane",
      "last": "Doe",
    },
    "phone": "0502222222",
    "email": "jane_doe@gmail.com",
    "password": "Aa123456&",
    "isBusiness": true,
    "isAdmin": false,
    "address": {
      "state": "California",
      "country": "USA",
      "city": "Los Angeles",
      "street": "Main Street",
      "houseNumber": "10",
    },
  },
];

const cardsData = [
  {
    "title": "Card1 Title",
    "subtitle": "Card1 subTitle",
    "description": "Card1 Description",
    "phone": "0504444444",
    "email": "biz1@biz.com",
    "web": "biz1_web.site",
    "address": {
      "state": "California",
      "country": "USA",
      "city": "Los Angeles",
      "street": "Main Street",
      "houseNumber": "10",
    },
  },
  {
    "title": "Card2 Title",
    "subtitle": "Card2 subTitle",
    "description": "Card2 Description",
    "phone": "0505555555",
    "email": "biz2@biz.com",
    "web": "biz2_web.site",
    "address": {
      "state": "California",
      "country": "USA",
      "city": "Los Angeles",
      "street": "Main Street",
      "houseNumber": "10",
    },
  },
  {
    "title": "Card3 Title",
    "subtitle": "Card3 subTitle",
    "description": "Card3 Description",
    "phone": "0506666666",
    "email": "biz3@biz.com",
    "web": "biz3_web.site",
    "address": {
      "state": "California",
      "country": "USA",
      "city": "Los Angeles",
      "street": "Main Street",
      "houseNumber": "10",
    },
  },
];

module.exports = {
  usersData,
  cardsData,
};
