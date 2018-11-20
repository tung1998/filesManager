
function CRUpdateFolderCard(childrenFolder){

    $('#folderCard').empty();


    childrenFolder.forEach(function (item) {
        $('#folderCard').append(`<a class="folder-item col-sm-6 col-md-4 col-lg-3" idFolder="${item.id}">
                                            <i class="mdi mdi-folder">${item.FolderName}</i> 
                                        </a>`);
    })
}


function CRUpdateFileCard(childrenFile){

    $('#fileCard').empty();

    childrenFile.forEach(function (item) {
        $('#fileCard').append(`<a class="file-item col-sm-6 col-md-4 col-lg-3" idFile="${item.file_id}" typeFile="${item.type}">
                                            <i class="mdi mdi-file">${item.file_name}</i> 
                                        </a>`);
    })
}


function CRUpdateSearch(data){
    $("#searchDropdown").empty();
    data.folderInfor.forEach((item)=> {
        $("#searchDropdown").prepend(
            `<a class="dropdown-item notify-item search-folder-item"idFolder="${item.id}">
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
            <a class="dropdown-item notify-item search-file-item" idFile="${item.file_id}">
                <div class="notify-icon bg-primary">
                    <i class="mdi mdi-file"></i></div>
                <p class="notify-details">
                    <b>${item.file_name}</b> 
                    <small class="text-muted"></small></p>
            </a>`)
    })
}


function CRRenameFolder(id, folderName) {
    $('#folderCard').find(`[idFolder=${id}]>i`).text(folderName);
}
function CRRenameFile(id, fileName) {
    $('#fileCard').find(`[idFile=${id}]>i`).text(fileName);
}