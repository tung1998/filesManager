let localFolder = folderData.localFolder;
let clipboard={
    type:undefined,//1=folder,0=file
    id:undefined,
    name:undefined,
    method:undefined,//1=coppy,0=cut
    localFolder:undefined
};

$(function () {
    if(localStorage.getItem('view')==1){
        $('#setListView>div.float-right').addClass('mdi-check')
    }else {
        $('#setGridView>div.float-right').addClass('mdi-check')
    }

    if(window.location.pathname=="/trash"){
        SCGetTrashData();
    }
    if(window.location.pathname=="/love"){
        SCGetOnLoveData();
    }
    if(window.location.pathname=="/openRecent"){
        SCGetFileOpenRecent();
    }
    if(window.location.pathname=="/shareWithMe"){
        SCGetShareWithMeData();
    }

    $('#myFile > a').addClass("menu-nav-active")


    $(document).on('click',function(){
        if($("#Search").is(":focus")&&$("#Search").val().length>=3){
            // $('#searchDropdown').addClass("show");
            SCGetSearchPage();
        }else {
            // $('#searchDropdown').removeClass("show");
        }
    })
    $(document).on('dblclick',function(){
        if($("#Search").is(":focus")&&$("#Search").val().length>=3){
            // $('#searchDropdown').addClass("show")
            SCGetSearchPage();
        }else {
            // $('#searchDropdown').removeClass("show");
        }
    })

    $(document).on('click', '#searchDropdown>[idFile]',function(){
        let file = $(this);
        let type = file.attr("typeFile");
        let id = file.attr("idFile");
        let name = file.find('b').first().text();
        showFile(type,id,name);
    })



    $(document).on('click', '#searchDropdown>[idFolder]',function(){
        SCGetDataFolder($(this).attr("idFolder"));
    })

    $(document).on('click', '[idFolder]>a', function (e) {

        let idFolder = $(this).parent().attr("idFolder");

        if(localFolder.id!=idFolder) {
            $("#errorStatus").hide();
            $("#pageContent").show();
            SCGetDataFolder(idFolder);
        }

        $(document).on('click', '[idFolder] i', function (e) {
            e.stopPropagation();
        })
    })




    $(document).on('dblclick', '#folderCard a.folder-item', function () {
        if(localFolder.id==-7) SCGetShareWithMeFolderData($(this).attr('idFolder'),"")
        else {
            SCGetDataFolder($(this).attr('idFolder'),"");
        }

    })

    $(document).on('click', '#folderPath>ul#1>li', function () {
        let path=$(this).attr("pathFolder");
        if(localFolder.id==-7) SCGetShareWithMeFolderData("",path)
        else {
            SCGetDataFolder("",path);
        }
    })


    $(document).on('keydown', '#Search', function (e) {
        let code = e.charCode || e.keyCode;
        if (code==13) SCGetSearchPage();
    })




    $(document).on('dblclick', '#fileCard a.file-item', function () {
        // SCGetDataFile($(this).attr('idFolder'));
        let file = $(this);
        let type = file.attr("typeFile");
        let id = file.attr("idFile");
        let name = file.find('i').first().text();
        if(localFolder.id==(-1)) ALRestoreFile(id);
        else showFile(type,id,name);
    })


    $(document).on('dblclick', '#list-row tr.file-item', function () {
        // SCGetDataFile($(this).attr('idFolder'));
        let file = $(this);
        let type = file.attr("typeFile");
        let id = file.attr("idFile");
        let name = file.find('td.list-view-name').first().text();
        if(localFolder.id==(-1)) ALRestoreFile(id);
        else showFile(type,id,name);
    })

    $(document).on('dblclick', '#list-row tr.folder-item', function () {
        // SCGetDataFile($(this).attr('idFolder'));
        let file = $(this);
        let id = file.attr("idFolder");
        if(localFolder.id==(-1)) ALRestoreFolder(id);
        else if(localFolder.id==-7) SCGetShareWithMeFolderData(id,"")
        else {
            SCGetDataFolder(id,"");
        }
    })

    // $('#folderCard a.folder-item').on('click' ,function () {
    //     SCGetDataFolder($(this).attr('idFolder'));
    // })
    SCGetTreeData();
    CRUpdatePathBar(localFolder.path)
    CRUpdateFileCard(folderData.childrenFile);
    CRUpdateFolderCard(folderData.childrenFolder);

})



function logout() {
    $.ajax({
        url:'/users/logout',
        type:'post',
        success: function(){
            location.reload();
        }
    });
}

function searchData() {
    let text = $("#Search").val();
    if(text.length>=3){
        $('#searchDropdown').addClass("show")
        SCGetDataSearch(text);
    }else $('#searchDropdown').removeClass("show");
}

function setGridView() {
    localStorage.setItem('view','0');
    $('#list-row').empty();
    $('#setGridView>div.float-right').addClass('mdi-check')
    $('#setListView>div.float-right').removeClass('mdi-check')

    CRUpdateFolderCard(folderData.childrenFolder);
    CRUpdateFileCard(folderData.childrenFile);

}

function setListView() {
    localStorage.setItem('view','1');
    $('#list-row').empty();
    $('#setGridView>div.float-right').removeClass('mdi-check')
    $('#setListView>div.float-right').addClass('mdi-check')
    CRUpdateFolderCard(folderData.childrenFolder);
    CRUpdateFileCard(folderData.childrenFile);
}

function profile() {

}

function checkFolderName(folderName) {
    for(let i=0; i<folderData.childrenFolder.length; i++){
        if (folderData.childrenFolder[i].FolderName == folderName) return false;
    }
    return true;
}

function checkFileName(fileName) {
    for(let i=0; i<folderData.childrenFile.length; i++){
        if (folderData.childrenFile[i].file_name == fileName) return false;
    }
    return true;
}


