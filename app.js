const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow
const request = require('request');
const remote = electron.remote;

var user = null;
var evento = null;

app.on('ready', function(){
    var mainWindow = new BrowserWindow({
        width: 800,
        heigth: 600
    })
    mainWindow.loadURL('file://'+ __dirname +'/views/login.html')
    mainWindow.openDevTools()

    ipc.on('online-status-changed', (event, status) => {
        console.log(status);
    })

    // ABRE CADASTRO DE USUÁRIO
    ipc.on('register_call', function(){
        mainWindow.loadURL('file://' + __dirname + '/views/register.html')
    })
    
    // RETORNA A TELA DE LOGIN
    ipc.on('back_login', function(){
        user = null;
        mainWindow.loadURL('file://' + __dirname + '/views/login.html')  
    })

    // RETORNA A LISTA DE EVENTOS
    ipc.on('back_events', function(event, arg){
        evento = null;
        mainWindow.loadURL('file://' + __dirname + '/views/main.html')
    })

    // ABRE LISTA EVENTOS ONDE O USUÁRIO ESTÁ INSCRITO
    ipc.on('inscribes', function(){
        mainWindow.loadURL('file://' + __dirname + '/views/inscricao.html')
    });

    ipc.on('call_events', function(event, arg){
        mainWindow.loadURL('file://' + __dirname + '/views/events.html')
    });

    // ABRE LISTA DE INSCRITOS NO EVENTO
    ipc.on('participants', function(event, arg){
        evento = arg.evento_id;
        mainWindow.loadURL('file://' + __dirname + '/views/participants.html')
    });

    // ABRE TELA PARA GERAR CERTIFICADOS
    ipc.on('call_certificates', function(){
        mainWindow.loadURL('file://' + __dirname + '/views/certificates.html')
    })

    ipc.on('call_validate', function(){
        mainWindow.loadURL('file://' + __dirname + '/views/validate.html')
    })

    // EFETUA CADASTRO DE USUÁRIO
    ipc.on('register', function(event, arg){
        request({
            uri: 'http://localhost:3000/register',
            body: JSON.stringify(arg),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (error, response){
            console.log(error, response);
            return;
        })
    })
    
    // REALIZA LOGIN E ENCAMINHA PARA LISTA DE EVENTOS
    ipc.on('login', function(event, arg){
        request({
            uri: 'http://localhost:3000/login',
            body: JSON.stringify(arg),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (err, res, body){
            if(JSON.parse(body) != undefined){
                user = JSON.parse(body).id;
                mainWindow.loadURL('file://' + __dirname + '/views/main.html')
            }
        })
    });

    // OBTÉM LISTA DE EVENTOS
    ipc.on('get_events', function(event){
        request({
            uri: 'http://localhost:3001/events',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (err, res, body){
            event.sender.send('events', {body: JSON.parse(body), user_id: user});
        })
    })

    // EFETUA INSCRIÇÃO NO EVENTO
    ipc.on('inscribe', function(event, arg){
        request({
            uri: 'http://localhost:3002/inscribe',
            method: 'POST',
            body: JSON.stringify(arg),
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (err, res, body){
            console.log(body);
        })
    })

    // CANCELA INSCRIÇÃO NO EVENTO
    ipc.on('cancel_inscribe', function(event, arg){
        request({
            uri: 'http://localhost:3002/cancel_inscribe',
            method: 'POST',
            body: JSON.stringify(arg),
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (err, res, body){
            console.log('cancelou inscrição');
            remote.getCurrentWindow().reload();
        })
    })

    // OBTÉM LISTA DE EVENTOS INSCRITO
    ipc.on('get_inscribed_events', function(event, arg){
        request({
            uri: 'http://localhost:3002/inscribes',
            method: 'POST',
            body: JSON.stringify({usuario_id: user}),
            headers: {
                'Content-Type': 'application/json'
            }
        }, function(err, res, body){
            event.sender.send('return_events', {body: JSON.parse(body), user_id: user});
        })
    })

    // OBTÉM LISTA DE PARTICIPANTES DO EVENTO
    ipc.on('get_participants', function(event, arg){
        request({
            uri: 'http://localhost:3002/get_participants',
            method: 'POST',
            body: JSON.stringify({evento_id: evento}),
            headers: {
                'Content-Type': 'application/json'
            }
        }, function(err, res, body){
            event.sender.send('return_participants', {body: JSON.parse(body), evento_id: evento});
        })
    });

    // DÁ A PRESENÇA PARA O PARTICIPANTE
    ipc.on('give_presence', function(event, arg){
        request({
            uri: 'http://localhost:3002/give_presence',
            method: 'POST',
            body: JSON.stringify(arg),
            headers: {
                'Content-Type': 'application/json'
            }
        }, function(err, res, body){
            event.sender.send('confirm_presence');
        })
    });

    // OBTER USUÁRIOS PARA GERAR CERTIFICADOS
    ipc.on('get_users', function(event, arg){
        request({
            uri: 'http://localhost:3003/get_users',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, function(err, res, body){
            event.sender.send('set_users', {body: JSON.parse(body)});
        })
    });

    // OBTER EVENTOS DOS USUÁRIOS PARA GERAR CERTIFICADOS
    ipc.on('get_events_from_user', function(event, arg){
        console.log(arg);
        request({
            uri: 'http://localhost:3003/get_events',
            method: 'POST',
            body: JSON.stringify(arg),
            headers: {
                'Content-Type': 'application/json'
            }
        }, function(err, res, body){
            event.sender.send('set_events', {body: JSON.parse(body)});
        })
    })

    // GERAR CERTIFICADO
    ipc.on('generate_certificate', function(event, arg){
        console.log(arg);
        request({
            uri: 'http://localhost:3003/generate_certificate',
            method: 'POST',
            body: JSON.stringify(arg),
            headers: {
                'Content-Type': 'application/json'
            }
        }, function(err, res, body){
            event.sender.send('number_certificate', {body: JSON.parse(body)});
        })
    })

    // VALIDAR CERTIFICADO
    ipc.on('validate', function(event, arg){
        request({
            uri: 'http://localhost:3003/validate',
            method: 'POST',
            body: JSON.stringify(arg),
            headers: {
                'Content-Type': 'application/json'
            }
        }, function(err, res, body){
            event.sender.send('validator', {body: JSON.parse(body)});
        })
    })

    // CRIAR INSCRIÇÃO RÁPIDA
    ipc.on('quick_inscribe', function(event, arg){
        request({
            uri: 'http://localhost:3001/quick_inscribe',
            method: 'POST',
            body: JSON.stringify(arg),
            headers: {
                'Content-Type': 'application/json'
            }
        }, function(err, res, body){
            event.sender.send('quick_return', body);
        })
    })
})