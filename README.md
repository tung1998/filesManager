# filesManager
FilesManager_blackBirds
## I Hướng dẫn cài đặt
1. Cài đặt môi trường nodejs để chạy server - setup nodejs environment (link: https://nodejs.org/en/ )
2. clone repo  (link: https://github.com/tung1998/filesManager/)
3. Cài đặt mysql server và filesmanager database (filemanager.sql)
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
       - Thêm vào yêu thích: Đánh dấu những mục hay truy cập để tiện việc theo dõi.
       - Hiện những file truy cập trong ngày, để tiện việc theo dõi.
       
                                                                                          
       
      
 
