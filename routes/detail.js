import { fetchJson, postJson } from '../helpers/fetchWrapper.js'

import express from 'express'



const locatie = express.Router()

// Haal de gegevens van één member op
locatie.get('/', (request, response) => {
  const id = request.query.id || null   
  const url = `${process.env.API_URL}/member/?id=${id}`

  fetchJson(url).then((data) => {
    response.render('locatie', data)
  })
})