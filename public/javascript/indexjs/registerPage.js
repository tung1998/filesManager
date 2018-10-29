$(document).ready( () => {
    // $('#register-button').click(()=>{
    //     var data = {
    //         email: $('#register-email').val(),
    //         id: $('#register-id').val(),
    //         pass: $('#register-pass').val(),
    //     }
    //     console.log(data.email.split("@"));
    //     if((data.email.split("@").length==2)&&data.id&&data.pass&&data.email!="@") {
    //         $.ajax({
    //             type: 'post',
    //             url: '/api/register',
    //             data: JSON.stringify(data),
    //             contentType: "application/json",
    //             success: function (data) {
    //                 console.log(data);
    //             }
    //         })
    //     }else console.log(false);
    // })


});
function registerClick() {
    var data = {
        email: $('#register-email').val(),
        id: $('#register-id').val(),
        pass: $('#register-pass').val(),
    }
    // console.log(data.email.split("@"));
    if (checkform(data)) {
        $.ajax({
            type: 'post',
            url: '/register',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                if (data == 1) {
                    $('form').empty();
                    $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                        '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                        '</button>Instructions will be sent to you! Please check <strong>your Email</strong> to confirm</div>');
                }
                else if (data == 2) {
                    $('.alert').remove();
                    $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                        '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                        '</button>Your <strong>Email</strong> had been using' +
                        '<p>get back your password<a href="/recorverpw"> <strong> hear </strong></a></p></div>');
                }
                else if (data == 3) {
                    $('.alert').remove();
                    $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                        '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                        '</button>Your <strong>Email</strong> hadn\'t been activated' +
                        '<p>Please check your email or <a href="/recorverpw"> <strong>resent a confirm mail</strong></a></p></div>');
                }
                else if (data == 4) {
                    $('.alert').remove();
                    $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                        '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                        '</button>Your <strong>UserName</strong> had been using' +
                        '<p>Please choose other<strong> UserName </strong></p></div>');
                }
            }
        })
    } else console.log(false);
}
function checkform(data) {
    if (data.pass!=$('#confirm-pass').val()) {
        // console.log(data.pass + $('#confirm-pass').val())
        $('.alert').remove();
        $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
            '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
            '</button> Your confirm password is wrong </div>');
        return 0;
    }
    else if ((data.email.split("@").length != 2) || !data.id || !data.pass || data.email == "@") {
        // console.log(2)
        return 0;
    }
    else if ($('#acceptCheck:checked').length==0) {
        // console.log(3)
        $('.alert').remove();
        $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
            '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
            '</button> Please accept Terms and Conditions </div>');
        return 0;
    }
    else return 1;
}