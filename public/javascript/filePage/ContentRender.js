
function CRUpdateFolderCard(childrenFolder){
    childrenFolder.sort(compareValues('FolderName','desc'))
    // $('#list-row').empty();
    $('#folderCard').empty();
    folderData.childrenFolder=childrenFolder;
    if(localStorage.getItem('view')==1){
        $('#gridShow').hide();
        $('#listShow').show();
        childrenFolder.forEach(function (item) {
            CRItemFolderListStyle(item);
        })
    }

    else {
        $('#listShow').hide();
        $('#gridShow').show();
        if(childrenFolder.length) $("#folderShow").show();
        else $("#folderShow").hide();

        childrenFolder.forEach(function (item) {
            CRItemFolderGridStyle(item)
        })
    }

}


function CRUpdateFileCard(childrenFile){
    childrenFile.sort(compareValues('file_name'))
    $('#fileCard').empty();
    folderData.childrenFile=childrenFile;
    if(localStorage.getItem('view')==1){
        $('#listShow').show();
        $('#gridShow').hide();
        childrenFile.forEach(function (item) {
            CRItemFileListStyle(item)
        })
    }else {
        if(childrenFile.length) $("#fileShow").show();
        else $("#fileShow").hide();
        $('#listShow').hide();
        $('#gridShow').show();
        childrenFile.forEach(function (item) {
            CRItemFileGridStyle(item);
        })
    }
}

// function CRUpdateSearch(data){
//     $("#searchDropdown").empty();
//     data.folderInfor.forEach((item)=> {
//         $("#searchDropdown").prepend(
//             `<a class="waves-effect dropdown-item notify-item search-folder-item"idFolder="${item.id}">
//                 <div class="notify-icon bg-primary">
//                     <i class="mdi mdi-folder"></i></div>
//                 <p class="notify-details">
//                     <b>${item.FolderName}</b>
//                     <small class="text-muted">${item.path}</small></p>
//             </a>`
//         )
//     })
//     data.fileInfor.forEach((item)=> {
//         $("#searchDropdown").append(`
//             <a class="waves-effect dropdown-item notify-item search-file-item" idFile="${item.file_id}" typeFile="${item.type}">
//                 <div class="notify-icon bg-primary">
//                     <i class="mdi ${CRAddFileIcon(item.file_id,item.type)}"></i></div>
//                 <p class="notify-details">
//                     <b>${item.file_name}</b>
//                     <small class="text-muted"></small></p>
//             </a>`)
//     })
// }

function CRUpdatePathBar(path) {
    $('#folderPath>#1').empty();
    let folder=[];
    if (path!=undefined&&path.includes("/"))
        folder =path.split("/");
    else folder.push(path);
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
    if(localStorage.getItem('view')==1){
        $('#list-row').find(`[idFolder=${id}]>.list-view-name`).text(folderName);
        $('#list-row').find(`[idFolder=${id}]>.list-view-path`).text(localFolder.path+'/'+folderName);
    }else {
        $('#folderCard').find(`[idFolder=${id}]>i`).text(folderName);
    }

}

function CRRenameFile(id, fileName) {
    if(localStorage.getItem('view')==1){
        $('#list-row').find(`[idFile=${id}]>.list-view-name`).text(fileName);
        $('#list-row').find(`[idFile=${id}]>.list-view-path`).text(localFolder.path+'/'+fileName);
    }else {
        $('#fileCard').find(`[idFile=${id}]>i`).text(fileName);
    }
}

async function CRGetSearchPage() {
    $('#list-row').empty();
    $('#folderCard').empty();
    $('#fileCard').empty();
    let text = $('#Search').val().toUpperCase();

    console.log(text)
    if(localStorage.getItem('view')==1) {
        folderData.childrenFile.forEach((item) => {
            if (item.file_name.toUpperCase().includes(text)) {
                CRItemFileListStyle(item)
            }

        })
        folderData.childrenFolder.forEach((item) => {
            if (item.FolderName.toUpperCase().includes(text)) {
                CRItemFolderListStyle(item)
            }
        })
    }else {
        folderData.childrenFile.forEach((item) => {
            if (item.file_name.toUpperCase().includes(text)) {
                CRItemFileGridStyle(item)
            }
        })
        folderData.childrenFolder.forEach((item) => {
            if (item.FolderName.toUpperCase().includes(text)) {
                CRItemFolderGridStyle(item)
            }
        })
    }

}

function CRItemFileListStyle(item) {
    $('#list-row').append(`<tr class="d-flex row file-item col-md-12 waves-effect" idFile="${item.file_id}" typeFile="${item.type}">
                                    <td class="col-1 mdi ${CRAddFileIcon(item.file_id,item.type)}"></td>
                                    <td class="col-4 list-view-name">${item.file_name}</td>
                                    <td class="col-4 list-view-path">${localFolder.path}/${item.file_name}</td>
                                    <td class="col-1 list-view-size">${CRSize(item.file_id,item.size)}</td>
                                    <td class="col-2 list-view-time">${item.timeUpload}</td></tr>`)
    if(item.onLove==1&&localFolder.id!=-7){
        $('#list-row').find(`[idFile="${item.file_id}"] td`).first().addClass("love")
    }
}

function CRItemFileGridStyle(item) {
    $('#fileCard').append(`<a class="file-item col-sm-6 col-md-4 col-lg-3" idFile="${item.file_id}" typeFile="${item.type}">
                                        <i class="waves-effect mdi ${CRAddFileIcon(item.file_id,item.type)}">${item.file_name}</i> 
                                    </a>`);
    if(item.onLove==1&&localFolder.id!=-7){
        $('#fileCard').find(`[idFile="${item.file_id}"]`).addClass("love")
    }
}

function CRItemFolderListStyle(item) {
    $('#list-row').prepend(`<tr class="d-flex row folder-item col-lg-12 waves-effect" idFolder="${item.id}">
                                    <td class="col-1 mdi mdi-folder"></td>
                                    <td class="col-4 list-view-name">${item.FolderName}</td>
                                    <td class="col-4 list-view-path">${item.path}</td>
                                    <td class="col-1 list-view-size">${CRSize(item.id,item.size)}</td>
                                    <td class="col-2 list-view-time">${item.time_create}</td></tr>`)
    if(item.onLove==1&&localFolder.id!=-7){
        $('#list-row').find(`[idFolder="${item.id}"] td`).first().addClass("love")
    }
}

function CRItemFolderGridStyle(item) {
    if(item.onLove==1&&localFolder.id!=-7) {
        $('#folderCard').prepend(`<a class="folder-item col-sm-6 col-md-4 col-lg-3 love" idFolder="${item.id}">
                                            <i class="waves-effect mdi mdi-folder">${item.FolderName}</i> 
                                        </a>`);
    }else {
        $('#folderCard').prepend(`<a class="folder-item col-sm-6 col-md-4 col-lg-3" idFolder="${item.id}">
                                            <i class="waves-effect mdi mdi-folder">${item.FolderName}</i> 
                                        </a>`);
    }
}

function CRAddFileIcon(id,type) {
    if(type==0){
        return "mdi-file";
    }
    else if(type==1){
        return  "mdi-file-image"
    }
    else if(type==2){
        return"mdi-file-document"
    }
    else if(type==3){
        return"mdi-file-pdf"
    }
    else if(type==4){
        return"mdi-file-music"
    }
    else if(type==5){
        return"mdi-file-video"
    }
}

function CRSize(id,size) {
    if(size<900){
        return`${size.toFixed(2)} byte`;
    }else if(size<(900*1024)){
        return`${(size/1024).toFixed(2)} Kb`;
    }else if(size<(900*1024*1024)){
        return`${(size/1024/1024).toFixed(2)} Mb`;
    }else{
        return`${(size/1024/1024/1024).toFixed(2)} Gb`;
    }
}

function compareValues(key, order='asc') {
    return function(a, b) {
        if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // không tồn tại tính chất trên cả hai object
            return 0;
        }

        const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order == 'desc') ? (comparison * -1) : comparison
        );
    };
}

function TRUpdateTree(data) {
    $('#myFolder>ul').empty();
    data.forEach(function (item) {
        TRUpdateNode(item)
    })
}

function TRRenameFolder(id, FolderName) {
    $('#myFolder').find(`[idFolder=${id}]>a>span`).first().text(FolderName);
}

function TRUpdateNode(item) {
    let parent = $(document).find(`[idFolder="${item.In_folder}"]>ul`);
    let icon = $(document).find(`[idFolder="${item.In_folder}"]>a>span>.mdi`);
    parent.append(`<li class="has_sub" idFolder="${item.id}">
                                                <a class="waves-effect">
                                                    <i class="mdi mdi-folder"></i>
                                                    <span>${item.FolderName}</span>
                                                    <span class="float-right">
                                                        <i class="mdi"></i></span></a>
                                                    <ul class="list-unstyled"></ul></li>`);
    icon.addClass(`mdi-chevron-right`)
}

