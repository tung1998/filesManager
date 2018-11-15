$(document).ready( () => {

});


function recoverpw() {
    var data = {
        email    :   $('#email').val(),
    }
    console.log(data);
    $.ajax({
        type : 'post',
        url : '/recoverpw',
        data : JSON.stringify(data),
        contentType: "application/json",
        success: function(data){
            console.log(data)
            if (data=="1"){

                alertify.success(`Send Success, check your email to change new pass word`)
                // $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                //     '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                //     '</button>check your email to receive new pass word</div>');
            }
            else {

                alertify.error(`your email is not being using`)
                // $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                //     '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                //     '</button>your email is not being using</div>');
            }
        }
    })
}