const express = require('express')
const app = express()

var util = require('./calc.js')

app.get('/', (req, res) => res.send(util.message()))
app.get('/add', (req, res) => res.send("sum: "+util.add(req.query.x, req.query.y)))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
