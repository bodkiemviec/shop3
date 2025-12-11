document.addEventListener('DOMContentLoaded', function() {
    // 1. Lấy phần tử chính của bong bóng liên hệ
    const contactBubble = document.querySelector('.contact-bubble');
    
    // 2. Lấy phần tử biểu tượng chính (nơi người dùng sẽ nhấn)
    const mainIcon = document.querySelector('.main-icon');

    // 3. Định nghĩa hàm chuyển đổi trạng thái
    function toggleBubble() {
        // Dùng .classList.toggle() để thêm hoặc xóa lớp 'active'
        // Lớp 'active' này đã được định nghĩa trong CSS để hiển thị các nút con
        contactBubble.classList.toggle('active');
    }

    // 4. Gắn sự kiện 'click' (nhấn) vào biểu tượng chính
    if (mainIcon) {
        mainIcon.addEventListener('click', toggleBubble);
    }
    
    // Tùy chọn: Đóng bong bóng khi nhấn ra ngoài
    document.addEventListener('click', function(event) {
        // Kiểm tra xem cú nhấp chuột có nằm ngoài .contact-bubble không
        if (contactBubble && !contactBubble.contains(event.target) && contactBubble.classList.contains('active')) {
            contactBubble.classList.remove('active');
        }
    });

});