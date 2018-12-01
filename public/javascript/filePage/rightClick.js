
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
                    ALNotWorkFunction();
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
            "cut": {name: "Cut", icon: "cut",callback:()=> {
                    ALNotWorkFunction();
                }},
            'copy': {name: "Copy", icon: "copy",callback:()=> {
                    ALNotWorkFunction();
                }},
            "paste": {name: "Paste", icon: "paste",callback:()=> {
                    ALNotWorkFunction();
                }},
            "delete": {name: "Add to trash", icon: "delete",callback:(key,opt)=> {
                    SCDeleteFolder(opt.$trigger);
                }},
            "sep2": "---------",
            "love": {name: "Love/UnLove", icon: "fa-heart",callback:(key,opt)=> {
                    SCAddToLoveFolder(opt.$trigger);
                }},
            "share": {name: "Share Folder", icon: "fa-share-square-o",callback:(key,opt)=> {
                    let idFolder = opt.$trigger.attr("idFolder")
                    ADShareFolder(idFolder);
                }},
            "download": {name: "Download File", icon: "fa-download",callback:(key,opt)=> {
                    ALNotWorkFunction();
                }},
            "rename": {name: "rename", icon: "fa-pencil", callback: (key,opt) => {
                    ALRenameFolder(opt.$trigger);
                    // console.log(opt.$trigger)
                }}
        }
    });

    // $('.folder-item').on('click', (e)=>{
    //     // console.log('clicked', this);
    // })
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
            "cut": {name: "Cut", icon: "cut",callback:()=> {
                    ALNotWorkFunction();
                }},
            'copy': {name: "Copy", icon: "copy",callback:()=> {
                    ALNotWorkFunction();
                }},
            "paste": {name: "Paste", icon: "paste",callback:()=> {
                    ALNotWorkFunction();
                }},
            "delete": {name: "Add to trash", icon: "delete",callback:(key,opt)=> {
                    SCDeleteFile(opt.$trigger);
                }},
            "sep2": "---------",
            "love": {name: "Love/UnLove", icon: "fa-heart",callback:(key,opt)=> {
                    SCAddToLoveFile(opt.$trigger);
                }},
            "share": {name: "Share File", icon: "fa-share-square-o",callback:(key,opt)=> {
                    ALNotWorkFunction();
                }},
            "download": {name: "Download File", icon: "fa-download",callback:(key,opt)=> {
                    SCDownloadFile(opt.$trigger.attr("idFile"));
                }},
            "rename": {name: "rename", icon: "fa-pencil", callback: (key,opt) => {
                    ALRenameFile(opt.$trigger);
                    // console.log(opt.$trigger)
                }}
        }
    });

    // $('.folder-item').on('click', (e)=>{
    //     // console.log('clicked', this);
    // })
});