var electron = require('electron');
$ = require('jquery')
var ipc = electron.ipcRenderer;
var nodemailer = require('nodemailer');

const register_call = document.getElementById('register_call');
const login = document.getElementById('login');
const certificates = document.getElementById('certificates');
const validate = document.getElementById('validate');
const email = document.getElementById('email');
const events = document.getElementById('events');

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
    enviarEmail();
});

events.addEventListener('click', function(){
    ipc.send('call_events');
});

function enviarEmail() {
    nodemailer.createTestAccount((err, account) => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'rhea.trantow95@ethereal.email',
                pass: 'q91Jz5n3uc1sxXbhWz'
            }
        });
    });

    var mailOptions = {
        from: '"Teste" <rhea.trantow95@ethereal.email>',
        to: 'gustavo.trentini@universo.univates.br',
        subject: 'Testing Nodemailer',
        text: 'Hi, this is a Nodemailer test email ;) ', 
        html: '<b> Hi </b><br> this is a Nodemailer test email'
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}
