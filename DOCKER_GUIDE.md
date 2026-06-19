# 🐳 Parking System - Docker Setup Guide

## 📋 Yêu Cầu Hệ Thống

- **Docker**: v20.10+
- **Docker Compose**: v2.0+
- **Disk Space**: ≥ 2GB

### Cài Đặt

**Windows & macOS:**
- Tải [Docker Desktop](https://www.docker.com/products/docker-desktop)

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install docker.io docker-compose

# Fedora/RHEL
sudo dnf install docker docker-compose
```

---

## 🚀 Cách Chạy

### **Windows (Dễ Nhất)**
```bash
# Chạy file batch
start.bat

# Hoặc dùng PowerShell
docker-compose up -d --build
```

### **macOS & Linux**
```bash
# Cấp quyền thực thi
chmod +x start.sh

# Chạy script
./start.sh

# Hoặc dùng docker-compose trực tiếp
docker-compose up -d --build
```

---

## 📍 Truy Cập Dịch Vụ

| Dịch Vụ | URL | Ghi Chú |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | React App |
| **Backend API** | http://localhost:8080 | Spring Boot |
| **phpMyAdmin** | http://localhost:8081 | Quản lý DB |

---

## 💾 Thông Tin Database

```
Host:     localhost
Port:     3306
User:     root
Password: root123
Database: parking_db
```

### Kết nối qua MySQL CLI:
```bash
mysql -h localhost -u root -proot123 -D parking_db
```

---

## 📝 Các Lệnh Thường Dùng

### Khởi động
```bash
# Với build mới
docker-compose up -d --build

# Mà không build lại
docker-compose up -d

# Chế độ interactive (xem logs)
docker-compose up
```

### Dừng & Xóa
```bash
# Dừng containers
docker-compose down

# Dừng và xóa volumes (DB data)
docker-compose down -v

# Dừng service cụ thể
docker-compose stop frontend
```

### Xem Logs
```bash
# Tất cả services
docker-compose logs

# Service cụ thể
docker-compose logs -f frontend
docker-compose logs -f backend

# 100 dòng cuối
docker-compose logs --tail 100 -f
```

### Vào Container
```bash
# Frontend
docker exec -it parking-system-fe sh

# Backend
docker exec -it parking-system-backend bash

# MySQL
docker exec -it parking-system-db mysql -uroot -proot123
```

### Rebuild
```bash
# Build lại image
docker-compose build --no-cache

# Build service cụ thể
docker-compose build --no-cache frontend
```

---

## 🔧 Cấu Hình & Biến Môi Trường

### Frontend (`.env.production`)
```env
VITE_API_BASE_URL=http://backend:8080
VITE_FIREBASE_API_KEY=your_key
...
```

### Docker Compose (`docker-compose.yml`)
Chỉnh sửa các biến:
```yaml
environment:
  - VITE_API_BASE_URL=http://backend:8080
  - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/parking_db
  - SPRING_DATASOURCE_PASSWORD=root123
```

---

## ⚙️ Cấu Trúc Dự Án Docker

```
📁 FE/
├── Dockerfile                 # Build config
├── docker-compose.yml        # Orchestration
├── nginx.conf               # Nginx config
├── .dockerignore            # Ignore files
├── start.sh / start.bat     # Scripts
├── stop.sh / stop.bat
├── .env.example             # Template
├── .env.production          # Production vars
└── src/
    ├── app/
    ├── features/
    ├── components/
    └── ...
```

---

## 🐛 Troubleshooting

### Port 3000 đã được sử dụng
```bash
# Kiểm tra process chiếm port
lsof -i :3000

# Hoặc thay đổi port trong docker-compose.yml
ports:
  - "8000:80"  # Dùng 8000 thay vì 3000
```

### Database connection failed
```bash
# Kiểm tra MySQL container
docker ps

# Xem logs MySQL
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Frontend không load
```bash
# Xóa cache browser (Ctrl+Shift+Delete)
# Xem logs
docker-compose logs -f frontend

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Volume permission denied
```bash
# Linux: cấp quyền cho folder
sudo chown -R $USER:$USER mysql_data
```

---

## 📊 Kiểm Tra Sức Khỏe

```bash
# Kiểm tra trạng thái services
docker-compose ps

# Output mong muốn:
# NAME                    STATUS
# parking-system-fe       Up (healthy)
# parking-system-backend  Up (healthy)
# parking-system-db       Up (healthy)
```

---

## 🧹 Dọn Dẹp

```bash
# Xóa toàn bộ (containers, volumes, images)
docker-compose down -v

# Xóa unused images/volumes
docker system prune -a --volumes

# Xóa cái cụ thể
docker rmi parking-system-fe:latest
docker volume rm mysql_data
```

---

## 📚 Tài Liệu Tham Khảo

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Nginx Config](https://nginx.org/en/docs/)
- [Vite Config](https://vitejs.dev/config/)

---

## ❓ Câu Hỏi Thường Gặp

**Q: Làm sao để update code khi chạy Docker?**
A: Dừng container, pull code mới, rebuild: `docker-compose up -d --build`

**Q: Có thể scale services không?**
A: Có thể chỉnh trong docker-compose.yml hoặc dùng: `docker-compose up -d --scale backend=3`

**Q: Dữ liệu DB sẽ mất không nếu dừng container?**
A: Không, data lưu trong volume `mysql_data`. Chỉ mất nếu chạy: `docker-compose down -v`

**Q: Làm sao để sử dụng database ngoài?**
A: Chỉnh `SPRING_DATASOURCE_URL` trong `docker-compose.yml`

---

## 🎯 Next Steps

1. ✅ Đã setup Docker
2. ⬜ Build & run: `docker-compose up -d --build`
3. ⬜ Truy cập: http://localhost:3000
4. ⬜ Check logs: `docker-compose logs -f`
5. ⬜ Deploy to production

---

**Cần giúp?** Liên hệ team hoặc check logs: `docker-compose logs`
