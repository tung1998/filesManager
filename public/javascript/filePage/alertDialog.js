function ADAddNewFolder() {
    //add
    alertify
        .placeholder("NewFolder")
        .prompt("CreateNewFile", function (folderName, ev) {
            ev.preventDefault();
            if(folderName) {
                alertify.success("Add New Folder: " + folderName)
                //make new folder
                SCAddNewFolderToDb(localFolder, folderName);

            }else {
                alertify.error('Please insert FolderName')
                ADAddNewFolder();
            }
        }, function(ev) {
            ev.preventDefault();

        });
}