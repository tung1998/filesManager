function TRUpdateTree(sub, data) {
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


function TRRenameFolder(id, FolderName) {
    $('#myFolder').find(`[idFolder=${id}]>a>span`).first().text(FolderName);
}