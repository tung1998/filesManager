function SCGetUserData() {
    $.ajax({
        url: `/admin/getUserData`,
        type: 'post',
        contentType: "application/json",
        success: function (data) {
            if (data.status != 0) {
                adminPageData.status=1;
                adminPageData.userData = data;
                console.log(data);
                CRUserData(data);
            }else alertify.error('ERROR')
        }
    })
}

function SCGetFileData() {
    $.ajax({
        url: `/admin/getFileData`,
        type: 'post',
        contentType: "application/json",
        success: function (data) {
            if (data.status != 0) {
                adminPageData.status=2;
                adminPageData.folderData = data;
                console.log(data);
                CRFileData(data);
            }else alertify.error('ERROR')
        }
    })
}

function SCGetAdminData() {
    $.ajax({
        url: `/admin/getAdminData`,
        type: 'post',
        contentType: "application/json",
        success: function (data) {
            if (data.status != 0) {
                adminPageData.adminData=data;
                adminPageData.status=3;
                console.log(data);
                CRAdminData(data);
            }else alertify.error('ERROR')
        }
    })
}

function SCActivateUser (id,activate) {
    let data={
        id:id,
        activate:activate
    }
    $.ajax({
        url: `/admin/userManager/activate`,
        type: 'post',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data) {
            if(data.status){
                alertify.success('SUCCESS');
                if(activate){
                    $(`#user-row`).find(`[idUser='${id}']`).attr('activate',1);
                    $(`#user-row`).find(`[idUser='${id}']>.list-view-activate`).removeClass("mdi-close-circle");
                    $(`#user-row`).find(`[idUser='${id}']>.list-view-activate`).addClass("mdi-check-circle");
                }else {
                    $(`#user-row`).find(`[idUser='${id}']`).attr('activate',0);
                    $(`#user-row`).find(`[idUser='${id}']>.list-view-activate`).removeClass("mdi-check-circle");
                    $(`#user-row`).find(`[idUser='${id}']>.list-view-activate`).addClass("mdi-close-circle");
                }
            }
            else  alertify.error('ERROR');
        }
    })
}

function SCUserChangePass(id,newPass) {
    $.ajax({
        url: `/admin/userManager/resetPass`,
        type: 'post',
        contentType: "application/json",
        data: JSON.stringify({id:id,newPass:newPass}),
        success: function (data) {
            if(data.status){
                alertify.success('SUCCESS');
            }
            else  alertify.error('ERROR');
        }
    })
}



function SCDeleteUser(id) {
    $.ajax({
        url: `/admin/userManager/delete`,
        type: 'post',
        contentType: "application/json",
        data: JSON.stringify({id:id}),
        success: function (data) {
            if(data.status){
                $('#user_row').find(`tr[idUser='${id}']`).remove();
                alertify.success('SUCCESS');
            }
            else  alertify.error('ERROR');
        }
    })
}


function SCDeleteAdmin(id) {
    $.ajax({
        url: `/admin/adminManager/delete`,
        type: 'post',
        contentType: "application/json",
        data: JSON.stringify({id:id}),
        success: function (data) {
            if(data.status){
                $('#admin-row').find(`tr[idUser='${id}']`).remove();
                alertify.success('SUCCESS');
            }
            else  alertify.error('ERROR');
        }
    })
}