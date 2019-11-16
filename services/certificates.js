const port = 3003;
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
    console.log('Service certificados listening on port ' + port);
})

app.post('/get_users', function (req, res) {
    client.query('SELECT * FROM usuarios') // your query string here
          .then(result => res.json(result.rows)) // your callback here
          .catch(e => console.error(e.stack))
})

app.post('/get_events', function (req, res) {
    client.query('SELECT e.* FROM inscricoes AS i INNER JOIN eventos as e ON i.evento_id = e.id WHERE usuario_id = $1', [req.body.usuario_id]) // your query string here
          .then(result => res.json(result.rows)) // your callback here
          .catch(e => console.error(e.stack))
})

app.post('/generate_certificate', function (req, res) {
    client.query('INSERT INTO certificados (usuario_id, evento_id) VALUES ($1, $2) RETURNING *', [req.body.usuario_id, req.body.evento_id]) // your query string here
          .then(result => res.json(result.rows[0])) // your callback here
          .catch(e => console.error(e.stack))
})

app.post('/validate', function (req, res) {
    console.log('validate service: ', req.body.number);
    client.query('SELECT COUNT(1) FROM certificados WHERE id = $1', [req.body.number]) // your query string here
          .then(result => res.json(result.rows[0])) // your callback here
          .catch(e => console.error(e.stack))
})