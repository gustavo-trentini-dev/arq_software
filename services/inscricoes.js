const port = 3002;
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
    console.log('Service Inscricoes listening on port ' + port);
})

app.post('/inscribe', function (req, res) {
    console.log(req.body);
    client.query("INSERT INTO inscricoes (evento_id, usuario_id) VALUES ($1, $2)", [req.body.event, req.body.user_id])
          .then(result => console.log('Inscrição confirmada')) // your callback here
          .catch(e => console.error(e.stack))
})

app.post('/inscribes', function (req, res) {
    client.query('SELECT e.name, e.data, i.evento_id  FROM inscricoes AS i INNER JOIN eventos AS e ON i.evento_id = e.id WHERE usuario_id = $1', [req.body.usuario_id]) // your query string here
          .then(result => res.json(result.rows)) // your callback here
          .catch(e => console.error(e.stack))
})

app.post('/cancel_inscribe', function (req, res) {
    client.query('DELETE FROM inscricoes WHERE evento_id = $1 AND usuario_id = $2', [req.body.evento_id, req.body.usuario_id]) // your query string here
          .then(result => console.log('Inscrição cancelada')) // your callback here
          .catch(e => console.error(e.stack))
})

app.post('/get_participants', function (req, res) {
    client.query('SELECT e.name, u.nome, i.usuario_id, i.evento_id  FROM inscricoes AS i INNER JOIN eventos AS e ON (i.evento_id = e.id) INNER JOIN usuarios AS u ON (i.usuario_id = u.id) WHERE i.evento_id = $1', [req.body.evento_id]) // your query string here
          .then(result => res.json(result.rows)) // your callback here
          .catch(e => console.error(e.stack))
});

app.post('/give_presence', function (req, res) {
    console.log('give presence', req.body);
    client.query('UPDATE inscricoes SET present = TRUE WHERE evento_id = $1 AND usuario_id = $2', [req.body.evento_id, req.body.usuario_id]) // your query string here
          .then(result => res.end('Presença dada tio')) // your callback here
          .catch(e => console.error(e.stack))
});