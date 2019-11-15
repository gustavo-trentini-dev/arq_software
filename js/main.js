var electron = require('electron');
$ = require('jquery')
var ipc = electron.ipcRenderer;
let user = null;

const logout = document.getElementById('logout');

$(document).ready(function () {
    ipc.send('get_events');
});

ipc.on('events', function (data, arg) {
    drawRow(arg);
})

ipc.on('user', function (event,store) {
    console.log('user', store);
});

function inscribeListener() {
    $('[name^="inscrever"]').on('click', function (e) {
        console.log(user, this.getAttribute('name'))
        // ipc.send(this.getAttribute('name'));
    });
}

logout.addEventListener('click', function () {
    ipc.send('back_login');
})

function drawRow(data) {
    data.forEach(element => {
        console.log(element);
        $('tbody').append('<tr>' +
            '<td>' + element.name + '</td>' +
            '<td>' + element.data + '</td>' +
            '<td><a name="inscrever-' + element.id + '" href="javascript:void(0)">Inscrever</a></td>' +
            '</tr>')
    });

    inscribeListener();
}