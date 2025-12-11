let allTags = [];
let selectedTags = [];
const maxTags = 7;

const searchInput = document.getElementById("tagSearch");
const suggestionsBox = document.getElementById("tagSuggestions");
const selectedBox = document.getElementById("selectedTagsBox");
const hiddenInput = document.getElementById("tags");

// Load từ JSON
fetch("/json/datatags.json")
    .then(res => res.json())
    .then(data => {
        allTags = data.tags; // lưu lại để tìm kiếm
    })
    .catch(err => console.error("Lỗi load tags:", err));

// Khi gõ vào ô tìm kiếm
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    
    // Nếu không gõ gì → ẩn suggestion
    if (keyword.length === 0) {
        suggestionsBox.innerHTML = "";
        return;
    }

    // Lọc tag theo từ khóa
    const results = allTags.filter(t => t.toLowerCase().includes(keyword));

    renderSuggestions(results);
});

function renderSuggestions(list) {
    suggestionsBox.innerHTML = "";

    if (list.length === 0) {
        suggestionsBox.innerHTML = `<div class="text-muted">Không tìm thấy tag...</div>`;
        return;
    }

    list.forEach(tag => {
        // Nếu tag đã được chọn thì không cho hiển thị trong gợi ý
        if (selectedTags.includes(tag)) return;

        const el = document.createElement("div");
        el.classList.add("tag-suggestion");
        el.textContent = tag;

        el.onclick = () => selectTag(tag);

        suggestionsBox.appendChild(el);
    });
}

function selectTag(tag) {
    if (selectedTags.length >= maxTags) {
        alert("Bạn chỉ được chọn tối đa 7 tag!");
        return;
    }

    selectedTags.push(tag);
    updateSelectedUI();

    // Xóa từ thanh tìm kiếm + ẩn gợi ý
    searchInput.value = "";
    suggestionsBox.innerHTML = "";
}

function updateSelectedUI() {
    selectedBox.innerHTML = "";

    selectedTags.forEach(tag => {
        const el = document.createElement("span");
        el.className = "selected-tag";
        el.textContent = tag;

        el.onclick = () => removeTag(tag);

        selectedBox.appendChild(el);
    });

    hiddenInput.value = selectedTags.join(",");
}

function removeTag(tag) {
    selectedTags = selectedTags.filter(t => t !== tag);
    updateSelectedUI();
}