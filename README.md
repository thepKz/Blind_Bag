# Trò Chơi Túi Mù

Trò Chơi Túi Mù là một ứng dụng web đơn giản được xây dựng bằng React, nơi người chơi có thể chọn số lượng túi mù và màu nguyện vọng. Mục tiêu là thu thập các túi mù thông qua các lượt chơi, với cơ hội nhận thêm túi khi có cặp màu hoặc trùng màu nguyện vọng.

## Cách Chơi

1. **Chọn Số Túi Mù và Màu Nguyện Vọng:**
   - Người chơi chọn số lượng túi mù muốn mua và màu nguyện vọng từ danh sách có sẵn.

2. **Bắt Đầu Trò Chơi:**
   - Nhấn nút "Bắt đầu chơi" để bắt đầu bốc túi mù.

3. **Luật Chơi:**
   - Mỗi lượt, số túi mù đã chọn sẽ được bốc ngẫu nhiên.
   - Nếu có 2 túi cùng màu, người chơi sẽ được tặng 1 túi mù.
   - Nếu túi trùng với màu nguyện vọng, người chơi cũng sẽ được tặng 1 túi mù.
   - Những túi được tặng sẽ tiếp tục được bốc lại trong lượt tiếp theo.
   - Trò chơi kết thúc khi không còn túi mù trùng màu hoặc nguyện vọng, hoặc đạt tối đa 20 lượt.

4. **Xem Kết Quả:**
   - Sau khi trò chơi kết thúc, người chơi có thể xem chi tiết các lượt và tổng kết số túi nhận được.

## Cài Đặt

1. **Clone Repository:**
   ```bash
   git clone https://github.com/thepKz/Blind_Bag.git
   cd blind-bag
   ```

2. **Cài Đặt Dependencies:**
   ```bash
   npm install
   ```

3. **Chạy Ứng Dụng:**
   ```bash
   npm start
   ```

4. **Mở Trình Duyệt:**
   - Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Công Nghệ Sử Dụng

- **React**: Thư viện JavaScript để xây dựng giao diện người dùng.
- **Tailwind CSS**: Framework CSS để tạo kiểu cho ứng dụng.

## Ghi Chú

- Ứng dụng này được xây dựng với mục đích học tập và giải trí.
- Đảm bảo rằng bạn đã cài đặt Node.js và npm trước khi bắt đầu.

## Đóng Góp

Nếu bạn muốn đóng góp cho dự án, vui lòng tạo một pull request hoặc mở một issue để thảo luận.

---

Hy vọng bạn thích trò chơi này!
