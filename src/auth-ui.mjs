const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mark=(size=34)=>`<span class="lg-mark" aria-hidden="true"><svg viewBox="0 0 48 48" width="${size}" height="${size}" fill="none"><path d="M10 35L21 24L29 30L40 13" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="35" r="4" fill="#fff"/><circle cx="29" cy="30" r="4" fill="#fff" opacity=".8"/><circle cx="40" cy="13" r="4" fill="#fff"/></svg></span>`;
const themes=[['blue','Cầu vồng','#6d3df0','#f43f7a','#ffa31a'],['indigo','Tím mộng','#6651dc','#d946ef','#3b82f6'],['emerald','Rừng xanh','#059669','#65a30d','#ca8a04'],['teal','Đại dương','#0891b2','#2563eb','#4f46e5'],['coral','Hoàng hôn','#ef4444','#f97316','#ec4899'],['navy','Đêm xanh','#1e40af','#0f766e','#7c3aed']];
const modeIcons={"light": "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/></svg>", "soft": "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 3a9 9 0 0 0 0 18z\" fill=\"currentColor\"/></svg>", "dark": "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z\"/></svg>", "auto": "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M8 20h8M12 16v4\"/></svg>"},modeNames={light:'Sáng',soft:'Dịu',dark:'Tối',auto:'Tự động'};
const picker=(theme,lang,mode='soft')=>`<div class="lg-tools"><div class="mode-switch" role="group" aria-label="Chế độ sáng tối">${['light','soft','dark','auto'].map(m=>`<button type="button" data-preference="mode" data-value="${m}" aria-pressed="${mode===m}" title="${modeNames[m]}" aria-label="${modeNames[m]}">${modeIcons[m]}</button>`).join('')}</div><div class="lg-themes" role="group" aria-label="Bảng màu giao diện">${themes.map(([id,label,a,b,c])=>`<button type="button" class="${theme===id?'current':''}" data-preference="theme" data-value="${id}" aria-label="Bảng màu ${label}" aria-pressed="${theme===id}" title="${label}" style="background:linear-gradient(135deg,${a} 0 40%,${b} 40% 72%,${c} 72%)"></button>`).join('')}</div><div class="lg-lang" role="group" aria-label="Ngôn ngữ"><button type="button" class="${lang==='vi'?'current':''}" data-preference="lang" data-value="vi">VI</button><button type="button" class="${lang==='en'?'current':''}" data-preference="lang" data-value="en">EN</button></div></div>`;
const tape=['BÁN HÀNG','TỒN KHO','CÔNG NỢ','DỰ BÁO','MÔ PHỎNG','QUYẾT ĐỊNH','TRỢ LÝ AI'];
const stage=`<section class="lg-stage" aria-label="Minh họa nền tảng RetailMind"><div class="lg-stage-top">${mark(30)}<span>RetailMind</span></div>
<div class="lg-headline"><span class="lg-eyebrow">MIS · DSS · AI</span><h2>Mỗi quyết định bán lẻ<br>đều có <em>căn cứ</em>.</h2><p>Bán hàng, kho, công nợ và dự báo trong một không gian làm việc nhiều màu sắc — dễ nhìn, dễ hiểu, dễ hành động.</p></div>
<div class="lg-scene" aria-hidden="true">
 <div class="lg-card c-chart"><small>DOANH THU</small><div class="lg-bars"><i style="--h:38%"></i><i style="--h:56%"></i><i style="--h:44%"></i><i style="--h:72%"></i><i style="--h:63%"></i><i style="--h:90%"></i></div></div>
 <div class="lg-card c-health"><div class="lg-ring"><b>82</b></div><span><b>Sức khỏe KD</b><small>Tốt</small></span></div>
 <div class="lg-card c-stock"><small>TỒN KHO</small><div class="lg-meter"><i style="--w:72%"></i></div><div class="lg-meter warn"><i style="--w:34%"></i></div><div class="lg-meter bad"><i style="--w:14%"></i></div></div>
 <div class="lg-card c-ai"><span class="lg-spark">✦</span><span><b>Gemini</b><small>Giải thích kịch bản</small></span></div>
 <div class="lg-card c-tag">ABC · Pareto</div>
 <i class="lg-orb o1"></i><i class="lg-orb o2"></i><i class="lg-orb o3"></i>
</div>
<div class="lg-tape"><div>${[...tape,...tape,...tape].map(t=>`<span>${t}</span><i>✦</i>`).join('')}</div></div></section>`;
export function loginView({tab='login',error='',configured=true,recovery=false,theme='blue',lang='vi',invited=false,mode='soft'}={}){
 const signup=tab==='signup',forgot=tab==='forgot';
 return `<div class="lg-shell">${stage}
 <section class="lg-form-side"><div class="lg-form-card">
 <div class="lg-form-head"><div class="lg-brand">${mark(26)}<span>Retail<b>Mind</b></span></div>${picker(theme,lang,mode)}</div>
 <p class="lg-eyebrow dark">NỀN TẢNG QUẢN TRỊ DOANH NGHIỆP</p>
 <h1>${recovery?'Đặt mật khẩu mới':signup?'Khởi tạo tài khoản':forgot?'Lấy lại mật khẩu':'Chào mừng trở lại!'}</h1>
 <p class="lg-sub">${signup?'Tạo tài khoản để bắt đầu quản lý không gian doanh nghiệp riêng.':forgot?'Nhập địa chỉ email để nhận liên kết đặt lại mật khẩu.':recovery?'Chọn mật khẩu mới cho tài khoản của bạn.':'Đăng nhập để tiếp tục điều hành và ra quyết định từ dữ liệu của bạn.'}</p>
 ${!configured?'<div class="auth-notice">Website chưa nhận được cấu hình kết nối Supabase. Cần bổ sung biến môi trường Netlify và triển khai lại.</div>':''}
 ${error?`<div class="auth-notice" role="alert">${escape(error)}</div>`:''}
 ${invited?'<div class="auth-notice ok" role="status">Bạn được mời vào một doanh nghiệp. Hãy đăng nhập hoặc đăng ký; mã mời sẽ tự điền ở bước tiếp theo.</div>':''}
 ${!forgot&&!recovery?`<div class="lg-tabs" role="tablist" aria-label="Chọn cách truy cập"><button data-auth-tab="login" type="button" role="tab" aria-selected="${!signup}" class="${signup?'':'active'}">Đăng nhập</button><button data-auth-tab="signup" type="button" role="tab" aria-selected="${signup}" class="${signup?'active':''}">Đăng ký</button></div>`:''}
 <form id="auth-entry" class="lg-form">
 <input type="hidden" name="mode" value="${recovery?'reset':tab}">
 ${!recovery?`<label>Địa chỉ email<input type="email" name="email" placeholder="tenban@gmail.com" autocomplete="email" required></label>`:''}
 ${!forgot?`<label>${recovery?'Mật khẩu mới':'Mật khẩu'}<input type="password" name="password" minlength="6" placeholder="Nhập mật khẩu" autocomplete="${signup||recovery?'new-password':'current-password'}" required></label>`:''}
 ${!forgot&&!signup&&!recovery?`<div class="lg-forgot-row"><button type="button" class="lg-forgot" data-auth-tab="forgot">Quên mật khẩu?</button></div>`:''}
 ${signup?'<label>Xác nhận mật khẩu<input type="password" name="confirm" minlength="6" placeholder="Nhập lại mật khẩu" autocomplete="new-password" required></label>':''}
 <button class="lg-submit" type="submit" ${!configured?'disabled':''}>${recovery?'Cập nhật mật khẩu':signup?'Tạo tài khoản':forgot?'Gửi liên kết khôi phục':'Đăng nhập'} <span aria-hidden="true">→</span></button>
 </form>
 <div class="lg-bottom">${forgot?'<button data-auth-tab="login">← Quay lại đăng nhập</button>':signup?'Đã có tài khoản? <button data-auth-tab="login">Đăng nhập</button>':recovery?'':`<button data-auth-tab="forgot">Quên mật khẩu?</button><span>Chưa có tài khoản? <button data-auth-tab="signup">Đăng ký ngay</button></span>`}</div>
 <a class="lg-demo" href="?preview=1">▶ Dùng thử ngay với dữ liệu minh họa (không cần đăng nhập)</a>
 <div class="lg-trust"><span aria-hidden="true">✓</span><div><b>Không gian riêng cho mỗi doanh nghiệp</b><small>Dữ liệu chỉ chia sẻ với thành viên được cấp quyền.</small></div></div>
 </div></section></div>`;
}
export function organizationsView({user,organizations=[],error='',loading=false,inviteCode=''}={}){
 return `<div class="lg-choose"><div class="lg-choose-wrap"><div class="lg-brand big">${mark(30)}<span>Retail<b>Mind</b></span></div><span class="lg-eyebrow dark">KHÔNG GIAN DOANH NGHIỆP</span><h1>Chọn nơi bạn muốn làm việc</h1><p class="lg-sub">Đăng nhập: <strong>${escape(user?.email||'')}</strong></p>${error?`<div class="auth-notice">${escape(error)}</div>`:''}
 ${organizations.length?`<div class="lg-orgs">${organizations.map((o,i)=>`<button data-auth-action="choose" data-org="${escape(o.id)}" style="--k:var(--c${i%6+1})"><span class="lg-org-ico">${escape(String(o.name||'?').trim().slice(0,1).toUpperCase())}</span><span><strong>${escape(o.name)}</strong><small>${o.role==='owner'?'Chủ doanh nghiệp':o.role==='admin'?'Quản trị viên':'Nhân viên'}</small></span><span class="lg-go">→</span></button>`).join('')}</div>`:''}
 <div class="lg-choose-cards"><form id="company-create" class="lg-ccard c-a"><div class="lg-cbig">＋</div><h2>Tạo doanh nghiệp</h2><p>Bắt đầu với dữ liệu trống, độc lập với dữ liệu demo.</p><label>Tên doanh nghiệp<input name="company" maxlength="120" minlength="2" placeholder="Ví dụ: Công ty An Phát" required></label><button type="submit" class="lg-submit" ${loading?'disabled':''}>Tạo không gian mới</button></form>
 <form id="company-join" class="lg-ccard c-b"><div class="lg-cbig">↗</div><h2>Tham gia doanh nghiệp</h2><p>Nhập mã mời mà chủ doanh nghiệp gửi cho bạn.</p><label>Mã mời<input name="code" placeholder="Dán mã mời" autocomplete="off" value="${escape(inviteCode)}" required></label><button type="submit" class="lg-submit ghost" ${loading?'disabled':''}>Tham gia</button></form></div>
 <button class="lg-signout" data-auth-action="logout">Đăng xuất tài khoản</button></div></div>`;
}
