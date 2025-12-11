// script.js

// 1. Lấy các phần tử cần thiết
const themeLink = document.getElementById('theme-link'); // Thẻ <link> với ID="theme-link"
const toggleSwitch = document.getElementById('checkbox'); // Nút checkbox
const DARK_THEME_PATH = '/css/index4.css';
const LIGHT_THEME_PATH = '/css/index3.css';

// 2. Hàm chuyển đổi file CSS
function switchCssFile(event) {
    if (event.target.checked) {
        // Nếu được check (BẬT) -> Chuyển sang Dark Mode
        themeLink.href = DARK_THEME_PATH;
        localStorage.setItem('theme', 'dark'); // Lưu trạng thái
    } else {
        // Nếu KHÔNG được check (TẮT) -> Chuyển về Light Mode
        themeLink.href = LIGHT_THEME_PATH;
        localStorage.setItem('theme', 'light'); // Lưu trạng thái
    }
}

// 3. Lắng nghe sự kiện click
toggleSwitch.addEventListener('change', switchCssFile);

// 4. Khôi phục trạng thái khi tải trang (duy trì lựa chọn)
window.addEventListener('load', () => {
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        // Nếu theme đã lưu là dark, cập nhật đường dẫn và trạng thái nút
        themeLink.href = DARK_THEME_PATH;
        toggleSwitch.checked = true;
    } else {
        // Mặc định hoặc theme đã lưu là light, không cần làm gì nhiều
        // (Do href mặc định trong HTML đã là light-theme.css)
        toggleSwitch.checked = false;
    }
});