# BÁO CÁO TỔNG HỢP LỖI VÀ THIẾU SÓT HỆ THỐNG PARKING SYSTEM

**Ngày kiểm tra:** 27/07/2026  
**Phạm vi:** Frontend React/Vite trong repository `PARKING_FE`  
**Nhánh kiểm tra:** `main`  
**Commit hiện tại:** `33ea578`  
**Trạng thái đồng bộ:** `main` đang đồng bộ với `origin/main`, nhưng vẫn còn thay đổi local chưa commit  

## 1. Mục đích báo cáo

Báo cáo này tổng hợp các lỗi, rủi ro kỹ thuật và thiếu sót nghiệp vụ còn tồn tại trong frontend Parking System. Nội dung được chia theo mức độ ưu tiên để nhóm phát triển có thể xác định phần cần sửa trước khi demo, kiểm thử nghiệm thu hoặc triển khai production.

Các nhận định trong báo cáo được chia thành ba loại:

- **Lỗi đã xác nhận:** Có bằng chứng trực tiếp trong source code hoặc kết quả kiểm tra tự động.
- **Rủi ro cần xác minh:** Phụ thuộc vào cấu hình Vercel, backend hoặc yêu cầu phân quyền của đồ án.
- **Thiếu sót sản phẩm:** Hệ thống có thể chạy nhưng trải nghiệm hoặc quy trình nghiệp vụ chưa hoàn chỉnh.

## 2. Kết quả kiểm tra tự động

### 2.1. Build

Lệnh kiểm tra:

```bash
npm run build
```

Kết quả:

- Build thành công.
- Vite xử lý thành công 2.953 module.
- Không có lỗi biên dịch chặn việc tạo bản production.
- Có cảnh báo các JavaScript chunk lớn hơn 500 KB.

Kích thước đáng chú ý:

- Main JavaScript bundle khoảng 1,7 MB.
- ExcelJS bundle khoảng 940 KB.

### 2.2. Lint

Lệnh kiểm tra:

```bash
npm run lint
```

Kết quả:

- Lint thất bại.
- Có 8 lỗi.

Các lỗi cụ thể:

1. `src/components/stripe/StripeCheckoutModal.jsx`
   - Biến `_` được khai báo nhưng không sử dụng.
   - Prop `paymentIntentId` được khai báo nhưng không sử dụng.
2. `src/features/auth/pages/WelcomePage/WelcomePage.jsx`
   - Import `CheckCircle2` không được sử dụng.
   - Import `Facebook` không được sử dụng.
   - Import `Github` không được sử dụng.
3. `src/pages/UserVehicleRegistrationPage/UserVehicleRegistrationPage.jsx`
   - `FileReader` chưa được khai báo trong môi trường ESLint.
4. `src/pages/VehicleEntryPage/VehicleEntryPage.jsx`
   - Biến `exitTime` được gán nhưng không được sử dụng.
5. `src/utils/parkingDashboardReport.js`
   - Biến `end` được gán nhưng không được sử dụng.

### 2.3. Test

Lệnh kiểm tra:

```bash
npm test -- --run
```

Kết quả:

- 1 file test thành công.
- 4 test case thành công.
- Toàn bộ test hiện tại chỉ kiểm tra utility xử lý ngày giờ.

Các luồng quan trọng chưa có test:

- Đăng nhập.
- Refresh token.
- Đăng xuất.
- Route guard.
- Phân quyền Admin và Staff.
- Đăng ký xe.
- Nhân viên xét duyệt hồ sơ.
- Thanh toán Stripe.
- Axios interceptor.
- Xử lý lỗi API.

File `test_results_baseline.csv` đang chứa dữ liệu kiểm thử Petstore Swagger, không phải Parking System. File này không chứng minh các API của đồ án hoạt động chính xác.

## 3. Các phần đã được sửa hoặc đã hoạt động

### 3.1. Route tài xế đã được bọc xác thực trong workspace

Nhóm route tài xế hiện được bọc bằng:

```jsx
<Route element={<RequireAuth><DriverLayout /></RequireAuth>}>
```

Người chưa đăng nhập sẽ được chuyển về trang login.

Lưu ý: thay đổi này hiện vẫn là thay đổi local trong `src/routes/index.jsx`, chưa có trong commit `origin/main`.

### 3.2. Endpoint lấy xe đang gửi đã được khai báo

`API_ENDPOINTS.PARKING.ACTIVE_ORDERS` hiện có giá trị:

```js
'/api/v1/parking-orders/active'
```

`parkingOrderService.js` đã sử dụng endpoint này thay vì gọi một giá trị `undefined`.

### 3.3. Luồng thanh toán chính sử dụng apiClient

Trang `DriverPayment.jsx` xác nhận thanh toán Stripe bằng:

```js
await apiClient.post(
  API_ENDPOINTS.PAYMENTS.STRIPE_ORDER_CONFIRM(paymentIntentId)
);
```

Request này được hưởng cơ chế gắn Bearer token và refresh token từ `apiClient`.

## 4. Lỗi và thiếu sót mức nghiêm trọng

## 4.1. Thay đổi quan trọng chưa được commit và push

### Hiện trạng

Workspace đang có các thay đổi chưa commit:

- `src/routes/index.jsx` đã thêm `RequireAuth` cho route tài xế.
- `apiClient.ts` được chuyển thành `apiClient.js`.
- `endpoints.ts` được chuyển thành `endpoints.js`.
- `authService.ts` được chuyển thành `authService.js`.
- Một số file notification và booking đang có thay đổi.
- Một file tài liệu mới chưa được Git theo dõi.

### Ảnh hưởng

Nếu Vercel deploy trực tiếp từ GitHub thì các thay đổi local chưa commit sẽ không xuất hiện trên production. Một thành viên khác pull `main` cũng không nhận được các thay đổi này.

### Hướng xử lý

1. Kiểm tra lại toàn bộ diff.
2. Chạy build, lint và test.
3. Stage đúng các file cần thiết.
4. Commit với nội dung rõ ràng.
5. Push lên nhánh làm việc hoặc `main` theo quy trình của nhóm.
6. Kiểm tra deployment Vercel sau khi push.

## 4.2. AuthContext có thể giữ trạng thái đăng nhập cũ hoặc không hợp lệ

### Hiện trạng

Trong `AuthContext.jsx`, nếu tìm thấy user và token trong storage, frontend lập tức xem phiên đăng nhập là hợp lệ:

```js
if (existingUser && hasToken) {
  setAuthReady(true);
  return;
}
```

Frontend chưa xác minh token còn hạn trước khi cho phép giao diện sử dụng trạng thái đăng nhập.

Khi refresh token thất bại nhưng vẫn có `existingUser`, code không xóa user khỏi state và storage.

### Ảnh hưởng

- Giao diện có thể hiển thị người dùng đang đăng nhập dù token đã hết hạn.
- Route guard có thể cho mở trang vì `isAuthenticated` chỉ dựa vào `!!user`.
- Các API sau đó liên tục trả về `401 Unauthorized`.
- Người dùng có thể gặp vòng lặp chuyển trang hoặc trạng thái giao diện không nhất quán.
- Role lưu trong trình duyệt có thể bị chỉnh sửa để hiển thị giao diện không đúng quyền.

### Hướng xử lý

- Khi khởi động ứng dụng, xác minh phiên bằng refresh token hoặc endpoint lấy thông tin người dùng hiện tại.
- Nếu refresh thất bại, luôn xóa user và token.
- Không sử dụng role trong localStorage làm bằng chứng phân quyền.
- Backend phải xác minh access token và role cho mọi API cần bảo vệ.
- Có thể bổ sung endpoint:

```http
GET /api/v1/auth/me
```

## 4.3. Phân quyền Admin và Staff chưa được tách rõ ở tầng route

### Hiện trạng

`RequireBackOfficeRole` cho phép cả hai role:

```js
['admin', 'staff']
```

Toàn bộ route bên trong dùng chung guard này, bao gồm:

- Quản lý tài khoản.
- Cấu hình hệ thống.
- Audit log.
- Quản lý thông báo.
- Quản lý xe vào và xe ra.
- Quản lý phiên gửi xe.

`AdminLayout.jsx` cũng hiển thị cùng một danh sách menu cho Admin và Staff.

### Ảnh hưởng

Nếu yêu cầu nghiệp vụ quy định Staff không được truy cập chức năng quản trị cấp cao, giao diện hiện chưa chặn đúng.

Ngay cả khi backend trả về `403 Forbidden`, Staff vẫn nhìn thấy menu và có thể mở trang trước khi API bị từ chối.

### Hướng xử lý

- Xác nhận ma trận quyền của đồ án.
- Tạo guard riêng:

```jsx
<RequireAdminRole>
```

- Chỉ Admin được mở quản lý role, cấu hình hệ thống và audit log nếu tài liệu yêu cầu như vậy.
- Lọc menu theo role.
- Backend tiếp tục kiểm tra quyền độc lập với frontend.

## 5. Lỗi và thiếu sót mức cao

## 5.1. Trạng thái đăng ký xe chỉ tồn tại tạm thời trên frontend

### Hiện trạng

Sau khi gửi hồ sơ thành công, trang đăng ký xe chỉ chạy:

```js
setSubmitted(true);
```

Không có API lấy danh sách hồ sơ của tài xế hiện tại. Khi tải lại trang, state React bị mất.

### Ảnh hưởng

- Người dùng không biết hồ sơ đang chờ, đã duyệt hay bị từ chối.
- Thông báo gửi thành công biến mất sau khi reload.
- Người dùng có thể gửi trùng hồ sơ.
- Không hiển thị được lý do từ chối.
- Không có lịch sử đăng ký theo biển số.

### Hướng xử lý phù hợp với đồ án

Backend nên bổ sung:

```http
GET /api/v1/vehicle-registrations/my
```

Response đề xuất:

```json
[
  {
    "registrationId": 123,
    "licensePlate": "59A12345",
    "vehicleTypeName": "Ô tô",
    "status": "PENDING",
    "rejectReason": null,
    "createdAt": "2026-07-27T10:30:00",
    "reviewedAt": null
  }
]
```

Frontend cần:

- Gọi API khi mở trang.
- Tải lại danh sách sau khi gửi thành công.
- Hiển thị `PENDING`, `APPROVED`, `REJECTED`, `APPROVED_WAITING_PAYMENT` và `ACTIVE`.
- Hiển thị lý do từ chối.
- Khóa gửi mới khi cùng biển số đang có hồ sơ `PENDING`.

Backend phải chống gửi trùng và trả về:

```http
409 Conflict
```

## 5.2. ID loại xe đang được hard-code

### Hiện trạng

Trang đăng ký xe gửi:

```js
vehicleTypeId: vehicleType === 'CAR' ? 2 : 1
```

### Ảnh hưởng

Nếu database thay đổi ID hoặc thêm loại xe mới, frontend có thể gửi sai loại xe.

### Hướng xử lý

- Lấy danh sách loại xe từ:

```http
GET /api/v1/vehicle-types
```

- Lưu và gửi ID do backend trả về.
- Không suy luận ID database từ tên hiển thị.

## 5.3. Upload giấy tờ bằng Base64 trong JSON

### Hiện trạng

Ảnh được chuyển thành Base64 bằng:

```js
reader.readAsDataURL(file);
```

Mỗi ảnh cho phép tối đa 4 MB. Có bốn ảnh giấy tờ, nên payload Base64 có thể vượt 21 MB trước khi tính thêm phần JSON.

### Ảnh hưởng

- Request có thể vượt giới hạn Vercel, proxy hoặc backend.
- Upload chậm trên mạng di động.
- Trình duyệt và backend tốn nhiều RAM.
- Khó thực hiện upload lại từng ảnh.
- Dữ liệu CCCD nhạy cảm được đặt trực tiếp trong JSON.

### Hướng xử lý

Ưu tiên một trong hai phương án:

1. Gửi bằng `multipart/form-data`.
2. Upload ảnh lên object storage bằng signed URL, sau đó gửi URL hoặc object key về backend.

Backend phải kiểm tra:

- MIME type thực tế.
- Kích thước file.
- Phần mở rộng.
- Quyền truy cập.
- Tên file an toàn.
- Chính sách lưu trữ và xóa dữ liệu giấy tờ.

## 5.4. Giao diện không thống nhất về giấy tờ bắt buộc

### Hiện trạng

Tiêu đề hiển thị:

```text
Giấy tờ minh chứng tùy chọn
```

Nhưng label lại có dấu bắt buộc:

```text
Mặt trước CCCD *
Mặt sau CCCD *
Bằng lái xe *
Ảnh đăng ký / Cà vẹt xe *
```

### Ảnh hưởng

Người dùng không biết có bắt buộc tải ảnh hay không. Luồng chính và AiChatWidget cũng đang có yêu cầu file khác nhau.

### Hướng xử lý

- Xác nhận yêu cầu với backend và tài liệu nghiệp vụ.
- Nếu bắt buộc, frontend phải validate đầy đủ trước khi gọi API.
- Nếu tùy chọn, bỏ dấu `*`.
- Đồng bộ quy tắc giữa trang đăng ký và AiChatWidget.

## 5.5. Cấu hình Vercel không tự chứa địa chỉ backend

### Hiện trạng

`.env.production` đang để:

```env
VITE_API_BASE_URL=
```

`vercel.json` chỉ rewrite mọi route về `index.html`, không có rewrite `/api` sang backend.

### Ảnh hưởng

Nếu Vercel Dashboard chưa đặt `VITE_API_BASE_URL`, frontend sẽ gọi:

```text
https://fe-parking-system.vercel.app/api/...
```

Request có thể bị rewrite về `index.html` thay vì tới backend.

### Hướng xử lý

- Kiểm tra biến `VITE_API_BASE_URL` trong Vercel Dashboard.
- Đặt giá trị là origin backend production.
- Redeploy sau khi thay đổi biến build-time.
- Tách biến cho Development, Preview và Production.
- Không đưa secret backend vào biến có tiền tố `VITE_`.

Đây là rủi ro cấu hình cần xác minh trên Vercel. Nếu API production hiện hoạt động thì khả năng cao biến đã được đặt trong Dashboard.

## 5.6. Stripe publishable key trong file production đang trống

### Hiện trạng

`.env.production` chứa:

```env
VITE_STRIPE_PUBLISHABLE_KEY=
```

### Ảnh hưởng

Nếu Vercel Dashboard không có key thì form Stripe không thể khởi tạo.

### Hướng xử lý

- Đặt Stripe publishable key trong Vercel Dashboard.
- Dùng test key cho môi trường demo.
- Không đưa Stripe secret key vào frontend.
- Hiển thị thông báo cấu hình rõ ràng khi key bị thiếu.

## 6. Lỗi và thiếu sót mức trung bình

## 6.1. Có nhiều Axios client với cấu hình không đồng nhất

### Hiện trạng

`apiClient.js` sử dụng:

```js
VITE_API_BASE_URL
access_token
withCredentials: true
```

`parkingMapService.js` lại sử dụng:

```js
VITE_API_URL
authToken
http://localhost:8080
```

`parkingAreaSummaryService.js` tự tạo Axios client khác và không dùng refresh interceptor.

### Ảnh hưởng

Nếu các service này được dùng lại:

- Request có thể gọi về localhost trên production.
- Bearer token không được gắn.
- Không refresh token khi gặp 401.
- Xử lý response và error không đồng nhất.

### Hướng xử lý

- Chỉ sử dụng một `apiClient`.
- Xóa client riêng không còn dùng.
- Đưa toàn bộ endpoint về `endpoints.js`.

Hiện `parkingMapService.js` và `parkingAreaSummaryService.js` chưa được component nào import, nên đây là code chết và rủi ro bảo trì, chưa phải lỗi runtime của luồng đang hoạt động.

## 6.2. Component StripeCheckoutModal cũ không được sử dụng

### Hiện trạng

`StripeCheckoutModal.jsx` không được import ở component khác nhưng vẫn chứa:

```js
await fetch(
  API_ENDPOINTS.PAYMENTS.STRIPE_ORDER_CONFIRM(paymentIntent.id),
  { method: 'POST' }
);
```

Component này:

- Gọi `fetch` trực tiếp thay vì `apiClient`.
- Không tự gắn Bearer token.
- Không dùng `VITE_API_BASE_URL`.
- Bỏ qua lỗi confirm.
- Có prop `paymentIntentId` không sử dụng.
- Gây lỗi lint.

### Hướng xử lý

- Xóa component nếu luồng mới không dùng.
- Nếu cần dùng lại, chuyển request sang `apiClient` và xử lý lỗi đầy đủ.

Luồng thanh toán chính trong `DriverPayment.jsx` hiện đã dùng `apiClient`, nên lỗi này nằm trong code chết.

## 6.3. Service đăng ký xe và auth bị trùng lặp

### Hiện trạng

Auth tồn tại ở:

- `src/features/auth/services/authApi.js`
- `src/services/modules/authService.js`

Đăng ký xe tồn tại ở:

- `customerService.registerVehicleCard`
- `bookingService.registerVehicleCard`

### Ảnh hưởng

- Khó xác định hàm chuẩn.
- Dễ sửa một luồng nhưng bỏ sót luồng khác.
- Endpoint, payload và xử lý lỗi có thể lệch nhau.

### Hướng xử lý

- Giữ một auth service.
- Giữ một vehicle registration service.
- Di chuyển các hàm về đúng domain.
- Xóa export không còn sử dụng.

## 6.4. Code TypeScript vẫn còn trong dự án JavaScript

### Hiện trạng

Các file TypeScript còn lại:

- `vite.config.ts`
- `vitest.config.ts`
- `src/vite-env.d.ts`
- `src/tests/setup.ts`
- `src/stores/authStore.ts`
- `src/constants/storageKeys.ts`
- `src/constants/routes.ts`
- `src/features/driver/index.ts`
- `src/features/auth/index.ts`
- `src/features/auth/types.ts`

Build vẫn chạy:

```bash
tsc -b && vite build
```

### Ảnh hưởng

- Dự án chưa phải JavaScript thuần như yêu cầu.
- Nhóm vẫn phải cài và duy trì TypeScript.
- ESLint vẫn dùng TypeScript parser và rule.

### Hướng xử lý

- Chuyển các file có logic sang `.js`.
- Chuyển barrel file sang `.js`.
- Chuyển cấu hình Vite/Vitest sang `.js` nếu công cụ hỗ trợ.
- Cập nhật import.
- Bỏ bước `tsc -b` sau khi không còn phụ thuộc TypeScript.
- Xóa dependency TypeScript và cấu hình liên quan khi việc chuyển đổi hoàn tất.

## 6.5. Debug log còn trong production code

### Hiện trạng

Các log hiện có:

- `VehicleEntryPage.jsx` log loại xe, ID và biển số.
- `staffService.js` log toàn bộ payload kiểm tra xe vào.

### Ảnh hưởng

- Lộ thông tin nghiệp vụ trong DevTools.
- Console production bị nhiễu.
- Khó phân biệt log vận hành và log debug.

### Hướng xử lý

- Xóa log debug.
- Nếu cần logging, chỉ bật khi `import.meta.env.DEV` là `true`.
- Không log token, thông tin giấy tờ hoặc dữ liệu cá nhân.

## 6.6. Bundle production quá lớn

### Hiện trạng

Build tạo:

- Main bundle khoảng 1,7 MB.
- ExcelJS bundle khoảng 940 KB.

### Ảnh hưởng

- Tải trang lần đầu chậm.
- Tốn dữ liệu trên điện thoại.
- Parse JavaScript lâu trên thiết bị yếu.

### Hướng xử lý

- Lazy-load các page bằng `React.lazy`.
- Chỉ import ExcelJS khi người dùng bấm xuất báo cáo.
- Lazy-load Stripe.
- Chia bundle Admin, Staff và Driver.
- Kiểm tra bundle bằng visualizer.

## 6.7. Firebase configuration đang hard-code

### Hiện trạng

`src/config/firebase.js` chứa trực tiếp Firebase project configuration, trong khi `.env.production` có các biến Firebase placeholder nhưng code không sử dụng.

### Ảnh hưởng

- Khó tách Firebase project giữa development và production.
- Deploy môi trường mới vẫn dùng project cũ.
- Cấu hình trong `.env.production` gây hiểu nhầm vì không được đọc.

### Hướng xử lý

- Đọc toàn bộ Firebase client config từ biến `VITE_FIREBASE_*`.
- Tách cấu hình Development, Preview và Production.
- Không đặt Firebase Admin credential hoặc private key trong frontend.

## 6.8. Docker Compose chứa mật khẩu cố định

### Hiện trạng

`docker-compose.yml` chứa:

```text
MYSQL_ROOT_PASSWORD=root123
MYSQL_PASSWORD=parking123
PMA_PASSWORD=root123
```

Port backend được khai báo:

```text
8080:10000
```

Trong khi Nginx và healthcheck sử dụng container port `8080`.

### Ảnh hưởng

- Mật khẩu yếu và nằm trong repository.
- Cấu hình port có thể gây nhầm lẫn hoặc lỗi khi truy cập từ host.
- Không phù hợp nếu file được dùng ngoài môi trường local.

### Hướng xử lý

- Chuyển mật khẩu sang `.env` không commit hoặc Docker secrets.
- Dùng mật khẩu mạnh cho môi trường triển khai.
- Xác nhận Spring Boot thực sự lắng nghe port nào.
- Đồng bộ `ports`, Nginx `proxy_pass` và healthcheck.

## 7. Thiếu sót về kiểm thử và đảm bảo chất lượng

## 7.1. Chưa có test cho nghiệp vụ quan trọng

Bộ test cần bổ sung tối thiểu:

1. Đăng nhập thành công và thất bại.
2. Restore session khi access token hết hạn.
3. Refresh token thành công và thất bại.
4. Người chưa đăng nhập không mở được route tài xế.
5. Driver không mở được route Admin.
6. Staff chỉ mở được route được cấp quyền.
7. Gửi hồ sơ đăng ký xe.
8. Chặn hồ sơ trùng biển số.
9. Hiển thị trạng thái hồ sơ.
10. Admin hoặc Staff duyệt và từ chối hồ sơ.
11. Stripe confirm thành công và thất bại.
12. Axios interceptor chỉ refresh token một lần khi nhiều request cùng gặp 401.

## 7.2. Chưa có kiểm thử tích hợp với backend thật

Cần có bộ test API dành riêng cho Parking System:

- Auth.
- Vehicle registrations.
- Parking entry.
- Parking exit.
- Parking sessions.
- Fee subscriptions.
- Stripe payments.
- Notifications.
- Account management.

Không sử dụng kết quả Petstore làm bằng chứng nghiệm thu cho hệ thống.

## 8. Thứ tự ưu tiên đề xuất

### Ưu tiên 1: Trước khi deploy hoặc demo

1. Kiểm tra và commit các thay đổi local.
2. Push code để Vercel nhận route guard và các file JavaScript mới.
3. Xác minh `VITE_API_BASE_URL` trên Vercel.
4. Xác minh `VITE_STRIPE_PUBLISHABLE_KEY` trên Vercel.
5. Sửa 8 lỗi lint.
6. Kiểm tra đăng nhập, refresh token và logout trên production.

### Ưu tiên 2: Hoàn thiện nghiệp vụ

1. Bổ sung API lấy hồ sơ đăng ký của người dùng hiện tại.
2. Hiển thị trạng thái và lịch sử hồ sơ.
3. Chặn gửi hồ sơ trùng ở backend.
4. Lấy vehicle type từ backend.
5. Thống nhất giấy tờ bắt buộc hay tùy chọn.
6. Tách quyền Admin và Staff theo tài liệu nghiệp vụ.

### Ưu tiên 3: Nâng chất lượng kỹ thuật

1. Chuyển upload Base64 sang multipart hoặc object storage.
2. Gộp các API client.
3. Xóa service và component không dùng.
4. Hoàn tất chuyển TypeScript sang JavaScript.
5. Xóa debug log.
6. Viết test cho các luồng chính.
7. Tối ưu bundle.
8. Chuẩn hóa cấu hình Firebase và Docker.

## 9. Tiêu chí hoàn thành đề xuất

Hệ thống có thể xem là sẵn sàng cho demo ổn định khi đạt các điều kiện sau:

- Build thành công.
- Lint không còn lỗi.
- Test auth, route guard, đăng ký xe và thanh toán đều qua.
- Người chưa đăng nhập không mở được route cần bảo vệ.
- Driver, Staff và Admin chỉ thấy chức năng đúng quyền.
- Reload trang không làm mất trạng thái hồ sơ đăng ký.
- Backend chặn hồ sơ đăng ký trùng.
- API production gọi đúng backend.
- Stripe hoạt động bằng key đúng môi trường.
- Không còn request production gọi về localhost.
- Không còn debug log chứa dữ liệu nghiệp vụ.
- Các thay đổi quan trọng đã được commit, push và xuất hiện trên Vercel.

## 10. Giới hạn của báo cáo

Báo cáo này tập trung vào frontend trong repository hiện tại. Chưa có source backend trong workspace nên chưa thể xác minh trực tiếp:

- Validation phía backend.
- Phân quyền trong Spring Security.
- Cấu trúc database và constraint chống dữ liệu trùng.
- Transaction thanh toán.
- Stripe webhook.
- Cách mã hóa và lưu trữ ảnh CCCD.
- Chính sách bảo vệ dữ liệu cá nhân.

Các mục liên quan backend cần được đối chiếu với repository backend và API documentation trước khi kết luận nghiệm thu toàn hệ thống.
