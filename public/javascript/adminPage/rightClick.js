//user
$(function() {
    $.contextMenu({
        selector: '.user-item',
        items: {
            "active": {
                name: "Active/Lock", icon: 'fa-key', callback: function (key,opt) {
                    let id = opt.$trigger.attr('idUser');
                    let activate = opt.$trigger.attr('activate');
                    ALActivateUser(id,activate);   ///contentRender
                }
            },
            "sep1": "---------",
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
//file
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
//admin
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