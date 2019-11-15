const port = 3001;
const bodyParser = require('body-parser');
const app = require('express')();
const http = require('http').createServer(app);
const { Client } = require('pg')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

client.connect();

http.listen(process.env.PORT || port, function () {
    console.log('Service Eventos listening on port ' + port);
})

app.post('/events', function (req, res) {
    client.query('SELECT * FROM eventos') // your query string here
          .then(result => res.json(result.rows)) // your callback here
          .catch(e => console.error(e.stack))
})