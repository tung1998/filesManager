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

    $('#myFile > a').addClass("menu-nav-active")


    $(document).on('click', '[idFolder]>a', function (e) {

        let idFolder = $(this).parent().attr("idFolder");

        if(localFolder.id!=idFolder) {

            SCGetDataFolder(idFolder);
        }

        $(document).on('click', '[idFolder] i', function (e) {
            e.stopPropagation();
        })
    })



    $(document).on('click', '#folderCard a.folder-item', function () {
        SCGetDataFolder($(this).attr('idFolder'));
    })

//$('.context-menu-one').contextMenu('update'); // update single menu
//$.contextMenu('update') // update all open menus
})




// });




function rename(a) {
    alertify
        .defaultValue(a.children().first().text())
        .prompt("CreateNewFile", function (folderName, ev) {
            ev.preventDefault();
            if(folderName) {
                alertify.success(" Success change: " + folderName)
                //make new folder
                renameFolder(userRootFolder.rootFile, folderName);

            }else {
                alertify.error('Please insert FolderName')
                rename(a);
            }
        }, function(ev) {
            ev.preventDefault();
        });
}










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


