# filesManager
FilesManager_blackBirds
## I Hướng dẫn cài đặt
1. Cài đặt môi trường nodejs để chạy server - setup nodejs environment (link: https://nodejs.org/en/ )
2. clone repo  (link: https://github.com/tung1998/filesManager/)
3. Cài đặt mysql server và filesmanager database (thư mục cấu hình database: filemanager.sql)
4. cài đặt các thư viện sử dụng tại server - setup module: chạy lệnh( npm i )
5. Chạy server - run server: chạy lệnh ( node www ) trong thư mục bin
## II Các chức năng chính
  ### 1. Đăng kí, Đăng nhập, và các chức năng liên quan
    1. Đăng kí (/register) .
        - Điền các thông tin theo yêu cầu.
        - Bấm nút (Register).
        - một email xác nhận mật khẩu sẽ được gửi đến mail mà bạn đã điền.
        - Xác nhận email và nó sẽ chuyển hướng bạn đến trang đăng nhập.
    2. Đăng nhập
        - Điền các thông tin theo yêu cầu.
        - Bấm nút (Login).
    3. Chức năng lấy mật khẩu và gửi lại mail xác nhận
        - Nếu quên mật khẩu, bạn có thể vào (/recoverpw) để nhận được một email đổi mật khẩu
        - Điền mật khẩu mới và xác nhận
        - Gửi lại email xác nhận cũng tương tự trại (/resendconfirmmail)
    *****
      - Bạn phải đăng nhập để có thể sử dụng các chức năng khác của Ứng Dụng.
      - Điền sai thông tin sẽ có các dialog thông báo.
 ### 2. Chức năng của người dùng
      - khi tạo tài khoản, người dùng sẽ có mặc định một folder gốc có tên trùng với tên tài khoản
      1. Thao tác với folder
       - thêm mới, sửa tên, đưa vào thùng rác:( right click --> add||rename||delete)
       - truy cập một folder: - ( right click --> Show)
                              - ( double click )
      2. Thao tác với file
       - Upload File (right click --> Upload File  --> Chọn File --> ok) 
                - File upload sẽ ở trong thư mục hiện thời
                - không thể upload file tại các khu vực khác ngoài myFodler
       - Xóa, đổi tên file (right click)
       - Trình chiếu file (hiện nay app có thể trình chiếu được một số loại file cơ bản): (pdf,mp3,mp4,các loại file ảnh, các loại file text)
       - Download file: Người dùng có thể download file mà mình sở hữu hoặc được chia sẻ
      3. Các chức năng khác
       - cut,copy,paste: hỗ trợ người dùng quản lí.
       - Thêm vào yêu thích: Đánh dấu những mục hay truy cập để tiện việc theo dõi.
       - Hiện những file truy cập trong ngày, để tiện việc theo dõi.
       - Tìm kiếm: sàng lọc các thư mục và file cho ra kết quả mà người dùng mong muốn.
       - Duyệt cây: hỗ trợ truy xuất thư mục
       - Thay đổi dạng trình chiếu: Hiện nay có 2 dạng trình chiếu cơ bản là list và grid
              + list cung cấp danh sách kèm theo một số thông tin như kích cỡ, đường dẫn, ngày khởi tạo.
              + Grid style cung vấp sự gọn gàng dễ nhìn, hiển thị được số lượng nhiều hơn.
       - Chia sẻ: dễ dàng chia sẻ dữ liệu với các người dùng khác, người được chia sẻ sẽ không thể sửa đổi tên hay xóa, nhưng có thể trình chiếu và download.
### 3. Chức năng của Admin
       1. Quản lý Người dùng: 
        - Liệt kê danh sách người dùng: hiển thị thông tin của người dùng, tiện cho việc quản lí
        - Kích hoạt tài khoản: có thể kích hoạt tài khoản trực tiếp cho người dùng thay vì người dùng phải xác nhận qua mail
        - Đổi mật khẩu người dùng: có thể trực tiếp thay đổi mật khẩu giúp người dùng.
        - khóa tài khoản: Có thể khóa tài khoản người dùng nếu người dùng vi phạm các quy tắc khi tham gia sử dụng app
        - Xóa tài khoản: Tài khoản vi phạm điều lệ nhiều lần, tài khoản ma,... có thể bị xóa khi sử dụng chức năng này
       2. Quản lí thư mục
       3. Quản lí Admin
        - Hiện thị danh sách các admin
        - thêm mới admin
        - xóa admin
### 4.Các chức năng trong tương lai
        - Trình chiếu được nhiều loại file hơn nữa
        - Đặt mật khẩu khi truy cập file
## III Công nghệ
  #### FrontEnd
      PUGENGINE: Ngôn ngữ hỗ trợ lập trình frontEnd (link: https://pugjs.org/api/getting-started.html )
      THEME : URORA-bootstrap4 (link: https://mannatthemes.com/urora/)
      JQUERY: thư viện javascript (https://jquery.com/)
      Contextmenu2x :  (link: https://swisnl.github.io/jQuery-contextMenu//)
      pdf.js: hỗ trợ trình chiếu file pdf https://mozilla.github.io/pdf.js/
  #### BackEnd
      NodeJS EXPRESS server: (link: [link](https://expressjs.com/en/api.html#res) )
      Mysql database: (link: https://www.mysql.com/ )
      Module: xem trong file cấu hình [package.json](https://github.com/tung1998/filesManager/blob/master/package.json)

       
      
 
