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

app.post('/quick_inscribe', function (req, res) {
    client.query('SELECT id FROM usuarios WHERE email = $1 AND nome = $2', [req.body.email, req.body.nome]) // your query string here
          .then(result => {
              if(result.rows[0] == undefined){
                  usuario_id = createUser(req.body.email, req.body.nome);
              }else{
                usuario_id = result.rows[0].id;
              }
              console.log('usuarioID', usuario_id, 'eventoId', req.body.event);
              res.end(insribe(usuario_id, req.body.event));
            }) // your callback here
          .catch(e => console.error(e.stack))
})

function createUser(email, nome){
    var retorno;
    client.query('INSERT INTO usuarios (email, senha, nome) VALUES ($1, $2, $3) RETURNING id', [email, '123', nome]) // your query string here
          .then(result => retorno = result.rows[0].id) // your callback here
          .catch(e => console.error(e.stack))

          return retorno;
}

function insribe(usuario, evento){
    var retorno;
    client.query('INSERT INTO inscricoes (usuario_id, evento_id, present) VALUES ($1, $2, true)', [usuario, evento]) // your query string here
          .then(retorno = 'Inscrição realizada com sucesso') // your callback here
          .catch(e => retorno = e.stack)

          return retorno;
}