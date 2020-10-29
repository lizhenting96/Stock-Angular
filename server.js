const express = require('express')
const fetch = require('node-fetch')
var cors = require('cors')
const port = process.env.PORT || 8080

const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// route: Get Company Description
app.get('/getdescription/:ticker', (req, res) => {
  var ticker = req.params.ticker
  fetch(`https://api.tiingo.com/tiingo/daily/${ticker}?token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: Get Latest Price
app.get('/getlatestprice/:ticker', (req, res) => {
  var ticker = req.params.ticker
  fetch(`https://api.tiingo.com/iex/?tickers=${ticker}&token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: Get chart data for last open day
app.get('/getdaily/:ticker/:date', (req, res) => {
  var ticker = req.params.ticker
  var date = req.params.date
  fetch(`https://api.tiingo.com/iex/${ticker}/prices?startDate=${date}&resampleFreq=4min&columns=open,high,low,close,volume&token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: Get Historical Data
app.get('/gethistory/:ticker', (req, res) => {
  var ticker = req.params.ticker
  var date = new Date()
  date.setFullYear(date.getFullYear() - 2)
  var curDateStr = new Intl.DateTimeFormat('fr-ca', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(date)
  fetch(`https://api.tiingo.com/tiingo/daily/${ticker}/prices?startDate=${curDateStr}&token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: Get News
app.get('/getnews/:ticker', (req, res) => {
  var ticker = req.params.ticker
  fetch(`https://newsapi.org/v2/everything?q=${ticker}&apiKey=22b387547ec4439ea92f58065a1db39d`)
  .then(result => result.json())
  .then(body => res.json(body))
})
// route: Autocomplete
app.get('/autocomplete/:input', (req, res) => {
  var input = req.params.input
  fetch(`https://api.tiingo.com/tiingo/utilities/search?query=${input}&token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})