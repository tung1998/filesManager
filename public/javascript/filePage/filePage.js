let localFolder = folderData.localFolder;
//
// window.onpopstate = function(e){
//     if(e.state){
//         var currentState = history.state;
//         $("body").html(e.state.html);
//         console.log(e.state)
//         document.title = e.state.pageTitle;
//     }
//
// };
// $(document).ready( () => {


$(function () {

    if(window.location.pathname=="/trash"){
        SCGetTrashData();
    }
    if(window.location.pathname=="/love"){
        SCGetOnLoveData();
    }
    if(window.location.pathname=="/openRecent"){
        SCGetFileOpenRecent();
    }

    $('#myFile > a').addClass("menu-nav-active")


    $(document).on('click',function(){
        if($("#Search").is(":focus")&&$("#Search").val().length>=3){
            $('#searchDropdown').addClass("show")
        }else {
            $('#searchDropdown').removeClass("show");
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
        SCGetDataFolder($(this).attr('idFolder'));
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

    // $('#folderCard a.folder-item').on('click' ,function () {
    //     SCGetDataFolder($(this).attr('idFolder'));
    // })


    CRUpdateFileCard(folderData.childrenFile);
    CRUpdateFolderCard(folderData.childrenFolder);

})




// });










//logout
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


function profile() {

}



function checkFolderName(folderName) {
    for(let i=0; i<folderData.childrenFolder.length; i++){
        if (folderData.childrenFolder[i].FolderName === folderName) return false;
    }
    return true;
}
function checkFileName(fileName) {
    for(let i=0; i<folderData.childrenFile.length; i++){
        if (folderData.childrenFile[i].file_name === fileName) return false;
    }
    return true;
}


