const port = 3000;
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
    console.log('Service usuarios listening on port ' + port);
})

app.get('/', function(req, res){
    res.sendFile('/home/gustavo.trentini/Documentos/arq_software/index.html');
});

app.post('/register', function(req, res){
    client.query("INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)", [req.body.name, req.body.email, req.body.password])
          .then(result => console.log('Usuário criado'))
          .catch(e => console.error(e.stack))
});

app.post('/login', function (req, res) {
    client.query('SELECT * FROM usuarios WHERE email LIKE $1 and senha LIKE $2', [req.body.email, req.body.password]) // your query string here
          .then(result => res.json(result.rows[0])) // your callback here
          .catch(e => console.error(e.stack))
})