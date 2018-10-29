$(document).ready( () => {

});


function recoverpw() {
    var data = {
        email    :   $('#email').val(),
    }
    console.log(data);
    $.ajax({
        type : 'post',
        url : '/users/recoverpw',
        data : JSON.stringify(data),
        contentType: "application/json",
        success: function(data){
            if (data=="1"){
                $('.alert').remove();
                $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                    '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                    '</button>check your email to receive new pass word</div>');
            }
            else {
                $('.alert').remove();
                $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                    '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                    '</button>your email is not being using</div>');
            }
        }
    })
}