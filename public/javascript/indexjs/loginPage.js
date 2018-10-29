$(document).ready( () => {

});
function loginClick() {
    var data = {
        id    :   $('#login-id').val(),
        pass  :   $('#login-pass').val(),
    }
    console.log(data);
    $.ajax({
        type : 'post',
        url : '/login',
        data : JSON.stringify(data),
        contentType: "application/json",
        success: function(data){
            if (data == 0||data == 3) {
                $('.alert').remove();
                $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                    '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                    '</button>Wrong id or password</div>');
            }
            else if (data == 1) {
                $('.alert').remove();
                $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                    '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                    '</button>Your <strong>Email</strong> hadn\'t been activated' +
                    '<p>Please check your email or <a href="/recorverpw"> <strong>resent a confirm mail</strong></a></p></div>');
            }
            else if(data == 2){
                window.location.replace("/file");
            }
        }
    })
}
