// const serverless = require('serverless-http');
const express = require('express')
const fetch = require('node-fetch')
var cors = require('cors')
const port = process.env.PORT || 8081

const app = express()
app.use(cors())
app.use(express.static(process.cwd()+"/my-app/dist/my-app/"));

// route: Get Company Description
app.get('/api/getdescription/:ticker', (req, res) => {
  var ticker = req.params.ticker
  fetch(`https://api.tiingo.com/tiingo/daily/${ticker}?token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: Get Latest Price
app.get('/api/getlatestprice/:ticker', (req, res) => {
  var ticker = req.params.ticker
  fetch(`https://api.tiingo.com/iex/?tickers=${ticker}&token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: Get chart data for last open day
app.get('/api/getdaily/:ticker/:date', (req, res) => {
  var ticker = req.params.ticker
  var date = req.params.date
  fetch(`https://api.tiingo.com/iex/${ticker}/prices?startDate=${date}&resampleFreq=4min&columns=open,high,low,close,volume&token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: Get Historical Data
app.get('/api/gethistory/:ticker', (req, res) => {
  var ticker = req.params.ticker
  var date = new Date()
  date.setFullYear(date.getFullYear() - 2)
  var curDateStr = new Intl.DateTimeFormat('fr-ca', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(date)
  fetch(`https://api.tiingo.com/tiingo/daily/${ticker}/prices?startDate=${curDateStr}&token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: Get News
app.get('/api/getnews/:ticker', (req, res) => {
  var ticker = req.params.ticker
  fetch(`https://newsapi.org/v2/everything?q=${ticker}&apiKey=22b387547ec4439ea92f58065a1db39d`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: Autocomplete
app.get('/api/autocomplete/:input', (req, res) => {
  var input = req.params.input
  fetch(`https://api.tiingo.com/tiingo/utilities/search?query=${input}&token=c6f1c961e0a39fc4cb1315782a41a40e354f03c4`)
  .then(result => result.json())
  .then(body => res.json(body))
})

// route: send all endpoints in a table
app.get('/api/getallapis', (req, res) => {
  res.send(
    `<table style="width:60%" align="center">
    <tbody><tr>
      <td><a href="/api/getdescription/aapl">End Point for Commpany Description</a></td>
    </tr>
    <tr>
      <td><a href="/api/getlatestprice/aapl">End Point for Latest Price</a></td>
    </tr>
    <tr>
      <td><a href="/api/getdaily/aapl/2020-11-4">End Point for Daily Chart data (Example date: 2020-11-4)</a></td>
    </tr>
    <tr>
      <td><a href="/api/gethistory/aapl">End Point for Historical data</a></td>
    </tr>
    <tr>
      <td><a href="/api/getnews/aapl">End Point for News</a></td>
    </tr>
    <tr>
      <td><a href="/api/autocomplete/aap">End Point for Autocomplete (Example Input: "aap")</a></td>
    </tr>
    </tbody></table>`
  )
})
// 404 return to home page
app.get('*', (req, res) => {
  res.sendFile(process.cwd()+"/my-app/dist/my-app/index.html")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
// module.exports.handler = serverless(app);