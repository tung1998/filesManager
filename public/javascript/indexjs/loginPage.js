$(document).ready( () => {
    $('#login-id').val(localStorage.getItem('userName'));
    $('#login-pass').val(localStorage.getItem('Pass'));
    if (localStorage.getItem('check')=='true')
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
        url : '/login',
        data : JSON.stringify(data),
        contentType: "application/json",
        success: (data)=>{
            if (data == 0||data == 3) {
                alertify.error("Wrong id or password")
                // $('.alert').remove();
                // $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                //     '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                //     '</button>Wrong id or password</div>');
            }
            else if (data == 1) {
                alertify.log(`Your Email hadn't been activated \n\r Click hear to resent a confirm mail \n\r `,(ev) => {
                    window.location.replace("/resendconfirmmail");
                })
                // $('.alert').remove();
                // $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                //     '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                //     '</button>Your <strong>Email</strong> hadn\'t been activated' +
                //     '<p>Please check your email or <a href="/resendconfirmmail"> <strong>resent a confirm mail</strong></a></p></div>');
            }
            else{
                if($('#rememberCheck').prop("checked")) {
                    localStorage.setItem('userName', $('#login-id').val());
                    localStorage.setItem('check', $('#rememberCheck').prop('checked'));
                    localStorage.setItem('Pass', $('#login-pass').val());
                    window.location.reload();
                    // window.location.replace(`/${data}`);
                }
                else{
                    localStorage.setItem('userName', $('#login-id').val());
                    localStorage.setItem('check', $('#rememberCheck').prop('checked'));
                    localStorage.setItem('Pass', '');
                    // window.location.replace(`${data}`);
                    window.location.reload();
                }

            }
        }
    })
}
