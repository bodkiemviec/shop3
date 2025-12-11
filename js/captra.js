    // Biến toàn cục để lưu trữ mã CAPTCHA hiện tại
    let currentCaptcha = '';

    /**
     * @function showMessage
     * Hiển thị thông báo trong hộp cảnh báo tùy chỉnh
     * @param {string} message - Nội dung thông báo
     * @param {string} type - Loại thông báo (success, danger, warning, info)
     */
    function showMessage(message, type = 'info') {
        const messageBox = document.getElementById('message-box');
        messageBox.className = `mb-4 alert alert-${type} fade show`;
        messageBox.innerHTML = `<strong>${message}</strong>`;
        messageBox.style.display = 'block';
    }
    
    /**
     * @function generateCaptcha
     * Tạo một mã CAPTCHA ngẫu nhiên và hiển thị nó.
     */
    function generateCaptcha() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        const length = 6; // Độ dài mã CAPTCHA
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            captcha += characters.charAt(randomIndex);
        }
        
        currentCaptcha = captcha;
        document.getElementById('captchaDisplay').textContent = captcha;
    }

    /**
     * @function validateCustomFields
     * Thực hiện các kiểm tra xác thực tùy chỉnh (Mật khẩu, CAPTCHA).
     * @param {FormData} formData - Dữ liệu form
     * @returns {boolean} - True nếu hợp lệ, False nếu không.
     */
    function validateCustomFields(formData) {
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        const captchaInput = formData.get('captchaInput');

        // 1. Kiểm tra Mật khẩu có đủ độ dài tối thiểu (8)
        if (password.length < 8) {
            showMessage('Mật khẩu phải có tối thiểu 8 ký tự!', 'warning');
            return false;
        }

        // 2. Kiểm tra Mật khẩu và Xác nhận Mật khẩu có khớp nhau
        if (password !== confirmPassword) {
            showMessage('Mật khẩu và Xác nhận Mật khẩu không khớp!', 'danger');
            return false;
        }

        // 3. Kiểm tra CAPTCHA
        if (captchaInput !== currentCaptcha) {
            showMessage('Mã xác thực (CAPTCHA) không đúng. Vui lòng thử lại.', 'danger');
            generateCaptcha(); // Tạo mã mới sau khi nhập sai
            document.getElementById('captchaInput').value = ''; // Xóa trường nhập CAPTCHA
            return false;
        }

        return true;
    }

    // --- MAIN EXECUTION ---
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('registrationForm');
        
        // Khởi tạo CAPTCHA khi trang tải
        generateCaptcha();
        
        // Ẩn hộp thông báo lúc đầu
        document.getElementById('message-box').style.display = 'none';

        // Xử lý sự kiện gửi form
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn chặn gửi form mặc định
            event.stopPropagation();

            // Lấy dữ liệu form
            const formData = new FormData(form);

            // 1. Kiểm tra xác thực mặc định của Bootstrap (trường required)
            if (!form.checkValidity()) {
                // Thêm class 'was-validated' để hiển thị phản hồi của Bootstrap
                form.classList.add('was-validated'); 
                showMessage('Vui lòng điền đầy đủ và chính xác tất cả các trường bắt buộc.', 'warning');
                return;
            }

            // 2. Kiểm tra xác thực tùy chỉnh (Mật khẩu, CAPTCHA)
            if (!validateCustomFields(formData)) {
                // Nếu validateCustomFields trả về false, lỗi đã được hiển thị
                return;
            }
            
            // --- Nếu tất cả kiểm tra đều thành công ---
            form.classList.add('was-validated'); // Giữ lại trạng thái đã kiểm tra
            
            // Chuẩn bị dữ liệu để gửi (ví dụ: in ra console)
            const registrationData = {};
            for (let [key, value] of formData.entries()) {
                if (key !== 'confirm_password' && key !== 'captchaInput' && key !== 'terms') {
                    registrationData[key] = value;
                }
            }
            
            console.log('Dữ liệu đăng ký hợp lệ:', registrationData);

            // Hiển thị thông báo thành công
            showMessage('Đăng ký thành công! Chúc mừng bạn đã có tài khoản.', 'success');
            
            // Có thể thêm logic AJAX để gửi dữ liệu lên server tại đây:
            /*
            fetch('your_api_endpoint', {
                method: 'POST',
                body: JSON.stringify(registrationData),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    showMessage('Đăng ký thành công!', 'success');
                    form.reset(); // Xóa form
                    generateCaptcha(); // Tạo CAPTCHA mới
                } else {
                    showMessage(data.message || 'Đăng ký thất bại. Vui lòng thử lại.', 'danger');
                    generateCaptcha(); // Tạo CAPTCHA mới
                }
            })
            .catch(error => {
                console.error('Lỗi khi gửi dữ liệu:', error);
                showMessage('Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.', 'danger');
                generateCaptcha();
            });
            */
        });
    });