// ==========================================
// 1. DATABASE ẢO & QUẢN LÝ PHIÊN ĐĂNG NHẬP
// ==========================================
window.currentLang = 'vi';
window.depositTimerInterval = null; 

// Khởi tạo Database tổng của hệ thống
window.usersDB = JSON.parse(localStorage.getItem('changMmoUsers')) || {};

// Tự động tạo sẵn tài khoản Admin đặc quyền
if (!window.usersDB['0394539007']) {
    window.usersDB['0394539007'] = { 
        pass: '21022007', 
        name: 'Admin CHANG', 
        balance: 0, 
        totalDeposit: 2000000, 
        totalSpent: 600000, 
        history: [], 
        chatData: [], 
        isAdmin: true, 
        refCode: 'ADMIN_VIP' 
    };
    localStorage.setItem('changMmoUsers', JSON.stringify(window.usersDB));
}

// Trạng thái mặc định khi chưa đăng nhập
window.isLoggedIn = false;
window.currentUser = { 
    name: "KHÁCH VÃNG LAI", 
    balance: 0, 
    totalDeposit: 0, 
    totalSpent: 0, 
    history: [], 
    chatData: [], 
    isAdmin: false 
};

// Kiểm tra xem máy người dùng có đang lưu phiên đăng nhập không
const savedSessionId = localStorage.getItem('changMmoSessionId');
if (savedSessionId && window.usersDB[savedSessionId]) {
    window.isLoggedIn = true;
    window.currentUser = window.usersDB[savedSessionId];
    window.currentUser.id = savedSessionId;
    
    // Đảm bảo các tài khoản cũ không bị lỗi thiếu trường dữ liệu
    if(!window.currentUser.history) window.currentUser.history = [];
    if(!window.currentUser.chatData) window.currentUser.chatData = [];
    if(!window.currentUser.totalDeposit) window.currentUser.totalDeposit = 0;
    if(!window.currentUser.totalSpent) window.currentUser.totalSpent = 0;
}

// Hàm lưu dữ liệu người dùng hiện tại vào Database
window.saveUserDB = function() {
    if (window.isLoggedIn && window.currentUser.id) {
        window.usersDB[window.currentUser.id] = window.currentUser;
        localStorage.setItem('changMmoUsers', JSON.stringify(window.usersDB));
    }
};

// ==========================================
// 2. TÍNH TOÁN CẤP ĐỘ VIP & TIỀN TỆ
// ==========================================
window.getVipInfo = function() {
    const d = window.currentUser.totalDeposit || 0;
    const s = window.currentUser.totalSpent || 0;
    
    if (d >= 1000000 && s >= 500000) {
        return { level: 3, name: "Hạng VIP", color: "#FFD700", discount: 15, next: "Max Level" };
    } else if (d >= 500000 && s > 0) {
        return { level: 2, name: "Thành Viên", color: "#C0C0C0", discount: 5, next: "Cấp 3" };
    } else {
        return { level: 1, name: "Hạng Thường", color: "#CD7F32", discount: 0, next: "Cấp 2" };
    }
};

window.formatCurrency = function(amount) {
    let val = parseInt(amount) || 0; 
    if (window.currentLang === 'vi') return val.toLocaleString('vi-VN') + ' ₫';
    return '$' + (val / 25000).toFixed(2); 
};

// ==========================================
// 3. TỪ ĐIỂN ĐA NGÔN NGỮ (FULL 100%)
// ==========================================
const i18n = {
    vi: { 
        welcome_title: "Thông Báo", welcome_text: "Web CHANGDINHANHMMO xin chào khách hàng đã đến với dịch vụ !!!", welcome_btn: "Đã hiểu", 
        menu_home: "Trang Chủ", menu_services: "Dịch Vụ", menu_balance: "Số Dư", menu_deposit: "Nạp tiền", menu_history: "Lịch sử", menu_partners: "Đối Tác", menu_policy: "Chính Sách", menu_contact: "Liên Hệ", menu_profile: "Trang Cá Nhân", menu_login: "Đăng Nhập", menu_register: "Đăng Ký", btn_deposit: "Nạp",
        guest_name: "KHÁCH VÃNG LAI", admin_name: "QUẢN TRỊ VIÊN", vip_level_title: "Cấp Tài Khoản",
        search_placeholder: "Nhập tên dịch vụ...", btn_search: "Tìm",
        srv_fb: "Dịch vụ Facebook", srv_tt: "Dịch vụ TikTok", srv_ig: "Dịch vụ Instagram", srv_yt: "Dịch vụ YouTube", srv_tele: "Dịch vụ Telegram", srv_tw: "Dịch vụ Twitter (X)", srv_sp: "Dịch vụ Shopee", srv_threads: "Dịch vụ Threads", srv_free: "Dịch vụ Miễn phí", srv_other: "Dịch vụ Khác",
        home_title: "Nâng Tầm Tương Tác Số", home_sub: "Giải pháp mạng xã hội, bảo mật và cung cấp tài nguyên MMO chuyên nghiệp.", home_box_title: "Dịch Vụ Nổi Bật", home_box_sub: "Chào mừng bạn đến với hệ thống! Mọi thứ đã hoạt động hoàn hảo."
    },
    en: { 
        welcome_title: "Notice", welcome_text: "Welcome to CHANGDINHANHMMO services !!!", welcome_btn: "Got it", 
        menu_home: "Home", menu_services: "Services", menu_balance: "Balance", menu_deposit: "Deposit", menu_history: "History", menu_partners: "Partners", menu_policy: "Policies", menu_contact: "Contact Us", menu_profile: "Profile", menu_login: "Login", menu_register: "Register", btn_deposit: "Deposit",
        guest_name: "GUEST USER", admin_name: "ADMINISTRATOR", vip_level_title: "Account Level",
        search_placeholder: "Search for services...", btn_search: "Search",
        srv_fb: "Facebook Services", srv_tt: "TikTok Services", srv_ig: "Instagram Services", srv_yt: "YouTube Services", srv_tele: "Telegram Services", srv_tw: "Twitter (X) Services", srv_sp: "Shopee Services", srv_threads: "Threads Services", srv_free: "Free Services", srv_other: "Other Services",
        home_title: "Elevate Digital Interaction", home_sub: "Professional social media solutions, security, and elite MMO resources.", home_box_title: "Featured Services", home_box_sub: "Welcome to the system! Everything is working perfectly."
    }
};

window.applyTranslations = function() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[window.currentLang] && i18n[window.currentLang][key]) {
            // Dịch cả ô tìm kiếm (placeholder) lẫn văn bản thường
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = i18n[window.currentLang][key];
            } else {
                el.innerHTML = i18n[window.currentLang][key]; 
            }
        }
    });
    window.updateBalanceUI();
};

// ==========================================
// 4. HỆ THỐNG THÔNG BÁO (MODAL 3D CAO CẤP)
// ==========================================
window.showCustomModal = function(title, message, type = 'alert', onConfirm = null) {
    const existing = document.getElementById('customModalUi');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'customModalUi';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); display:flex; justify-content:center; align-items:center; z-index:15000; opacity:0; transition:all 0.3s ease;';
    
    let buttonsHtml = '';
    if (type === 'confirm') {
        buttonsHtml = `
            <div style="display:flex; gap:12px; margin-top:25px;">
                <button onclick="window.closeCustomModal()" style="flex:1; padding:14px; border-radius:12px; background:rgba(255,255,255,0.1); color:#fff; border:none; font-weight:700; cursor:pointer;">Hủy</button>
                <button id="modalConfirmBtn" style="flex:1; padding:14px; border-radius:12px; background:linear-gradient(135deg, #FF375F, #FF453A); color:#fff; border:none; font-weight:700; cursor:pointer; box-shadow: 0 5px 15px rgba(255,55,95,0.4);">Đồng ý</button>
            </div>`;
    } else {
        buttonsHtml = `<button id="modalAlertBtn" style="width:100%; margin-top:25px; padding:14px; border-radius:12px; background:linear-gradient(135deg, #0A84FF, #00C6FF); color:#fff; border:none; font-weight:700; cursor:pointer; box-shadow: 0 5px 15px rgba(10,132,255,0.4);">Đã hiểu</button>`;
    }

    modal.innerHTML = `
        <div id="customModalContent" style="background:rgba(30,30,35,0.95); border:1px solid rgba(255,255,255,0.1); padding:30px 25px; border-radius:24px; width:320px; text-align:center; transform:scale(0.8) translateY(20px); transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h3 style="color:#fff; margin-bottom:12px; font-size:20px;">${title}</h3>
            <p style="color:#8e8e93; font-size:15px; line-height:1.5;">${message}</p>
            ${buttonsHtml}
        </div>`;
    document.body.appendChild(modal);
    
    if (type === 'confirm' && onConfirm) {
        document.getElementById('modalConfirmBtn').onclick = () => { window.closeCustomModal(); onConfirm(); };
    } else if (type === 'alert') {
        document.getElementById('modalAlertBtn').onclick = () => { window.closeCustomModal(); if(onConfirm) onConfirm(); };
    }

    requestAnimationFrame(() => { 
        modal.style.opacity = '1'; 
        document.getElementById('customModalContent').style.transform = 'scale(1) translateY(0)'; 
    });
};

window.closeCustomModal = function() {
    const modal = document.getElementById('customModalUi');
    if (modal) { 
        modal.style.opacity = '0'; 
        document.getElementById('customModalContent').style.transform = 'scale(0.8) translateY(20px)'; 
        setTimeout(() => modal.remove(), 300); 
    }
};

window.closeWelcomePopup = function() {
    const popup = document.getElementById('welcomePopup');
    if(popup) popup.classList.remove('active');
};

// ==========================================
// 5. LOGIC XÁC THỰC (ĐĂNG KÝ, ĐĂNG NHẬP, ĐĂNG XUẤT)
// ==========================================
window.executeRegister = function() {
    const name = document.getElementById('regName')?.value;
    const id = document.getElementById('regId')?.value;
    const pass = document.getElementById('regPass')?.value; 
    const ref = document.getElementById('regRef')?.value;

    if(!name || !id || !pass) { window.showCustomModal("Lỗi", "Vui lòng nhập đủ SĐT/Email và Mật khẩu!", "alert"); return; }
    if(window.usersDB[id]) { window.showCustomModal("Lỗi", "Tài khoản (SĐT/Email) này đã tồn tại!", "alert"); return; }

    window.usersDB[id] = { 
        pass: pass, name: name, balance: 0, totalDeposit: 0, totalSpent: 0, 
        history: [], chatData: [], isAdmin: false, refCode: ref || 'CHANG_NEW' 
    };
    
    window.isLoggedIn = true;
    window.currentUser = window.usersDB[id];
    window.currentUser.id = id;
    
    localStorage.setItem('changMmoSessionId', id);
    window.saveUserDB();

    window.renderAccountState();
    window.updateBalanceUI();
    window.navigateTo('pages/account/profile.html');
};

window.executeLogin = function() {
    const id = document.getElementById('loginId')?.value;
    const pass = document.getElementById('loginPass')?.value;

    if(!id || !pass) { window.showCustomModal("Lỗi", "Vui lòng nhập đủ thông tin!", "alert"); return; }

    if(window.usersDB[id] && window.usersDB[id].pass === pass) {
        window.isLoggedIn = true;
        window.currentUser = window.usersDB[id];
        window.currentUser.id = id;
        
        // Cập nhật các trường dữ liệu nếu nick cũ chưa có
        if(!window.currentUser.history) window.currentUser.history = [];
        if(!window.currentUser.chatData) window.currentUser.chatData = [];
        if(!window.currentUser.totalDeposit) window.currentUser.totalDeposit = 0;
        if(!window.currentUser.totalSpent) window.currentUser.totalSpent = 0;

        localStorage.setItem('changMmoSessionId', id);
        window.saveUserDB();
        
        if(window.currentUser.isAdmin) {
            window.showCustomModal("Xin chào Admin", "Quyền Quản Trị Viên đã được kích hoạt trên hệ thống!", "alert");
        }

        window.renderAccountState();
        window.updateBalanceUI();
        window.navigateTo('pages/account/profile.html');
    } else {
        window.showCustomModal("Đăng nhập thất bại", "Tài khoản hoặc mật khẩu không chính xác!", "alert");
    }
};

window.executeLogout = function() {
    window.showCustomModal("Đăng Xuất", "Bạn muốn đăng xuất khỏi tài khoản này?", "confirm", () => {
        const loader = document.getElementById('globalLoader');
        if (loader) loader.classList.add('active');
        
        setTimeout(() => {
            window.isLoggedIn = false;
            window.currentUser = { name: "KHÁCH VÃNG LAI", balance: 0, totalDeposit: 0, totalSpent: 0, history: [], chatData: [], isAdmin: false };
            localStorage.removeItem('changMmoSessionId');
            
            window.renderAccountState(); 
            window.updateBalanceUI();
            window.navigateTo('pages/home.html'); 
            if (loader) loader.classList.remove('active');
        }, 800);
    });
};

// ==========================================
// 6. LOGIC NẠP TIỀN VÀ QUẢN LÝ GIAO DỊCH
// ==========================================
window.createNewOrder = function() {
    if (!window.isLoggedIn) {
        window.showCustomModal("Từ Chối Nạp", "Bạn chưa đăng nhập. Vui lòng Đăng nhập/Đăng ký để nạp tiền!", "confirm", () => { window.navigateTo('pages/account/login.html'); });
        return;
    }

    const amount = document.getElementById('inputDepositAmt').value;
    if(!amount || parseInt(amount) < 10000) { window.showCustomModal("Lỗi", "Số tiền nạp tối thiểu là 10.000 ₫", "alert"); return; }

    const randomCode = "DAC" + Math.floor(100 + Math.random() * 900);
    const newOrder = { amount: parseInt(amount), code: randomCode, expiry: Date.now() + 10 * 60 * 1000, status: 'pending' };
    
    localStorage.setItem('active_order', JSON.stringify(newOrder));
    if(window.renderDepositScreen) window.renderDepositScreen();
};

window.cancelOrderAction = function() {
    window.showCustomModal("Hủy Đơn", "Bạn có chắc chắn muốn hủy đơn nạp này không?", "confirm", () => {
        clearInterval(window.depositTimerInterval);
        const activeOrderStr = localStorage.getItem('active_order');
        
        if (activeOrderStr && window.isLoggedIn) {
            const order = JSON.parse(activeOrderStr);
            window.currentUser.history.unshift({ id: order.code, type: 'deposit', title: 'Hủy nạp tiền', amount: order.amount, time: new Date().toLocaleString('vi-VN'), status: 'failed' });
            window.saveUserDB();
        }

        localStorage.removeItem('active_order');
        window.showCustomModal("Đã Hủy", "Đơn nạp tiền đã bị hủy và ghi vào lịch sử.", "alert", () => {
            if(window.renderDepositScreen) window.renderDepositScreen();
            if(window.renderDepositTable) window.renderDepositTable();
        });
    });
};

window.submitDepositProof = function() {
    const activeOrderStr = localStorage.getItem('active_order');
    if(!activeOrderStr) return;
    const order = JSON.parse(activeOrderStr);

    clearInterval(window.depositTimerInterval);
    localStorage.removeItem('active_order');
    
    let logStatus = 'processing';
    let modalTitle = "Hóa Đơn Đang Xử Lý";
    let modalMsg = "Yêu cầu nạp tiền đã gửi. Vui lòng đợi Admin kiểm tra và duyệt!";

    // ĐẶC QUYỀN ADMIN: TỰ ĐỘNG DUYỆT VÀ CỘNG TIỀN
    if (window.currentUser.isAdmin) {
        logStatus = 'success';
        window.currentUser.balance += order.amount;
        window.currentUser.totalDeposit += order.amount; // Cộng điểm VIP
        modalTitle = "Nạp Thành Công (Admin)";
        modalMsg = `Quyền Admin: Số tiền +${window.formatCurrency(order.amount)} đã được cộng ngay lập tức!`;
    }

    window.currentUser.history.unshift({ id: order.code, type: 'deposit', title: 'Nạp tiền tài khoản', amount: order.amount, time: new Date().toLocaleString('vi-VN'), status: logStatus });
    window.saveUserDB();

    window.showCustomModal(modalTitle, modalMsg, "alert", () => {
        window.updateBalanceUI();
        if(window.renderDepositScreen) window.renderDepositScreen(); 
        window.navigateTo('pages/balance/history.html');
    });
};

window.startCountdown = function(seconds) {
    clearInterval(window.depositTimerInterval); 
    let timer = seconds;
    window.depositTimerInterval = setInterval(() => {
        const d = document.getElementById('countdownDisplay');
        if(!d) { clearInterval(window.depositTimerInterval); return; }
        
        let m = Math.floor(timer / 60); let s = timer % 60;
        d.textContent = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
        
        if (--timer < 0) { 
            clearInterval(window.depositTimerInterval); 
            localStorage.removeItem('active_order'); 
            if(window.renderDepositScreen) window.renderDepositScreen(); 
        }
    }, 1000);
};

window.updateBalanceUI = function() {
    const vip = window.getVipInfo();
    
    // Cập nhật số dư ở đáy màn hình
    document.querySelectorAll('.balance-amount').forEach(el => el.textContent = window.formatCurrency(window.currentUser.balance));
    
    // Cập nhật Badge VIP ở đáy
    const vipText = document.querySelector('.vip-text');
    if(vipText) vipText.textContent = "VIP " + vip.level;
    const vipBadge = document.querySelector('.vip-badge');
    if(vipBadge) vipBadge.style.borderColor = vip.color;

    // Cập nhật Thẻ ảo ở phần Nạp tiền
    const virtualName = document.getElementById('virtualCardName');
    const virtualBalance = document.getElementById('virtualCardBalance');
    if(virtualName) {
        virtualName.textContent = window.isLoggedIn ? window.currentUser.name.toUpperCase() : (i18n[window.currentLang] ? i18n[window.currentLang].guest_name : "KHÁCH VÃNG LAI");
    }
    if(virtualBalance) {
        virtualBalance.textContent = window.formatCurrency(window.currentUser.balance);
    }
};

// ==========================================
// 7. ĐIỀU HƯỚNG SPA & RENDER TRẠNG THÁI TÀI KHOẢN
// ==========================================
window.navigateTo = async function(pageUrl) {
    const loader = document.getElementById('globalLoader');
    const appContent = document.getElementById('app-content');

    if (loader) loader.classList.add('active');
    
    // Đóng các menu khi chuyển trang
    document.getElementById('sideDrawer')?.classList.remove('active');
    document.getElementById('menuOverlay')?.classList.remove('active');
    document.getElementById('hamburgerMenuBtn')?.classList.remove('open');
    document.getElementById('searchDropdown')?.classList.remove('active');

    try {
        const response = await fetch(pageUrl);
        if (!response.ok) throw new Error(pageUrl);
        const html = await response.text();

        setTimeout(() => {
            appContent.innerHTML = html;
            window.scrollTo(0, 0); 
            // Load lại các script bên trong trang con
            const scripts = appContent.querySelectorAll('script');
            scripts.forEach(oldScript => { 
                const newScript = document.createElement('script'); 
                if (oldScript.innerHTML) newScript.innerHTML = oldScript.innerHTML; 
                document.body.appendChild(newScript); 
                newScript.remove(); 
            });
            window.applyTranslations(); 
            if (loader) loader.classList.remove('active');
        }, 400);
    } catch (error) {
        setTimeout(() => { 
            appContent.innerHTML = `
                <div style="text-align: center; margin-top: 80px; padding: 40px; background: rgba(30,30,35,0.8); border-radius: 24px; border: 1px dashed #0A84FF;">
                    <h2 style="color: #0A84FF; font-size: 22px; margin-bottom: 15px;">Trang Chưa Được Tạo</h2>
                    <p style="color: #fff; font-size: 16px; margin-bottom: 10px;">Để hiển thị nội dung, bạn hãy tạo file HTML tại:</p>
                    <code style="display:block; background:#000; color:#34C759; padding:10px; border-radius:8px; font-size:15px; font-weight:bold;">${error.message}</code>
                    <p style="color: #8e8e93; font-size: 14px; margin-top: 15px;">(Sau khi tạo file, tab sẽ tự động tải nội dung riêng biệt của nó).</p>
                </div>`;
            if (loader) loader.classList.remove('active'); 
        }, 400);
    }
};

window.renderAccountState = function() {
    const preview = document.getElementById('accountPreview');
    const menuProfile = document.getElementById('menuProfile');
    const menuLogin = document.getElementById('menuLogin');
    const menuRegister = document.getElementById('menuRegister');
    const taiKhoanToggle = document.getElementById('taiKhoanToggle');

    if (!preview || !menuProfile) return;

    const loggedInAvatar = `<img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=256" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    const guestAvatar = `<img src="https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg?w=256" style="width:100%; height:100%; border-radius:50%; object-fit:cover; filter: grayscale(100%) brightness(0.7);">`;

    if (window.isLoggedIn) {
        taiKhoanToggle.classList.add('logged-in');
        const roleName = window.currentUser.isAdmin ? 'Quản Trị Viên' : `VIP ${window.getVipInfo().level}`;
        const roleColor = window.currentUser.isAdmin ? '#FFD700' : '#34C759';
        preview.innerHTML = `
            <div class="account-avatar" style="border: 2px solid ${roleColor}; padding: 2px;">
                ${loggedInAvatar}<span class="account-status-dot"></span>
            </div>
            <div class="account-info">
                <span class="account-name">${window.currentUser.name}</span>
                <span class="account-role" style="color: ${roleColor};">${roleName}</span>
            </div>`;
        menuProfile.style.display = 'flex'; menuLogin.style.display = 'none'; menuRegister.style.display = 'none';
    } else {
        taiKhoanToggle.classList.remove('logged-in');
        preview.innerHTML = `
            <div class="account-avatar" style="border: 2px solid #3a3a3c; padding: 2px;">
                ${guestAvatar}<span class="account-status-dot"></span>
            </div>
            <div class="account-info">
                <span class="account-name" data-i18n="guest_name">KHÁCH VÃNG LAI</span>
                <span class="account-role">...</span>
            </div>`;
        menuProfile.style.display = 'none'; menuLogin.style.display = 'flex'; menuRegister.style.display = 'flex';
    }
};

window.onload = () => {
    window.renderAccountState();
    window.updateBalanceUI();
    window.applyTranslations();
    window.navigateTo('pages/home.html');
    setTimeout(() => { 
        const popup = document.getElementById('welcomePopup'); 
        if(popup) popup.classList.add('active'); 
    }, 800);
};

// ==========================================
// 8. SỰ KIỆN GIAO DIỆN (DOM EVENTS)
// ==========================================
// Bật tắt khung Tìm kiếm
document.getElementById('searchToggleBtn')?.addEventListener('click', (e) => { 
    e.stopPropagation(); document.getElementById('searchDropdown').classList.toggle('active'); 
});

// Nút Tìm kiếm
document.getElementById('executeSearchBtn')?.addEventListener('click', () => {
    const val = document.getElementById('searchInput').value;
    document.getElementById('searchDropdown').classList.remove('active');
    if(val.trim() !== '') {
        window.currentSearchQuery = val;
        window.navigateTo('pages/search.html');
    }
});

// Bật tắt Menu Ngôn ngữ
document.getElementById('langBtn')?.addEventListener('click', (e) => { 
    e.stopPropagation(); document.getElementById('langWrapper').classList.toggle('active'); 
});

// Chuyển Ngôn ngữ
document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', function() {
        window.currentLang = this.getAttribute('data-lang');
        document.querySelector('.lang-option.selected')?.classList.remove('selected');
        this.classList.add('selected');
        
        document.getElementById('currentFlag').innerHTML = this.querySelector('.flag-icon').innerHTML;
        document.getElementById('currentFlag').setAttribute('viewBox', this.querySelector('.flag-icon').getAttribute('viewBox'));
        document.getElementById('currentLangText').textContent = window.currentLang === 'vi' ? 'VN' : 'EN';
        
        window.applyTranslations();
        document.getElementById('langWrapper').classList.remove('active');
    });
});

// Hamburger Menu
document.getElementById('hamburgerMenuBtn')?.addEventListener('click', function() { 
    this.classList.toggle('open'); 
    document.getElementById('sideDrawer').classList.toggle('active'); 
    document.getElementById('menuOverlay').classList.toggle('active'); 
});

document.getElementById('menuOverlay')?.addEventListener('click', function() { 
    document.getElementById('hamburgerMenuBtn').classList.remove('open'); 
    document.getElementById('sideDrawer').classList.remove('active'); 
    this.classList.remove('active'); 
});

// Tự động đóng menu trượt khi click ra ngoài
document.addEventListener('click', (e) => { 
    if (!e.target.closest('.lang-wrapper')) document.getElementById('langWrapper')?.classList.remove('active'); 
    if (!e.target.closest('.search-dropdown') && !e.target.closest('#searchToggleBtn')) document.getElementById('searchDropdown')?.classList.remove('active');
});

// Accordion (Menu con)
const accordions = [ 'trangChuToggle', 'dichVuToggle', 'soDuToggle', 'taiKhoanToggle', 'lienHeToggle', 'doiTacToggle', 'chinhSachToggle' ];
accordions.forEach(id => { 
    const btn = document.getElementById(id); 
    if (btn) btn.addEventListener('click', function() { 
        this.classList.toggle('active'); 
        this.nextElementSibling.classList.toggle('active'); 
    }); 
});

// Copy to Clipboard (Sao chép)
window.copyToClip = function(text) {
    const el = document.createElement('textarea'); 
    el.value = text; 
    document.body.appendChild(el); 
    el.select(); 
    document.execCommand('copy'); 
    document.body.removeChild(el);
    
    const toast = document.getElementById('copyToast'); 
    if(toast) { 
        toast.classList.add('show'); 
        setTimeout(() => { toast.classList.remove('show'); }, 2000); 
    }
};
