// CRUD Files
// Cập nhật thông báo trên delete dialog
function confirmDelete(event, isDirectory, name) {
    const lastBreadcrumb = $("a[breadcrumb]").last();
    // Lấy path hiện tại đang đứng + tên folder vừa click
    const fullPath = lastBreadcrumb.attr("breadcrumb") + "/" + name;

    const delete_Modal = $("#confirm-delete");
    const delete_Modal_Title = delete_Modal.find(".modal-title");
    const delete_Modal_Body = delete_Modal.find(".modal-body");

    // Gán vào thẻ input type hidden trong delete modal val = fullPath
    delete_Modal.find("input[name='fullPath']").val(fullPath);

    isDirectory
        ?
        delete_Modal_Title.html("Xóa thư mục") :
        delete_Modal_Title.html("Xóa tập tin");
    isDirectory
        ?
        delete_Modal_Body.html(`Bạn có chắc rằng muốn xóa thư mục
    <strong>${name}</strong>`) :
        delete_Modal_Body.html(`Bạn có chắc rằng muốn xóa tập tin
    <strong>${name}</strong>`);
}

// Hiện thông báo bằng modal dialog, truyền tiêu đề và nội dung thông báo
function showMessageDialog(title, bodyMessage) {
    const message_Modal = $("#message-dialog");
    const message_Modal_Title = message_Modal.find(".modal-title");
    const message_Modal_Body = message_Modal.find(".modal-body");

    message_Modal_Title.html(title);
    message_Modal_Body.html(bodyMessage);

    message_Modal.modal("show");
}