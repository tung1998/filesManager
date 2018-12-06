function SCGetUserData() {
    $.ajax({
        url: `/admin/getUserData`,
        type: 'post',
        contentType: "application/json",
        success: function (data) {
            if (data.status != 0) {
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
                console.log(data);
                CRAdminData(data);
            }else alertify.error('ERROR')
        }
    })
}