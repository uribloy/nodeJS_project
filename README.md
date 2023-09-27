## nodeJS-hackeru-project

# CardApp Server

## Description

This server is managing business card, create, edit and display business cards.

## Install

Download the project.

**Attention**

This project uses mongoDB server configuration, as local DataBase.
To run it you need to [download](https://www.mongodb.com/try/download/community-kubernetes-operator) and install mongoDB.

### Installing the libraries

```
npm i
```

Create an ".env" file and insert the details as in the ".env.examples" file.

### run the server

```
 // for production
npm run start

 // for devlopment
npm run dev
```

### Installing the seed data

```
npm run seed-db
```

**Attention**
This action reset the Users & Cards collection, and inserts examples users (regular, admin, business) and cards (that are associated with the business user).

## models

### user model

example input by user

```
{
    name: {
        first*: "first",
        middle: "",
        last*:"lastName",
    },
    phone*: "051123456/7",
    email*: "f@l.com",(unique)
    password*:"12345678",
    address: {
        state: "",
        country*:"israel",
        city*: "tlv",
        street*:"hasalom",
        houseNumber*:"25",
        zipCode: "",
    },
    image: {
        url: "example.com/photo.png",
        alt: "image user",
    },
    isBusiness*: true(boolean)
}
```

Other details to save in DB creatd by system

```
{
isAdmin:false(boolean),
_id:"650fe437fd3160feaac2702a",
createdAt:2001-09-11T15:14:39.390+00:00,

//and _id for name, image, address
}
```

### card model

example input by user

```
{
    title*:"title",
    subtitle:"subtitle",
    description*:"Description",
    phone*:"051123456/7",
    email*:"biz@b.com",
    web*:"biz_web.com",
    address: {
        state: "",
        country*:"israel",
        city*: "tlv",
        street*:"hasalom",
        houseNumber*:"25",
        zipCode: "",
    },
    image: {
        url: "example.com/photo.png",
        alt: "image user",
    },
}
```

Other details to save in DB creatd by system

```
{
_id:"650fe437fd3160feaac2702a",
createdAt:2001-09-11T15:14:39.390+00:00,
likes:[],

//and _id for image, address
}
```

## routes

### user route

| No. | URL          | method | Authorization                | action                   | notice       | return          |
| --- | ------------ | ------ | ---------------------------- | ------------------------ | ------------ | --------------- |
| 1.  | /users       | POST   | all                          | register user            | Unique email | User            |
| 2.  | /users/login | POST   | all                          | login                    |              | Encrypted token |
| 3.  | /users       | GET    | admin                        | Get all                  |              | Array of users  |
| 4.  | /users/:id   | GET    | The registered user or admin | Get user                 |              | User            |
| 5.  | /users/:id   | PUT    | The registered user          | Edit user                |              | User            |
| 6.  | /users/:id   | PATCH  | The registered user          | Change isBusiness status |              | User            |
| 7.  | /users/:id   | DELETE | The registered user or admin | Delete User              |              | Deleted User    |

### card route

| No. | URL                        | method | Authorization                           | action            | return         |
| --- | -------------------------- | ------ | --------------------------------------- | ----------------- | -------------- |
| 1.  | /cards                     | GET    | all                                     | All cards         | card           |
| 2.  | /cards/my-cards            | GET    | The registered user                     | Get User Cards    | Array of cards |
| 3.  | /cards/:id                 | GET    | all                                     | Get card          | card           |
| 4.  | /cards                     | POST   | business users                          | create new card   | card           |
| 5.  | /cards/:id                 | PUT    | The users who created the card          | Edit card         | card           |
| 6.  | /cards/:id                 | PATCH  | A registered user                       | add/sub Like card | card           |
| 7.  | /cards/:id                 | DELETE | The users who created the card or admin | Delete card       | Deleted card   |
| 8.  | /cards/changeBizNumber/:id | PATCH  | admin                                   | change bizNumber  | card           |

## Technologies & Libraraies

- "nodemon": for development purposes
- "bcrypt": password encryption
- "chalk": coloring console messages
- "config": configuration
- "cors": cors policy
- "dotenv": environment variables
- "express": requests routing
- "joi": validation
- "jsonwebtoken": managing web tokens
- "lodash": various helper functions
- "mongoose": managing mongoDB
- "morgan": logging response messages
