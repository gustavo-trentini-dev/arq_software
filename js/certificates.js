const electron = require('electron');
const jsPDF = require('jspdf');
$ = require('jquery')
const ipc = electron.ipcRenderer;

let users = null;
let eventos = null;
let usuario = null;
let evento = null;

const generate = document.getElementById('generate');
const logout = document.getElementById('back_login');

logout.addEventListener('click', function () {
    ipc.send('back_login');
})

$(document).ready(function(){
    ipc.send('get_users');
})

generate.addEventListener('click', function(){
    usuario = users[$('#users').val() - 1];
    evento = eventos[$('#events').val() - 1];
    data = {
        usuario_id: usuario.id,
        evento_id: evento.id
    }
    ipc.send('generate_certificate', data);
})

ipc.on('number_certificate', function(data, arg){
    console.log('print certificado', arg.body.id, usuario, evento);
    var doc = new jsPDF({
        orientation: 'landscape',
        unit: 'cm',
        format: 'letter'
    })
    let text = 'Certifica-se que ' + usuario.nome + ' esteve presente no evento de nome ' + evento.name + '<br> no dia ' + evento.data + ' [identificação: ' + arg.body.id + ']'; 
    doc.setFontSize(10);
    doc.text(text, 2, 2)
    doc.save('a4.pdf')
});

ipc.on('set_users', function(data, arg){
    console.log(arg.body)
    users = arg.body;
    fillUsers(arg.body)
})

ipc.on('set_events', function(data, arg){
    console.log('set_events', arg.body);
    eventos = arg.body;
    fillEvents(arg.body);
})

function fillUsers(itens){
    itens.forEach(element => {
        $('#users').append('<option value="' + element.id + '">' + element.nome + '</option>')
    });

    getEvents(parseInt($('#users').val()))
}

function fillEvents(itens){
    clearOptions();
    itens.forEach(element => {
        $('#events').append('<option value="' + element.id + '">' + element.name + '</option>')
    });
}

function clearOptions(){
    $('#events option').each(function(){
        $(this).remove()
    })
}

function getEvents(user){
    ipc.send('get_events_from_user', {usuario_id: user});
}

$('#users').on('change', function(){
    getEvents(parseInt($(this).val()));
})