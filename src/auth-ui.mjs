const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const logo=`<span class="rm-symbol" aria-hidden="true"><svg viewBox="0 0 40 40" width="28" height="28" fill="none"><rect x="4" y="21" width="6" height="13" rx="2" fill="currentColor" opacity=".55"/><rect x="16" y="13" width="6" height="21" rx="2" fill="currentColor" opacity=".8"/><rect x="28" y="5" width="6" height="29" rx="2" fill="currentColor"/></svg></span>`;
export function loginView({tab='login',error='',configured=true,recovery=false}={}){
 const signup=tab==='signup',forgot=tab==='forgot';
 return `<div class="auth-shell"><div class="auth-pane"><div class="auth-inner"><div class="auth-logo">${logo}<span>Retail<span>Mind</span></span></div><div class="auth-overline">ENTERPRISE WORKSPACE</div>
 <h1>${recovery?'Đặt mật khẩu mới':signup?'Tạo tài khoản doanh nghiệp':forgot?'Khôi phục tài khoản':'Chào mừng trở lại'}</h1>
 <p class="auth-sub">${signup?'Bắt đầu với không gian quản trị riêng, an toàn cho doanh nghiệp.':forgot?'Chúng tôi gửi liên kết đặt lại mật khẩu đến email của bạn.':'Quản lý, phân tích và ra quyết định trên cùng một nền tảng.'}</p>
 ${!configured?'<div class="auth-notice">Chưa cấu hình Supabase cho bản triển khai này. Xem README-BAN-GIAO.md để thiết lập Netlify và chạy SQL.</div>':''}
 ${error?`<div class="auth-notice">${escape(error)}</div>`:''}
 ${!forgot&&!recovery?`<div class="auth-tabs"><button data-auth-tab="login" class="${signup?'':'active'}">Đăng nhập</button><button data-auth-tab="signup" class="${signup?'active':''}">Đăng ký</button></div>`:''}
 <form id="auth-entry" class="auth-form">
 <input type="hidden" name="mode" value="${recovery?'reset':tab}">
 ${!recovery?`<label>Email doanh nghiệp<input type="email" name="email" placeholder="ban@doanhnghiep.vn" autocomplete="email" required></label>`:''}
 ${!forgot?`<label>${recovery?'Mật khẩu mới':'Mật khẩu'}<input type="password" name="password" minlength="6" placeholder="Tối thiểu 6 ký tự" autocomplete="${signup?'new-password':'current-password'}" required></label>`:''}
 ${signup?'<label>Nhập lại mật khẩu<input type="password" name="confirm" minlength="6" autocomplete="new-password" required></label>':''}
 <button class="btn primary auth-submit" type="submit" ${!configured?'disabled':''}>${recovery?'Lưu mật khẩu mới':signup?'Tạo tài khoản':forgot?'Gửi liên kết khôi phục':'Đăng nhập'} <span>→</span></button>
 </form>
 <div class="auth-bottom">${forgot?'<button data-auth-tab="login">← Quay lại đăng nhập</button>':signup?'Đã có tài khoản? <button data-auth-tab="login">Đăng nhập</button>':recovery?'':`<button data-auth-tab="forgot">Quên mật khẩu?</button><p>Chưa có tài khoản? <button data-auth-tab="signup">Đăng ký ngay</button></p>`}</div>
 <div class="auth-foot">🔒 Mỗi doanh nghiệp có dữ liệu riêng • Xác minh email</div></div></div>
 <section class="auth-art" aria-label="Nền tảng quản trị kinh doanh"><div class="auth-art-grain"></div><div class="auth-skyline"></div><div class="auth-art-content"><span class="auth-pill">RETAILMIND / BUSINESS INTELLIGENCE</span><h2>Mọi quyết định tốt<br>đều bắt đầu từ<br><em>dữ liệu đáng tin cậy.</em></h2><p>Một không gian điều hành duy nhất cho mọi lĩnh vực bán lẻ — từ giao dịch hằng ngày đến phân tích chiến lược.</p><div class="auth-fake"><div class="auth-fake-head"><span>Performance overview</span><span>↗ +12.6%</span></div><div class="auth-fake-bars">${[36,50,43,70,64,84,96].map((x,i)=>`<i style="height:${x}%"></i>`).join('')}</div><small>Phân tích • Dự báo • Quyết định</small></div></div><div class="auth-art-footer">Tích hợp DSS & AI <span>✧</span> An toàn theo doanh nghiệp</div></section></div>`;
}
export function organizationsView({user,organizations=[],error='',loading=false}={}){
 return `<div class="choose-shell"><div class="choose-wrap"><div class="auth-logo">${logo}<span>Retail<span>Mind</span></span></div><div class="choose-eyebrow">KHÔNG GIAN DOANH NGHIỆP</div><h1>Chọn nơi bạn muốn làm việc</h1><p>Đăng nhập: <strong>${escape(user?.email||'')}</strong></p>${error?`<div class="auth-notice">${escape(error)}</div>`:''}
 ${organizations.length?`<div class="choose-list">${organizations.map(o=>`<button data-auth-action="choose" data-org="${escape(o.id)}"><span class="choose-icon">⌂</span><span><strong>${escape(o.name)}</strong><small>${o.role==='owner'?'Chủ doanh nghiệp':o.role==='admin'?'Quản trị viên':'Nhân viên'}</small></span><span>→</span></button>`).join('')}</div>`:''}
 <div class="choose-panels"><form id="company-create" class="choose-card"><div class="choose-big-icon">＋</div><h2>Tạo doanh nghiệp</h2><p>Bắt đầu với dữ liệu trống, độc lập với dữ liệu demo của SmartDecision.</p><label>Tên doanh nghiệp<input name="company" maxlength="120" minlength="2" placeholder="Ví dụ: Công ty An Phát" required></label><button type="submit" class="btn primary" ${loading?'disabled':''}>Tạo không gian mới</button></form>
 <form id="company-join" class="choose-card"><div class="choose-big-icon">↗</div><h2>Tham gia doanh nghiệp</h2><p>Nhập mã mời mà chủ doanh nghiệp gửi cho bạn.</p><label>Mã mời<input name="code" placeholder="Dán mã mời" autocomplete="off" required></label><button type="submit" class="btn secondary" ${loading?'disabled':''}>Tham gia</button></form></div>
 <button class="choose-signout" data-auth-action="logout">Đăng xuất tài khoản</button></div></div>`;
}
