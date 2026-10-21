const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const logo=`<span class="rm-symbol" aria-hidden="true"><svg viewBox="0 0 40 40" width="28" height="28" fill="none"><rect x="4" y="21" width="6" height="13" rx="2" fill="currentColor" opacity=".55"/><rect x="16" y="13" width="6" height="21" rx="2" fill="currentColor" opacity=".8"/><rect x="28" y="5" width="6" height="29" rx="2" fill="currentColor"/></svg></span>`;
export function loginView({tab='login',error='',configured=true,recovery=false}={}){
 const signup=tab==='signup',forgot=tab==='forgot';
 return `<div class="auth-shell retail-auth-v8">
 <div class="auth-pane"><div class="auth-inner">
 <div class="auth-form-brand">${logo}<span>Retail<span>Mind</span></span></div>
 <p class="auth-intro-label">NỀN TẢNG QUẢN TRỊ DOANH NGHIỆP</p>
 <h1>${recovery?'Đặt mật khẩu mới':signup?'Khởi tạo tài khoản':forgot?'Lấy lại mật khẩu':'Chào mừng trở lại!'}</h1>
 <p class="auth-sub">${signup?'Tạo tài khoản để bắt đầu quản lý không gian doanh nghiệp riêng.':forgot?'Nhập địa chỉ email để nhận liên kết đặt lại mật khẩu.':'Đăng nhập để tiếp tục điều hành và ra quyết định từ dữ liệu của bạn.'}</p>
 ${!configured?'<div class="auth-notice">Website chưa nhận được cấu hình kết nối Supabase. Cần bổ sung biến môi trường Netlify và triển khai lại.</div>':''}
 ${error?`<div class="auth-notice" role="alert">${escape(error)}</div>`:''}
 ${!forgot&&!recovery?`<div class="auth-tabs" role="tablist" aria-label="Chọn cách truy cập"><button data-auth-tab="login" type="button" role="tab" aria-selected="${!signup}" class="${signup?'':'active'}">Đăng nhập</button><button data-auth-tab="signup" type="button" role="tab" aria-selected="${signup}" class="${signup?'active':''}">Đăng ký</button></div>`:''}
 <form id="auth-entry" class="auth-form">
 <input type="hidden" name="mode" value="${recovery?'reset':tab}">
 ${!recovery?`<label>Địa chỉ email<input type="email" name="email" placeholder="tenban@gmail.com" autocomplete="email" required></label>`:''}
 ${!forgot?`<label>${recovery?'Mật khẩu mới':'Mật khẩu'}<input type="password" name="password" minlength="6" placeholder="Nhập mật khẩu" autocomplete="${signup?'new-password':'current-password'}" required></label>`:''}
 ${signup?'<label>Xác nhận mật khẩu<input type="password" name="confirm" minlength="6" placeholder="Nhập lại mật khẩu" autocomplete="new-password" required></label>':''}
 <button class="btn primary auth-submit" type="submit" ${!configured?'disabled':''}>${recovery?'Cập nhật mật khẩu':signup?'Tạo tài khoản':forgot?'Gửi liên kết khôi phục':'Đăng nhập'} <span aria-hidden="true">→</span></button>
 </form>
 <div class="auth-bottom">${forgot?'<button data-auth-tab="login">← Quay lại đăng nhập</button>':signup?'Đã có tài khoản? <button data-auth-tab="login">Đăng nhập</button>':recovery?'':`<button data-auth-tab="forgot">Quên mật khẩu?</button><p>Chưa có tài khoản? <button data-auth-tab="signup">Đăng ký ngay</button></p>`}</div>
 <div class="auth-trust"><span aria-hidden="true">♢</span><div><strong>Không gian riêng cho mỗi doanh nghiệp</strong><small>Đăng nhập an toàn, dữ liệu chỉ chia sẻ với thành viên được cấp quyền.</small></div></div>
 <div class="auth-policy">RetailMind · Quản trị dựa trên dữ liệu</div>
 </div></div>
 <section class="auth-art" aria-label="Minh họa nền tảng phân tích và quản trị đa ngành">
 <div class="auth-art-glow"></div>
 <div class="auth-art-top"><div class="auth-art-logo">${logo}<span>RetailMind</span></div><div class="auth-lang" role="group" aria-label="Ngôn ngữ"><button type="button" data-preference="lang" data-value="vi">🇻🇳 VI</button><button type="button" data-preference="lang" data-value="en">🇬🇧 EN</button></div></div>
 <div class="auth-art-body"><span class="auth-pill">✧ QUẢN TRỊ · PHÂN TÍCH · RA QUYẾT ĐỊNH</span><h2>Biến dữ liệu<br>thành <em>lợi thế<br>cạnh tranh.</em></h2><p>Liên kết bán hàng, tồn kho, tài chính và trí tuệ nhân tạo để quản trị hiệu quả hơn — trên mọi thiết bị.</p>
 <div class="auth-art-benefits"><span><b>▣</b> Quản trị bán lẻ</span><span><b>▥</b> Phân tích dữ liệu</span><span><b>✦</b> Hỗ trợ quyết định</span></div></div>
 <div class="auth-art-scene" aria-hidden="true"><div class="auth-scene-grid"></div><div class="auth-scene-building building-one"><i></i><i></i><i></i><i></i></div><div class="auth-scene-building building-two"><i></i><i></i><i></i><i></i></div><div class="auth-scene-building building-three"><i></i><i></i><i></i><i></i></div><div class="auth-floating-card auth-analytics"><div><span>▥</span> PHÂN TÍCH DOANH THU</div><div class="auth-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="auth-floating-card auth-insights"><span>✦</span><div><b>Hỗ trợ thông minh</b><small>Dự báo · Kịch bản · DSS</small></div></div><div class="auth-scene-orb"></div></div>
 <div class="auth-art-footer">Dữ liệu hôm nay. Quyết định tốt hơn ngày mai.<span>✦</span></div>
 </section></div>`;
}
export function organizationsView({user,organizations=[],error='',loading=false}={}){
 return `<div class="choose-shell"><div class="choose-wrap"><div class="auth-logo">${logo}<span>Retail<span>Mind</span></span></div><div class="choose-eyebrow">KHÔNG GIAN DOANH NGHIỆP</div><h1>Chọn nơi bạn muốn làm việc</h1><p>Đăng nhập: <strong>${escape(user?.email||'')}</strong></p>${error?`<div class="auth-notice">${escape(error)}</div>`:''}
 ${organizations.length?`<div class="choose-list">${organizations.map(o=>`<button data-auth-action="choose" data-org="${escape(o.id)}"><span class="choose-icon">⌂</span><span><strong>${escape(o.name)}</strong><small>${o.role==='owner'?'Chủ doanh nghiệp':o.role==='admin'?'Quản trị viên':'Nhân viên'}</small></span><span>→</span></button>`).join('')}</div>`:''}
 <div class="choose-panels"><form id="company-create" class="choose-card"><div class="choose-big-icon">＋</div><h2>Tạo doanh nghiệp</h2><p>Bắt đầu với dữ liệu trống, độc lập với dữ liệu demo của SmartDecision.</p><label>Tên doanh nghiệp<input name="company" maxlength="120" minlength="2" placeholder="Ví dụ: Công ty An Phát" required></label><button type="submit" class="btn primary" ${loading?'disabled':''}>Tạo không gian mới</button></form>
 <form id="company-join" class="choose-card"><div class="choose-big-icon">↗</div><h2>Tham gia doanh nghiệp</h2><p>Nhập mã mời mà chủ doanh nghiệp gửi cho bạn.</p><label>Mã mời<input name="code" placeholder="Dán mã mời" autocomplete="off" required></label><button type="submit" class="btn secondary" ${loading?'disabled':''}>Tham gia</button></form></div>
 <button class="choose-signout" data-auth-action="logout">Đăng xuất tài khoản</button></div></div>`;
}
