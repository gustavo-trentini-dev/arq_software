const electron = require('electron');
$ = require('jquery')
const ipc = electron.ipcRenderer;
var evento = null;

const logout = document.getElementById('back_login');
const inscribe = document.getElementById('inscribe');

$(document).ready(function () {
    ipc.send('get_events');
});

logout.addEventListener('click', function () {
    ipc.send('back_login');
})

inscribe.addEventListener('click', function () {
    ipc.send('quick_inscribe', {event: evento, email: getEmail(), nome: getNome()});
});

ipc.on('quick_return', function(data,arg){
    console.log('Events -> ', arg);
    $('#retorno').text(arg);
    $('#retorno').show();
})

ipc.on('events', function (data, arg) {
    console.log(arg.body)
    drawRow(arg.body);
})

function clearTrs(){
    $('tbody tr').each(function(){
        $(this).remove()
    });
}

function drawRow(data) {
    clearTrs();   
    data.forEach(element => {
        $('tbody').append('<tr>' +
            '<td>' + element.name + '</td>' +
            '<td>' + element.data + '</td>' +
            '<td><a name="inscrever-' + element.id + '" href="javascript:void(0)">Inscrever</a></td>' +
            '</tr>')
    });

    inscribeListener();
}

function getEmail(){
    return $('#email').val();
}

function getNome(){
    return $('#nome').val();
}

function inscribeListener() {
    $('[name^="inscrever"]').on('click', function (e) {
        $('#user').show();
        evento = this.getAttribute('name');
        evento = parseInt(evento.substr(evento.indexOf('-')+1));
        console.log(evento);
    });
}