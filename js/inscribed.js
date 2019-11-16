var electron = require('electron');
$ = require('jquery')
var ipc = electron.ipcRenderer;
var user = null;

const back_events = document.getElementById('back_events');

back_events.addEventListener('click', function(){
    ipc.send('back_events');
})

$(document).ready(function () {
    ipc.send('get_inscribed_events');
});

ipc.on('return_events', function(data, arg){    
    drawRow(arg.body);
    user = arg.user_id;
});

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
            '<td><a name="cancelar-' + element.evento_id + '" href="javascript:void(0)">Cancelar</a></td>' +
            '</tr>')
    });

    cancelInscribe();
}

function cancelInscribe() {
    $('[name^="cancelar"]').on('click', function (e) {
        var name = this.getAttribute('name');
        name = parseInt(name.substr(name.indexOf('-')+1));
        ipc.send('cancel_inscribe', {evento_id: name, usuario_id: user});
    });
}