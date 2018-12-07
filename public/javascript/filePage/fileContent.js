
const modal = $(document).find("#file-content")
const fileBox = $(document).find("#fileBox")
const captionText = $(document).find("#caption")
//download
var codeName;
var idFileOnShow;
var nameFileOnShow;

$(document).on("click","#download",function () {
    // let name = $(document).find("#caption>i").text();
    window.open("/download/"+codeName);
})

$(document).on("click","#share",function () {
    ADShareFile(idFileOnShow);
})

$(document).on("click","#close",function () {
    codeName="";
    modal.removeClass("small-box");
    modal.hide();
    $('.modal-content').remove()
})

$(document).on("click","#size",function () {
    modal.toggleClass("small-box");
    $("#size>i").toggleClass("mdi-fullscreen mdi-fullscreen-exit");
})

async function showFile(type,id,name){

    idFileOnShow=id;
    nameFileOnShow=name
    $.ajax({
        type: 'post',
        url: '/file/getCodeName',
        dataType: 'json',
        data: {id:id},
        success: function (data) {
            codeName = data.code;
            console.log(codeName);
            $('.modal-content').remove()
            // console.log(file)
            captionText.find('i').text(name)
            if(type==1){
                showFilePicture(codeName)
                modal.show();
            }
            else if(type==2){
                showFileTxt(codeName)
                modal.show();
            }
            else if(type==3){
                window.open(`/pdf/${codeName}`)
            }
            else if(type==4){
                showFileMp3(codeName)
                modal.show();
            }
            else if(type==5){
                showFileMp4(codeName)
                modal.show();
            }
            else if(type==0){
                alertify.confirm("Không có bản xem trước. Download?", function (ev) {
                    ev.preventDefault();
                    SCDownloadFile(id);
                }, function(ev) {
                    ev.preventDefault();
                });
            }

        }
    })

}

function showFilePicture(id) {
    modal.append(`<img class="modal-content" src="/userFile/${id}">`)
}

async function showFileTxt(id) {
    modal.append(`<div class="modal-content txt-file"></div>`)
    $.ajax({
        type: 'post',
        url: '/file/getTxtData',
        dataType: 'json',
        data: {id:id},
        success: function (data) {
            console.log(data);
            data.forEach(function (item) {
                $(document).find('.txt-file').append(`<p>${item}</p>`)
            })
        }
    })
}

function showFileMp3(id) {
    modal.append(`<div class="modal-content"><audio controls><source src="/userFile/${id}" type="audio/mpeg"></audio></div>`)
}

function showFileMp4(id) {
    modal.append(`<div class="modal-content"><video controls><source src="/userFile/${id}" type="video/mp4"></video></div>`)
}




fileBox.on("click",()=>{
    modal.addClass("small-box");
    $("#size>i").removeClass("mdi-fullscreen-exit");
    $("#size>i").addClass("mdi-fullscreen");

})


