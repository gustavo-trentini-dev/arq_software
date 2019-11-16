const electron = require('electron');
$ = require('jquery')
const ipc = electron.ipcRenderer;

const validate = document.getElementById('validate');
const logout = document.getElementById('back_login');

logout.addEventListener('click', function () {
    ipc.send('back_login');
})
validate.addEventListener('click', function(){
    ipc.send('validate', {number: $('#number').val()})
})

ipc.on('validator', function(data, arg){
    if(arg.body.count == 1){
        $('#valid').show();
        setTimeout(() => {
            $('#valid').hide();            
        }, 5000);
    }else{
        $('#invalid').show();
        setTimeout(() => {
            $('#invalid').hide();            
        }, 5000);
    }
})