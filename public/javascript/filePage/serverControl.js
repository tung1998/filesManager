function SCAddNewFolderToDb(ParentFolder, folderName) {
    let data = {
        In_folder: ParentFolder.id,
        FolderName: folderName,
        Owner_id: ParentFolder.Owner_id,
        path: ParentFolder.path+'/'+folderName
    }
    // folderData.childrenFolder.add(data);
    $.ajax({
        type: 'post',
        url: '/folder/addNewFolder',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            // console.log(data);
            folderData.childrenFolder.push(data);
            if(localStorage.getItem('view')==1){
                $('#list-row').prepend(`<tr class="d-flex row folder-item col-lg-12 waves-effect" idFolder="${data.id}">
                                    <td class="col-1 mdi mdi-folder"></td>
                                    <td class="col-4 list-view-name">${data.FolderName}</td>
                                    <td class="col-4 list-view-path">${data.path}</td>
                                    <td class="col-1 list-view-size">${CRSize(data.id,data.size)}</td>
                                    <td class="col-2 list-view-time">${data.time_create}</td></tr>`)
            }else {
                // $("#folderShow").show()
                $('#folderCard').prepend(`<a class="folder-item col-sm-6 col-md-4 col-lg-3" idFolder="${data.id}">
                                <i class="waves-effect mdi mdi-folder"> ${folderName}</i> 
                            </a>`);
            }
        }
    })
}




function SCGetDataFolder(id,path){

    $(document).find('#sidebar-menu a.menu-nav-active').removeClass("menu-nav-active");

    $.ajax({
        url:`/folder/getFolderData`,
        type:'post',
        data: JSON.stringify({id:id,path:path}),
        contentType: "application/json",
        success: function(data){
            if(data==0){
                ALRestoreFolder(id);
            }else {
                $('#list-row').empty();
                window.history.pushState(data, "Title", "/" + data.localFolder.path);
                localFolder = data.localFolder;
                $(document).find(`#sidebar-menu li[idFolder=${data.localFolder.id}]>a`).addClass("menu-nav-active");
                CRUpdatePathBar(localFolder.path)
                CRUpdateFolderCard(data.childrenFolder)
                $.ajax({
                    url:`/file/getFileData`,
                    type:'post',
                    data: JSON.stringify({id:data.localFolder.id}),
                    contentType: "application/json",
                    success: function(data){
                        CRUpdateFileCard(data)
                    }
                });
            }
        }
    });


}





function  SCGetTreeData(sub, folderID) {
    $.ajax({
        url: `/folder/updateTree`,
        type: 'post',
        data: JSON.stringify({id: folderID}),
        contentType: "application/json",
        success: function (data) {
            // console.log(data);
            TRUpdateTree(sub, data)

        }
    })
}






function SCRenameFolder(id, folderName){
    let data = {
        id: id,
        FolderName: folderName,
        path: localFolder.path
    }
    $.ajax({
        type: 'post',
        url: '/folder/renameFolder',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function () {
            TRRenameFolder(id,folderName)
            CRRenameFolder(id,folderName)
            folderData.childrenFolder.forEach(function (item) {
                if(item.id==id){
                    item.FolderName = folderName;
                }
            })
        }
    })
}


function SCRenameFile(id, fileName){
    let data = {
        id: id,
        fileName: fileName,
        path: localFolder.path
    }
    $.ajax({
        type: 'post',
        url: '/file/renameFile',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            if(data.status){
                CRRenameFile(id,fileName)
                folderData.childrenFile.forEach(function (item) {
                    if(item.file_id==id){
                        item.file_name = fileName;
                    }
                })
            }
            else alertify.error("Can not rename file")
        }
    })
}


function SCDeleteFolder(folder) {
    let id = folder.attr("idFolder");
    $.ajax({
        type: 'post',
        url: '/folder/deleteFolder',
        data: JSON.stringify({id:id}),
        contentType: "application/json",
        success: function (data) {
            if(data.status){
                ALDeleteStatus(true);
                $(document).find(folder).remove();
                // $('#list-row').find(`[idFolder=${id}]`).remove();
                $(document).find(`#myFolder [idFolder*='${folder.attr('idFolder')}']`).remove();
            }else alertify.error("Can not delete folder")

        }
    })
}

function SCRestoreFolder(folderID) {
    $.ajax({
        type: 'post',
        url: '/folder/restoreFolder',
        data: JSON.stringify({id:folderID}),
        contentType: "application/json",
        success: function (data) {
            if(data.status==0) alertify.error("Can not restore folder")
            else {
                $('#list-row').find(`[idFolder=${folderID}]`).remove();
                $(document).find(`#folderCard>a[idFolder=${folderID}]`).remove();
            }
        }
    })
}

function SCRestoreFile(fileID) {
    $.ajax({
        type: 'post',
        url: '/file/restoreFile',
        data: JSON.stringify({id:fileID}),
        contentType: "application/json",
        success: function (data) {
            if(data.status==0) alertify.error("Can not restore file")
            else {
                $('#list-row').find(`[idFile=${fileID}]`).remove();
                $(document).find(`#fileCard>a[idFile=${fileID}]`).remove();
            }
        }
    })
}



function SCDeleteFile(file) {
    let id = file.attr("idFile");
    $.ajax({
        type: 'post',
        url: '/file/deleteFile',
        data: JSON.stringify({id:id}),
        contentType: "application/json",
        success: function (data) {
            if(data.status){
                ALDeleteStatus(true);
                $(document).find(file).remove();
            }alertify.error("Can not delete file")

        }
    })
}



function SCAddNewFileToDb() {
    // console.log($("#fileUpload").val())
    let fileUpload = new FormData();
    let length = $(document).find('#fileUpload').get(0).files.length;
    for (let x = 0; x < length; x++){
        fileUpload.append("fileUpload"+x, $(document).find('#fileUpload').get(0).files[x]);
    }
    fileUpload.append("folderID", localFolder.id);
    // fileUpload.append("OwnerID", localFolder.Owner_id);
    // console.log(fileUpload);
    $.ajax({
        type: 'post',
        url: '/file/fileUpload'+window.location.pathname,
        dataType: 'json',
        data: fileUpload,
        contentType: false,
        processData: false,
        beforeSend: function(){
            ALOnUploadFile();
        },
        success: function (data) {
            // console.log(data);
            if(data.status==0) alertify.error("Can not upload")
            else {
                $("#fileShow").show()
                // console.log(data);
                data.fileUpload.forEach((item)=> {
                    if (localStorage.getItem('view') == 1) {
                        $('#list-row').append(`<tr class="d-flex row file-item col-md-12 waves-effect" idFile="${item.file_id}" typeFile="${item.type}">
                                    <td class="col-1 mdi ${CRAddFileIcon(item.file_id,item.type)}"></td>
                                    <td class="col-4 list-view-name">${item.file_name}</td>
                                    <td class="col-4 list-view-path">${localFolder.path}/${item.file_name}</td>
                                    <td class="col-1 list-view-size">${item.size}</td>
                                    <td class="col-2 list-view-time">${item.timeUpload}</td></tr>`)
                    } else{
                        $('#fileCard').append(`<a class="file-item col-sm-6 col-md-4 col-lg-3" idFile="${item.file_id}" typeFile="${item.type}">
                                                    <i class="waves-effect mdi ${CRAddFileIcon(item.file_id,item.type)}">${item.file_name}</i> 
                                                </a>`);
                    }
                    let name = item.file_name;
                    let x=0;
                    // console.log(name);
                    while (true){
                        // console.log("12312321")
                        if (checkFileName(item.file_name)){
                            // console.log(item.file_name);
                            folderData.childrenFile.push(item);
                            if (x>0){
                                SCRenameFile(item.file_id,item.file_name);
                                break;
                            }
                            else{
                                break;
                            }
                        }else {
                            x++;
                            item.file_name=name+"("+x+")";
                        }
                    }
                })
                $(document).find("#alertUpload").html(`Upload Success`);
            }
        }
    })
}


function SCGetTrashData() {
    let data={
        userID: folderData.userInfo.id,
    }
    $.ajax({
        type: 'post',
        url: '/trash',
        dataType: 'json',
        data: data,
        success: function (data) {
            $('#list-row').empty();
            $("#errorStatus").hide();
            $("#pageContent").show();
            CRUpdatePathBar(`${folderData.userInfo.username}/Trash`)
            localFolder.id=(-1);
            window.history.replaceState('trash', "Title", "/trash");
            CRUpdateFolderCard(data.childrenFolder);
            CRUpdateFileCard(data.childrenFile);
        }
    })
}
function SCGetShareWithMeData() {
    $.ajax({
        type: 'post',
        url: '/share/getShare',
        success: function (data) {
            $('#list-row').empty();
            $("#errorStatus").hide();
            $("#pageContent").show();
            CRUpdatePathBar(`${folderData.userInfo.username}/Share With Me`)
            localFolder.id=(-7);
            window.history.replaceState('shareWithMe', "Title", "/shareWithMe");
            CRUpdateFolderCard(data.childrenFolder);
            CRUpdateFileCard(data.childrenFile);
        }
    })
}


function SCGetShareWithMeFolderData(id,path) {
    $(document).find('#sidebar-menu a.menu-nav-active').removeClass("menu-nav-active");
    if(id==""){
        if(path==folderData.userInfo.username) {
            console.log(id,path)
            SCGetDataFolder(folderData.userInfo.RootID,"");
        }
        else if(path==folderData.userInfo.username+'/Share With Me') {
            console.log(path);
            SCGetShareWithMeData();
        }
        else{
            console.log(path);
            path=path.substr(folderData.userInfo.username.length+15)
            $.ajax({
                url:`/share/getFolderData`,
                type:'post',
                data: JSON.stringify({id:id,path:path}),
                contentType: "application/json",
                success: function(data){
                    console.log(data);
                    if(data=='0'||data=='1'||data=='2'||data=='3') alertify.error("Can not access")
                    else {
                        $('#list-row').empty();
                        $("#errorStatus").hide();
                        $("#pageContent").show();
                        CRUpdatePathBar(`${folderData.userInfo.username}/Share With Me/${data.localFolder.path}`)
                        window.history.replaceState('shareWithMe', "Title", `/shareWithMe/${data.localFolder.path}`);
                        CRUpdateFolderCard(data.childrenFolder);
                        CRUpdateFileCard(data.childrenFile);
                    }
                }
            });
        }
    }else {
        $.ajax({
            url:`/share/getFolderData`,
            type:'post',
            data: JSON.stringify({id:id,path:path}),
            contentType: "application/json",
            success: function(data){
                if(data=='0') alertify.error("Can not upload")
                else {
                    $('#list-row').empty();
                    $("#errorStatus").hide();
                    $("#pageContent").show();
                    CRUpdatePathBar(`${folderData.userInfo.username}/Share With Me/${data.localFolder.path}`)
                    window.history.replaceState('shareWithMe', "Title", `/shareWithMe/${data.localFolder.path}`);
                    CRUpdateFolderCard(data.childrenFolder);
                    CRUpdateFileCard(data.childrenFile);
                }
            }
        });
    }
}

function SCGetOnLoveData() {
    let data={
        userID: folderData.userInfo.id,
    }
    $.ajax({
        type: 'post',
        url: '/love',
        dataType: 'json',
        data: data,
        success: function (data) {
            $('#list-row').empty();
            $("#errorStatus").hide();
            $("#pageContent").show();
            localFolder.id=(-2);
            CRUpdatePathBar(`${folderData.userInfo.username}/Love`)
            window.history.replaceState('love', "Title", "/love");
            CRUpdateFolderCard(data.childrenFolder);
            CRUpdateFileCard(data.childrenFile);
        }
    })
}


function SCGetFileOpenRecent() {
    let data={
        userID: folderData.userInfo.id,
    }
    $.ajax({
        type: 'post',
        url: '/file/openRecent',
        dataType: 'json',
        data: data,
        success: function (data) {
            $('#list-row').empty();
            $("#errorStatus").hide();
            $("#pageContent").show();
            localFolder.id=(-3);
            CRUpdatePathBar(`${folderData.userInfo.username}/Open Recent`);
            window.history.replaceState('openRecent', "Title", "/openRecent");
            CRUpdateFolderCard([]);
            CRUpdateFileCard(data);
        }
    })
}

function SCGetDataSearch(text) {
    let data={
        localFolder:localFolder.id,
        Owner_id: folderData.userInfo.id,
        text:text
    }
    $.ajax({
        type: 'post',
        url: '/search',
        dataType: 'json',
        data: data,
        success: function (data) {
            // console.log(data)
            CRUpdateSearch(data)
        }
    })
}




async function SCGetSearchPage() {
    CRGetSearchPage()
    // let data={
    //     localFolder:localFolder.id,
    //     Owner_id: folderData.userInfo.id,
    //     text:$("#Search").val()
    // }
    // $.ajax({
    //     type: 'post',
    //     url: '/search',
    //     dataType: 'json',
    //     data: data,
    //     success: function (data) {
    //         $("#errorStatus").hide();
    //         $("#pageContent").show();
    //         CRUpdateFolderCard(data.folderInfor);
    //         CRUpdateFileCard(data.fileInfor);
    //     }
    // })
}
function SCShareFolder(idFolder,shareUser) {
    let data={
        idFolder:idFolder,
        shareUser:shareUser
    }
    $.ajax({
        type: 'post',
        url: '/share/shareFolder',
        dataType: 'json',
        data: data,
        success: function (data) {
            if(data.status==2) alertify.success(`Folder Share to: ${shareUser}`);
            else if(data.status==4) alertify.error("Wrong Username or Email")
            else alertify.error("Can not share")
        }
    })
}
function SCShareFile(idFile,shareUser) {
    let data={
        idFile:idFile,
        shareUser:shareUser
    }
    $.ajax({
        type: 'post',
        url: '/share/shareFile',
        dataType: 'json',
        data: data,
        success: function (data) {
            console.log(data)
            if(data.status==2) alertify.success(`Folder Share to: ${shareUser}`);
            else if(data.status==4) alertify.error("Wrong Username or Email")
            else alertify.error("Can not share")
        }
    })
}

function SCAddToLoveFile(file) {
    let data={
        id:file.attr("idFile")
    }
    $.ajax({
        type: 'post',
        url: '/file/addToLove',
        dataType: 'json',
        data: data,
        success: function (data) {
            ALAddToLove(data)
            if(data){
                folderData.childrenFile.forEach((item)=>{
                    if(item.file_id==file.attr('idFile')) item.onLove=1;
                })
                file.addClass("love")
            }else {
                folderData.childrenFile.forEach((item)=>{
                    if(item.file_id==file.attr('idFile')) item.onLove=0;
                })
                file.removeClass("love")
            }
        }
    })
}

function SCAddToLoveFolder(folder) {
    let data={
        id:folder.attr("idFolder")
    }
    $.ajax({
        type: 'post',
        url: '/folder/addToLove',
        dataType: 'json',
        data: data,
        success: function (data) {
            ALAddToLove(data)
            if(data){
                folderData.childrenFolder.forEach((item)=>{
                    if(item.id==folder.attr('idFolder')) item.onLove=1;
                })
                folder.addClass("love")
            }else {
                folderData.childrenFolder.forEach((item)=>{
                    if(item.id==folder.attr('idFolder')) item.onLove=0;
                })
                folder.removeClass("love")
            }

        }
    })
}



function SCDownloadFile(id) {
    $.ajax({
        type: 'post',
        url: '/file/getCodeName',
        dataType: 'json',
        data: {id:id},
        success: function (data) {
            window.open(`/download/${data.code}`)
        }
    })
}


function checkNameFileUpload(id,name) {

}