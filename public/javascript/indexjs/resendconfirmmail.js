$(document).ready( () => {

});


function resendconfirmmail() {
    var data = {
        email    :   $('#email').val(),
    }
    console.log(data);
    $.ajax({
        type : 'post',
        url : '/resendconfirmmail',
        data : JSON.stringify(data),
        contentType: "application/json",
        success: function(data){
            console.log(data);
            if(data=='0') {
                alertify.error(`Wrong email`)
            }else alertify.success("SUCCESS")

        }
    })
}