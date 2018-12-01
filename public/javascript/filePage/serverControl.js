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
            $("#folderShow").show()
            $('#folderCard').append(`<a class="folder-item col-sm-6 col-md-4 col-lg-3" idFolder="${data.id}">
                                <i class="waves-effect mdi mdi-folder"> ${folderName}</i> 
                            </a>`);
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
                window.history.pushState(data, "Title", "/" + data.localFolder.path);
                localFolder.childrenFolder = data;
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
                        localFolder.childrenFile=data;
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


function SCRenameFile(id, folderName){
    let data = {
        id: id,
        fileName: folderName,
        path: localFolder.path
    }
    $.ajax({
        type: 'post',
        url: '/file/renameFile',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function () {
            CRRenameFile(id,folderName)
            folderData.childrenFile.forEach(function (item) {
                if(item.id==id){
                    item.file_name = folderName;
                }
            })
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
        success: function () {
            ALDeleteStatus(true);
            $(document).find(folder).remove();
            $(document).find(`#myFolder [idFolder*='${folder.attr('idFolder')}']`).remove();
        }
    })
}

function SCRestoreFolder(folderID) {
    $.ajax({
        type: 'post',
        url: '/folder/restoreFolder',
        data: JSON.stringify({id:folderID}),
        contentType: "application/json",
        success: function () {
            $(document).find(`#folderCard>a[idFolder=${folderID}]`).remove();
        }
    })
}

function SCRestoreFile(fileID) {
    $.ajax({
        type: 'post',
        url: '/file/restoreFile',
        data: JSON.stringify({id:fileID}),
        contentType: "application/json",
        success: function () {
            $(document).find(`#fileCard>a[idFile=${fileID}]`).remove();
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
        success: function () {
            ALDeleteStatus(true);
            $(document).find(file).remove();
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
    fileUpload.append("OwnerID", localFolder.Owner_id);
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
            $("#fileShow").show()
            // console.log(data);
            data.forEach((item)=> {
                folderData.childrenFile.push(item);
                $('#fileCard').append(`<a class="file-item col-sm-6 col-md-4 col-lg-3" idFile="${item.id}" typeFile="${item.type}">
                                            <i class="waves-effect mdi mdi-file">${item.name}</i> 
                                        </a>`);
                CRAddFileIcon(item.id,item.type);
            })
            $(document).find("#alertUpload").html(`Upload Success`);
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
            $("#errorStatus").hide();
            $("#pageContent").show();
            CRUpdatePathBar(`${localFolder.FolderName}/trash`)
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
            $("#errorStatus").hide();
            $("#pageContent").show();
            CRUpdatePathBar(`${localFolder.FolderName}/shareWithMe`)
            localFolder.id=(-1);
            window.history.replaceState('shareWithMe', "Title", "/shareWithMe");
            CRUpdateFolderCard(data.childrenFolder);
            CRUpdateFileCard(data.childrenFile);
        }
    })
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
            $("#errorStatus").hide();
            $("#pageContent").show();
            localFolder.id=(-2);
            CRUpdatePathBar(`${localFolder.FolderName}/love`)
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
            $("#errorStatus").hide();
            $("#pageContent").show();
            localFolder.id=(-3);
            CRUpdatePathBar(`${localFolder.FolderName}/openRecent`);
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
                file.addClass("love")
            }else file.removeClass("love")
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
                folder.addClass("love")
            }else folder.removeClass("love")

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


