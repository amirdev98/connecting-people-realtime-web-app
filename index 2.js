import express from 'express'

// const url = "https://zoeken.oba.nl/api/v1/search/";


// Maak een nieuwe express app
const app = express()

// Stel in hoe we express gebruiken
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))   

// Stel de afhandeling van formulieren in
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Maak een route voor de index pagina
app.get('/', (request, response) => {

    fetchJson().then((data) => {
        response.render('index', data)
    })
   
})

// Maak een route voor de detail pagina
app.get("/detail", (request, response) => {
    fetchJson().then((data) => {
        response.render('detail', data)
    })
});


app.get('succes', (request, response) => {
    fetchJson().then((data) => {
        response.render('succes', data)
    })
})

// Stel het poortnummer in en start express
app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}
export async function postJson(url, body) {
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .catch((error) => error)
}

