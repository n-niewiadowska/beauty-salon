# Beauty Salon Website

The website is a full-stack university project for *Front-end Development*, *Databases II* and *Web Protocols* developed in December 2023 and January 2024. 
CSS styles are still in the process of upgrading, but everything else is finished.

### Tech stack

`Figma`  `HTML`  `CSS`  `React/Next`  `TypeScript`

`JavaScript`  `Node`  `Express`  `MongoDB`  `MQTT Broker`

### Description

The project contains front-end, back-end and connection with MongoDB database. It showcases a website for fictional beauty salon, where user can sign up and book an appointment. 
Adding opinions, displaying salon's rating and changing appointment's state is handled with MQTT over WebSocket. 

It also has:

- user authentication with password encryption, JWT and cookies

- roles: user and admin (owner of the salon)

- writing logs to file

- front-end components for picking date, showing statistics etc.

### Run

1. Install HiveMQ Broker (from [here](https://github.com/hivemq/hivemq-community-edition/releases))

2. Install dependencies

For client:

```sh
cd client
npm install create-next-app formik yup mqtt
```

For server:
```sh
cd server
npm install express cors dotenv bcryptjs mqtt mongoose mongoose-type-email body-parser cookie-parser jsonwebtoken
```

3. In server, create `config.env` file and fill the fields below with your own MongoDB connection, server port and JWT token (for user authentication):

```env
MONGO_URI=
PORT=
JWT_TOKEN=
```

4. Replace HiveMQ configuration (`/conf/config.xml`) with `/server/config.xml`.

5. Add starting data to the database (examples in `/start-data`).
                                                                                                                              
6. Run broker (`run.sh` on Linux and `run.bat` on Windows).

6. Run server with `node server.js` or `npm start` and client with `npm run dev` (in their directories).

### Visuals

First draft of some pages' design can be found on [Figma](https://www.figma.com/file/l1yoaZEurH4jm8BdzmViy9/beauty-salon?type=design&node-id=0%3A1&mode=design&t=GYieKUqEu7pqZKEK-1)

*place for some screenshots*
