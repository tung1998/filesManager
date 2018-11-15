
function CRUpdateFolderCard(childrenFolder){

    $('#folderCard').empty();


    childrenFolder.forEach(function (item) {
        $('#folderCard').append(`<a class="folder-item btn col-sm-4 col-md-3 col-lg-2" idFolder="${item.id}">
                                            <i class="mdi mdi-folder">${item.FolderName}</i> 
                                        </a>`);
    })
}