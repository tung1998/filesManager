$(document).ready( () => {
    $('#login-button').click(()=>{
        var data = {
            id    :   $('#login-id').val(),
            pass  :   $('#register-pass').val(),
        }
        console.log(data);
        $.ajax({
            type : 'post',
            url : '/users/login',
            data : JSON.stringify(data),
            contentType: "application/json",
            success: function(data){
                console.log(data);

            }
        })
    })
});
