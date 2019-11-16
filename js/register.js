var electron = require('electron');
$ = require('jquery')
var ipc = electron.ipcRenderer;
const nodemailer = require('nodemailer');

const register = document.getElementById('register');
const back_login = document.getElementById('back_login');

register.addEventListener('click', function(){
    data = {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val()
    }
    ipc.send('register', data);
});

back_login.addEventListener('click', function(){
    ipc.send('back_login');
});