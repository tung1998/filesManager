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
            console.log(data);
            folderData.childrenFolder.push(data);
            $('#folderCard').append(`<a class="folder-item col-sm-6 col-md-4 col-lg-3" idFolder="${data.id}">
                                <i class="mdi mdi-folder"> ${folderName}</i> 
                            </a>`);
        }
    })
}




function SCGetDataFolder(a){
    $(document).find('#sidebar-menu a.menu-nav-active').removeClass("menu-nav-active");
    $(document).find(`#sidebar-menu li[idFolder=${a}]>a`).addClass("menu-nav-active");

    $.ajax({
        url:`/folder/getFolderData`,
        type:'post',
        data: JSON.stringify({id:a}),
        contentType: "application/json",
        success: function(data){
            window.history.pushState(data, "Title", "/"+data.localFolder.path);
            localFolder.childrenFolder=data;
            localFolder=data.localFolder;
            CRUpdateFolderCard(data.childrenFolder)
        }
    });


    $.ajax({
        url:`/file/getFileData`,
        type:'post',
        data: JSON.stringify({id:a}),
        contentType: "application/json",
        success: function(data){
            localFolder.childrenFile=data;
            CRUpdateFileCard(data)
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
    console.log(fileUpload);
    $.ajax({
        type: 'post',
        url: '/file/fileUpload'+window.location.pathname,
        dataType: 'json',
        data: fileUpload,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data)
            data.forEach((item)=> {
                folderData.childrenFile.push(item);
                $('#fileCard').append(`<a class="file-item col-sm-6 col-md-4 col-lg-3" idFile="${item.id}" typeFile="${item.type}">
                                            <i class="mdi mdi-file">${item.name}</i> 
                                        </a>`);
            })
        }
    })
}


function SCGetTrashData() {
    let data={
        userID: folderData.localFolder.Owner_id,
    }
    $.ajax({
        type: 'post',
        url: '/trash/'+folderData.userInfo.userName,
        dataType: 'json',
        data: data,
        success: function (data) {
            localFolder.id=(-1);
            window.history.replaceState('trash', "Title", "/trash/"+folderData.userInfo.userName);
            CRUpdateFolderCard(data.childrenFolder);
            CRUpdateFileCard(data.childrenFile);
        }
    })
}

function SCGetDataSearch(text) {
    let data={
        Owner_id: folderData.userInfo.id,
        text:text
    }
    $.ajax({
        type: 'post',
        url: '/search',
        dataType: 'json',
        data: data,
        success: function (data) {
            console.log(data)
            CRUpdateSearch(data)
        }
    })
}

function SCGetSearchPage() {
    let data={
        Owner_id: folderData.userInfo.id,
        text:$("#Search").val()
    }
    $.ajax({
        type: 'post',
        url: '/search',
        dataType: 'json',
        data: data,
        success: function (data) {
            window.history.replaceState('trash', "Title", "/search/"+$("#Search").val());
            CRUpdateFolderCard(data.folderInfor);
            CRUpdateFileCard(data.fileInfor);
        }
    })
}