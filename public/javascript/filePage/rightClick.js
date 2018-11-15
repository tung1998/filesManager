$(function() {
    $.contextMenu({
        selector: '#pageContent',
        items: {
            "add": {name: "NewFolder",
                icon: 'fa-plus',
                callback:function () {
                    SCAddNewFolderToDb();   ///contentRender
                }},
            "edit": {name: "Edit", icon: "edit"},
            "sep1": "---------",
            "paste": {name: "Paste", icon: "paste"},
        }
    });

    $(document).on('click', '#pageContent',  function(e){
        // console.log('clicked', this);
    })
});




$(function() {
    $.contextMenu({
        selector: '.folder-item',
        items: {
            "cut": {name: "Cut", icon: "cut"},
            'copy': {name: "Copy", icon: "copy"},
            "paste": {name: "Paste", icon: "paste"},
            "delete": {name: "Delete", icon: "delete"},
            "sep1": "---------",
            "rename": {name: "rename", icon: "fa-pencil", callback:function () {
                    rename(this);
                    console.log(this.children().first().text());
                }}
        }
    });

    $('.folder-item').on('click', function(e){
        // console.log('clicked', this);
    })
});