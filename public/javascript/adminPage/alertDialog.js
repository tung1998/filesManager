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