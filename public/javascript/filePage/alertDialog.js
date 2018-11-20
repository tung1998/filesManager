function ADAddNewFolder() {
    //add
    alertify
        .placeholder("NewFolder")
        .prompt("CreateNewFolder", function (folderName, ev) {
            ev.preventDefault();
            if(folderName) {

                //make new folder
                if(checkFolderName(folderName)) {
                    alertify.success("Add New Folder: " + folderName)
                    SCAddNewFolderToDb(localFolder, folderName);
                }
                else {
                    alertify.error('Folder already exists')
                    ADAddNewFolder();
                }

            }else {
                alertify.error('Please insert FolderName')
                ADAddNewFolder();
            }
        }, function(ev) {
            ev.preventDefault();

        });
}

function ALRenameFolder(folder) {
    alertify
        .defaultValue(folder.children().first().text())
        .prompt("Rename folder", function (folderName, ev) {
            ev.preventDefault();
            if(folderName) {

                //make new folder
                if(checkFolderName(folderName)) {
                    alertify.success(" Success change: " + folderName)
                    SCRenameFolder(folder.attr("idFolder"), folderName)
                }
                else {
                    alertify.error('Folder already exists')
                    ALRenameFolder();
                }

            }else {
                alertify.error('Please insert FolderName')
                ALRenameFolder(folder);
            }
        }, function(ev) {
            ev.preventDefault();
        });
}

function ALRenameFile(file) {
    alertify
        .defaultValue(file.children().first().text())
        .prompt("Rename file", function (fileName, ev) {
            ev.preventDefault();
            if(fileName) {

                //make new folder
                if(checkFileName(fileName)) {
                    alertify.success(" Success change: " + fileName)
                    console.log(file.attr("idFile"))
                    SCRenameFile(file.attr("idFile"), fileName)
                }
                else {
                    alertify.error('Folder already exists')
                    ALRenameFile();
                }

            }else {
                alertify.error('Please insert FolderName')
                ALRenameFile(folder);
            }
        }, function(ev) {
            ev.preventDefault();
        });
}

function ALUploadFile() {
    $("#fileUpload").trigger("click");
    $("#fileUpload").change(()=>{
        SCAddNewFileToDb();

        $("#fileUpload").val(null);
    })
}


function ALDeleteStatus(check) {
    if(check) {
        alertify.success("Success Delete")
    }
    else {
        alertify.error('ERROR')
    }

}



function ALNotWorkFunction() {
    alertify.alert("Chức năng chưa được cập nhật, quý khách vui lòng sử dụng các chức năng khác");
    return false;
}