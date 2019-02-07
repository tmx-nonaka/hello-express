const express = require('express')
const app = express()

app.get('/', (req, res) => res.send(message()))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

function message() {
	return "Hello World!"
}
