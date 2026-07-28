# Ghi chú dữ liệu giao diện Welcome Page

## 1. Kết luận nhanh

Hiện tại trên giao diện Welcome Page:

- Khu vực **Thông báo từ Ban Quản Lý** đang gọi API backend.
- Các KPI, biểu đồ xu hướng và giờ cao điểm đang dùng dữ liệu minh họa được set cứng trên frontend.
- Các phần hero, giới thiệu tính năng, quy trình, hướng dẫn, điều khoản và footer là nội dung cố định, không cần lấy từ database.
- Trong file còn một số mock data cũ không còn được sử dụng và có thể xoá để code sạch hơn.

> Câu trả lời ngắn khi review:
>
> “Ở Welcome Page, phần thông báo đang lấy dữ liệu động từ backend qua API notifications. Các KPI và biểu đồ hiện là dữ liệu minh họa set cứng trên frontend, chưa phản ánh dữ liệu bãi xe thời gian thực. Những phần còn lại như hero, mô tả tính năng, quy trình, hướng dẫn, điều khoản và footer là nội dung marketing cố định nên không cần lấy database.”

---

## 2. Phần đang lấy dữ liệu từ backend/database

### Thông báo từ Ban Quản Lý

Đây là khu vực duy nhất trên Welcome Page đang gọi API thật.

API lấy danh sách tối đa 6 thông báo:

```http
GET /api/v1/notifications?page=0&size=6
```

API lấy chi tiết khi người dùng bấm vào một thông báo:

```http
GET /api/v1/notifications/{id}
```

Các trường được hiển thị từ kết quả backend:

- `id`
- `title`
- `summary`
- `content`
- `category`
- `publishedAt`

Vị trí code:

- `src/features/auth/pages/WelcomePage/WelcomePage.jsx`, component `NotificationCenter`.
- `src/services/notificationService.js`, các hàm `getActiveNotifications` và `getNotificationDetail`.

Lưu ý:

- Frontend chỉ gọi backend API, không kết nối trực tiếp database.
- Việc backend đọc dữ liệu từ database được hiểu theo kiến trúc của hệ thống.
- Nếu API lỗi, service hiện trả về mảng rỗng. Welcome Page sẽ hiển thị trạng thái “Chưa có thông báo”, chưa phân biệt rõ giữa lỗi API và database thật sự không có dữ liệu.

---

## 3. Phần set cứng nhưng nên lấy backend nếu muốn hiển thị dữ liệu thật

### 3.1. Các thẻ KPI

Các thông tin sau hiện không lấy từ backend:

- Tổng số slot.
- Số slot còn trống.
- Phần trăm còn trống.
- Mức thay đổi `-5%`.
- Khung giờ cao điểm.

Code đang đặt cố định:

```js
const zone = 'LK';
const floor = '1';
```

Sau đó số liệu được tạo bằng công thức frontend:

```js
const baseTotal = zone === 'C' ? 120 : 100;
const floorMult = floor === 'B1' ? 1 : floor === 'B2' ? 0.8 : 0.6;
const occupiedRatio = zone === 'A' ? 0.85 : zone === 'B' ? 0.6 : 0.4;
```

Do `zone` và `floor` không thay đổi, kết quả hiển thị luôn được tạo từ cùng một bộ giá trị, không phản ánh tình trạng bãi xe thực tế.

Đề xuất:

- Nếu gọi đây là dashboard thời gian thực thì cần lấy API.
- Nếu chỉ dùng để giới thiệu sản phẩm thì có thể giữ dữ liệu mẫu, nhưng nên ghi rõ “Dữ liệu minh họa”.
- Có thể đổi khu vực này thành nội dung giới thiệu để tránh reviewer hiểu nhầm đây là số liệu thực tế.

### 3.2. Biểu đồ “Xu hướng sử dụng bãi xe”

Toàn bộ dữ liệu biểu đồ được set cứng:

```js
const trendData = [
  { time: '06h', value: 120 },
  { time: '08h', value: 850 },
  { time: '10h', value: 920 },
  { time: '12h', value: 750 },
  { time: '14h', value: 680 },
  { time: '16h', value: 890 },
  { time: '18h', value: 1100 },
  { time: '20h', value: 450 },
  { time: '22h', value: 150 },
];
```

Đề xuất:

- Nếu muốn hiển thị xu hướng vận hành thật, backend cần cung cấp số lượt xe hoặc mức sử dụng bãi theo từng khung giờ.
- Nếu chỉ để demo giao diện thì có thể giữ, nhưng nên note “Dữ liệu minh họa”.

### 3.3. Các con số giới thiệu hệ thống

Các số liệu sau được viết trực tiếp trong frontend:

- `99.9%` độ chính xác nhận diện biển số.
- Giám sát `24/7`.
- Mở barrier trong `1–2 giây`.
- `100%` dữ liệu được lưu trữ.
- Hơn `10.000` người dùng tin cậy.
- Toàn bộ quy trình dưới `30 giây`.

Các số này không nhất thiết phải lấy database nếu đây là thông số hoặc nội dung marketing cố định.

Tuy nhiên, nhóm cần có căn cứ nếu reviewer hỏi. Riêng số lượng người dùng nên lấy backend hoặc bỏ nếu chưa có dữ liệu thực tế chứng minh.

---

## 4. Phần set cứng và không cần lấy database

### 4.1. Thanh điều hướng

Bao gồm:

- Trang chủ.
- Bảng điều khiển.
- Thông báo.
- Khám phá.
- Thanh toán.
- Đăng nhập.
- Đăng ký.
- Chuyển ngôn ngữ.

Đây là cấu hình điều hướng và bản dịch giao diện, không cần database.

### 4.2. Hero đầu trang

Bao gồm:

- Tiêu đề Smart Parking.
- Nội dung mô tả hệ thống.
- Danh sách tính năng nổi bật.
- Nút đăng nhập và đăng ký.
- Hai ảnh nền chạy luân phiên.

Đây là nội dung giới thiệu cố định nên không cần database.

Lưu ý: ảnh nền hiện đang dùng URL từ website bên ngoài. Nên tải ảnh về project hoặc dùng CDN ổn định để tránh trường hợp website nguồn đổi hoặc xoá ảnh.

### 4.3. Hành trình trải nghiệm

Bao gồm:

- Đăng ký phương tiện.
- Xem biểu phí.
- Nhận diện biển số.
- Quản lý phương tiện.
- Thanh toán.

Đây là nội dung mô tả chức năng hệ thống, không cần database.

### 4.4. Tính năng cốt lõi

Bao gồm:

- Nhận diện biển số LPR.
- Đặt chỗ trước.
- Quản lý phương tiện.
- Hỗ trợ xe vãng lai.
- Thanh toán QR.
- Ứng dụng di động.
- Sơ đồ luồng vận hành.

Đây là nội dung giới thiệu sản phẩm, không cần database.

### 4.5. Quy trình đỗ xe

Bao gồm:

1. Nhận diện biển số.
2. Di chuyển vào chỗ đỗ.
3. Thanh toán khi ra.

Các quy định như chiều cao xe, tắt máy và đỗ đúng vạch cũng là nội dung hướng dẫn cố định, không cần database.

### 4.6. Footer và các modal

Bao gồm:

- Email liên hệ.
- Địa chỉ.
- Hướng dẫn sử dụng.
- Điều khoản sử dụng.
- Chính sách bảo mật.
- Copyright.

Đây là nội dung cố định, không cần database.

---

## 5. Dữ liệu set cứng đang tồn tại nhưng không được sử dụng

Trong `WelcomePage.jsx` còn các dữ liệu mock cũ:

- `translations.vi.notice.data`.
- `translations.en.notice.data`.
- `zoneData`.
- `buildingOptions`.
- `floorOptions`.
- `generateParkingAreas()`.
- `getAreaTone()`.

Hai bộ `notice.data` không còn được dùng để hiển thị thông báo vì component `NotificationCenter` đã chuyển sang gọi API backend.

Các dữ liệu khu vực, tòa nhà và tầng cũng không được render. Code hiện dùng các dòng `void ...` để tránh cảnh báo biến không được sử dụng.

Các phần này có thể xoá để:

- Giảm kích thước và độ phức tạp của file.
- Tránh người đọc hiểu nhầm Welcome Page đang sử dụng dữ liệu bãi xe này.
- Tránh nhầm lẫn giữa mock data và dữ liệu backend.

---

## 6. Trạng thái động nhưng không phải dữ liệu bãi xe

Welcome Page còn sử dụng:

- `useAuth()` để kiểm tra người dùng đã đăng nhập và role hiện tại.
- Token trong `localStorage` hoặc `sessionStorage` để điều hướng.
- Ngôn ngữ trong `localStorage`.

Đây là trạng thái đăng nhập và cấu hình trình duyệt, không phải dữ liệu vận hành bãi xe lấy trực tiếp từ database.

---

## 7. Bảng tổng hợp

| Khu vực | Nguồn dữ liệu hiện tại | Có cần database không? |
|---|---|---|
| Thông báo | Backend API | Có |
| Chi tiết thông báo | Backend API | Có |
| Tổng số slot | Công thức set cứng | Có, nếu muốn dữ liệu thật |
| Slot còn trống | Công thức set cứng | Có, nếu muốn dữ liệu thật |
| Giờ cao điểm | Công thức set cứng | Có, nếu muốn dự báo thật |
| Biểu đồ xu hướng | Mảng `trendData` set cứng | Có, nếu muốn số liệu thật |
| Hero | Nội dung set cứng | Không |
| Ảnh hero | URL set cứng | Không |
| Hành trình trải nghiệm | Nội dung set cứng | Không |
| Tính năng cốt lõi | Nội dung set cứng | Không |
| Quy trình đỗ xe | Nội dung set cứng | Không |
| Điều khoản và bảo mật | Nội dung set cứng | Không |
| Footer và liên hệ | Nội dung set cứng | Không |
| Trạng thái đăng nhập | Auth context và token trình duyệt | Không phải dữ liệu bãi xe |
| Ngôn ngữ | i18n và `localStorage` | Không |

---

## 8. Các câu reviewer có thể hỏi

### “Welcome Page có lấy dữ liệu thật không?”

Phần thông báo có lấy dữ liệu thật từ backend. KPI và biểu đồ hiện là dữ liệu minh họa trên frontend.

### “Tại sao KPI không lấy database?”

Welcome Page hiện đóng vai trò landing page giới thiệu sản phẩm. Phần KPI mới chỉ dùng để minh họa giao diện. Nếu yêu cầu hiển thị thời gian thực, nhóm sẽ nối với API thống kê bãi xe.

### “Thông báo set cứng hay lấy backend?”

Thông báo đang lấy backend qua API `/api/v1/notifications`. Trong file còn mock data cũ nhưng không được sử dụng.

### “Những phần nào không cần backend?”

Hero, nội dung giới thiệu tính năng, quy trình sử dụng, hướng dẫn, điều khoản, chính sách bảo mật, footer và cấu hình điều hướng không cần backend.

### “Có vấn đề gì cần cải thiện?”

- Ghi rõ KPI và biểu đồ là dữ liệu minh họa hoặc nối API thật.
- Xoá mock data cũ không còn sử dụng.
- Phân biệt trạng thái API lỗi với trạng thái không có thông báo.
- Chuyển ảnh hero từ URL bên ngoài sang asset nội bộ hoặc CDN ổn định.
- Kiểm tra lại căn cứ cho các số liệu marketing như `99.9%`, `10.000+` người dùng và quy trình dưới `30 giây`.
