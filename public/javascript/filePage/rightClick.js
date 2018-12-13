
//ground right Click
$(function() {
    $.contextMenu({
        selector: '#FileFolder',
        items: {
            "add": {name: "NewFolder",
                icon: 'fa-plus',
                callback:function () {
                    ADAddNewFolder();   ///contentRender
                }},
            // "edit": {name: "Edit", icon: "edit",callback:()=> {
            //         ALNotWorkFunction();
            //     }},
            "fileUpload": {name: "FileUpload", icon: "fa-cloud-upload",callback:()=> {
                    if (localFolder.id<0) alertify.error("Can't add file Hear");
                    else ALUploadFile();
                }},
            "sep1": "---------",
            "paste": {name: "Paste", icon: "paste",callback:()=> {
                    ALClipboard(localFolder.id,localFolder.FolderName);
                }},
        }
    });

    // $(document).on('click', '#pageContent', (e)=>{
    //     // console.log('clicked', this);
    // })
});

//folder right click
$(function() {
    $.contextMenu({
        selector: '.folder-item',
        items: {
            "show": {name: "Show Folder", icon: "fa-eye", callback: (key,opt) => {
                    let id = opt.$trigger.attr("idFolder")
                    SCGetDataFolder(id);
                }},
            "sep1": "---------",
            "cut": {name: "Cut", icon: "cut",callback:(key,opt)=> {
                    $(document).find(".on-cut").removeClass("on-cut")
                    let folder =opt.$trigger;
                    folder.addClass('on-cut')
                    clipboard.type=1;
                    clipboard.id=folder.attr('idFolder');
                    clipboard.method=0;
                    clipboard.localFolder=localFolder.id;
                    if(localStorage.getItem('view')==1){
                        clipboard.name = folder.find('.list-view-name').first().text();
                    }else {
                        clipboard.name = folder.find('i').first().text()
                    }
                }},
            'copy': {name: "Copy", icon: "copy",callback:(key,opt)=> {
                    $(document).find(".on-cut").removeClass("on-cut")
                    let folder =opt.$trigger;
                    clipboard.type=1;
                    clipboard.id=folder.attr('idFolder');
                    clipboard.method=1;
                    clipboard.localFolder=localFolder.id;
                    if(localStorage.getItem('view')==1){
                        clipboard.name = folder.find('.list-view-name').first().text();
                    }else {
                        clipboard.name = folder.find('i').first().text()
                    }
                }},
            "paste": {name: "Paste", icon: "paste",callback:(key,opt)=> {
                    let folder = opt.$trigger;
                    let id =folder.attr('idFolder');
                    if(localStorage.getItem('view')==1){
                        let name = folder.find('.list-view-name').first().text();
                        ALClipboard(id,name);
                    }else {
                        let name = folder.find('i').first().text()
                        ALClipboard(id,name);
                    }

                }},
            "delete": {name: "Add to trash", icon: "delete",callback:(key,opt)=> {
                    SCDeleteFolder(opt.$trigger);
                }},
            "sep2": "---------",
            "love": {name: "Love/UnLove", icon: "fa-heart",callback:(key,opt)=> {
                    if (localFolder.id==-7) alertify.error("Can't add to love folder");
                    else {
                        SCAddToLoveFolder(opt.$trigger);
                    }
                }},
            "share": {name: "Share Folder", icon: "fa-share-square-o",callback:(key,opt)=> {
                    let idFolder = opt.$trigger.attr("idFolder")
                    ADShareFolder(idFolder);
                }},
            "rename": {name: "rename", icon: "fa-pencil", callback: (key,opt) => {
                    let file = opt.$trigger;
                    let id =file.attr('idFolder');
                    if(localStorage.getItem('view')==1){
                        let name = file.find('.list-view-name').first().text();
                        ALRenameFolder(id,name);
                    }else {
                        let name = file.find('i').first().text()
                        ALRenameFolder(id,name);
                    }
                    // console.log(opt.$trigger)
                }}
        }
    });

});

//file right click
$(function() {
    $.contextMenu({
        selector: '.file-item',
        items: {
            "show": {name: "Show File", icon: "fa-eye", callback: (key,opt) => {
                    let file = opt.$trigger;
                    let type = file.attr("typeFile")
                    let id = file.attr("idFile")
                    let name = file.find('i').first().text();
                    showFile(type,id,name);
                }},
            "sep1": "---------",
            "cut": {name: "Cut", icon: "cut",callback:(key,opt)=> {
                    let file = opt.$trigger;
                    $(document).find(".on-cut").removeClass("on-cut")
                    file.addClass("on-cut");
                    clipboard.type=0;
                    clipboard.id=file.attr('idFile');
                    clipboard.method=0;
                    clipboard.localFolder=localFolder.id;
                    if(localStorage.getItem('view')==1){
                        clipboard.name = file.find('.list-view-name').first().text();
                    }else {
                        clipboard.name = file.find('i').first().text()
                    }
                }},
            'copy': {name: "Copy", icon: "copy",callback:(key,opt)=> {
                    if(localFolder.id!=-1){
                        $(document).find(".on-cut").removeClass("on-cut")
                        let file = opt.$trigger;
                        clipboard.type=0;
                        clipboard.id=file.attr('idFile');
                        clipboard.method=1;
                        clipboard.localFolder=localFolder.id;
                        if(localStorage.getItem('view')==1){
                            clipboard.name = file.find('.list-view-name').first().text();
                        }else {
                            clipboard.name = file.find('i').first().text()
                        }
                    }else alertify.error('Can not add to clipboard')
                }},
            "delete": {name: "Add to trash", icon: "delete",callback:(key,opt)=> {
                    SCDeleteFile(opt.$trigger);
                }},
            "sep2": "---------",
            "love": {name: "Love/UnLove", icon: "fa-heart",callback:(key,opt)=> {
                    if (localFolder.id==-7) alertify.error("Can't add to love file");
                    else {
                        SCAddToLoveFile(opt.$trigger);
                    }
                }},
            "share": {name: "Share File", icon: "fa-share-square-o",callback:(key,opt)=> {
                    let idFile = opt.$trigger.attr("idFile")
                    ADShareFile(idFile);
                }},
            "download": {name: "Download File", icon: "fa-download",callback:(key,opt)=> {
                    SCDownloadFile(opt.$trigger.attr("idFile"));
                }},
            "rename": {name: "rename", icon: "fa-pencil", callback: (key,opt) => {
                    let file = opt.$trigger;
                    let id =file.attr('idFile');
                    if(localStorage.getItem('view')==1){
                        let name = file.find('.list-view-name').first().text();
                        ALRenameFile(id,name);
                    }else {
                        let name = file.find('i').first().text()
                        ALRenameFile(id,name);
                    }


                    // console.log(opt.$trigger)
            }}
        }
    });

});