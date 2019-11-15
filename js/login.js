var electron = require('electron');
$ = require('jquery')
var ipc = electron.ipcRenderer;

const register_call = document.getElementById('register_call');
const login = document.getElementById('login');

login.addEventListener('click', function(){
    data = {
        email: $('#email').val(),
        password: $('#password').val()
    }
    console.log('is here login')
    ipc.send('login', data);
});

register_call.addEventListener('click', function(){
    ipc.send('register_call');
});
