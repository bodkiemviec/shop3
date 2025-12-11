// Khai báo biến toàn cục để lưu trữ dữ liệu tài khoản gốc
let allAccountsData = []; 

// Lấy vùng chứa các card
const container = document.getElementById('account-list-container');

// Lấy các phần tử input của bộ lọc
const searchInput = document.getElementById('searchInput');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const applyFiltersButton = document.getElementById('applyFilters');
const resetFiltersButton = document.getElementById('resetFilters');

// --- HÀM 1: HIỂN THỊ DỮ LIỆU ---
function displayAccounts(accounts) {
    let htmlContent = '';
    
    accounts.forEach(account => {
        const formattedPrice = account.price.toLocaleString('vi-VN');
        
        htmlContent += `
            <div class="col-md-4 col-sm-6 mt-3">
                <div class="card shadow-sm h-100">
                    <span class="account-id-badge">#${account.id}</span> 
                    
                    <img src="${account.image}" class="card-img-top" alt="${account.name}" style="height: 250px; object-fit: cover;">
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title">${account.name}</h5>
                        <p class="card-text fw-bold text-danger fs-4 mb-3">${formattedPrice} ${account.currency}</p>
                        <a href="${account.link}" class="btn btn-primary w-100 mt-auto">Khám phá</a>
                    </div>
                </div>
            </div>
        `;
    });

    if (accounts.length === 0) {
    // Thay đổi lớp text-info và fs-5 bằng lớp CSS tùy chỉnh
    htmlContent = '<p class="col-12 text-center no-results-message">⚠️ Không tìm thấy tài khoản nào phù hợp với điều kiện tìm kiếm/lọc.</p>';
    }

    container.innerHTML = htmlContent;
}


// --- HÀM 2: TẢI DỮ LIỆU GỐC ---
function loadAccounts() {
    fetch('/json/accounts/accounts2.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi: Không thể tải accounts.json. Mã lỗi: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            allAccountsData = data; // LƯU dữ liệu gốc vào biến toàn cục
            displayAccounts(allAccountsData); // Hiển thị tất cả lần đầu
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi:', error);
            container.innerHTML = '<p class="col-12 text-center text-danger">Không thể tải hoặc hiển thị dữ liệu tài khoản.</p>';
        });
}


// --- HÀM 3: ÁP DỤNG TẤT CẢ BỘ LỌC (LOGIC CHÍNH) ---
function applyAllFilters() {
    let filteredData = allAccountsData; // Bắt đầu từ dữ liệu gốc
    
    // 1. Lọc theo Tìm kiếm chung (Tên, ID, Tag)
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredData = filteredData.filter(account => {
            const nameMatch = account.name.toLowerCase().includes(searchTerm);
            const idMatch = account.id.toLowerCase().includes(searchTerm);
            const tagMatch = account.tags && account.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            return nameMatch || idMatch || tagMatch;
        });
    }

    // 2. Lọc theo Giá
    const minPrice = parseInt(minPriceInput.value) || 0;
    const maxPrice = parseInt(maxPriceInput.value) || Infinity; 

    filteredData = filteredData.filter(account => {
        return account.price >= minPrice && account.price <= maxPrice;
    });

    // 3. Hiển thị dữ liệu đã lọc
    displayAccounts(filteredData);
}

// --- HÀM 4: ĐẶT LẠI BỘ LỌC ---
function resetAllFilters() {
    searchInput.value = '';
    minPriceInput.value = '0';
    maxPriceInput.value = '';
    
    // Áp dụng lại bộ lọc để hiển thị tất cả
    applyAllFilters(); 
}

// --- THIẾT LẬP SỰ KIỆN LẮNG NGHE (CHỈ GẮN VÀO NÚT CLICK) ---

// Sự kiện cho nút "Áp dụng Lọc"
applyFiltersButton.addEventListener('click', applyAllFilters);

// Sự kiện cho nút "Đặt lại"
resetFiltersButton.addEventListener('click', resetAllFilters);

/* * Đã bỏ các sự kiện sau để không lọc khi gõ:
 * searchInput.addEventListener('input', applyAllFilters);
 * minPriceInput.addEventListener('input', applyAllFilters);
 * maxPriceInput.addEventListener('input', applyAllFilters);
*/

// Bắt đầu quá trình tải dữ liệu khi trang load
loadAccounts();