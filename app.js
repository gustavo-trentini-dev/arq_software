const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow
const request = require('request');

app.on('ready', function(){
    var mainWindow = new BrowserWindow({
        width: 800,
        heigth: 600
    })
    mainWindow.loadURL('file://'+ __dirname +'/login.html')
    mainWindow.openDevTools()

    ipc.on('register_call', function(){
        mainWindow.loadURL('file://' + __dirname + '/register.html')
    })

    ipc.on('back_login', function(){
        mainWindow.loadURL('file://' + __dirname + '/login.html')
    })

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

    ipc.on('login', function(event, arg){
        console.log('login server');
        request({
            uri: 'http://localhost:3000/login',
            body: JSON.stringify(arg),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (err, res, body){
            if(JSON.parse(body) != undefined){
                console.log('LOGIN LOCO: ', JSON.parse(body).id);
                event.sender.send('user', JSON.parse(body).id);
                mainWindow.loadURL('file://' + __dirname + '/main.html')
            }
        })
    });

    ipc.on('get_events', function(event){
        request({
            uri: 'http://localhost:3001/events',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (err, res, body){
            event.sender.send('events', JSON.parse(body));
        })
    })

})