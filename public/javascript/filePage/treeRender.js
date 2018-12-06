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