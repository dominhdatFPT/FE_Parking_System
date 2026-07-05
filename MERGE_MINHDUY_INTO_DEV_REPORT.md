# Báo cáo merge `minhduy` vào `dev`

Ngày thực hiện: 05/07/2026

## Trạng thái nhánh trước khi merge

- Nhánh nguồn: `minhduy` tại commit `dd2b116197e6b4918c4c6d925f6a181087e44503`.
- Nhánh đích: `dev`, được đồng bộ theo `origin/dev` tại commit `76d763c` trước khi merge.
- Do `origin/dev` đã bị force-update và khác lịch sử local, bản `dev` local cũ được giữ tại nhánh `dev-backup-before-minhduy-merge-20260705`.

## Các conflict đã xử lý

### `src/features/auth/pages/LoginPage/LoginPage.jsx`

- Giữ cơ chế đăng nhập, lưu phiên, điều hướng theo role và xử lý lỗi mới nhất của `dev`.
- Giữ import `Link` từ `react-router`, là bản sửa lỗi mới nhất trên `dev`.
- Không khôi phục liên kết quên mật khẩu trỏ tới route đã bị xóa trên `dev`.
- Nhập từ `minhduy`: biểu tượng mũi tên trên nút đăng nhập, nội dung nhận diện biển số không còn chữ “AI”, và cờ mở modal nội quy sau khi đăng nhập.
- Xóa hai import i18n không còn được sử dụng.

### `src/features/driver/pages/DriverFeePlans/DriverFeePlans.jsx`

- Giữ ảnh xe máy/ô tô, khoảng cách input và giao diện mới nhất của `dev`.
- Nhập từ `minhduy`: bản dịch tên gói, đơn vị tiền, giá theo tháng, quyền lợi và trạng thái chọn gói.
- Kết hợp dấu chấm trạng thái của `dev` với nội dung đã quốc tế hóa từ `minhduy`.

### `src/features/driver/pages/DriverProfile/DriverProfile.jsx`

- Giữ bản `dev` đang lấy danh sách phương tiện thật từ API và hiển thị trạng thái xác thực.
- Không đưa lại luồng đổi mật khẩu mô phỏng từ phiên bản cũ vì API đổi mật khẩu trong luồng đó chưa được kết nối.

### `src/layouts/AdminLayout.jsx`

- Giữ danh sách route đang tồn tại trên `dev`, bố cục canvas mới và cơ chế `logout()` từ AuthContext.
- Không dùng các mục `ROUTES.STAFF.BOOKINGS` và `ROUTES.ADMIN.PERMISSIONS` từ bản cũ vì các hằng route này chưa tồn tại.
- Các thành phần nội quy, phân quyền và giao diện khác không conflict từ `minhduy` vẫn được Git đưa vào merge.

## Các nhóm thay đổi được merge tự động

- Modal nội quy hệ thống và context/provider liên quan.
- Các màn hình và component cho tài xế: đặt chỗ, lịch sử, bản đồ, thanh toán và thông báo.
- Các trang/phần tử quản lý phân quyền.
- Các trang nghiệp vụ staff và các service đặt chỗ/bản đồ.
- Cập nhật bản dịch tiếng Việt, tiếng Anh và style toàn cục.

## Kiểm tra sau khi xử lý

- Không còn marker conflict (`<<<<<<<`, `=======`, `>>>>>>>`).
- Bốn file từng conflict không còn marker; diff tổng của nhánh nguồn vẫn có cảnh báo khoảng trắng/CRLF trong một số file được merge tự động.
- `npm run build` (`tsc -b && vite build`): đạt.
- Vite chỉ cảnh báo một số bundle lớn hơn 500 kB; đây không phải lỗi build.
