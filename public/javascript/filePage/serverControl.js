function SCAddNewFolderToDb(ParentFolder, folderName) {
    var data = {
        In_folder: ParentFolder.id,
        FolderName: folderName,
        Owner_id: ParentFolder.Owner_id,
        path: ParentFolder.path+'/'+folderName
    }
    $.ajax({
        type: 'post',
        url: '/file/add',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            $('#folderCard').append(`<a class="folder-item btn col-sm-4 col-md-3 col-lg-2">
                                <i class="mdi mdi-folder"> ${folderName}</i> 
                            </a>`);
        }
    })
}




function SCGetDataFolder(a){
    $(document).find('#sidebar-menu a.menu-nav-active').removeClass("menu-nav-active");
    $(document).find(`#sidebar-menu li[idFolder=${a}]>a`).addClass("menu-nav-active");

    $.ajax({
        url:`/file/getFolderData`,
        type:'post',
        data: JSON.stringify({id:a}),
        contentType: "application/json",
        success: function(data){
            window.history.pushState(data, "Title", "/"+data.localFolder.path);

            localFolder=data.localFolder;
            CRUpdateFolderCard(data.childrenFolder)
        }
    });
}




var  getTreeData = function (sub, folderID) {
    $.ajax({
        url: `/file/updateTree`,
        type: 'post',
        data: JSON.stringify({id: folderID}),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            data.forEach(function (item) {
                sub.append(`<li class="has_sub" idFolder="${item.id}">
                                                <a class="waves-effect">
                                                    <i class="mdi mdi-folder"></i>
                                                    <span>${item.FolderName}</span>
                                                    <span class="float-right">
                                                        <i class="mdi mdi-chevron-right"></i></span></a>
                                                    <ul class="list-unstyled"></ul></li>`);
            })

        }
    })
}




function renameFolder(id, folderName){
    var data = {
        In_folder: id,
        FolderName: folderName,
    }
    $.ajax({
        type: 'post',
        url: '/file/add',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
        }
    })
}