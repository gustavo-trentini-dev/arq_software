const port = 4000

const bodyParser = require('body-parser')
const { Client } = require('pg')
const express = require('express')
const server = express()

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'cep',
    password: 'postgres',
    port: 5432,
})
client.connect()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

server.listen(process.env.PORT || port, function () {
    console.log('Listening');
})

server.post('/insertCep', function (req, res) {
    client.query("INSERT INTO enderecos VALUES ($1, $2, $3, $4, $5)", [req.body.cep, req.body.logradouro, req.body.bairro, req.body.cidade, req.body.estado ], (err, resp) => {
        console.log(err, resp)
        if (err) {
            res.end(err.stack)
        } else {
            res.end('INSERT realizado com sucesso')
        }
    })
})