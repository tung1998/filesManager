let user = $('#User');
let file = $('#File');
let admin = $('#Admin');



function CRUserData(userData) {
    user.show();
    file.hide();
    admin.hide();
    $('#user-row').empty()
    userData.forEach(function (item) {
        $('#user-row').append(`<tr class="d-flex row user-item col-md-12 waves-effect" idUser="${item.id}" ">
                                    <td class="col-1 mdi mdi-account"></td>
                                    <td class="col-2 list-view-name">${item.username}</td>
                                    <td class="col-3 list-view-email">${item.email}</td>
                                    <td class="col-2 list-view-dataused">${CRSize(item.id,item.dataUsed)}</td>
                                    <td class="col-1 list-view-folder-count">${item.folderCount}</td>
                                    <td class="col-1 list-view-file-count">${item.fileCount? item.folderCount: 0 }</td>
                                    <td class="col-2 list-view-time">${item.time_create}</td></tr>`)
    })
}

function CRFileData(fileData) {
    user.hide();
    file.show();
    admin.hide();
    $('#file-row').empty();
    fileData.forEach(function (item) {
        $('#file-row').append(`<tr class="d-flex row file-item col-md-12 waves-effect" idFolder="${item.id}">
                                    <td class="col-1 mdi mdi-folder"></td>
                                    <td class="col-4 list-view-name">${item.FolderName}</td>
                                    <td class="col-4 list-view-path">${item.path}</td>
                                    <td class="col-1 list-view-size">${CRSize(item.file_id,item.size)}</td>
                                    <td class="col-2 list-view-time">${item.time_create}</td></tr>`)
    })
}

function CRAdminData(adminData) {
    user.hide();
    file.hide();
    admin.show();
    $('#admin-row').empty();
    adminData.forEach(function (item) {
        $('#admin-row').append(`<tr class="d-flex row admin-item col-md-12 waves-effect" idUser="${item.id}" ">
                                    <td class="col-1 mdi mdi-account-key"></td>
                                    <td class="col-4 list-view-name">${item.username}</td>
                                    <td class="col-4 list-view-email">${item.fullName}</td>
                                    <td class="col-1 list-view-level">${item.level}</td>
                                    <td class="col-2 list-view-time">${item.time_create}</td></tr>`)
    })
}

function CRSize(id,size) {
    if(size==null) return 0;
    else if(size<900){
        return`${size.toFixed(2)} byte`;
    }else if(size<(900*1024)){
        return`${(size/1024).toFixed(2)} Kb`;
    }else if(size<(900*1024*1024)){
        return`${(size/1024/1024).toFixed(2)} Mb`;
    }else{
        return`${(size/1024/1024/1024).toFixed(2)} Gb`;
    }
}
