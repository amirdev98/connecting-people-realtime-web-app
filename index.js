import express from "express";

const url = "https://api.oba.fdnd.nl/api/v1/vestigingen";
const urlDefault = "?first=100";

// Maak een nieuwe express app
const app = express();

// Stel in hoe we express gebruiken
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Stel de afhandeling van formulieren in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Maak een route voor de index pagina en haalt data uit de api 
app.get('/', (request, response) => {
  const vestigingUrl = url + urlDefault;


    fetchJson(vestigingUrl).then((data) => {
    
        response.render('index', {vestigingen: data.vestigingen})
    })
   
})


// set up van bodyparser om te redirecten naar de success.ejs pagina
import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/reserveren", (request, response) => {
  fetchJson().then((data) => {
    response.render("reserveren", data);
  });
});

// Maak een route voor de detail pagina
app.get("/detail", async (request, response) => {
  let id = request.query.id; 
  const uniqueUrl = url + "?id=" + id;

    const data = await fetch(uniqueUrl)
        .then((response) => response.json())
        .catch((err) => err);

    response.render("detail", data.vestigingen[0]); 
});

//Hiermee reserveer ik en stuur ik data naar de API
app.post('/success', (request, response) => {
  //De gestuurde data gaat naar de volgende URL:
  const postUrl = 'https://api.oba.fdnd.nl/api/v1/'
  const url = `${postUrl}studieplekReserveringen`

  const newDate = new Date(request.body.beginTijd);
  request.body.beginTijd = newDate;

  postJson(url, request.body).then((data) => {
    let newStudiePlekReservering = { ... request.body }

    //In de data zit een data.id Hiermee check ik of er een ID aanwezig is voor een studieplek dat nog niet geresereerd is.
    if (data.data.id) {
      response.redirect('success') 
    } else {
      //Als het boek al gereserveerd is dan heeft data.data.id geen id meer en krijg je dus een error message.
      console.log("errorrrs")
        const errormessage = `${data.message}: Mogelijk komt dit door het id die al bestaat.`;
        const newData = {
          error: errormessage,
          values: newStudiePlekReservering,
        };
        //hiermee stuur ik de gebruiker daar de error pagina.
        response.render("error", newData);
      }
      //console.log(JSON.stringify(data.id));
  })
})

// Maak een route voor de succes pagina
app.get('/success', (request, response) => {
  fetchJson().then((data) => {
      response.render('success', data)
  })
})

app.get('/contact', (request, response) => {
  fetchJson().then((data) => {
      response.render('contact', data)
  })
})

// Stel het poortnummer in en start express
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});

/**
 * Wraps the fetch api and return s the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
}
export async function postJson(url, body) {
  return await fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => error);
}








/* Losjes gebaseerd op https://socket.io/get-started/chat */


import * as path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'http'

const http = createServer(app)
const ioServer = new Server(http, {
  connectionStateRecovery: {
    // De tijdsduur voor recovery bij disconnect
    maxDisconnectionDuration: 2 * 60 * 1000,
    // Of middlewares geskipped moeten worden bij recovery (ivm login)
    skipMiddlewares: true,
  },
})
const port = process.env.PORT || 4242
const historySize = 50

let history = []

// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))

// Start de socket.io server op
ioServer.on('connection', (client) => {
  // Log de connectie naar console
  console.log(`user ${client.id} connected`)

  // Stuur de history
  client.emit('history', history)

  // Luister naar een message van een gebruiker
  client.on('message', (message) => {
    // Check de maximum lengte van de historie
    while (history.length > historySize) {
      history.shift()
    }
    // Voeg het toe aan de historie
    history.push(message)

    // Verstuur het bericht naar alle clients
    ioServer.emit('message', message)
  })

  // Luister naar een disconnect van een gebruiker
  client.on('disconnect', () => {
    // Log de disconnect
    console.log(`user ${client.id} disconnected`)
  })
})

// Start een http server op het ingestelde poortnummer en log de url
http.listen(port, () => {
  console.log('listening on http://localhost:' + port)
})