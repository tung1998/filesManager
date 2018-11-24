
//ground right Click
$(function() {
    $.contextMenu({
        selector: '#pageContent',
        items: {
            "add": {name: "NewFolder",
                icon: 'fa-plus',
                callback:function () {
                    if (localFolder.id<0) alertify.error("Can't add folder Hear");
                    else ADAddNewFolder();   ///contentRender
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
            "sep1": "---------",
            "love": {name: "Love/UnLove", icon: "fa-heart",callback:(key,opt)=> {
                    SCAddToLoveFolder(opt.$trigger);
                }},
            "share": {name: "Share File", icon: "fa-share-square-o",callback:(key,opt)=> {
                    ALNotWorkFunction();
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
            "sep1": "---------",
            "love": {name: "Love/UnLove", icon: "fa-heart",callback:(key,opt)=> {
                    SCAddToLoveFile(opt.$trigger);
                }},
            "share": {name: "Share File", icon: "fa-share-square-o",callback:(key,opt)=> {
                    ALNotWorkFunction();
                }},
            "download": {name: "Download File", icon: "fa-download",callback:(key,opt)=> {
                    ALNotWorkFunction();
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