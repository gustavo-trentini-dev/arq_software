var electron = require('electron');
$ = require('jquery')
var ipc = electron.ipcRenderer;
var user = null;

const logout = document.getElementById('logout');
const inscribe = document.getElementById('inscribe');

$(document).ready(function () {
    ipc.send('get_events');
});

inscribe.addEventListener('click', function(){
    ipc.send('inscribes', {usuario_id: user});
})

ipc.on('events', function (data, arg) {
    drawRow(arg.body);
    user = arg.user_id;
})

function inscribeListener() {
    $('[name^="inscrever"]').on('click', function (e) {
        var name = this.getAttribute('name');
        name = parseInt(name.substr(name.indexOf('-')+1));
        ipc.send('inscribe', {event: name, user_id: user});
    });
}

function showParticipants(){
    $('[name^="participantes"]').on('click', function (e) {
        var name = this.getAttribute('name');
        name = parseInt(name.substr(name.indexOf('-')+1));
        ipc.send('participants', {evento_id: name});
    })
}

logout.addEventListener('click', function () {
    ipc.send('back_login');
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
            '<td><a name="participantes-' + element.id + '" href="javascript:void(0)">Participantes</a></td>' +
            '</tr>')
    });

    inscribeListener();
    showParticipants();
}