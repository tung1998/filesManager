$(function() {
    $.contextMenu({
        selector: '.user-item',
        items: {
            "add": {
                name: "NewFolder", icon: 'fa-plus', callback: function () {
                    ALNotWorkFunction();   ///contentRender
                }
            },
            "fileUpload": {
                name: "FileUpload", icon: "fa-cloud-upload", callback: () => {
                    ALNotWorkFunction();
                }
            },
            "sep1": "---------",
            "paste": {
                name: "Paste", icon: "paste", callback: () => {
                    ALNotWorkFunction();
                }
            },
        }
    });
});


$(function() {
    $.contextMenu({
        selector: '.file-item',
        items: {
            "add": {
                name: "NewFolder", icon: 'fa-plus', callback: function () {
                    ALNotWorkFunction();   ///contentRender
                }
            },
            "fileUpload": {
                name: "FileUpload", icon: "fa-cloud-upload", callback: () => {
                    ALNotWorkFunction();
                }
            },
            "sep1": "---------",
            "paste": {
                name: "Paste", icon: "paste", callback: () => {
                    ALNotWorkFunction();
                }
            },
        }
    });
});



$(function() {
    $.contextMenu({
        selector: '.admin-item',
        items: {
            "add": {
                name: "NewFolder", icon: 'fa-plus', callback: function () {
                    ALNotWorkFunction();   ///contentRender
                }
            },
            "fileUpload": {
                name: "FileUpload", icon: "fa-cloud-upload", callback: () => {
                    ALNotWorkFunction();
                }
            },
            "sep1": "---------",
            "paste": {
                name: "Paste", icon: "paste", callback: () => {
                    ALNotWorkFunction();
                }
            },
        }
    });
});