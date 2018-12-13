function ALNotWorkFunction() {
    alertify.alert("Chức năng chưa được cập nhật, quý khách vui lòng sử dụng các chức năng khác");
    return false;
}

function ALActivateUser(id,activate) {
    let userName = $(`#user-row>[idUser='${id}']>.list-view-name`).text()
    if(activate==1){
        alertify.confirm(`Lock account : ${userName}`, function (ev) {
            ev.preventDefault();
            SCActivateUser(id,false)
        }, function(ev) {
            ev.preventDefault();
        });
    }else {
        alertify.confirm(`Active account : ${userName}`, function (ev) {
            ev.preventDefault();
            SCActivateUser(id,true);
        }, function(ev) {
            ev.preventDefault();
        });
    }
}


function ALResetUserPassword(id) {
    let userName = $(`#user-row>[idUser='${id}']>.list-view-name`).text()
    alertify
        .placeholder("Enter Password")
        .defaultValue('')
        .prompt(`Reset Password for ${userName}`, function (newPass, ev) {
            ev.preventDefault();
            if (newPass) {
                SCUserChangePass(id,newPass);
            } else {
                alertify.error('Please enter Password')
                ALResetUserPassword(id)
            }
        }, function (ev) {
            ev.preventDefault();
        });
}


function ALDeleteUser(id) {
    let userName = $(`#user-row>[idUser='${id}']>.list-view-name`).text()
    alertify.confirm(`Delete Account : ${userName}`, function (ev) {
        ev.preventDefault();
        SCDeleteUser(id);
    }, function(ev) {
        ev.preventDefault();
    });
}


function ALDeleteAdmin(id) {
    let userName = $(`#admin-row>[idUser='${id}']>.list-view-name`).text()
    alertify.confirm(`Delete Account : ${userName}`, function (ev) {
        ev.preventDefault();
        SCDeleteAdmin(id);
    }, function(ev) {
        ev.preventDefault();
    });
}