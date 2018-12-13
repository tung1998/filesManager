//user
$(function() {
    $.contextMenu({
        selector: '.user-item',
        items: {
            "active": {
                name: "Active/Lock", icon: 'fa-lock', callback: function (key,opt) {
                    let id = opt.$trigger.attr('idUser');
                    let activate = opt.$trigger.attr('activate');
                    ALActivateUser(id,activate);   ///contentRender
                }
            },
            "sep1": "---------",
            "Change Pass": {
                name: "Change Pass", icon: "fa-key", callback: (key,opt) => {
                    let id = opt.$trigger.attr('idUser');
                    ALResetUserPassword(id);
                }
            },
            "sep2": "---------",
            "delete": {
                name: "delete User", icon: "paste", callback: (key,opt) => {
                    let id = opt.$trigger.attr('idUser');
                    ALDeleteUser(id)
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
                name: "NewAdmin", icon: 'fa-plus', callback: function () {
                    showCreateAdminForm();   ///contentRender
                }
            },
            "delete": {
                name: "Delete Admin", icon: "fa-trash", callback: (key,opt) => {
                    let id = opt.$trigger.attr('idUser');
                    ALDeleteAdmin(id);
                }
            },
            "sep1": "---------",
        }
    });
});