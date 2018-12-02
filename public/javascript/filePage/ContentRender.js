
function CRUpdateFolderCard(childrenFolder){

    $('#folderCard').empty();
    if(childrenFolder.length) $("#folderShow").show();
    else $("#folderShow").hide();
    folderData.childrenFolder=childrenFolder;
    childrenFolder.forEach(function (item) {
        if(item.onLove==1) {
            $('#folderCard').append(`<a class="folder-item col-sm-6 col-md-4 col-lg-3 love" idFolder="${item.id}">
                                            <i class="waves-effect mdi mdi-folder">${item.FolderName}</i> 
                                        </a>`);
        }else {
            $('#folderCard').append(`<a class="folder-item col-sm-6 col-md-4 col-lg-3" idFolder="${item.id}">
                                            <i class="waves-effect mdi mdi-folder">${item.FolderName}</i> 
                                        </a>`);
        }
    })
}


function CRUpdateFileCard(childrenFile){

    $('#fileCard').empty();

    if(childrenFile.length) $("#fileShow").show();
    else $("#fileShow").hide();
    folderData.childrenFile=childrenFile;
    childrenFile.forEach(function (item) {
        $('#fileCard').append(`<a class="file-item col-sm-6 col-md-4 col-lg-3" idFile="${item.file_id}" typeFile="${item.type}">
                                        <i class="waves-effect mdi">${item.file_name}</i> 
                                    </a>`);
        if(item.onLove==1){
            $('#fileCard').find(`[idFile="${item.file_id}"]`).addClass("love")
        }
        CRAddFileIcon(item.file_id,item.type)
    })
    // childrenFile.forEach(function (item) {
    //     if(item.onLove==1){
    //         $('#fileCard').find(`[idFile="${item.file_id}"]`).addClass("love")
    //     }
    //     CRAddFileIcon(item.file_id,item.type)
    // })

}

function CRAddFileIcon(id,type) {
    if(type==0){
        $('#fileCard').find(`[idFile="${id}"]>i`).addClass("mdi-file")
    }
    else if(type==1){
        $('#fileCard').find(`[idFile="${id}"]>i`).addClass("mdi-file-image")
    }
    else if(type==2){
        $('#fileCard').find(`[idFile="${id}"]>i`).addClass("mdi-file-document")
    }
    else if(type==3){
        $('#fileCard').find(`[idFile="${id}"]>i`).addClass("mdi-file-pdf")
    }
    else if(type==4){
        $('#fileCard').find(`[idFile="${id}"]>i`).addClass("mdi-file-music")
    }
    else if(type==5){
        $('#fileCard').find(`[idFile="${id}"]>i`).addClass("mdi-file-video")
    }
}


function CRUpdateSearch(data){
    $("#searchDropdown").empty();
    data.folderInfor.forEach((item)=> {
        $("#searchDropdown").prepend(
            `<a class="waves-effect dropdown-item notify-item search-folder-item"idFolder="${item.id}">
                <div class="notify-icon bg-primary">
                    <i class="mdi mdi-folder"></i></div>
                <p class="notify-details">
                    <b>${item.FolderName}</b>
                    <small class="text-muted">${item.path}</small></p>
            </a>`
        )
    })
    data.fileInfor.forEach((item)=> {
        $("#searchDropdown").append(`
            <a class="waves-effect dropdown-item notify-item search-file-item" idFile="${item.file_id}" typeFile="${item.type}">
                <div class="notify-icon bg-primary">
                    <i class="mdi mdi-file"></i></div>
                <p class="notify-details">
                    <b>${item.file_name}</b> 
                    <small class="text-muted"></small></p>
            </a>`)
    })
}


function CRUpdatePathBar(path) {
    $('#folderPath>#1').empty();
    let folder =path.split("/");
    for (let i=folder.length-1;i>=0;i--){
        if(i!=0) {
            if (i == folder.length - 1) {
                $('#lastPath button').text(`${folder[i]}`)
            }
            else {
                path = path.slice(0, path.length - folder[i + 1].length - 1);
                $('#folderPath>#1').prepend(`<li class="list-inline-item" pathFolder="${path}">
                                            <button class="btn btn-path" type="button">${folder[i]}
                                            <div class="ripple-container"></div></button>
                                            <i class="mdi mdi-chevron-right"></i></li>`)
            }
        }else {
            if (i == folder.length - 1) {
                $('#lastPath button').text(`My Folder`)
            }
            else {
                path = path.slice(0, path.length - folder[i + 1].length - 1);
                $('#folderPath>#1').prepend(`<li class="list-inline-item" pathFolder="${path}">
                                            <button class="btn btn-path" type="button">My Folder
                                            <div class="ripple-container"></div></button>
                                            <i class="mdi mdi-chevron-right"></i></li>`)
            }
        }
    }
}



function CRRenameFolder(id, folderName) {
    $('#folderCard').find(`[idFolder=${id}]>i`).text(folderName);
}
function CRRenameFile(id, fileName) {
    $('#fileCard').find(`[idFile=${id}]>i`).text(fileName);
}



async function CRGetSearchPage() {
    $('#folderCard').empty();
    $('#fileCard').empty();
    let text = $('#Search').val().toUpperCase();
    localFolder.childrenFile.forEach((item) => {
        if (item.file_name.toUpperCase().includes(text)) {
            $('#fileCard').append(`<a class="file-item col-sm-6 col-md-4 col-lg-3" idFile="${item.file_id}" typeFile="${item.type}">
                                        <i class="waves-effect mdi">${item.file_name}</i> 
                                    </a>`);
            if(item.onLove==1){
                $('#fileCard').find(`[idFile="${item.file_id}"]`).addClass("love")
            }
            CRAddFileIcon(item.file_id,item.type)
        }
    })
    localFolder.childrenFolder.forEach((item) => {
        if (item.FolderName.toUpperCase().includes(text)) {
            if(item.onLove==1) {
                $('#folderCard').append(`<a class="folder-item col-sm-6 col-md-4 col-lg-3 love" idFolder="${item.id}">
                                            <i class="waves-effect mdi mdi-folder">${item.FolderName}</i> 
                                        </a>`);
            }else {
                $('#folderCard').append(`<a class="folder-item col-sm-6 col-md-4 col-lg-3" idFolder="${item.id}">
                                            <i class="waves-effect mdi mdi-folder">${item.FolderName}</i> 
                                        </a>`);
            }
        }
    })
}