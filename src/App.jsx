import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Boxes,
  BrainCircuit, BriefcaseBusiness, Building2, CalendarDays, Check, ChevronDown,
  ChevronLeft, ChevronRight, CircleDollarSign, ClipboardList, Download, FileBarChart,
  FileText, Gauge, Headphones, HelpCircle, LayoutDashboard, Lightbulb, Menu,
  MessageCircle, Package, Plus, Search, Send, Settings, ShoppingCart, Sparkles,
  Target, TrendingUp, Truck, Users, Wallet, X, Mic, RotateCcw, Trash2, Pencil,
  ShieldCheck, SlidersHorizontal
} from 'lucide-react';

const initialProducts = [
  { id: 'SP001', name: 'Cà phê rang xay 500g', category: 'Đồ uống', price: 145000, cost: 85000, stock: 42, min: 15, supplier: 'Công ty An Phúc' },
  { id: 'SP002', name: 'Bình giữ nhiệt 600ml', category: 'Gia dụng', price: 220000, cost: 130000, stock: 8, min: 12, supplier: 'Minh Long Trading' },
  { id: 'SP003', name: 'Trà xanh túi lọc', category: 'Đồ uống', price: 68000, cost: 35000, stock: 65, min: 20, supplier: 'Công ty An Phúc' },
  { id: 'SP004', name: 'Hộp bảo quản thực phẩm', category: 'Gia dụng', price: 99000, cost: 54000, stock: 21, min: 10, supplier: 'Gia Phát' },
  { id: 'SP005', name: 'Túi vải tái sử dụng', category: 'Phụ kiện', price: 45000, cost: 18000, stock: 6, min: 15, supplier: 'Gia Phát' },
  { id: 'SP006', name: 'Bộ ly thủy tinh', category: 'Gia dụng', price: 185000, cost: 105000, stock: 17, min: 8, supplier: 'Minh Long Trading' },
];
const initialOrders = [
  { id: 'DH-1028', customer: 'Nguyễn Minh Anh', date: '18/10/2026', total: 435000, status: 'Hoàn thành', items: 'Cà phê rang xay × 3' },
  { id: 'DH-1027', customer: 'Trần Quốc Bảo', date: '18/10/2026', total: 220000, status: 'Đang xử lý', items: 'Bình giữ nhiệt × 1' },
  { id: 'DH-1026', customer: 'Lê Thu Hà', date: '17/10/2026', total: 313000, status: 'Hoàn thành', items: 'Trà xanh × 2, Túi vải × 4' },
  { id: 'DH-1025', customer: 'Phạm Gia Huy', date: '17/10/2026', total: 185000, status: 'Đã hủy', items: 'Bộ ly thủy tinh × 1' },
];
const initialCustomers = [
  { id: 'KH001', name: 'Nguyễn Minh Anh', phone: '0901 234 567', email: 'minhanh@example.com', orders: 12, spent: 3280000 },
  { id: 'KH002', name: 'Trần Quốc Bảo', phone: '0902 345 678', email: 'quocbao@example.com', orders: 7, spent: 1950000 },
  { id: 'KH003', name: 'Lê Thu Hà', phone: '0903 456 789', email: 'thuha@example.com', orders: 9, spent: 2460000 },
];
const initialSuppliers = [
  { id: 'NCC01', name: 'Công ty An Phúc', contact: '0908 111 222', products: 2, debt: 0 },
  { id: 'NCC02', name: 'Minh Long Trading', contact: '0908 333 444', products: 2, debt: 1250000 },
  { id: 'NCC03', name: 'Gia Phát', contact: '0908 555 666', products: 2, debt: 0 },
];
const initialExpenses = [
  { id: 'CP001', date: '01/10/2026', name: 'Thuê mặt bằng', category: 'Vận hành', amount: 12000000 },
  { id: 'CP002', date: '05/10/2026', name: 'Quảng cáo trực tuyến', category: 'Marketing', amount: 3500000 },
  { id: 'CP003', date: '10/10/2026', name: 'Vận chuyển', category: 'Logistics', amount: 1850000 },
];
const initialDecisions = [
  { id: 'QD001', title: 'Bổ sung tồn kho túi vải', reason: 'Tồn kho thấp hơn ngưỡng tối thiểu', owner: 'Quản lý kho', due: '20/10/2026', status: 'Đang thực hiện' },
  { id: 'QD002', title: 'Đánh giá hiệu quả quảng cáo', reason: 'Chi phí marketing tăng trong tháng', owner: 'Marketing', due: '23/10/2026', status: 'Chưa bắt đầu' },
];
const navGroups = [
  { label: 'ĐIỀU HÀNH', items: [
    ['Tổng quan', LayoutDashboard], ['Bán hàng & đơn hàng', ShoppingCart], ['Sản phẩm', Package], ['Tồn kho', Boxes], ['Nhà cung cấp', Truck], ['Khách hàng', Users], ['Chi phí & lợi nhuận', Wallet]
  ]},
  { label: 'PHÂN TÍCH & QUYẾT ĐỊNH', items: [
    ['Phân tích & dự báo', BarChart3], ['Cảnh báo kinh doanh', AlertTriangle], ['Mô phỏng phương án', SlidersHorizontal], ['Quyết định', Target], ['Báo cáo quản trị', FileBarChart]
  ]},
  { label: 'HỆ THỐNG', items: [['Cài đặt', Settings]] }
];
const money = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(n || 0));
const number = (n) => new Intl.NumberFormat('vi-VN').format(Number(n || 0));
function readStore(key, fallback) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
function saveStore(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
function Badge({ children, tone = 'neutral' }) { return <span className={`badge badge-${tone}`}>{children}</span>; }
function Button({ children, variant = 'primary', onClick, icon: Icon, type = 'button' }) { return <button type={type} className={`button button-${variant}`} onClick={onClick}>{Icon && <Icon size={16} />}{children}</button>; }
function SectionTitle({ eyebrow, title, subtitle, action }) { return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>; }
function KpiCard({ title, value, change, icon: Icon, tone = 'blue', note }) { return <div className="kpi-card"><div className="kpi-top"><span>{title}</span><span className={`kpi-icon ${tone}`}><Icon size={19}/></span></div><div className="kpi-value">{value}</div><div className="kpi-foot"><span className={change?.startsWith('-') ? 'negative' : 'positive'}>{change?.startsWith('-') ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>} {change}</span><span>{note || 'so với kỳ trước'}</span></div></div>; }
function EmptyState({ text = 'Chưa có dữ liệu phù hợp.' }) { return <div className="empty-state"><FileText size={26}/><p>{text}</p></div>; }
function OrdersTable({ rows }) { return <div className="table-wrap"><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Ngày tạo</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead><tbody>{rows.map(o => <tr key={o.id}><td className="code-cell">{o.id}</td><td><strong>{o.customer}</strong><small>{o.items}</small></td><td>{o.date}</td><td className="amount-cell">{money(o.total)}</td><td><Badge tone={o.status === 'Hoàn thành' ? 'success' : o.status === 'Đã hủy' ? 'danger' : 'warning'}>{o.status}</Badge></td></tr>)}</tbody></table>{!rows.length && <EmptyState text="Không tìm thấy đơn hàng."/>}</div>; }
function SearchBox({ value, onChange, placeholder = 'Tìm kiếm...' }) { return <label className="search-box"><Search size={16}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>{value && <button type="button" onClick={()=>onChange('')} aria-label="Xóa tìm kiếm"><X size={14}/></button>}</label>; }

function Modal({ title, onClose, children }) { return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose}><X size={18}/></button></div>{children}</div></div>; }

export default function App() {
  const [page, setPage] = useState('Tổng quan');
  const [mobileNav, setMobileNav] = useState(false);
  const [products, setProducts] = useState(() => readStore('sd_products', initialProducts));
  const [orders, setOrders] = useState(() => readStore('sd_orders', initialOrders));
  const [customers, setCustomers] = useState(() => readStore('sd_customers', initialCustomers));
  const [suppliers, setSuppliers] = useState(() => readStore('sd_suppliers', initialSuppliers));
  const [expenses, setExpenses] = useState(() => readStore('sd_expenses', initialExpenses));
  const [decisions, setDecisions] = useState(() => readStore('sd_decisions', initialDecisions));
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState([{ role: 'assistant', text: 'Xin chào! Tôi là trợ lý SmartDecision bản demo. Bạn có thể hỏi về doanh thu, tồn kho, cảnh báo hoặc phương án kinh doanh.' }]);
  const [simPrice, setSimPrice] = useState(5);
  const [simMarketing, setSimMarketing] = useState(2);
  const [simCost, setSimCost] = useState(3);
  const [range, setRange] = useState('30 ngày gần nhất');
  const [settings, setSettings] = useState(() => readStore('sd_settings', { business: 'Cửa hàng Smart Retail', currency: 'VND', alerts: true }));

  useEffect(() => saveStore('sd_products', products), [products]);
  useEffect(() => saveStore('sd_orders', orders), [orders]);
  useEffect(() => saveStore('sd_customers', customers), [customers]);
  useEffect(() => saveStore('sd_suppliers', suppliers), [suppliers]);
  useEffect(() => saveStore('sd_expenses', expenses), [expenses]);
  useEffect(() => saveStore('sd_decisions', decisions), [decisions]);
  useEffect(() => saveStore('sd_settings', settings), [settings]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2800); return () => clearTimeout(t); } }, [toast]);

  const revenue = orders.filter(o => o.status === 'Hoàn thành').reduce((sum, o) => sum + o.total, 0) + 12450000;
  const lowStock = products.filter(p => p.stock <= p.min);
  const inventoryValue = products.reduce((sum, p) => sum + p.stock * p.cost, 0);
  const grossProfit = products.reduce((sum, p) => sum + p.stock * (p.price - p.cost), 0) + 16800000;
  const searchFilter = (rows, fields) => rows.filter(row => fields.some(field => String(row[field] ?? '').toLowerCase().includes(query.toLowerCase())));
  const go = (name) => { setPage(name); setMobileNav(false); setQuery(''); };
  const notify = (message) => setToast(message);
  const addDecision = (title, reason) => setDecisions(prev => [{ id: `QD${String(Date.now()).slice(-5)}`, title, reason, owner: 'Quản lý', due: '25/10/2026', status: 'Chưa bắt đầu' }, ...prev]);

  function sendChat(text = chatInput) {
    const prompt = text.trim(); if (!prompt) return;
    let answer = 'Tôi có thể hỗ trợ bạn xem doanh thu, tồn kho, cảnh báo, lợi nhuận hoặc mô phỏng phương án. Hãy thử hỏi cụ thể hơn nhé.';
    const q = prompt.toLowerCase();
    if (q.includes('doanh thu') || q.includes('bán hàng')) answer = `Theo dữ liệu demo hiện có, doanh thu đơn hàng đã hoàn thành và số liệu minh họa là ${money(revenue)}. Có ${orders.length} đơn hàng trong danh sách, trong đó ${orders.filter(o => o.status === 'Hoàn thành').length} đơn đã hoàn thành. Đây là dữ liệu demo lưu trên trình duyệt.`;
    else if (q.includes('tồn kho') || q.includes('hết hàng') || q.includes('kho')) answer = lowStock.length ? `Có ${lowStock.length} mặt hàng cần kiểm tra tồn kho: ${lowStock.map(p => `${p.name} (còn ${p.stock}, ngưỡng ${p.min})`).join('; ')}. Bạn nên xác nhận nhu cầu trước khi tạo đơn nhập hàng.` : 'Hiện chưa có sản phẩm nào dưới ngưỡng tồn kho tối thiểu trong dữ liệu demo.';
    else if (q.includes('lợi nhuận') || q.includes('chi phí')) answer = `Lợi nhuận gộp ước tính minh họa là ${money(grossProfit)}. Chi phí đã ghi nhận trong danh sách là ${money(expenses.reduce((s, e) => s + e.amount, 0))}. Cần dữ liệu kế toán đầy đủ để kết luận lợi nhuận thực tế.`;
    else if (q.includes('cảnh báo') || q.includes('rủi ro')) answer = lowStock.length ? `Cảnh báo ưu tiên: ${lowStock.map(p => `${p.name} còn ${p.stock} sản phẩm`).join(', ')}. Hãy kiểm tra tốc độ bán và thời gian giao hàng trước khi quyết định nhập.` : 'Không có cảnh báo tồn kho theo ngưỡng hiện tại. Bạn vẫn nên theo dõi doanh thu, chi phí và đơn hàng chậm.';
    else if (q.includes('mô phỏng') || q.includes('phương án')) answer = `Trong mô phỏng hiện tại, bạn có thể điều chỉnh giá, marketing và giá vốn tại mục “Mô phỏng phương án”. Mô hình chỉ minh họa tác động theo giả định, không phải dự báo đã được kiểm chứng.`;
    setChat(prev => [...prev, { role: 'user', text: prompt }, { role: 'assistant', text: answer }]); setChatInput('');
  }

  const exportCsv = (rows, filename) => {
    if (!rows.length) { notify('Không có dữ liệu để xuất.'); return; }
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(','), ...rows.map(r => keys.map(k => `"${String(r[k] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); notify('Đã xuất file CSV.');
  };

  function submitModal(e) {
    e.preventDefault(); const fd = new FormData(e.currentTarget); const v = Object.fromEntries(fd.entries());
    if (modal === 'product') {
      if (!v.name || Number(v.price) < 0 || Number(v.stock) < 0) return notify('Vui lòng nhập tên và số liệu hợp lệ.');
      setProducts(prev => [{ id: `SP${String(Date.now()).slice(-5)}`, name: v.name, category: v.category || 'Khác', price: Number(v.price), cost: Number(v.cost), stock: Number(v.stock), min: Number(v.min), supplier: v.supplier || 'Chưa chọn' }, ...prev]); notify('Đã thêm sản phẩm.');
    } else if (modal === 'order') {
      if (!v.customer || Number(v.total) <= 0) return notify('Vui lòng nhập khách hàng và tổng tiền hợp lệ.');
      setOrders(prev => [{ id: `DH-${String(Date.now()).slice(-4)}`, customer: v.customer, date: new Date().toLocaleDateString('vi-VN'), total: Number(v.total), status: v.status || 'Đang xử lý', items: v.items || 'Đơn hàng mới' }, ...prev]); notify('Đã tạo đơn hàng.');
    } else if (modal === 'customer') {
      setCustomers(prev => [{ id: `KH${String(Date.now()).slice(-4)}`, name: v.name, phone: v.phone, email: v.email, orders: 0, spent: 0 }, ...prev]); notify('Đã thêm khách hàng.');
    } else if (modal === 'expense') {
      setExpenses(prev => [{ id: `CP${String(Date.now()).slice(-4)}`, date: new Date().toLocaleDateString('vi-VN'), name: v.name, category: v.category, amount: Number(v.amount) }, ...prev]); notify('Đã ghi nhận chi phí.');
    } else if (modal === 'decision') {
      addDecision(v.title, v.reason); notify('Đã tạo quyết định theo dõi.');
    }
    setModal(null);
  }

  function deleteProduct(id) { if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) { setProducts(prev => prev.filter(p => p.id !== id)); notify('Đã xóa sản phẩm.'); } }
  function changeDecision(id, status) { setDecisions(prev => prev.map(d => d.id === id ? { ...d, status } : d)); notify('Đã cập nhật trạng thái quyết định.'); }

  const pageHeader = {
    'Tổng quan': ['TRUNG TÂM ĐIỀU HÀNH', 'Bảng điều khiển', 'Theo dõi sức khỏe kinh doanh và ưu tiên hành động.'],
    'Bán hàng & đơn hàng': ['ĐIỀU HÀNH', 'Bán hàng & đơn hàng', 'Quản lý đơn hàng, trạng thái xử lý và giá trị giao dịch.'],
    'Sản phẩm': ['DANH MỤC', 'Quản lý sản phẩm', 'Quản lý danh mục, giá bán và giá vốn.'],
    'Tồn kho': ['VẬN HÀNH', 'Quản lý tồn kho', 'Theo dõi số lượng tồn và xác định mặt hàng cần bổ sung.'],
    'Nhà cung cấp': ['MUA HÀNG', 'Nhà cung cấp', 'Theo dõi đối tác cung ứng và công nợ tham khảo.'],
    'Khách hàng': ['QUAN HỆ KHÁCH HÀNG', 'Danh sách khách hàng', 'Hiểu lịch sử mua và giá trị khách hàng.'],
    'Chi phí & lợi nhuận': ['TÀI CHÍNH', 'Chi phí & lợi nhuận', 'Theo dõi chi phí vận hành và biên lợi nhuận ước tính.'],
    'Phân tích & dự báo': ['PHÂN TÍCH DỮ LIỆU', 'Phân tích & dự báo', 'Biến dữ liệu vận hành thành tín hiệu hỗ trợ quyết định.'],
    'Cảnh báo kinh doanh': ['GIÁM SÁT', 'Cảnh báo kinh doanh', 'Ưu tiên các vấn đề có thể ảnh hưởng hoạt động.'],
    'Mô phỏng phương án': ['HỖ TRỢ QUYẾT ĐỊNH', 'Mô phỏng phương án', 'Thay đổi giả định để so sánh các kịch bản kinh doanh.'],
    'Quyết định': ['THỰC THI', 'Theo dõi quyết định', 'Ghi nhận hành động, người phụ trách và tiến độ.'],
    'Báo cáo quản trị': ['BÁO CÁO', 'Báo cáo quản trị', 'Tổng hợp dữ liệu để xem xét và trao đổi trong cuộc họp.'],
    'Cài đặt': ['HỆ THỐNG', 'Cài đặt', 'Tùy chỉnh thông tin cửa hàng và trải nghiệm demo.']
  };
  const [eyebrow, title, subtitle] = pageHeader[page] || pageHeader['Tổng quan'];

  function renderDashboard() {
    const chart = [35, 48, 42, 61, 55, 72, 66, 82, 70, 90, 77, 96];
    return <>
      <div className="kpi-grid">
        <KpiCard title="Doanh thu ghi nhận" value={money(revenue)} change="12,8%" icon={CircleDollarSign} tone="blue" />
        <KpiCard title="Đơn hàng" value={number(orders.length + 126)} change="8,4%" icon={ShoppingCart} tone="purple" />
        <KpiCard title="Lợi nhuận gộp ước tính" value={money(grossProfit)} change="6,2%" icon={TrendingUp} tone="green" />
        <KpiCard title="Cảnh báo tồn kho" value={`${lowStock.length} mặt hàng`} change={lowStock.length ? 'Cần chú ý' : 'Ổn định'} icon={AlertTriangle} tone="orange" note="theo ngưỡng thiết lập" />
      </div>
      <div className="dashboard-grid">
        <div className="panel chart-panel"><div className="panel-heading"><div><h2>Xu hướng doanh thu</h2><p>Biểu đồ minh họa theo 12 kỳ gần nhất</p></div><select value={range} onChange={e => setRange(e.target.value)}><option>30 ngày gần nhất</option><option>90 ngày gần nhất</option><option>12 tháng gần nhất</option></select></div><div className="chart-legend"><span><i className="legend-dot blue-dot"/> Doanh thu</span><span className="muted">Đơn vị: triệu đồng · minh họa</span></div><div className="bar-chart">{chart.map((h, i) => <div className="bar-column" key={i}><div className="bar-value" style={{ height: `${h}%` }} title={`${h} đơn vị`}/><span>{['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'][i]}</span></div>)}</div></div>
        <div className="panel"><div className="panel-heading"><div><h2>Ưu tiên hôm nay</h2><p>Những việc cần chú ý</p></div><Bell size={18} className="muted"/></div><div className="priority-list">{lowStock.slice(0, 3).map(p => <div className="priority-item" key={p.id}><span className="priority-icon warning"><AlertTriangle size={16}/></span><div><strong>{p.name}</strong><p>Còn {p.stock} sản phẩm · ngưỡng {p.min}</p></div><ChevronRight size={16}/></div>)}{lowStock.length === 0 && <div className="priority-item"><span className="priority-icon success"><Check size={16}/></span><div><strong>Tồn kho trong ngưỡng</strong><p>Chưa phát hiện mặt hàng dưới ngưỡng.</p></div></div>}<div className="priority-item"><span className="priority-icon blue"><ClipboardList size={16}/></span><div><strong>{orders.filter(o => o.status === 'Đang xử lý').length} đơn đang xử lý</strong><p>Kiểm tra tiến độ giao hàng.</p></div><ChevronRight size={16} onClick={() => go('Bán hàng & đơn hàng')}/></div><div className="priority-item"><span className="priority-icon purple"><Lightbulb size={16}/></span><div><strong>{decisions.filter(d => d.status !== 'Hoàn thành').length} quyết định đang mở</strong><p>Cập nhật người phụ trách và thời hạn.</p></div><ChevronRight size={16} onClick={() => go('Quyết định')}/></div></div><button className="text-button" onClick={() => go('Cảnh báo kinh doanh')}>Xem tất cả cảnh báo <ChevronRight size={15}/></button></div>
      </div>
      <div className="panel table-panel"><div className="panel-heading"><div><h2>Đơn hàng gần đây</h2><p>Các giao dịch mới nhất trong dữ liệu demo</p></div><Button variant="secondary" onClick={() => go('Bán hàng & đơn hàng')}>Xem tất cả <ChevronRight size={15}/></Button></div><OrdersTable rows={orders.slice(0, 4)}/></div>
      <div className="demo-note"><Sparkles size={17}/><span><strong>Lưu ý dữ liệu:</strong> SmartDecision đang hiển thị dữ liệu minh họa và dữ liệu bạn thao tác trên trình duyệt này. Hãy kết nối cơ sở dữ liệu trước khi dùng cho quyết định kinh doanh thực tế.</span></div>
    </>;
  }


  function renderOrders() {
    const rows = searchFilter(orders, ['id','customer','status','items']);
    return <><div className="summary-strip"><div><span>Tổng đơn hàng</span><strong>{orders.length}</strong></div><div><span>Hoàn thành</span><strong>{orders.filter(o => o.status === 'Hoàn thành').length}</strong></div><div><span>Đang xử lý</span><strong>{orders.filter(o => o.status === 'Đang xử lý').length}</strong></div><div><span>Giá trị đơn hoàn thành</span><strong>{money(orders.filter(o => o.status === 'Hoàn thành').reduce((s,o)=>s+o.total,0))}</strong></div></div><div className="panel table-panel"><div className="panel-heading wrap-heading"><div><h2>Danh sách đơn hàng</h2><p>Tra cứu và tạo đơn mới</p></div><div className="toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Tìm mã đơn, khách hàng..."/><Button icon={Plus} onClick={() => setModal('order')}>Tạo đơn hàng</Button></div></div><OrdersTable rows={rows}/></div></>;
  }

  function renderProducts(inventory = false) {
    const rows = searchFilter(products, ['id','name','category','supplier']);
    return <><div className="summary-strip"><div><span>Tổng sản phẩm</span><strong>{products.length}</strong></div><div><span>Giá trị tồn kho (giá vốn)</span><strong>{money(inventoryValue)}</strong></div><div><span>Đang dưới ngưỡng</span><strong className={lowStock.length ? 'text-warning' : ''}>{lowStock.length}</strong></div><div><span>Danh mục</span><strong>{new Set(products.map(p=>p.category)).size}</strong></div></div><div className="panel table-panel"><div className="panel-heading wrap-heading"><div><h2>{inventory ? 'Tình trạng tồn kho' : 'Danh mục sản phẩm'}</h2><p>{inventory ? 'Theo dõi số lượng thực tế và ngưỡng tồn tối thiểu' : 'Cập nhật thông tin sản phẩm, giá và nhà cung cấp'}</p></div><div className="toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Tìm tên, mã, danh mục..."/><Button icon={Plus} onClick={() => setModal('product')}>Thêm sản phẩm</Button></div></div><div className="table-wrap"><table><thead><tr><th>Mã SP</th><th>Sản phẩm</th><th>Danh mục</th><th>Giá bán</th><th>Giá vốn</th><th>Tồn kho</th><th>Trạng thái</th><th></th></tr></thead><tbody>{rows.map(p=><tr key={p.id}><td className="code-cell">{p.id}</td><td><strong>{p.name}</strong><small>{p.supplier}</small></td><td>{p.category}</td><td className="amount-cell">{money(p.price)}</td><td>{money(p.cost)}</td><td><strong>{p.stock}</strong><small>Ngưỡng: {p.min}</small></td><td><Badge tone={p.stock <= p.min ? 'warning' : 'success'}>{p.stock <= p.min ? 'Cần nhập hàng' : 'Đủ hàng'}</Badge></td><td><button className="icon-button danger-icon" title="Xóa sản phẩm" onClick={()=>deleteProduct(p.id)}><Trash2 size={16}/></button></td></tr>)}</tbody></table>{!rows.length && <EmptyState text="Không tìm thấy sản phẩm."/>}</div><div className="table-footer"><span>{rows.length} sản phẩm</span><Button variant="secondary" icon={Download} onClick={()=>exportCsv(rows, inventory ? 'ton-kho.csv':'san-pham.csv')}>Xuất CSV</Button></div></div></>;
  }

  function renderCustomers() { const rows = searchFilter(customers,['id','name','phone','email']); return <div className="panel table-panel"><div className="panel-heading wrap-heading"><div><h2>Danh sách khách hàng</h2><p>Thông tin liên hệ và giá trị mua hàng</p></div><div className="toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Tìm khách hàng..."/><Button icon={Plus} onClick={()=>setModal('customer')}>Thêm khách hàng</Button></div></div><div className="table-wrap"><table><thead><tr><th>Mã KH</th><th>Khách hàng</th><th>Điện thoại</th><th>Email</th><th>Số đơn</th><th>Tổng chi tiêu</th></tr></thead><tbody>{rows.map(c=><tr key={c.id}><td className="code-cell">{c.id}</td><td><strong>{c.name}</strong></td><td>{c.phone}</td><td>{c.email}</td><td>{c.orders}</td><td className="amount-cell">{money(c.spent)}</td></tr>)}</tbody></table>{!rows.length&&<EmptyState/>}</div><div className="table-footer"><span>{rows.length} khách hàng</span><Button variant="secondary" icon={Download} onClick={()=>exportCsv(rows,'khach-hang.csv')}>Xuất CSV</Button></div></div>; }

  function renderSuppliers() { const rows = searchFilter(suppliers,['id','name','contact']); return <div className="content-grid two-col">{rows.map(s=><div className="panel supplier-card" key={s.id}><div className="supplier-icon"><Building2 size={22}/></div><div className="supplier-main"><div className="supplier-top"><h2>{s.name}</h2><Badge tone="success">Đang hợp tác</Badge></div><p>{s.id} · {s.contact}</p><div className="supplier-stats"><div><span>Sản phẩm cung ứng</span><strong>{s.products}</strong></div><div><span>Công nợ tham khảo</span><strong>{money(s.debt)}</strong></div></div></div></div>)}<div className="panel supplier-add" onClick={()=>notify('Bản demo: chức năng thêm nhà cung cấp sẽ được bổ sung trong phiên bản tiếp theo.')}><Plus size={20}/><strong>Thêm nhà cung cấp</strong><span>Ghi nhận đối tác cung ứng mới</span></div></div>; }

  function renderExpenses() { const rows = searchFilter(expenses,['id','name','category']); const total = expenses.reduce((s,e)=>s+e.amount,0); return <><div className="kpi-grid three-kpi"><KpiCard title="Tổng chi phí đã ghi nhận" value={money(total)} change="3 khoản" icon={Wallet} tone="purple" note="trong danh sách demo"/><KpiCard title="Lợi nhuận gộp ước tính" value={money(grossProfit)} change="Ước tính" icon={TrendingUp} tone="green" note="chưa trừ toàn bộ chi phí"/><KpiCard title="Tỷ lệ chi phí / doanh thu" value={`${revenue ? (total/revenue*100).toFixed(1).replace('.',',') : '0'}%`} change="Tham khảo" icon={Activity} tone="orange" note="theo dữ liệu đang có"/></div><div className="panel table-panel"><div className="panel-heading wrap-heading"><div><h2>Sổ chi phí</h2><p>Ghi nhận chi phí theo nhóm</p></div><div className="toolbar"><SearchBox value={query} onChange={setQuery}/><Button icon={Plus} onClick={()=>setModal('expense')}>Thêm chi phí</Button></div></div><div className="table-wrap"><table><thead><tr><th>Mã</th><th>Ngày</th><th>Nội dung</th><th>Danh mục</th><th>Số tiền</th></tr></thead><tbody>{rows.map(e=><tr key={e.id}><td className="code-cell">{e.id}</td><td>{e.date}</td><td><strong>{e.name}</strong></td><td><Badge>{e.category}</Badge></td><td className="amount-cell">{money(e.amount)}</td></tr>)}</tbody></table>{!rows.length&&<EmptyState/>}</div><div className="table-footer"><span>{rows.length} khoản chi</span><Button variant="secondary" icon={Download} onClick={()=>exportCsv(rows,'chi-phi.csv')}>Xuất CSV</Button></div></div></>; }

  function renderAnalysis() { const categories = [...new Set(products.map(p=>p.category))].map(category=>({category, count:products.filter(p=>p.category===category).length, value:products.filter(p=>p.category===category).reduce((s,p)=>s+p.stock*p.price,0)})); return <><div className="kpi-grid"><KpiCard title="Doanh thu ghi nhận" value={money(revenue)} change="Dữ liệu demo" icon={CircleDollarSign}/><KpiCard title="Giá trị hàng tồn" value={money(inventoryValue)} change="Theo giá vốn" icon={Boxes} tone="purple"/><KpiCard title="Lợi nhuận gộp ước tính" value={money(grossProfit)} change="Minh họa" icon={TrendingUp} tone="green"/><KpiCard title="Sản phẩm dưới ngưỡng" value={lowStock.length} change="Cần theo dõi" icon={AlertTriangle} tone="orange"/></div><div className="content-grid two-col"><div className="panel"><div className="panel-heading"><div><h2>Cơ cấu danh mục</h2><p>Số lượng sản phẩm theo danh mục</p></div></div><div className="category-list">{categories.map((c,i)=><div className="category-row" key={c.category}><div className="category-label"><span className={`category-dot dot-${i%4}`}/><strong>{c.category}</strong><span>{c.count} sản phẩm</span></div><div className="progress-track"><div className={`progress-fill fill-${i%4}`} style={{width:`${products.length ? c.count/products.length*100 : 0}%`}}/></div><div className="category-value">{money(c.value)}</div></div>)}</div></div><div className="panel insight-panel"><div className="panel-heading"><div><h2>Nhận định hỗ trợ quyết định</h2><p>Được tạo từ quy tắc demo</p></div><BrainCircuit size={20} className="primary-text"/></div>{(lowStock.length ? lowStock.slice(0,3).map(p=>({title:`Kiểm tra tồn kho: ${p.name}`,desc:`Còn ${p.stock} sản phẩm, thấp hơn hoặc bằng ngưỡng ${p.min}. Xem xét nhu cầu và thời gian cung ứng trước khi đặt hàng.`,tone:'warning'})) : [{title:'Tồn kho trong ngưỡng',desc:'Chưa có sản phẩm dưới ngưỡng thiết lập. Tiếp tục theo dõi tốc độ bán.',tone:'success'}]).map((it,i)=><div className="insight-item" key={i}><span className={`insight-icon ${it.tone}`}><Lightbulb size={17}/></span><div><strong>{it.title}</strong><p>{it.desc}</p><button className="text-button" onClick={()=>{addDecision(it.title,it.desc);notify('Đã chuyển nhận định thành quyết định theo dõi.');go('Quyết định')}}>Tạo quyết định theo dõi <ChevronRight size={14}/></button></div></div>)}<div className="caveat"><HelpCircle size={16}/> Đây là nhận định theo quy tắc và dữ liệu demo, không phải dự báo thống kê đã kiểm định.</div></div></div></>; }

  function renderAlerts() { const alerts = [...lowStock.map(p=>({title:`Tồn kho thấp: ${p.name}`,desc:`Còn ${p.stock} sản phẩm, ngưỡng tối thiểu ${p.min}. Nhà cung cấp: ${p.supplier}.`,priority:'Cần xử lý',tone:'warning',action:()=>{addDecision(`Bổ sung tồn kho: ${p.name}`,`Tồn kho còn ${p.stock}, ngưỡng ${p.min}.`);notify('Đã tạo quyết định bổ sung tồn kho.');go('Quyết định')}})), ...orders.filter(o=>o.status==='Đang xử lý').map(o=>({title:`Đơn hàng đang xử lý: ${o.id}`,desc:`Khách hàng ${o.customer}, tổng giá trị ${money(o.total)}. Kiểm tra tiến độ xử lý.`,priority:'Theo dõi',tone:'info',action:()=>go('Bán hàng & đơn hàng')}))]; return <div className="panel"><div className="panel-heading"><div><h2>Danh sách cảnh báo</h2><p>{alerts.length} cảnh báo từ dữ liệu hiện tại</p></div><Badge tone={alerts.length?'warning':'success'}>{alerts.length?'Cần chú ý':'Ổn định'}</Badge></div>{alerts.map((a,i)=><div className="alert-row" key={i}><span className={`alert-symbol ${a.tone}`}><AlertTriangle size={19}/></span><div className="alert-copy"><strong>{a.title}</strong><p>{a.desc}</p></div><Badge tone={a.tone==='warning'?'warning':'info'}>{a.priority}</Badge><Button variant="secondary" onClick={a.action}>Xử lý</Button></div>)}{!alerts.length&&<EmptyState text="Không có cảnh báo theo các quy tắc hiện tại."/>}</div>; }

  function renderSimulation() { const baseRevenue = 100000000; const baseCost = 65000000; const simulatedRevenue = baseRevenue*(1+simPrice/100); const simulatedMarketingCost = 8000000*(1+simMarketing/100); const simulatedCost = baseCost*(1-simCost/100); const profit = simulatedRevenue-simulatedCost-simulatedMarketingCost; const baseProfit=baseRevenue-baseCost-8000000; return <><div className="simulation-layout"><div className="panel simulation-controls"><div className="panel-heading"><div><h2>Điều chỉnh giả định</h2><p>Kéo thanh trượt để thay đổi kịch bản</p></div><SlidersHorizontal size={20} className="primary-text"/></div><div className="slider-field"><div className="slider-title"><label htmlFor="price-slider">Tăng doanh thu giả định</label><strong>+{simPrice}%</strong></div><input id="price-slider" type="range" min="-20" max="30" value={simPrice} onChange={e=>setSimPrice(Number(e.target.value))}/><div className="range-labels"><span>-20%</span><span>+30%</span></div><p>Phản ánh tác động giả định từ giá bán/sản lượng.</p></div><div className="slider-field"><div className="slider-title"><label htmlFor="marketing-slider">Thay đổi chi phí marketing</label><strong>+{simMarketing}%</strong></div><input id="marketing-slider" type="range" min="-50" max="100" value={simMarketing} onChange={e=>setSimMarketing(Number(e.target.value))}/><div className="range-labels"><span>-50%</span><span>+100%</span></div><p>Chi phí tăng có thể hỗ trợ tiếp cận khách hàng nhưng làm giảm lợi nhuận.</p></div><div className="slider-field"><div className="slider-title"><label htmlFor="cost-slider">Giảm giá vốn</label><strong>{simCost}%</strong></div><input id="cost-slider" type="range" min="0" max="20" value={simCost} onChange={e=>setSimCost(Number(e.target.value))}/><div className="range-labels"><span>0%</span><span>20%</span></div><p>Minh họa tác động từ đàm phán nhà cung cấp/tối ưu vận hành.</p></div><Button variant="secondary" icon={RotateCcw} onClick={()=>{setSimPrice(5);setSimMarketing(2);setSimCost(3)}}>Đặt lại giả định</Button></div><div className="panel scenario-result"><div className="eyebrow">KẾT QUẢ KỊCH BẢN</div><h2>Hiệu quả tài chính mô phỏng</h2><p className="muted">Đơn vị: VND · số liệu giả định, không phải dự báo thực tế</p><div className="result-highlight"><span>Lợi nhuận kịch bản</span><strong>{money(profit)}</strong><Badge tone={profit>=baseProfit?'success':'danger'}>{profit>=baseProfit?'+':''}{money(profit-baseProfit)} so với cơ sở</Badge></div><div className="result-lines"><div><span>Doanh thu giả định</span><strong>{money(simulatedRevenue)}</strong></div><div><span>Chi phí hàng hóa sau điều chỉnh</span><strong>{money(simulatedCost)}</strong></div><div><span>Chi phí marketing</span><strong>{money(simulatedMarketingCost)}</strong></div><div className="result-total"><span>Lợi nhuận cơ sở</span><strong>{money(baseProfit)}</strong></div></div><div className="recommendation"><Lightbulb size={18}/><div><strong>Gợi ý xem xét</strong><p>{profit>=baseProfit?'Kịch bản đang cho kết quả cao hơn cơ sở theo giả định. Hãy kiểm tra tính khả thi, nhu cầu thị trường và chi phí thực tế trước khi triển khai.':'Kịch bản đang thấp hơn mức cơ sở. Cân nhắc giảm chi phí hoặc điều chỉnh giả định, sau đó đánh giá lại.'}</p></div></div><Button icon={Plus} onClick={()=>{addDecision('Đánh giá kịch bản kinh doanh',`Giả định: doanh thu ${simPrice}%, marketing ${simMarketing}%, giảm giá vốn ${simCost}%. Lợi nhuận mô phỏng ${money(profit)}.`);notify('Đã lưu kịch bản thành quyết định theo dõi.');go('Quyết định')}}>Lưu thành quyết định</Button></div></div></>; }

  function renderDecisions() { const rows = searchFilter(decisions,['id','title','reason','owner','status']); return <div className="panel table-panel"><div className="panel-heading wrap-heading"><div><h2>Sổ theo dõi quyết định</h2><p>Gắn nhận định với hành động và trách nhiệm thực hiện</p></div><div className="toolbar"><SearchBox value={query} onChange={setQuery}/><Button icon={Plus} onClick={()=>setModal('decision')}>Tạo quyết định</Button></div></div><div className="table-wrap"><table><thead><tr><th>Mã</th><th>Quyết định / lý do</th><th>Phụ trách</th><th>Thời hạn</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead><tbody>{rows.map(d=><tr key={d.id}><td className="code-cell">{d.id}</td><td><strong>{d.title}</strong><small>{d.reason}</small></td><td>{d.owner}</td><td>{d.due}</td><td><Badge tone={d.status==='Hoàn thành'?'success':d.status==='Đang thực hiện'?'info':'warning'}>{d.status}</Badge></td><td><select className="compact-select" value={d.status} onChange={e=>changeDecision(d.id,e.target.value)}><option>Chưa bắt đầu</option><option>Đang thực hiện</option><option>Hoàn thành</option></select></td></tr>)}</tbody></table>{!rows.length&&<EmptyState/>}</div><div className="table-footer"><span>{rows.length} quyết định</span><Button variant="secondary" icon={Download} onClick={()=>exportCsv(rows,'quyet-dinh.csv')}>Xuất CSV</Button></div></div>; }

  function renderReports() { return <><div className="report-cards"><div className="panel report-card"><span className="report-icon blue"><FileBarChart size={22}/></span><h2>Báo cáo doanh thu</h2><p>Tổng hợp đơn hàng và giá trị giao dịch trong danh sách demo.</p><Button variant="secondary" icon={Download} onClick={()=>exportCsv(orders,'bao-cao-doanh-thu.csv')}>Xuất báo cáo CSV</Button></div><div className="panel report-card"><span className="report-icon purple"><Package size={22}/></span><h2>Báo cáo tồn kho</h2><p>Danh sách sản phẩm, số lượng, giá vốn và ngưỡng tồn tối thiểu.</p><Button variant="secondary" icon={Download} onClick={()=>exportCsv(products,'bao-cao-ton-kho.csv')}>Xuất báo cáo CSV</Button></div><div className="panel report-card"><span className="report-icon green"><Wallet size={22}/></span><h2>Báo cáo chi phí</h2><p>Chi phí được ghi nhận theo ngày và nhóm chi phí.</p><Button variant="secondary" icon={Download} onClick={()=>exportCsv(expenses,'bao-cao-chi-phi.csv')}>Xuất báo cáo CSV</Button></div><div className="panel report-card"><span className="report-icon orange"><Target size={22}/></span><h2>Báo cáo quyết định</h2><p>Trạng thái và tiến độ các quyết định đã ghi nhận.</p><Button variant="secondary" icon={Download} onClick={()=>exportCsv(decisions,'bao-cao-quyet-dinh.csv')}>Xuất báo cáo CSV</Button></div></div><div className="demo-note"><ShieldCheck size={17}/><span>Các báo cáo được xuất thành CSV để mở bằng Excel. Số liệu phụ thuộc vào dữ liệu đang có trên trình duyệt.</span></div></>; }

  function renderSettings() { return <div className="panel settings-panel"><div className="panel-heading"><div><h2>Thông tin hệ thống</h2><p>Cài đặt dành cho bản demo hiện tại</p></div><Settings size={20} className="muted"/></div><form onSubmit={e=>{e.preventDefault();saveStore('sd_settings',settings);notify('Đã lưu cài đặt trên trình duyệt.')}} className="settings-form"><label>Tên cửa hàng / doanh nghiệp<input value={settings.business} onChange={e=>setSettings({...settings,business:e.target.value})}/></label><label>Đơn vị tiền tệ<select value={settings.currency} onChange={e=>setSettings({...settings,currency:e.target.value})}><option value="VND">VND — Việt Nam đồng</option><option value="USD">USD — Đô la Mỹ</option></select></label><div className="setting-toggle"><div><strong>Cảnh báo tồn kho</strong><p>Hiển thị cảnh báo dựa trên ngưỡng tồn tối thiểu của sản phẩm.</p></div><input type="checkbox" checked={settings.alerts} onChange={e=>setSettings({...settings,alerts:e.target.checked})}/></div><Button type="submit" icon={Check}>Lưu cài đặt</Button></form><div className="settings-warning"><AlertTriangle size={17}/><span>Đây là cài đặt demo được lưu trong trình duyệt. Chưa có tài khoản, phân quyền hoặc đồng bộ dữ liệu đám mây.</span></div><Button variant="danger" icon={RotateCcw} onClick={()=>{if(confirm('Khôi phục toàn bộ dữ liệu demo ban đầu? Các thay đổi trên trình duyệt này sẽ bị mất.')){setProducts(initialProducts);setOrders(initialOrders);setCustomers(initialCustomers);setSuppliers(initialSuppliers);setExpenses(initialExpenses);setDecisions(initialDecisions);notify('Đã khôi phục dữ liệu demo ban đầu.')}}}>Khôi phục dữ liệu demo</Button></div>; }

  const renderPage = () => {
    if(page==='Tổng quan') return renderDashboard();
    if(page==='Bán hàng & đơn hàng') return renderOrders();
    if(page==='Sản phẩm') return renderProducts(false);
    if(page==='Tồn kho') return renderProducts(true);
    if(page==='Nhà cung cấp') return renderSuppliers();
    if(page==='Khách hàng') return renderCustomers();
    if(page==='Chi phí & lợi nhuận') return renderExpenses();
    if(page==='Phân tích & dự báo') return renderAnalysis();
    if(page==='Cảnh báo kinh doanh') return renderAlerts();
    if(page==='Mô phỏng phương án') return renderSimulation();
    if(page==='Quyết định') return renderDecisions();
    if(page==='Báo cáo quản trị') return renderReports();
    if(page==='Cài đặt') return renderSettings();
    return renderDashboard();
  };

  const modalFields = {
    product: { title:'Thêm sản phẩm', fields:[['name','Tên sản phẩm','text',true],['category','Danh mục','text',true],['price','Giá bán (VND)','number',true],['cost','Giá vốn (VND)','number',true],['stock','Số lượng tồn','number',true],['min','Ngưỡng tồn tối thiểu','number',true],['supplier','Nhà cung cấp','text',false]] },
    order: { title:'Tạo đơn hàng', fields:[['customer','Tên khách hàng','text',true],['items','Sản phẩm / số lượng','text',false],['total','Tổng tiền (VND)','number',true],['status','Trạng thái','select',true]] },
    customer: { title:'Thêm khách hàng', fields:[['name','Họ và tên','text',true],['phone','Số điện thoại','tel',true],['email','Email','email',false]] },
    expense: { title:'Ghi nhận chi phí', fields:[['name','Nội dung chi phí','text',true],['category','Danh mục','text',true],['amount','Số tiền (VND)','number',true]] },
    decision: { title:'Tạo quyết định', fields:[['title','Tên quyết định / hành động','text',true],['reason','Cơ sở / lý do','textarea',true]] }
  };

  return <div className="app-shell">
    {mobileNav && <div className="mobile-overlay" onClick={()=>setMobileNav(false)}/>}
    <aside className={`sidebar ${mobileNav?'sidebar-open':''}`}>
      <div className="brand"><div className="brand-mark"><BrainCircuit size={24}/></div><div><div className="brand-name">SmartDecision</div><div className="brand-subtitle">BUSINESS INTELLIGENCE</div></div><button className="mobile-close icon-button" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace"><div className="workspace-avatar">SR</div><div className="workspace-copy"><strong>{settings.business || 'Cửa hàng Smart Retail'}</strong><span>Không gian làm việc</span></div><ChevronDown size={15}/></div>
      <nav className="nav-menu">{navGroups.map(group=><div className="nav-group" key={group.label}><div className="nav-group-label">{group.label}</div>{group.items.map(([label,Icon])=><button key={label} className={`nav-item ${page===label?'active':''}`} onClick={()=>go(label)}><Icon size={18}/><span>{label}</span>{label==='Cảnh báo kinh doanh'&&lowStock.length>0&&<span className="nav-count">{lowStock.length}</span>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Headphones size={18}/></div><div><strong>Cần trợ giúp?</strong><p>Hỏi trợ lý SmartDecision</p></div><button className="icon-button" onClick={()=>setAssistantOpen(true)}><ChevronRight size={16}/></button></div><div className="user-profile"><div className="user-avatar">AD</div><div className="user-copy"><strong>Quản trị viên</strong><span>Bản demo · Local</span></div><button className="icon-button" onClick={()=>go('Cài đặt')}><Settings size={17}/></button></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={()=>setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">SmartDecision <ChevronRight size={14}/> <strong>{page}</strong></div></div><div className="topbar-actions"><div className="system-status"><span/> Dữ liệu demo</div><button className="icon-button topbar-bell" title="Xem cảnh báo" onClick={()=>go('Cảnh báo kinh doanh')}><Bell size={18}/>{lowStock.length>0&&<i/>}</button><div className="topbar-divider"/><button className="profile-mini" onClick={()=>go('Cài đặt')}><span className="user-avatar small">AD</span><span>Quản trị viên</span><ChevronDown size={14}/></button></div></header>
      <div className="page-content"><SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} action={page==='Tổng quan'?<div className="title-actions"><span className="date-chip"><CalendarDays size={15}/> 18/10/2026</span><Button variant="secondary" icon={Download} onClick={()=>exportCsv(orders,'tong-quan-don-hang.csv')}>Xuất dữ liệu</Button></div>:null}/>{renderPage()}</div>
      <footer className="app-footer"><span>© 2026 SmartDecision</span><span><span className="footer-status"/> Bản demo · Dữ liệu lưu trên thiết bị</span></footer>
    </main>
    <button className={`assistant-fab ${assistantOpen?'assistant-fab-open':''}`} onClick={()=>setAssistantOpen(!assistantOpen)} aria-label="Mở trợ lý AI">{assistantOpen?<X size={23}/>:<MessageCircle size={23}/>}<span>{assistantOpen?'Đóng trợ lý':'Trợ lý'}</span></button>
    {assistantOpen&&<div className="assistant-panel"><div className="assistant-head"><div className="assistant-avatar"><BrainCircuit size={20}/></div><div><strong>Trợ lý SmartDecision</strong><span><i/> Sẵn sàng hỗ trợ · Bản demo</span></div><button className="icon-button" onClick={()=>setAssistantOpen(false)}><X size={17}/></button></div><div className="assistant-disclaimer"><Sparkles size={14}/> Trợ lý quy tắc demo · Không thay thế tư vấn chuyên môn</div><div className="chat-messages">{chat.map((m,i)=><div className={`chat-message ${m.role}`} key={i}>{m.role==='assistant'&&<span className="chat-avatar"><BrainCircuit size={14}/></span>}<div>{m.text}</div></div>)}</div><div className="quick-prompts"><button onClick={()=>sendChat('Tình hình tồn kho thế nào?')}>Tình hình tồn kho</button><button onClick={()=>sendChat('Phân tích doanh thu')}>Phân tích doanh thu</button><button onClick={()=>sendChat('Có cảnh báo nào?')}>Cảnh báo</button></div><form className="chat-input-row" onSubmit={e=>{e.preventDefault();sendChat()}}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Hỏi về hoạt động kinh doanh..."/><button type="button" className="chat-mic" title="Nhập giọng nói không được bật trong bản demo này" onClick={()=>notify('Nhập giọng nói cần trình duyệt hỗ trợ Web Speech API và được bổ sung riêng.')}><Mic size={17}/></button><button className="chat-send" type="submit" aria-label="Gửi"><Send size={17}/></button></form></div>}
    {modal && modalFields[modal] && <Modal title={modalFields[modal].title} onClose={()=>setModal(null)}><form className="modal-form" onSubmit={submitModal}>{modalFields[modal].fields.map(([name,label,type,required])=><label key={name}>{label}{type==='textarea'?<textarea name={name} required={required} rows="3" placeholder={label}/>:type==='select'?<select name={name} defaultValue="Đang xử lý" required={required}><option>Đang xử lý</option><option>Hoàn thành</option><option>Đã hủy</option></select>:<input name={name} type={type} required={required} min={type==='number'?0:undefined} step={type==='number'?'1':undefined} placeholder={label}/>}</label>)}<div className="modal-actions"><Button variant="secondary" onClick={()=>setModal(null)}>Hủy</Button><Button type="submit" icon={Check}>Lưu thông tin</Button></div></form></Modal>}
    {toast&&<div className="toast"><Check size={17}/>{toast}</div>}
  </div>;
}
