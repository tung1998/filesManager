$(document).ready( () => {
    $('#login-id').val(localStorage.getItem('ADUserName'));
    $('#login-pass').val(localStorage.getItem('ADPass'));
    if (localStorage.getItem('ADCheck')=='true')
        $('#rememberCheck').prop('checked', true);
    else $('#rememberCheck').prop('checked', false);

});

function loginClick() {
    let data = {
        id    :   $('#login-id').val(),
        pass  :   $('#login-pass').val(),
    }
    $.ajax({
        type : 'post',
        url : '/admin/login',
        data : JSON.stringify(data),
        contentType: "application/json",
        success: (data)=>{
            if (data == 0||data == 3) {
                alertify.error("Wrong id or password")
            }
            else{
                if($('#rememberCheck').prop("checked")) {
                    localStorage.setItem('ADUserName', $('#login-id').val());
                    localStorage.setItem('ADCheck', $('#rememberCheck').prop('checked'));
                    localStorage.setItem('ADPass', $('#login-pass').val());
                    window.location.reload();
                }
                else{
                    localStorage.setItem('ADUserName', $('#login-id').val());
                    localStorage.setItem('ADCheck', $('#rememberCheck').prop('checked'));
                    localStorage.setItem('ADPass', '');
                    window.location.reload();
                }

            }
        }
    })
}
