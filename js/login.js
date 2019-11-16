var electron = require('electron');
$ = require('jquery')
var ipc = electron.ipcRenderer;
var nodemailer = require('nodemailer');

const register_call = document.getElementById('register_call');
const login = document.getElementById('login');
const certificates = document.getElementById('certificates');
const validate = document.getElementById('validate');
const email = document.getElementById('email');

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

certificates.addEventListener('click', function(){
    ipc.send('call_certificates');
});

validate.addEventListener('click', function(){
    ipc.send('call_validate')
})

email.addEventListener('click', function(){
    sendEMail();
});

function sendEMail() {
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gustavo.trentini@universo.univates.br',
        pass: '456z2B*K'
    }
    });

    var mailOptions = {
        from: 'gustavo.trentini@universo.univates.br',
        to: 'gtrentini@outlook.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}