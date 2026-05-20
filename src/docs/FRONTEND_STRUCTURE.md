# Parking Building Management Frontend Structure

Tài liệu này được thiết kế dựa trên file `_ Parking Building Management System.docx`.
Mục tiêu là chia frontend theo đúng nghiệp vụ bãi xe, dễ code, dễ test và dễ giao việc theo role.

## 1. Nguyên tắc tổ chức

- `src/app`: khởi tạo ứng dụng, providers và route shell.
- `src/router`: cấu hình route theo role nếu tách khỏi `src/app/routes.tsx`.
- `src/layouts`: layout dùng cho từng nhóm màn hình như Admin, Manager, Staff, Driver.
- `src/features`: nơi chứa code nghiệp vụ chính. Mỗi feature có `components`, `services`, `hooks`, `types` khi cần.
- `src/components`: component dùng chung toàn hệ thống.
- `src/services`: API client và endpoint dùng chung.
- `src/constants`: route, storage key, enum dùng chung.
- `src/types`: type dùng chung giữa nhiều module.
- `src/utils`: hàm thuần, format dữ liệu, validate.
- `src/stores`: global state như auth/user/session.
- `src/tests`: test setup và mock.

## 2. Module dùng chung

### `features/auth`

Chức năng:
- Đăng nhập tài khoản Admin, Staff, Manager.
- Đăng nhập tài khoản User/Driver.
- Đăng ký tài khoản user.
- Đăng ký đối tác/admin account nếu backend hỗ trợ.
- Quên mật khẩu, nhập OTP, đặt lại mật khẩu.
- Lưu token, thông tin user, role và điều hướng theo quyền.

Nên chứa:
- `pages`: Login, Register, ForgotPassword, VerifyOtp, ResetPassword.
- `services`: gọi API đăng nhập, đăng ký, refresh token, logout.
- `hooks`: hook xử lý form auth, kiểm tra quyền.
- `types.ts`: type user, role, login response.

### `features/parking`

Chức năng:
- Quản lý trạng thái bãi xe dùng chung cho nhiều role.
- Theo dõi slot trống, đang sử dụng, đã đặt trước, bảo trì, tạm khóa.
- Hiển thị availability realtime theo tầng, khu vực, loại xe.

Nên chứa:
- `slots`: màn hình/list/map slot.
- `availability`: trạng thái sức chứa, số slot còn trống.

### `features/notifications`

Chức năng:
- Hiển thị thông báo của admin trên welcome page.
- Thông báo cho user về đặt chỗ, thanh toán, session.
- Thông báo nội bộ cho staff/manager nếu có sự cố.

### `features/feedback`

Chức năng:
- User gửi phản hồi: mất vé, sai phí, khó tìm xe, slot bị chiếm.
- Staff/Manager xem và xử lý phản hồi.
- Cập nhật trạng thái New, InReview, Resolved.

### `features/ai-optimization`

Chức năng khuyến khích:
- Dự đoán khu vực sắp đầy.
- Đề xuất slot phù hợp theo loại xe.
- Dự đoán giờ cao điểm.
- Gợi ý mở thêm cổng, chuyển hướng xe, tăng nhân sự.

## 3. System Administrator

Thư mục: `features/admin`

Role này quản trị kỹ thuật, tài khoản, phân quyền và bảo mật hệ thống.

### `features/admin/user-management`

Chức năng:
- Tạo tài khoản.
- Cập nhật thông tin tài khoản.
- Reset mật khẩu.
- Khóa/mở khóa tài khoản.
- Xem trạng thái Active, Inactive, Suspended.

### `features/admin/role-permissions`

Chức năng:
- Quản lý role: Admin, Parking Manager, Parking Staff, Driver.
- Gán quyền theo RBAC.
- Kiểm soát màn hình/chức năng nào role được truy cập.

### `features/admin/system-configuration`

Chức năng:
- Cấu hình camera nhận diện biển số.
- Cấu hình RFID, QR.
- Cấu hình payment gateway.
- Cấu hình backup dữ liệu.
- Cấu hình tham số hệ thống.

### `features/admin/audit-log`

Chức năng:
- Xem lịch sử đăng nhập.
- Xem thao tác nhạy cảm như đổi quyền, khóa tài khoản, sửa giá.
- Theo dõi bảo mật và audit trail.

## 4. Parking Manager

Thư mục: `features/manager`

Role này quản lý vận hành bãi xe, cấu hình nghiệp vụ, xem báo cáo và giám sát hiệu suất.

### `features/manager/dashboard`

Chức năng:
- Màn hình tổng quan.
- Số xe đang gửi.
- Slot trống/đã dùng/đặt trước/bảo trì.
- Doanh thu nhanh.
- Cảnh báo ngoại lệ.

### `features/manager/building-management`

Chức năng:
- Quản lý tòa nhà gửi xe.
- Quản lý tên tòa nhà, địa chỉ, số tầng, sức chứa.
- Quản lý giờ hoạt động.
- Quản lý khu gửi xe/facility.

Entity liên quan:
- Building.
- ParkingFacility.

### `features/manager/vehicle-types`

Chức năng:
- Quản lý loại phương tiện: xe máy, ô tô, xe điện, xe tải nhỏ.
- Cấu hình kích thước xe.
- Cấu hình khu vực được phép gửi.
- Cấu hình icon/mô tả loại xe.

Entity liên quan:
- VehicleType.

### `features/manager/floor-zone-management`

Chức năng:
- Cấu hình tầng theo loại xe.
- Cấu hình zone: VIP, EV, Disabled, khu ưu tiên.
- Giới hạn số lượng xe theo tầng/khu.
- Đóng/mở tầng hoặc chuyển sang bảo trì.

Entity liên quan:
- ParkingFloor.
- ParkingZone.

### `features/manager/pricing-policy`

Chức năng:
- Thiết lập bảng giá theo loại xe.
- Thiết lập giá theo giờ, ngày, tháng, block giờ.
- Thiết lập phí quá giờ, phí mất vé, giá qua đêm.
- Thiết lập giá cuối tuần/ngày lễ nếu có.

Entity liên quan:
- ParkingRate.

### `features/manager/reports`

Chức năng:
- Báo cáo lượt xe vào/ra.
- Báo cáo doanh thu.
- Tỷ lệ lấp đầy.
- Khung giờ cao điểm.
- Loại xe phổ biến.
- Slot sử dụng nhiều nhất.

## 5. Parking Staff

Thư mục: `features/staff`

Role này xử lý xe vào/ra và các tình huống phát sinh tại bãi.

### `features/staff/vehicle-entry`

Chức năng:
- Kiểm tra điều kiện xe vào bãi.
- Nhập/quét biển số xe.
- Xác định loại phương tiện.
- Kiểm tra slot trống.
- Gợi ý tầng/khu vực phù hợp.
- Tạo lượt gửi xe.

### `features/staff/parking-sessions`

Chức năng:
- Quản lý vòng đời Parking Session.
- Xem Session ID, biển số, loại xe, giờ vào, cổng vào, slot.
- Theo dõi session Active, Completed, Overdue, Cancelled, LostTicket.

Entity liên quan:
- ParkingSession.

### `features/staff/vehicle-exit`

Chức năng:
- Tìm session theo biển số, mã vé, QR/RFID.
- Xác nhận xe ra.
- Tính phí cần thanh toán.
- Thu phí.
- Kết thúc session.
- Giải phóng slot về Available.

### `features/staff/exception-handling`

Chức năng:
- Xử lý mất vé.
- Xử lý sai biển số.
- Xử lý xe quá hạn.
- Xử lý xe gửi sai khu vực.
- Xử lý xe chưa thanh toán.
- Ghi chú, chụp ảnh, yêu cầu manager phê duyệt nếu cần.

## 6. Parking User / Driver

Thư mục: `features/driver`

Role này là người dùng gửi xe, xem thông tin bãi, đặt chỗ, thanh toán và gửi hỗ trợ.

### `features/driver/welcome`

Chức năng:
- Trang đầu tiên khi truy cập URL.
- Hiển thị logo, nút đăng ký, đăng nhập.
- Hiển thị tab nội dung: trang chủ, thông tin bãi, thông báo admin.
- Hiển thị dịch vụ dành cho user.
- Hiển thị thông tin bãi, thông báo admin, liên hệ hỗ trợ.

### `features/driver/parking-info`

Chức năng:
- Xem giờ hoạt động.
- Xem loại xe được phục vụ.
- Xem bảng giá.
- Xem quy định gửi xe.
- Xem số slot trống realtime.

### `features/driver/reservations`

Chức năng:
- Đặt chỗ trước.
- Chọn loại xe, thời gian gửi, khu vực.
- Giữ slot trước khi đến.
- Theo dõi trạng thái Pending, Confirmed, Active, Expired, Cancelled.

Entity liên quan:
- Reservation.

### `features/driver/active-session`

Chức năng:
- Xem lượt gửi xe hiện tại.
- Xem giờ vào, loại xe, tầng/khu vực, slot.
- Xem phí tạm tính.
- Xem thời gian đã gửi.

### `features/driver/payments`

Chức năng:
- Thanh toán phí gửi xe.
- Hỗ trợ tiền mặt, QR Banking, ví điện tử, thẻ ngân hàng nếu backend có.
- Xem trạng thái Success, Failed, Pending.
- Xem mã giao dịch và hóa đơn.

Entity liên quan:
- PaymentTransaction.

### `features/driver/history`

Chức năng:
- Xem lịch sử gửi xe.
- Xem lịch sử đặt chỗ.
- Xem lịch sử thanh toán.

### `features/driver/profile`

Chức năng:
- Xem/cập nhật thông tin cá nhân.
- Quản lý số điện thoại, email, avatar.
- Quản lý biển số thường dùng.
- Quản lý loại xe ưu tiên.

Entity liên quan:
- DriverProfile.

### `features/driver/support`

Chức năng:
- Gửi yêu cầu hỗ trợ.
- Phản ánh mất vé, sai phí, khó tìm xe, slot bị chiếm.
- Theo dõi trạng thái xử lý phản hồi.

## 7. Entity chính frontend cần type

Nên tạo type dùng chung trong `src/types` hoặc type riêng trong từng feature:

- `Building`
- `ParkingFacility`
- `VehicleType`
- `ParkingFloor`
- `ParkingZone`
- `ParkingSlot`
- `ParkingSession`
- `UserAccount`
- `Role`
- `Employee`
- `DriverProfile`
- `ParkingRate`
- `Reservation`
- `PaymentTransaction`
- `Feedback`

## 8. Gợi ý giao việc theo team

- Duy: `features/auth`, `features/driver/welcome`, login/register/forgot password.
- Admin screens: `features/admin/*`.
- Manager screens: `features/manager/*`.
- Staff screens: `features/staff/*`.
- User screens sau login: `features/driver/*`.
- Shared parking state: `features/parking/*`.

## 9. Quy ước file trong mỗi feature

Khi feature lớn hơn, dùng mẫu:

```txt
feature-name/
├─ pages/
├─ components/
├─ services/
├─ hooks/
├─ types.ts
├─ constants.ts
└─ index.ts
```

Không cần tạo đủ tất cả ngay từ đầu. Chỉ tạo khi feature thật sự dùng đến để tránh rối.
