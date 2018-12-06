function SCGetUserData() {
    $.ajax({
        url: `/folder/getFolderData`,
        type: 'post',
        data: JSON.stringify({id: id, path: path}),
        contentType: "application/json",
        success: function (data) {
            if (data == 0) {
                ALRestoreFolder(id);
            }
        }
    })
}