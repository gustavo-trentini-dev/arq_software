var electron = require('electron');
$ = require('jquery')
var ipc = electron.ipcRenderer;
var evento = null;

const back_events = document.getElementById('back_events');

back_events.addEventListener('click', function(){
    ipc.send('back_events');
})

$(document).ready(function(){
    ipc.send('get_participants');
});

ipc.on('return_participants', function(data, arg){
    console.log('return_participants ', arg);
    drawRow(arg.body);
    evento = arg.evento_id;
})

ipc.on('confirm_presence', function(){
    $('#return').show()
    setTimeout(() => {
        $('#return').hide()
    }, 5000);
})

function clearTrs(){
    $('tbody tr').each(function(){
        $(this).remove()
    });
}

function givePresence() {
    $('[name^="present"]').on('click', function (e) {
        var usuario = this.getAttribute('name');
        console.log(usuario);
        usuario = parseInt(usuario.substr(usuario.indexOf('-')+1));
        console.log(usuario);
        ipc.send('give_presence', {evento_id: evento, usuario_id: usuario});
    });
}

function drawRow(data) {
    clearTrs();   
    data.forEach(element => {
        $('tbody').append('<tr>' +
            '<td>' + element.nome + '</td>' +
            '<td><a name="present-' + element.usuario_id +'" href="javascript:void(0)">Presença</a></td>' +
            '</tr>')
    });

    givePresence();
}