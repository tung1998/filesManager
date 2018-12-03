function ADAddNewFolder() {
    if (localFolder.id<0) alertify.error("Can't add folder Hear");
    else {
        alertify
            .placeholder("NewFolder")
            .prompt("CreateNewFolder", function (folderName, ev) {
                ev.preventDefault();
                if (folderName) {

                    //make new folder
                    if (checkFolderName(folderName)) {
                        alertify.success("Add New Folder: " + folderName)
                        SCAddNewFolderToDb(localFolder, folderName);
                    }
                    else {
                        alertify.error('Folder already exists')
                        ADAddNewFolder();
                    }

                } else {
                    alertify.error('Please insert FolderName')
                    ADAddNewFolder();
                }
            }, function (ev) {
                ev.preventDefault();

            });
    }
}



function ALRenameFolder(id,name) {
    alertify
        .defaultValue(name)
        .prompt("Rename folder", function (folderName, ev) {
            ev.preventDefault();
            if(folderName) {
                //make new folder
                if(checkFolderName(folderName)) {
                    alertify.success(" Success change: " + folderName)
                    SCRenameFolder(id, folderName)
                }
                else {
                    alertify.error('Folder already exists')
                    ALRenameFolder(id,name);
                }

            }else {
                alertify.error('Please insert FolderName')
                ALRenameFolder(id,name);
            }
        }, function(ev) {
            ev.preventDefault();
        });
}

function ALRenameFile(id,name) {
    alertify
        .defaultValue(name)
        .prompt("Rename file", function (fileName, ev) {
            ev.preventDefault();
            if(fileName) {

                //make new folder
                if(checkFileName(fileName)) {
                    SCRenameFile(id, fileName)
                }
                else {
                    alertify.error('Folder already exists')
                    ALRenameFile(id,name);
                }

            }else {
                alertify.error('Please insert FolderName')
                ALRenameFile(id,name);
            }
        }, function(ev) {
            ev.preventDefault();
        });
}

function ALUploadFile() {
    $("#fileUpload").trigger("click");
    $("#fileUpload").change(()=>{
        console.log($("#fileUpload").val())
        if($("#fileUpload").val()!=''){
            SCAddNewFileToDb();
            $("#fileUpload").val('');
        }
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

function ALOnUploadFile() {
    alertify.closeLogOnClick(true).log(`<div id ="alertUpload" class="alert-upload row">
                                                    <div class="spinner"></div>
                                                    <div style="padding-left: 50px">File is Uploading</div>
                                                </div>`)
}

function ALRestoreFolder(folderId) {
    alertify.confirm("This Folder had been deleted, Do you want to restore Folder?", function (ev) {
        ev.preventDefault();
        SCRestoreFolder(folderId);
        alertify.success("Folder had been restored");
    }, function(ev) {
        ev.preventDefault();
        alertify.error("No restore Folder");
    });
}

function ALRestoreFile(fileId) {
    alertify.confirm("This File had been deleted, Do you want to restore file?", function (ev) {
        ev.preventDefault();
        SCRestoreFile(fileId);
        alertify.success("File had been restored");
    }, function(ev) {
        ev.preventDefault();
        alertify.error("No restore File");
    });
}

function ADShareFolder(idFolder) {
    alertify
        .placeholder("Email of username")
        .prompt("Share To:", function (shareUser, ev) {
            ev.preventDefault();
            if (shareUser) {
                SCShareFolder(idFolder,shareUser);
            } else {
                alertify.error('Please insert Email or UserName')
            }
        }, function (ev) {
            ev.preventDefault();

        });
}

function ADShareFile(idFile) {
    alertify
        .placeholder("Email of username")
        .prompt("Share To:", function (shareUser, ev) {
            ev.preventDefault();
            if (shareUser) {
                SCShareFile(idFile,shareUser);
            } else {
                alertify.error('Please insert Email or UserName')
            }
        }, function (ev) {
            ev.preventDefault();

        });
}

function ALNotWorkFunction() {
    alertify.alert("Chức năng chưa được cập nhật, quý khách vui lòng sử dụng các chức năng khác");
    return false;
}


function ALAddToLove(check) {
    if(check){
        alertify.success("On Love")
    }
    else alertify.error("Un Love")
}
