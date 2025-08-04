import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  LinkIcon,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' }
  ]
}

// This would typically come from a database or CMS
const getBlogPost = (id: string) => {
  const posts = {
    "1": {
      id: 1,
      title: "Hướng dẫn toàn diện cho người hiến máu lần đầu",
      excerpt:
        "Bạn đang cân nhắc hiến máu lần đầu? Đây là hướng dẫn chi tiết từ A-Z giúp bạn chuẩn bị tốt nhất cho lần hiến máu đầu tiên.",
      content: `
        <h2>Tại sao nên hiến máu?</h2>
        <p>Hiến máu là một hành động cao đẹp, thể hiện tinh thần tương thân tương ái và trách nhiệm xã hội của mỗi công dân. Mỗi đơn vị máu bạn hiến có thể cứu sống tới 3 người, đặc biệt trong các trường hợp cấp cứu, phẫu thuật và điều trị bệnh hiểm nghèo.</p>
        
        <h2>Điều kiện để hiến máu</h2>
        <h3>Điều kiện về tuổi tác và sức khỏe:</h3>
        <ul>
          <li><strong>Tuổi:</strong> Từ 18-60 tuổi (lần đầu hiến máu từ 18-55 tuổi)</li>
          <li><strong>Cân nặng:</strong> Tối thiểu 45kg đối với nữ, 50kg đối với nam</li>
          <li><strong>Sức khỏe:</strong> Khỏe mạnh, không mắc các bệnh truyền nhiễm</li>
          <li><strong>Huyết áp:</strong> Trong khoảng 90-160 mmHg (tâm thu) và 60-100 mmHg (tâm trương)</li>
          <li><strong>Mạch:</strong> 60-100 lần/phút, đều</li>
        </ul>

        <h3>Các trường hợp tạm hoãn hiến máu:</h3>
        <ul>
          <li>Phụ nữ có thai, cho con bú</li>
          <li>Đang trong thời kỳ kinh nguyệt</li>
          <li>Vừa mới phẫu thuật, điều trị răng</li>
          <li>Đang dùng thuốc kháng sinh</li>
          <li>Vừa tiêm vaccine (cần chờ 1-4 tuần tùy loại vaccine)</li>
        </ul>

        <h2>Chuẩn bị trước khi hiến máu</h2>
        <h3>24-48 giờ trước khi hiến máu:</h3>
        <ul>
          <li><strong>Ăn uống đầy đủ:</strong> Không nhịn ăn, ăn nhiều thực phẩm giàu sắt</li>
          <li><strong>Uống đủ nước:</strong> Tối thiểu 2 lít nước/ngày</li>
          <li><strong>Ngủ đủ giấc:</strong> 7-8 tiếng/đêm</li>
          <li><strong>Tránh rượu bia:</strong> Không uống rượu bia 24 giờ trước hiến máu</li>
          <li><strong>Hạn chế caffeine:</strong> Giảm cà phê, trà đậm đặc</li>
        </ul>

        <h3>Giấy tờ cần mang theo:</h3>
        <ul>
          <li>CMND/CCCD hoặc Hộ chiếu</li>
          <li>Thẻ hiến máu (nếu đã từng hiến)</li>
          <li>Sổ khám sức khỏe (nếu có)</li>
        </ul>

        <h2>Quy trình hiến máu chi tiết</h2>
        <h3>Bước 1: Đăng ký và khai báo y tế (10-15 phút)</h3>
        <p>Bạn sẽ điền vào phiếu đăng ký hiến máu tình nguyện, khai báo tình trạng sức khỏe và tiền sử bệnh. Nhân viên y tế sẽ hướng dẫn chi tiết và giải đáp mọi thắc mắc.</p>

        <h3>Bước 2: Khám sàng lọc sức khỏe (15-20 phút)</h3>
        <ul>
          <li>Đo huyết áp, cân nặng, chiều cao</li>
          <li>Đo nhiệt độ, mạch</li>
          <li>Xét nghiệm máu nhanh (hemoglobin, nhóm máu)</li>
          <li>Bác sĩ khám tổng quát</li>
        </ul>

        <h3>Bước 3: Hiến máu (8-15 phút)</h3>
        <ul>
          <li>Khử trùng vùng da cánh tay</li>
          <li>Đâm kim lấy máu (có thể hơi đau nhẹ)</li>
          <li>Thu thập 350-450ml máu (tùy cân nặng)</li>
          <li>Rút kim và băng vết thương</li>
        </ul>

        <h3>Bước 4: Nghỉ ngơi và ăn nhẹ (15-20 phút)</h3>
        <p>Sau khi hiến máu, bạn sẽ được nghỉ ngơi, uống nước và ăn nhẹ để phục hồi sức khỏe.</p>

        <h2>Chăm sóc sau khi hiến máu</h2>
        <h3>Ngay sau khi hiến máu:</h3>
        <ul>
          <li>Nghỉ ngơi 15-20 phút tại chỗ</li>
          <li>Uống nhiều nước, ăn nhẹ</li>
          <li>Giữ băng gạc ít nhất 4-6 giờ</li>
          <li>Không nâng vật nặng bằng tay đã hiến máu</li>
        </ul>

        <h3>24-48 giờ sau hiến máu:</h3>
        <ul>
          <li>Uống nhiều nước (2-3 lít/ngày)</li>
          <li>Ăn đầy đủ, bổ sung thực phẩm giàu sắt</li>
          <li>Tránh hoạt động thể lực nặng</li>
          <li>Không uống rượu bia</li>
          <li>Ngủ đủ giấc</li>
        </ul>

        <h2>Dấu hiệu cần lưu ý</h2>
        <p><strong>Liên hệ ngay với cơ sở y tế nếu có các dấu hiệu sau:</strong></p>
        <ul>
          <li>Chảy máu không cầm được tại vết kim</li>
          <li>Đau, sưng, đỏ vùng đâm kim</li>
          <li>Chóng mặt, buồn nôn kéo dài</li>
          <li>Sốt, mệt mỏi bất thường</li>
        </ul>

        <h2>Lợi ích của việc hiến máu</h2>
        <h3>Đối với người nhận:</h3>
        <ul>
          <li>Cứu sống trong các ca cấp cứu</li>
          <li>Hỗ trợ điều trị ung thư, bệnh máu</li>
          <li>Giúp phẫu thuật an toàn</li>
        </ul>

        <h3>Đối với người hiến:</h3>
        <ul>
          <li>Kiểm tra sức khỏe miễn phí</li>
          <li>Kích thích tạo máu mới</li>
          <li>Giảm nguy cơ bệnh tim mạch</li>
          <li>Cảm giác hạnh phúc khi giúp đỡ người khác</li>
        </ul>

        <h2>Kết luận</h2>
        <p>Hiến máu là một việc làm ý nghĩa và an toàn khi được thực hiện đúng quy trình. Hy vọng hướng dẫn này đã giúp bạn có đủ thông tin và tự tin cho lần hiến máu đầu tiên. Hãy nhớ rằng, mỗi giọt máu bạn hiến đều có thể tạo nên phép màu cứu sống!</p>
      `,
      author: "BS. Nguyễn Văn Minh",
      authorBio:
        "Bác sĩ chuyên khoa Huyết học, 15 năm kinh nghiệm trong lĩnh vực hiến máu và truyền máu. Hiện đang công tác tại Viện Huyết học - Truyền máu Trung ương.",
      date: "15/12/2024",
      readTime: "8 phút đọc",
      category: "Hướng dẫn",
      views: 2547,
      likes: 189,
      comments: 23,
      tags: ["hiến máu lần đầu", "hướng dẫn", "chuẩn bị", "quy trình", "chăm sóc"],
      relatedPosts: [2, 3, 4],
    },
    "2": {
      id: 2,
      title: "Quy trình hiến máu chi tiết từ A đến Z",
      excerpt:
        "Tìm hiểu từng bước trong quy trình hiến máu: đăng ký trực tuyến, khám sàng lọc sức khỏe, quy trình lấy máu và chăm sóc sau hiến.",
      content: `
        <h2>Tổng quan về quy trình hiến máu</h2>
        <p>Quy trình hiến máu được thiết kế để đảm bảo an toàn tối đa cho cả người hiến và người nhận máu. Toàn bộ quá trình từ đăng ký đến hoàn thành thường mất khoảng 45-60 phút.</p>

        <h2>Giai đoạn 1: Chuẩn bị và đăng ký</h2>
        <h3>Đăng ký trực tuyến (Khuyến khích)</h3>
        <p>Để tiết kiệm thời gian, bạn có thể đăng ký trước qua website hoặc ứng dụng di động:</p>
        <ul>
          <li>Truy cập website chính thức</li>
          <li>Điền thông tin cá nhân</li>
          <li>Chọn địa điểm và thời gian hiến máu</li>
          <li>Nhận mã QR xác nhận</li>
        </ul>

        <h3>Đăng ký tại chỗ</h3>
        <p>Nếu chưa đăng ký trước, bạn có thể đăng ký trực tiếp tại trung tâm hiến máu:</p>
        <ul>
          <li>Mang theo CMND/CCCD</li>
          <li>Điền phiếu đăng ký hiến máu</li>
          <li>Khai báo tình trạng sức khỏe</li>
          <li>Nhận số thứ tự chờ khám</li>
        </ul>

        <h2>Giai đoạn 2: Khám sàng lọc sức khỏe</h2>
        <h3>Kiểm tra thông tin cơ bản</h3>
        <ul>
          <li><strong>Đo chiều cao, cân nặng:</strong> Đảm bảo đạt tiêu chuẩn tối thiểu</li>
          <li><strong>Đo huyết áp:</strong> Kiểm tra trong khoảng bình thường</li>
          <li><strong>Đo mạch:</strong> Đánh giá nhịp tim</li>
          <li><strong>Đo nhiệt độ:</strong> Loại trừ tình trạng sốt</li>
        </ul>

        <h3>Xét nghiệm máu nhanh</h3>
        <ul>
          <li><strong>Hemoglobin:</strong> Kiểm tra nồng độ huyết sắc tố</li>
          <li><strong>Nhóm máu ABO/Rh:</strong> Xác định nhóm máu chính xác</li>
          <li><strong>Test nhanh HIV, HBV, HCV:</strong> Sàng lọc bệnh truyền nhiễm</li>
        </ul>

        <h3>Khám lâm sàng</h3>
        <p>Bác sĩ sẽ thực hiện khám tổng quát:</p>
        <ul>
          <li>Hỏi tiền sử bệnh</li>
          <li>Khám tim phổi</li>
          <li>Kiểm tra da niêm mạc</li>
          <li>Đánh giá tình trạng sức khỏe tổng thể</li>
        </ul>

        <h2>Giai đoạn 3: Quy trình lấy máu</h2>
        <h3>Chuẩn bị</h3>
        <ul>
          <li>Chọn tư thế nằm hoặc ngồi thoải mái</li>
          <li>Khử trùng vùng da cánh tay</li>
          <li>Buộc garô để tĩnh mạch nổi rõ</li>
          <li>Sử dụng kim và túi máu vô trùng</li>
        </ul>

        <h3>Quá trình lấy máu</h3>
        <ul>
          <li><strong>Đâm kim:</strong> Cảm giác đau nhẹ như bị kiến cắn</li>
          <li><strong>Thu thập máu:</strong> 350-450ml tùy theo cân nặng</li>
          <li><strong>Thời gian:</strong> 8-15 phút</li>
          <li><strong>Theo dõi:</strong> Nhân viên y tế luôn bên cạnh</li>
        </ul>

        <h3>Hoàn thành</h3>
        <ul>
          <li>Rút kim nhẹ nhàng</li>
          <li>Băng vết thương cẩn thận</li>
          <li>Ghi nhận thông tin túi máu</li>
          <li>Hướng dẫn chăm sóc sau hiến máu</li>
        </ul>

        <h2>Giai đoạn 4: Chăm sóc sau hiến máu</h2>
        <h3>Nghỉ ngơi tại chỗ</h3>
        <ul>
          <li>Nằm/ngồi nghỉ 15-20 phút</li>
          <li>Uống nước, ăn bánh quy</li>
          <li>Theo dõi tình trạng sức khỏe</li>
          <li>Nhận giấy chứng nhận hiến máu</li>
        </ul>

        <h3>Hướng dẫn về nhà</h3>
        <ul>
          <li>Giữ băng gạc 4-6 giờ</li>
          <li>Tránh nâng vật nặng 24 giờ</li>
          <li>Uống nhiều nước</li>
          <li>Ăn đầy đủ dinh dưỡng</li>
        </ul>

        <h2>Quy trình xử lý máu sau thu thập</h2>
        <h3>Vận chuyển và bảo quản</h3>
        <ul>
          <li>Máu được vận chuyển trong điều kiện lạnh</li>
          <li>Bảo quản ở nhiệt độ 2-6°C</li>
          <li>Thời gian vận chuyển tối đa 6 giờ</li>
        </ul>

        <h3>Xét nghiệm tại phòng lab</h3>
        <ul>
          <li>Xét nghiệm đầy đủ các bệnh truyền nhiễm</li>
          <li>Kiểm tra chất lượng máu</li>
          <li>Xác nhận lại nhóm máu</li>
          <li>Thời gian: 24-48 giờ</li>
        </ul>

        <h3>Tách máu và bảo quản</h3>
        <ul>
          <li>Tách thành các thành phần: hồng cầu, tiểu cầu, huyết tương</li>
          <li>Bảo quản ở nhiệt độ phù hợp</li>
          <li>Ghi nhãn và theo dõi hạn sử dụng</li>
        </ul>

        <h2>Hệ thống theo dõi và liên hệ</h2>
        <h3>Thông báo kết quả</h3>
        <ul>
          <li>SMS thông báo kết quả xét nghiệm</li>
          <li>Email cảm ơn và thông tin bổ sung</li>
          <li>Cập nhật vào sổ hiến máu điện tử</li>
        </ul>

        <h3>Lịch hẹn hiến máu tiếp theo</h3>
        <ul>
          <li>Nam: sau 3 tháng</li>
          <li>Nữ: sau 4 tháng</li>
          <li>Nhắc nhở qua tin nhắn</li>
          <li>Ưu tiên đăng ký trước</li>
        </ul>

        <h2>Những lưu ý đặc biệt</h2>
        <h3>Trường hợp khẩn cấp</h3>
        <p>Trong các tình huống cấp cứu, quy trình có thể được rút gọn nhưng vẫn đảm bảo an toàn:</p>
        <ul>
          <li>Ưu tiên xét nghiệm nhanh</li>
          <li>Sử dụng máu O- trong trường hợp khẩn cấp</li>
          <li>Tăng cường nhân lực hỗ trợ</li>
        </ul>

        <h3>Hiến máu thành phần</h3>
        <p>Đối với hiến tiểu cầu hoặc huyết tương:</p>
        <ul>
          <li>Thời gian dài hơn (1-2 giờ)</li>
          <li>Sử dụng máy tách máu tự động</li>
          <li>Yêu cầu sức khỏe cao hơn</li>
          <li>Cần đặt lịch trước</li>
        </ul>

        <h2>Kết luận</h2>
        <p>Quy trình hiến máu được thiết kế khoa học và an toàn, đảm bảo lợi ích tối đa cho cả người hiến và người nhận. Việc hiểu rõ từng bước sẽ giúp bạn chuẩn bị tốt hơn và có trải nghiệm tích cực khi tham gia hiến máu tình nguyện.</p>
      `,
      author: "BS. Trần Thị Lan Anh",
      authorBio:
        "Bác sĩ chuyên khoa Huyết học, Phó trưởng khoa Hiến máu tại Bệnh viện Trung ương Huế. 12 năm kinh nghiệm trong tổ chức và quản lý hoạt động hiến máu.",
      date: "12/12/2024",
      readTime: "6 phút đọc",
      category: "Hướng dẫn",
      views: 1823,
      likes: 145,
      comments: 18,
      tags: ["quy trình", "hiến máu", "từng bước", "an toàn", "chuẩn bị"],
      relatedPosts: [1, 3, 4],
    },
    "3": {
      id: 3,
      title: "Chuẩn bị gì trước khi hiến máu? Checklist hoàn chỉnh",
      excerpt:
        "Danh sách chi tiết những gì cần chuẩn bị trước 24-48 giờ hiến máu: chế độ ăn uống, giấy tờ cần thiết, trang phục phù hợp và những điều tuyệt đối không nên làm trước khi hiến máu.",
      content: `
        <h2>Tại sao cần chuẩn bị kỹ lưỡng?</h2>
        <p>Việc chuẩn bị tốt trước khi hiến máu không chỉ đảm bảo an toàn cho bạn mà còn giúp quá trình hiến máu diễn ra thuận lợi và hiệu quả. Chuẩn bị đúng cách sẽ giúp bạn cảm thấy thoải mái hơn và giảm thiểu các tác dụng phụ không mong muốn.</p>

        <h2>Checklist 48 giờ trước hiến máu</h2>
        <h3>🍎 Chế độ ăn uống</h3>
        <h4>Nên làm:</h4>
        <ul>
          <li><strong>Ăn đầy đủ 3 bữa:</strong> Không bỏ bữa, đặc biệt là bữa sáng</li>
          <li><strong>Tăng cường thực phẩm giàu sắt:</strong>
            <ul>
              <li>Thịt đỏ: thịt bò, thịt heo</li>
              <li>Gan động vật: gan bò, gan heo, gan gà</li>
              <li>Rau xanh đậm màu: rau bina, cải xoăn, rau muống</li>
              <li>Đậu và hạt: đậu đen, đậu lăng, hạt bí</li>
              <li>Trái cây: nho khô, mơ khô, táo</li>
            </ul>
          </li>
          <li><strong>Bổ sung vitamin C:</strong> Cam, chanh, ổi, đu đủ (giúp hấp thụ sắt tốt hơn)</li>
          <li><strong>Uống đủ nước:</strong> Tối thiểu 2-3 lít nước/ngày</li>
          <li><strong>Ăn thực phẩm giàu protein:</strong> Trứng, cá, thịt, đậu phụ</li>
        </ul>

        <h4>Tránh:</h4>
        <ul>
          <li>Thức ăn nhiều dầu mỡ, chiên rán</li>
          <li>Đồ uống có cồn (rượu, bia)</li>
          <li>Cà phê, trà đậm đặc quá nhiều</li>
          <li>Thức ăn nhanh, đồ ăn vặt</li>
          <li>Nhịn ăn hoặc ăn quá ít</li>
        </ul>

        <h3>💤 Chế độ nghỉ ngơi</h3>
        <ul>
          <li><strong>Ngủ đủ giấc:</strong> 7-8 tiếng/đêm</li>
          <li><strong>Tránh thức khuya:</strong> Đi ngủ trước 23h</li>
          <li><strong>Hạn chế stress:</strong> Tránh công việc căng thẳng</li>
          <li><strong>Không tập thể dục quá sức:</strong> Chỉ tập nhẹ nhàng</li>
        </ul>

        <h2>Checklist 24 giờ trước hiến máu</h2>
        <h3>🥗 Bữa ăn quan trọng</h3>
        <h4>Bữa tối (24h trước):</h4>
        <ul>
          <li>Cơm/phở/bún với thịt hoặc cá</li>
          <li>Rau xanh luộc hoặc xào</li>
          <li>Canh hoặc súp</li>
          <li>Trái cây tráng miệng</li>
          <li>Uống đủ nước, tránh rượu bia hoàn toàn</li>
        </ul>

        <h4>Bữa sáng (ngày hiến máu):</h4>
        <ul>
          <li><strong>Bắt buộc phải ăn sáng:</strong> Không được nhịn ăn</li>
          <li>Bánh mì kẹp thịt/trứng</li>
          <li>Phở/bún bò/bún riêu</li>
          <li>Cháo thịt/cháo cá</li>
          <li>Sữa, nước ép trái cây</li>
          <li>Tránh cà phê đậm đặc</li>
        </ul>

        <h3>💊 Thuốc và bổ sung</h3>
        <h4>Có thể dùng:</h4>
        <ul>
          <li>Vitamin tổng hợp (nếu đang dùng thường xuyên)</li>
          <li>Thuốc điều trị bệnh mãn tính (theo chỉ định bác sĩ)</li>
          <li>Paracetamol (nếu cần thiết)</li>
        </ul>

        <h4>Tuyệt đối tránh:</h4>
        <ul>
          <li>Aspirin (7 ngày trước hiến máu)</li>
          <li>Thuốc kháng sinh (trừ khi bác sĩ cho phép)</li>
          <li>Thuốc chống đông máu</li>
          <li>Thuốc giảm đau mạnh</li>
        </ul>

        <h2>Chuẩn bị giấy tờ và vật dụng</h2>
        <h3>📋 Giấy tờ bắt buộc</h3>
        <ul>
          <li><strong>CMND/CCCD:</strong> Bản gốc, còn hạn</li>
          <li><strong>Thẻ hiến máu:</strong> Nếu đã từng hiến (để kiểm tra lịch sử)</li>
          <li><strong>Giấy khám sức khỏe:</strong> Nếu có bệnh mãn tính</li>
          <li><strong>Sổ tiêm chủng:</strong> Nếu vừa tiêm vaccine gần đây</li>
        </ul>

        <h3>🎒 Vật dụng cần mang</h3>
        <ul>
          <li><strong>Nước uống:</strong> Chai nước 500ml</li>
          <li><strong>Đồ ăn nhẹ:</strong> Bánh quy, kẹo (phòng hạ đường huyết)</li>
          <li><strong>Điện thoại:</strong> Để liên lạc khẩn cấp</li>
          <li><strong>Tiền mặt:</strong> Phòng trường hợp cần thiết</li>
          <li><strong>Khăn giấy:</strong> Để lau chùi</li>
        </ul>

        <h2>Trang phục phù hợp</h2>
        <h3>👕 Lựa chọn quần áo</h3>
        <ul>
          <li><strong>Áo có tay ngắn hoặc dễ xắn tay:</strong> Để thuận tiện cho việc lấy máu</li>
          <li><strong>Quần dài thoải mái:</strong> Tránh quần bó sát</li>
          <li><strong>Giày dép thoải mái:</strong> Dép sandal hoặc giày thể thao</li>
          <li><strong>Tránh trang sức nhiều:</strong> Chỉ đeo đồng hồ, nhẫn cưới</li>
          <li><strong>Màu sắc tươi sáng:</strong> Giúp tinh thần thoải mái</li>
        </ul>

        <h2>Kiểm tra sức khỏe tự đánh giá</h2>
        <h3>✅ Checklist sức khỏe</h3>
        <h4>Kiểm tra trước khi đi:</h4>
        <ul>
          <li>□ Không sốt (nhiệt độ < 37.5°C)</li>
          <li>□ Không ho, sổ mũi</li>
          <li>□ Không đau đầu, chóng mặt</li>
          <li>□ Không buồn nôn</li>
          <li>□ Cảm thấy khỏe mạnh, tỉnh táo</li>
          <li>□ Đã ăn sáng đầy đủ</li>
          <li>□ Đã uống đủ nước</li>
          <li>□ Ngủ đủ giấc đêm trước</li>
        </ul>

        <h4>Nếu có bất kỳ dấu hiệu nào sau, hãy hoãn hiến máu:</h4>
        <ul>
          <li>Sốt, cảm cúm</li>
          <li>Đau răng, viêm họng</li>
          <li>Rối loạn tiêu hóa</li>
          <li>Mệt mỏi bất thường</li>
          <li>Vừa tiêm vaccine (< 2 tuần)</li>
          <li>Vừa uống thuốc kháng sinh</li>
        </ul>

        <h2>Chuẩn bị tâm lý</h2>
        <h3>🧠 Tinh thần tích cực</h3>
        <ul>
          <li><strong>Tìm hiểu về quy trình:</strong> Đọc thông tin, xem video hướng dẫn</li>
          <li><strong>Nghĩ về ý nghĩa:</strong> Bạn đang cứu sống 3 người</li>
          <li><strong>Chuẩn bị câu hỏi:</strong> Ghi chú những thắc mắc muốn hỏi bác sĩ</li>
          <li><strong>Thư giãn:</strong> Nghe nhạc, đọc sách trước khi đi</li>
          <li><strong>Mang theo bạn bè:</strong> Nếu cần hỗ trợ tinh thần</li>
        </ul>

        <h3>😰 Đối phó với lo lắng</h3>
        <ul>
          <li><strong>Hít thở sâu:</strong> Kỹ thuật thở 4-7-8</li>
          <li><strong>Tập trung vào lợi ích:</strong> Nghĩ về người được cứu sống</li>
          <li><strong>Nói chuyện với nhân viên:</strong> Họ rất kinh nghiệm và thân thiện</li>
          <li><strong>Không nhìn kim:</strong> Nếu sợ kim tiêm</li>
          <li><strong>Nghe nhạc:</strong> Mang tai nghe để thư giãn</li>
        </ul>

        <h2>Lịch trình ngày hiến máu</h2>
        <h3>⏰ Thời gian biểu mẫu</h3>
        <h4>Sáng sớm (6:00-7:00):</h4>
        <ul>
          <li>Thức dậy, vệ sinh cá nhân</li>
          <li>Uống 1-2 cốc nước</li>
          <li>Ăn sáng đầy đủ</li>
          <li>Kiểm tra giấy tờ, vật dụng</li>
        </ul>

        <h4>Trước khi đi (30 phút):</h4>
        <ul>
          <li>Uống thêm nước</li>
          <li>Kiểm tra địa chỉ, đường đi</li>
          <li>Thông báo cho gia đình/bạn bè</li>
          <li>Mang theo đồ ăn nhẹ</li>
        </ul>

        <h4>Tại trung tâm hiến máu:</h4>
        <ul>
          <li>Đến sớm 15-30 phút</li>
          <li>Mang theo tất cả giấy tờ</li>
          <li>Thư giãn, không vội vàng</li>
          <li>Hợp tác với nhân viên y tế</li>
        </ul>

        <h2>Những điều tuyệt đối không được làm</h2>
        <h3>🚫 Danh sách cấm</h3>
        <h4>24 giờ trước hiến máu:</h4>
        <ul>
          <li>❌ Uống rượu, bia</li>
          <li>❌ Thức khuya</li>
          <li>❌ Tập thể dục quá sức</li>
          <li>❌ Ăn đồ ăn bẩn, không rõ nguồn gốc</li>
          <li>❌ Dùng thuốc không theo chỉ định</li>
        </ul>

        <h4>Sáng ngày hiến máu:</h4>
        <ul>
          <li>❌ Nhịn ăn sáng</li>
          <li>❌ Uống cà phê đậm đặc</li>
          <li>❌ Hút thuốc lá</li>
          <li>❌ Căng thẳng, lo lắng quá mức</li>
          <li>❌ Đến muộn</li>
        </ul>

        <h2>Kết luận</h2>
        <p>Việc chuẩn bị kỹ lưỡng trước khi hiến máu là chìa khóa để có một trải nghiệm tích cực và an toàn. Hãy làm theo checklist này để đảm bảo bạn ở trạng thái tốt nhất cho việc hiến máu. Nhớ rằng, sự chuẩn bị tốt không chỉ có lợi cho bạn mà còn đảm bảo chất lượng máu tốt nhất cho người nhận.</p>

        <p><strong>Lưu ý:</strong> Nếu có bất kỳ thắc mắc nào, hãy liên hệ với trung tâm hiến máu trước khi đến. Họ sẽ tư vấn cụ thể cho tình trạng của bạn.</p>
      `,
      author: "Y tá trưởng Phạm Thị Hoa",
      authorBio:
        "Y tá trưởng với 18 năm kinh nghiệm trong lĩnh vực hiến máu và chăm sóc người hiến máu. Chuyên gia tư vấn chuẩn bị hiến máu tại Trung tâm Huyết học TP.HCM.",
      date: "10/12/2024",
      readTime: "5 phút đọc",
      category: "Hướng dẫn",
      views: 1456,
      likes: 98,
      comments: 12,
      tags: ["chuẩn bị", "checklist", "ăn uống", "giấy tờ", "trang phục"],
      relatedPosts: [1, 2, 4],
    },
    "4": {
      id: 4,
      title: "Chăm sóc bản thân sau khi hiến máu - Bí quyết phục hồi nhanh",
      excerpt:
        "Hướng dẫn chi tiết cách chăm sóc bản thân trong 24-48 giờ đầu sau hiến máu: chế độ nghỉ ngơi, dinh dưỡng bổ sung, dấu hiệu cần lưu ý và khi nào cần liên hệ bác sĩ.",
      content: `
        <h2>Tại sao cần chăm sóc đặc biệt sau hiến máu?</h2>
        <p>Sau khi hiến máu, cơ thể bạn cần thời gian để phục hồi và sản xuất lại lượng máu đã hiến. Việc chăm sóc đúng cách sẽ giúp quá trình này diễn ra nhanh chóng và an toàn, đồng thời tránh các biến chứng không mong muốn.</p>

        <h2>Chăm sóc ngay sau khi hiến máu (0-2 giờ)</h2>
        <h3>🩹 Chăm sóc vết kim</h3>
        <ul>
          <li><strong>Giữ băng gạc:</strong> Không được tháo băng trong 4-6 giờ đầu</li>
          <li><strong>Tránh làm ướt:</strong> Không để nước vào vết băng</li>
          <li><strong>Không nâng vật nặng:</strong> Tránh dùng tay đã hiến máu nâng đồ > 5kg</li>
          <li><strong>Không cọ xát:</strong> Tránh cọ xát mạnh vùng băng</li>
          <li><strong>Theo dõi chảy máu:</strong> Nếu thấy máu thấm qua băng, báo ngay nhân viên y tế</li>
        </ul>

        <h3>💧 Bù nước ngay lập tức</h3>
        <ul>
          <li><strong>Uống nước ngay:</strong> 500ml nước trong 30 phút đầu</li>
          <li><strong>Loại nước phù hợp:</strong>
            <ul>
              <li>Nước lọc</li>
              <li>Nước ép trái cây (cam, táo)</li>
              <li>Nước dừa tươi</li>
              <li>Trà nhạt, mật ong pha loãng</li>
            </ul>
          </li>
          <li><strong>Tránh:</strong> Cà phê đậm đặc, nước ngọt có gas, rượu bia</li>
        </ul>

        <h3>🍪 Ăn nhẹ phục hồi</h3>
        <ul>
          <li><strong>Ăn ngay tại chỗ:</strong> Bánh quy, kẹo được cung cấp</li>
          <li><strong>Bổ sung đường:</strong> Giúp tránh hạ đường huyết</li>
          <li><strong>Không vội vàng:</strong> Ăn chậm, nhai kỹ</li>
        </ul>

        <h3>😴 Nghỉ ngơi tại chỗ</h3>
        <ul>
          <li><strong>Thời gian:</strong> Tối thiểu 15-20 phút</li>
          <li><strong>Tư thế:</strong> Ngồi hoặc nằm thoải mái</li>
          <li><strong>Không đứng dậy đột ngột:</strong> Đứng dậy từ từ để tránh chóng mặt</li>
          <li><strong>Thông báo cảm giác:</strong> Nói với nhân viên nếu thấy khó chịu</li>
        </ul>

        <h2>Chăm sóc trong ngày đầu (2-24 giờ)</h2>
        <h3>🚗 Di chuyển an toàn</h3>
        <ul>
          <li><strong>Không lái xe ngay:</strong> Chờ ít nhất 30 phút sau hiến máu</li>
          <li><strong>Có người đưa đón:</strong> Tốt nhất nên có người thân đi cùng</li>
          <li><strong>Tránh phương tiện đông người:</strong> Xe bus, tàu điện đông đúc</li>
          <li><strong>Nghỉ ngơi nếu cần:</strong> Dừng lại nếu cảm thấy mệt</li>
        </ul>

        <h3>💪 Hoạt động hạn chế</h3>
        <h4>Tránh trong 24 giờ đầu:</h4>
        <ul>
          <li>❌ Tập thể dục nặng (gym, chạy bộ, bơi lội)</li>
          <li>❌ Nâng vật nặng (>10kg)</li>
          <li>❌ Làm việc căng thẳng</li>
          <li>❌ Đi sauna, tắm nước nóng</li>
          <li>❌ Massage mạnh</li>
        </ul>

        <h4>Có thể làm:</h4>
        <ul>
          <li>✅ Đi bộ nhẹ nhàng</li>
          <li>✅ Công việc văn phòng bình thường</li>
          <li>✅ Xem TV, đọc sách</li>
          <li>✅ Nấu ăn đơn giản</li>
          <li>✅ Tắm nước ấm (tránh vùng băng)</li>
        </ul>

        <h3>🍽️ Chế độ ăn uống</h3>
        <h4>Bữa trưa (sau hiến máu):</h4>
        <ul>
          <li><strong>Ăn đầy đủ:</strong> Không bỏ bữa</li>
          <li><strong>Thực phẩm giàu sắt:</strong>
            <ul>
              <li>Thịt bò, thịt heo</li>
              <li>Gan động vật</li>
              <li>Cá thu, cá ngừ</li>
              <li>Rau bina, cải xoăn</li>
            </ul>
          </li>
          <li><strong>Vitamin C:</strong> Cam, chanh, ổi (giúp hấp thụ sắt)</li>
          <li><strong>Protein:</strong> Trứng, đậu phụ, sữa</li>
        </ul>

        <h4>Nước uống:</h4>
        <ul>
          <li><strong>Lượng nước:</strong> 2-3 lít trong ngày</li>
          <li><strong>Phân bổ đều:</strong> Uống từng ngụm nhỏ, thường xuyên</li>
          <li><strong>Theo dõi nước tiểu:</strong> Màu vàng nhạt là bình thường</li>
        </ul>

        <h2>Chăm sóc ngày thứ 2-7</h2>
        <h3>🩹 Chăm sóc vết thương</h3>
        <h4>Sau 6-8 giờ:</h4>
        <ul>
          <li><strong>Có thể tháo băng:</strong> Nếu không còn chảy máu</li>
          <li><strong>Vệ sinh nhẹ nhàng:</strong> Rửa bằng nước sạch, xà phòng nhẹ</li>
          <li><strong>Không cần băng lại:</strong> Để vết thương khô tự nhiên</li>
          <li><strong>Tránh cọ xát:</strong> Khi tắm, lau khô nhẹ nhàng</li>
        </ul>

        <h4>Dấu hiệu bình thường:</h4>
        <ul>
          <li>Vết kim nhỏ, khô</li>
          <li>Có thể hơi bầm tím nhẹ xung quanh</li>
          <li>Không đau hoặc đau rất nhẹ</li>
        </ul>

        <h3>🏃‍♂️ Trở lại hoạt động</h3>
        <h4>Ngày 2-3:</h4>
        <ul>
          <li>✅ Tập thể dục nhẹ (yoga, đi bộ)</li>
          <li>✅ Công việc bình thường</li>
          <li>✅ Nâng vật vừa phải (<15kg)</li>
        </ul>

        <h4>Từ ngày 4-7:</h4>
        <ul>
          <li>✅ Tập thể dục bình thường</li>
          <li>✅ Hoạt động mạnh (nếu cảm thấy khỏe)</li>
          <li>✅ Không còn hạn chế đặc biệt</li>
        </ul>

        <h2>Chế độ dinh dưỡng phục hồi</h2>
        <h3>🥩 Thực phẩm giàu sắt (ưu tiên)</h3>
        <h4>Nguồn sắt heme (hấp thụ tốt):</h4>
        <ul>
          <li><strong>Thịt đỏ:</strong> Thịt bò, thịt cừu (100g = 2.5mg sắt)</li>
          <li><strong>Gan:</strong> Gan bò, gan heo (100g = 18mg sắt)</li>
          <li><strong>Hải sản:</strong> Tôm, cua, nghêu, hến</li>
          <li><strong>Cá:</strong> Cá ngừ, cá thu, cá hồi</li>
        </ul>

        <h4>Nguồn sắt phi-heme:</h4>
        <ul>
          <li><strong>Rau xanh:</strong> Rau bina, cải xoăn, rau muống</li>
          <li><strong>Đậu:</strong> Đậu đen, đậu lăng, đậu xanh</li>
          <li><strong>Hạt:</strong> Hạt bí, hạt hướng dương</li>
          <li><strong>Ngũ cốc:</strong> Yến mạch, quinoa</li>
        </ul>

        <h3>🍊 Tăng cường hấp thụ sắt</h3>
        <ul>
          <li><strong>Vitamin C:</strong> Cam, chanh, ổi, dâu tây</li>
          <li><strong>Ăn cùng bữa:</strong> Kết hợp thực phẩm giàu sắt với vitamin C</li>
          <li><strong>Nấu trong chảo gang:</strong> Tăng hàm lượng sắt trong thức ăn</li>
        </ul>

        <h3>🚫 Tránh cản trở hấp thụ sắt</h3>
        <ul>
          <li><strong>Không uống cùng bữa ăn:</strong>
            <ul>
              <li>Trà, cà phê (chờ 1-2 giờ sau ăn)</li>
              <li>Sữa và sản phẩm từ sữa</li>
              <li>Nước ngọt có gas</li>
            </ul>
          </li>
          <li><strong>Hạn chế:</strong> Thực phẩm giàu canxi cùng bữa ăn giàu sắt</li>
        </ul>

        <h2>Dấu hiệu cần lưu ý</h2>
        <h3>⚠️ Dấu hiệu bình thường</h3>
        <ul>
          <li>Mệt mỏi nhẹ trong 1-2 ngày</li>
          <li>Hơi chóng mặt khi đứng dậy nhanh</li>
          <li>Bầm tím nhỏ quanh vết kim</li>
          <li>Cảm giác khát nước</li>
          <li>Buồn ngủ hơn bình thường</li>
        </ul>

        <h3>🚨 Dấu hiệu cần liên hệ y tế ngay</h3>
        <h4>Liên hệ ngay nếu có:</h4>
        <ul>
          <li>🔴 <strong>Chảy máu không cầm được</strong> tại vết kim</li>
          <li>🔴 <strong>Sưng, đỏ, nóng</strong> vùng đâm kim</li>
          <li>🔴 <strong>Đau dữ dội</strong> tại vết kim</li>
          <li>🔴 <strong>Chóng mặt nặng, ngất xỉu</strong></li>
          <li>🔴 <strong>Buồn nôn, nôn nhiều</strong></li>
          <li>🔴 <strong>Sốt cao</strong> (>38°C)</li>
          <li>🔴 <strong>Khó thở, đau ngực</strong></li>
          <li>🔴 <strong>Tê bì, mất cảm giác</strong> tay/cánh tay</li>
        </ul>

        <h4>Số điện thoại khẩn cấp:</h4>
        <ul>
          <li><strong>Trung tâm hiến máu:</strong> [Số điện thoại]</li>
          <li><strong>Cấp cứu 115</strong></li>
          <li><strong>Bác sĩ tư vấn:</strong> [Số điện thoại]</li>
        </ul>

        <h2>Theo dõi sức khỏe dài hạn</h2>
        <h3>📊 Tự theo dõi</h3>
        <h4>Tuần đầu:</h4>
        <ul>
          <li><strong>Cân nặng:</strong> Có thể giảm 0.5-1kg (do mất nước)</li>
          <li><strong>Năng lượng:</strong> Từ từ trở lại bình thường</li>
          <li><strong>Giấc ngủ:</strong> Có thể cần ngủ nhiều hơn</li>
          <li><strong>Vết kim:</strong> Lành hoàn toàn sau 3-5 ngày</li>
        </ul>

        <h4>Tuần 2-4:</h4>
        <ul>
          <li><strong>Sức khỏe:</strong> Trở lại hoàn toàn bình thường</li>
          <li><strong>Xét nghiệm:</strong> Các chỉ số máu phục hồi</li>
          <li><strong>Thể lực:</strong> Không còn hạn chế</li>
        </ul>

        <h3>🔬 Kết quả xét nghiệm</h3>
        <ul>
          <li><strong>Thời gian:</strong> Nhận kết quả sau 3-7 ngày</li>
          <li><strong>Cách thức:</strong> SMS, email hoặc điện thoại</li>
          <li><strong>Nội dung:</strong> Nhóm máu, các bệnh truyền nhiễm</li>
          <li><strong>Bảo mật:</strong> Thông tin được bảo mật tuyệt đối</li>
        </ul>

        <h2>Chuẩn bị cho lần hiến máu tiếp theo</h2>
        <h3>📅 Lịch hiến máu</h3>
        <ul>
          <li><strong>Nam giới:</strong> Có thể hiến lại sau 3 tháng</li>
          <li><strong>Nữ giới:</strong> Có thể hiến lại sau 4 tháng</li>
          <li><strong>Nhắc nhở:</strong> Sẽ có tin nhắn thông báo khi đến hạn</li>
          <li><strong>Đăng ký trước:</strong> Có thể đặt lịch sớm</li>
        </ul>

        <h3>💪 Duy trì sức khỏe</h3>
        <ul>
          <li><strong>Chế độ ăn cân bằng:</strong> Đủ sắt, protein, vitamin</li>
          <li><strong>Tập thể dục đều đặn:</strong> Tăng cường sức khỏe tim mạch</li>
          <li><strong>Khám sức khỏe định kỳ:</strong> Đảm bảo đủ điều kiện hiến máu</li>
          <li><strong>Tránh các yếu tố nguy cơ:</strong> Hút thuốc, uống rượu quá mức</li>
        </ul>

        <h2>Lời khuyên từ chuyên gia</h2>
        <h3>👨‍⚕️ Kinh nghiệm thực tế</h3>
        <blockquote>
          <p><em>"Hầu hết người hiến máu đều phục hồi rất tốt nếu tuân thủ hướng dẫn chăm sóc. Điều quan trọng nhất là lắng nghe cơ thể mình và không vội vàng trở lại hoạt động mạnh."</em></p>
          <p><strong>- BS. Nguyễn Văn A, Trưởng khoa Hiến máu</strong></p>
        </blockquote>

        <h3>💡 Mẹo hay</h3>
        <ul>
          <li><strong>Ghi nhật ký:</strong> Theo dõi cảm giác, triệu chứng hàng ngày</li>
          <li><strong>Ảnh chụp vết thương:</strong> Để so sánh quá trình lành</li>
          <li><strong>Chia sẻ kinh nghiệm:</strong> Khuyến khích bạn bè hiến máu</li>
          <li><strong>Tham gia cộng đồng:</strong> Nhóm người hiến máu tình nguyện</li>
        </ul>

        <h2>Kết luận</h2>
        <p>Chăm sóc bản thân sau hiến máu không khó nhưng rất quan trọng. Việc tuân thủ đúng hướng dẫn sẽ giúp bạn phục hồi nhanh chóng và sẵn sàng cho những lần hiến máu tiếp theo. Hãy nhớ rằng, bạn đã làm một việc rất ý nghĩa - cứu sống người khác, vì vậy hãy chăm sóc bản thân thật tốt!</p>

        <p><strong>Nhớ:</strong> Khi có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với trung tâm hiến máu. Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
      `,
      author: "BS. Lê Văn Nam",
      authorBio:
        "Bác sĩ chuyên khoa Huyết học với 20 năm kinh nghiệm. Chuyên gia hàng đầu về chăm sóc người hiến máu và phục hồi sau hiến máu tại Bệnh viện Bạch Mai.",
      date: "08/12/2024",
      readTime: "7 phút đọc",
      category: "Hướng dẫn",
      views: 1234,
      likes: 87,
      comments: 9,
      tags: ["chăm sóc", "phục hồi", "dinh dưỡng", "vết thương", "dấu hiệu"],
      relatedPosts: [1, 2, 3],
    },
    "5": {
      id: 5,
      title: "7 lợi ích sức khỏe bất ngờ từ việc hiến máu định kỳ",
      excerpt:
        "Khám phá những lợi ích không ngờ tới của việc hiến máu thường xuyên: giảm nguy cơ mắc bệnh tim mạch, kiểm soát cân nặng, cải thiện lưu thông máu và hơn thế nữa.",
      content: `
        <h2>Hiến máu định kỳ: Hơn cả một hành động cao đẹp</h2>
        <p>Hiến máu là một hành động nhân đạo, giúp cứu sống nhiều người bệnh. Tuy nhiên, ít ai biết rằng, việc hiến máu định kỳ còn mang lại nhiều lợi ích sức khỏe bất ngờ cho chính người hiến.</p>

        <h2>1. Giảm nguy cơ mắc bệnh tim mạch</h2>
        <p>Hiến máu giúp giảm lượng sắt dư thừa trong cơ thể. Sắt tích tụ quá nhiều có thể gây oxy hóa cholesterol, dẫn đến xơ vữa động mạch và tăng nguy cơ mắc bệnh tim mạch. Hiến máu định kỳ giúp duy trì lượng sắt ở mức an toàn, bảo vệ tim mạch khỏe mạnh.</p>

        <h2>2. Kiểm soát cân nặng</h2>
        <p>Mỗi lần hiến máu, bạn sẽ đốt cháy khoảng 650 calo. Mặc dù không nên xem hiến máu là một phương pháp giảm cân, nhưng nó có thể hỗ trợ quá trình kiểm soát cân nặng của bạn, đặc biệt khi kết hợp với chế độ ăn uống lành mạnh và tập luyện thường xuyên.</p>

        <h2>3. Kích thích sản sinh tế bào máu mới</h2>
        <p>Sau khi hiến máu, cơ thể sẽ kích hoạt quá trình tạo máu mới để bù đắp lượng máu đã mất. Quá trình này giúp cơ thể sản sinh ra các tế bào máu khỏe mạnh, tăng cường hệ miễn dịch và giúp bạn cảm thấy tràn đầy năng lượng.</p>

        <h2>4. Cải thiện lưu thông máu</h2>
        <p>Hiến máu giúp giảm độ nhớt của máu, giúp máu lưu thông dễ dàng hơn trong cơ thể. Điều này đặc biệt quan trọng đối với những người có nguy cơ mắc bệnh đông máu hoặc các vấn đề về tuần hoàn.</p>

        <h2>5. Kiểm tra sức khỏe miễn phí</h2>
        <p>Trước khi hiến máu, bạn sẽ được kiểm tra sức khỏe tổng quát và xét nghiệm máu miễn phí. Điều này giúp bạn phát hiện sớm các vấn đề sức khỏe tiềm ẩn và có biện pháp can thiệp kịp thời.</p>

        <h2>6. Giảm nguy cơ mắc bệnh ung thư</h2>
        <p>Một số nghiên cứu cho thấy, việc hiến máu định kỳ có thể giúp giảm nguy cơ mắc một số bệnh ung thư, đặc biệt là ung thư gan, phổi, ruột kết và thực quản. Điều này có thể liên quan đến việc giảm lượng sắt dư thừa trong cơ thể.</p>

        <h2>7. Cảm giác hạnh phúc và ý nghĩa</h2>
        <p>Hiến máu là một hành động cao đẹp, giúp cứu sống nhiều người bệnh. Khi biết rằng mình đã đóng góp một phần nhỏ bé vào việc cứu người, bạn sẽ cảm thấy hạnh phúc và ý nghĩa hơn trong cuộc sống.</p>

        <h2>Lưu ý quan trọng</h2>
        <ul>
          <li>Hiến máu chỉ an toàn khi được thực hiện đúng quy trình và dưới sự giám sát của nhân viên y tế.</li>
          <li>Hãy đảm bảo bạn đủ điều kiện sức khỏe trước khi hiến máu.</li>
          <li>Tuân thủ hướng dẫn chăm sóc sau hiến máu để phục hồi nhanh chóng.</li>
        </ul>

        <h2>Kết luận</h2>
        <p>Hiến máu định kỳ không chỉ là một hành động nhân đạo mà còn mang lại nhiều lợi ích sức khỏe bất ngờ cho chính bạn. Hãy tham gia hiến máu tình nguyện để cứu sống người bệnh và cải thiện sức khỏe của bản thân!</p>
      `,
      author: "ThS. BS. Hoàng Thị Thu Thủy",
      authorBio:
        "Thạc sĩ, Bác sĩ chuyên khoa Huyết học - Truyền máu, Bệnh viện Truyền máu Huyết học TP.HCM. Có nhiều năm kinh nghiệm trong lĩnh vực tư vấn và điều trị các bệnh lý về máu.",
      date: "05/12/2024",
      readTime: "6 phút đọc",
      category: "Sức khỏe",
      views: 987,
      likes: 76,
      comments: 8,
      tags: ["lợi ích", "sức khỏe", "tim mạch", "ung thư", "tuần hoàn"],
      relatedPosts: [1, 2, 3],
    },
    "6": {
      id: 6,
      title: "777777777",
      excerpt:
        "Khám phá những lợi ích không ngờ tới của việc hiến máu thường xuyên: giảm nguy cơ mắc bệnh tim mạch, kiểm soát cân nặng, cải thiện lưu thông máu và hơn thế nữa.",
      content: `
        <h2>Hiến máu định kỳ: Hơn cả một hành động cao đẹp</h2>
        <p>Hiến máu là một hành động nhân đạo, giúp cứu sống nhiều người bệnh. Tuy nhiên, ít ai biết rằng, việc hiến máu định kỳ còn mang lại nhiều lợi ích sức khỏe bất ngờ cho chính người hiến.</p>

        <h2>1. Giảm nguy cơ mắc bệnh tim mạch</h2>
        <p>Hiến máu giúp giảm lượng sắt dư thừa trong cơ thể. Sắt tích tụ quá nhiều có thể gây oxy hóa cholesterol, dẫn đến xơ vữa động mạch và tăng nguy cơ mắc bệnh tim mạch. Hiến máu định kỳ giúp duy trì lượng sắt ở mức an toàn, bảo vệ tim mạch khỏe mạnh.</p>

        <h2>2. Kiểm soát cân nặng</h2>
        <p>Mỗi lần hiến máu, bạn sẽ đốt cháy khoảng 650 calo. Mặc dù không nên xem hiến máu là một phương pháp giảm cân, nhưng nó có thể hỗ trợ quá trình kiểm soát cân nặng của bạn, đặc biệt khi kết hợp với chế độ ăn uống lành mạnh và tập luyện thường xuyên.</p>

        <h2>3. Kích thích sản sinh tế bào máu mới</h2>
        <p>Sau khi hiến máu, cơ thể sẽ kích hoạt quá trình tạo máu mới để bù đắp lượng máu đã mất. Quá trình này giúp cơ thể sản sinh ra các tế bào máu khỏe mạnh, tăng cường hệ miễn dịch và giúp bạn cảm thấy tràn đầy năng lượng.</p>

        <h2>4. Cải thiện lưu thông máu</h2>
        <p>Hiến máu giúp giảm độ nhớt của máu, giúp máu lưu thông dễ dàng hơn trong cơ thể. Điều này đặc biệt quan trọng đối với những người có nguy cơ mắc bệnh đông máu hoặc các vấn đề về tuần hoàn.</p>

        <h2>5. Kiểm tra sức khỏe miễn phí</h2>
        <p>Trước khi hiến máu, bạn sẽ được kiểm tra sức khỏe tổng quát và xét nghiệm máu miễn phí. Điều này giúp bạn phát hiện sớm các vấn đề sức khỏe tiềm ẩn và có biện pháp can thiệp kịp thời.</p>

        <h2>6. Giảm nguy cơ mắc bệnh ung thư</h2>
        <p>Một số nghiên cứu cho thấy, việc hiến máu định kỳ có thể giúp giảm nguy cơ mắc một số bệnh ung thư, đặc biệt là ung thư gan, phổi, ruột kết và thực quản. Điều này có thể liên quan đến việc giảm lượng sắt dư thừa trong cơ thể.</p>

        <h2>7. Cảm giác hạnh phúc và ý nghĩa</h2>
        <p>Hiến máu là một hành động cao đẹp, giúp cứu sống nhiều người bệnh. Khi biết rằng mình đã đóng góp một phần nhỏ bé vào việc cứu người, bạn sẽ cảm thấy hạnh phúc và ý nghĩa hơn trong cuộc sống.</p>

        <h2>Lưu ý quan trọng</h2>
        <ul>
          <li>Hiến máu chỉ an toàn khi được thực hiện đúng quy trình và dưới sự giám sát của nhân viên y tế.</li>
          <li>Hãy đảm bảo bạn đủ điều kiện sức khỏe trước khi hiến máu.</li>
          <li>Tuân thủ hướng dẫn chăm sóc sau hiến máu để phục hồi nhanh chóng.</li>
        </ul>

        <h2>Kết luận</h2>
        <p>Hiến máu định kỳ không chỉ là một hành động nhân đạo mà còn mang lại nhiều lợi ích sức khỏe bất ngờ cho chính bạn. Hãy tham gia hiến máu tình nguyện để cứu sống người bệnh và cải thiện sức khỏe của bản thân!</p>
      `,
      author: "ThS. BS. Hoàng Thị Thu Thủy",
      authorBio:
        "Thạc sĩ, Bác sĩ chuyên khoa Huyết học - Truyền máu, Bệnh viện Truyền máu Huyết học TP.HCM. Có nhiều năm kinh nghiệm trong lĩnh vực tư vấn và điều trị các bệnh lý về máu.",
      date: "05/12/2024",
      readTime: "6 phút đọc",
      category: "Sức khỏe",
      views: 987,
      likes: 76,
      comments: 8,
      tags: ["lợi ích", "sức khỏe", "tim mạch", "ung thư", "tuần hoàn"],
      relatedPosts: [1, 2, 3],
    }
  }

  return posts[id as keyof typeof posts] || null
}

const getRelatedPosts = (postIds: number[]) => {
  const allPosts = [
    { id: 1, title: "Hướng dẫn toàn diện cho người hiến máu lần đầu", category: "Hướng dẫn" },
    { id: 2, title: "Quy trình hiến máu chi tiết từ A đến Z", category: "Hướng dẫn" },
    { id: 3, title: "Chuẩn bị gì trước khi hiến máu? Checklist hoàn chỉnh", category: "Hướng dẫn" },
    { id: 4, title: "Chăm sóc bản thân sau khi hiến máu - Bí quyết phục hồi nhanh", category: "Hướng dẫn" },
    { id: 5, title: "7 lợi ích sức khỏe bất ngờ từ việc hiến máu định kỳ", category: "Sức khỏe" },
  ]

  return allPosts.filter((post) => postIds.includes(post.id))
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = getBlogPost(params.id)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post.relatedPosts)

  const getCategoryColor = (category: string) => {
    const colors = {
      "Hướng dẫn": "bg-blue-100 text-blue-800",
      "Sức khỏe": "bg-green-100 text-green-800",
      "Kiến thức": "bg-purple-100 text-purple-800",
      "Câu chuyện": "bg-pink-100 text-pink-800",
      "Dinh dưỡng": "bg-orange-100 text-orange-800",
      "Công nghệ": "bg-gray-100 text-gray-800",
      "Tin tức": "bg-red-100 text-red-800",
      "An toàn": "bg-yellow-100 text-yellow-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-red-600">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-red-600">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{post.title}</span>
          </nav>

          {/* Back Button */}
          <Button variant="outline" asChild className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Blog
            </Link>
          </Button>

          {/* Article Header */}
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              {/* Category Badge */}
              <Badge className={`mb-4 ${getCategoryColor(post.category)}`}>{post.category}</Badge>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {post.views.toLocaleString()} lượt xem
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex items-center justify-between py-4 border-y border-gray-200 mb-8">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Từ khóa:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Article Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Bài viết này có hữu ích không?</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Có
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Không
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Chia sẻ:</span>
                    <Button variant="ghost" size="sm">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Author Bio */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Về tác giả: {post.author}</h3>
                  <p className="text-gray-600 mb-4">{post.authorBio}</p>
                  <Button variant="outline" size="sm">
                    Xem thêm bài viết
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Badge className={`mb-3 ${getCategoryColor(relatedPost.category)}`}>{relatedPost.category}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{relatedPost.title}</h3>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${relatedPost.id}`}>Đọc thêm</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <Card className="mt-12 bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/logo.webp"
                  alt="ScαrletBlood Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Sẵn sàng hiến máu cứu người?</h3>
              <p className="text-red-100 mb-4">
                Sau khi đọc bài viết này, bạn đã sẵn sàng trở thành người hùng cứu sinh mạng chưa?
              </p>
              <Button variant="secondary" className="w-full sm:w-auto" asChild>
                <Link href="/donate">Đăng ký hiến máu ngay</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
