# Hướng Dẫn Sử Dụng Parking Map Component

## 📁 Files Created

### Components
- `src/components/parking/ParkingMapDashboard.jsx` - Main component hiển thị sơ đồ bãi đỗ
- `src/pages/ParkingMapPage.jsx` - Page wrapper với facility selector

### Services
- `src/services/parkingMapService.js` - API service để call backend

---

## 🚀 Quick Start

### 1. Add Route to Router

Mở file routing của bạn (ví dụ: `src/routes/index.js` hoặc `src/App.jsx`) và thêm:

```javascript
import ParkingMapPage from '../pages/ParkingMapPage';

// Thêm route này vào router config
{
  path: '/parking-map',
  name: 'Parking Map',
  component: ParkingMapPage,
  meta: { requiresAuth: true } // Tuỳ chỉnh theo auth của bạn
}
```

### 2. Add Navigation Link

Thêm link vào navigation menu:

```jsx
<Link to="/parking-map" className="nav-link">
  Sơ đồ bãi đỗ xe
</Link>
```

### 3. Direct Component Usage

Hoặc sử dụng component trực tiếp:

```jsx
import ParkingMapDashboard from '@/components/parking/ParkingMapDashboard';

function MyPage() {
  return <ParkingMapDashboard parkingId={1} />;
}
```

---

## 📡 API Endpoints Required

Component này cần các endpoints này từ backend:

### 1. Get Parking Map by Facility
```
GET /api/v1/parking-map/facility/{parkingId}
```

**Response:**
```json
[
  {
    "id": 1,
    "floorName": "Tầng B3",
    "floorNumber": 3,
    "parkingId": 1,
    "slots": [
      {
        "id": 1,
        "slotNumber": "M-C301",
        "floor": 3,
        "status": "AVAILABLE",
        "createdAt": "2026-06-12T10:00:00",
        "updatedAt": "2026-06-12T10:00:00"
      }
    ]
  }
]
```

### 2. Get Parking Facilities (Optional)
```
GET /api/v1/parking-facilities
```

---

## 🎨 Features

✅ **Hiển thị lưới slots theo tầng**
- Grid 8 cột responsive
- Zoom effect on hover

✅ **Color-coded Status**
- 🟢 **Trống (AVAILABLE)** - Green
- 🔴 **Đã đỗ (OCCUPIED)** - Red
- 🟡 **Đặt trước (RESERVED)** - Yellow
- ⚙️ **Bảo trì (MAINTENANCE)** - Gray

✅ **Stats Dashboard**
- Hiển thị tổng số ô trống/đã đỗ/đặt trước
- Update realtime khi thay đổi tầng

✅ **Responsive Design**
- Mobile-friendly grid layout
- Dropdown chọn tầng

---

## 🔧 Customization

### Change Grid Columns

Mở `ParkingMapDashboard.jsx` và tìm:

```jsx
<div className="grid grid-cols-8 gap-4 auto-rows-auto">
```

Thay `grid-cols-8` bằng:
- `grid-cols-4` - 4 cột
- `grid-cols-6` - 6 cột
- `grid-cols-10` - 10 cột

### Change Colors

Tìm hàm `getStatusColor()` và update các class Tailwind:

```jsx
case 'AVAILABLE':
  return 'bg-green-100 border-green-300 text-green-800'; // Thay đổi ở đây
```

### Refresh Data

Component có button "Thử lại" khi error. Để add auto-refresh:

```jsx
useEffect(() => {
  const interval = setInterval(fetchParkingMap, 30000); // Refresh mỗi 30s
  return () => clearInterval(interval);
}, [parkingId]);
```

---

## 🔗 Service Usage

```javascript
import { parkingMapService } from '@/services/parkingMapService';

// Get parking map
const floors = await parkingMapService.getParkingMap(facilityId);

// Get all facilities
const facilities = await parkingMapService.getParkingFacilities();

// Get facility details
const facility = await parkingMapService.getParkingFacilityById(facilityId);

// Get available slots
const slots = await parkingMapService.getAvailableSlots(facilityId, floorId);
```

---

## ⚙️ Environment Variables

Ensure `.env` hoặc `.env.local` có:

```env
VITE_API_URL=http://localhost:8080
```

Hoặc để tự động detect:

```env
# Không cần set, sẽ dùng http://localhost:8080 as default
```

---

## 🐛 Troubleshooting

### Component not rendering
- ✅ Check browser console for errors
- ✅ Verify API endpoint is correct
- ✅ Check CORS settings in backend

### Data not showing
- ✅ Verify backend API is running
- ✅ Check parking data exists in database
- ✅ Ensure parking slots have floor numbers

### Styling issues
- ✅ Verify Tailwind CSS is configured
- ✅ Check if CSS classes are being compiled

---

## 📝 Backend Integration Checklist

- [ ] Endpoint `GET /api/v1/parking-map/facility/{parkingId}` implemented
- [ ] Endpoint `GET /api/v1/parking-facilities` implemented (optional)
- [ ] Database has parking_facilities, parking_floors, parking_slots
- [ ] Slots have proper status values (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE)
- [ ] JWT auth configured (if needed)
- [ ] CORS allows frontend domain

---

## 📚 Related Files

- API Service: `src/services/parkingMapService.js`
- Component: `src/components/parking/ParkingMapDashboard.jsx`
- Page: `src/pages/ParkingMapPage.jsx`
- Backend Controller: `ParkingStructureController.java`
- Backend Service: `ParkingStructureService.java`

---

Happy Parking! 🚗✨
