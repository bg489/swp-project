import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Heart, Users, Shield, Clock, AlertTriangle, CheckCircle, Phone, Mail, MapPin } from "lucide-react"

const qnaData = [
  {
    id: "1",
    question: "Ai có thể tham gia hiến máu?",
    answer: `
      • Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu của mình để cứu chữa người bệnh.
      • Cân nặng ít nhất là 45kg đối với phụ nữ, nam giới. Lượng máu hiến mỗi lần không quá 9ml/kg cân nặng và không quá 500ml mỗi lần.
      • Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác.
      • Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ.
      • Có giấy tờ tùy thân.
    `,
    icon: Users,
    category: "Điều kiện hiến máu",
  },
  {
    id: "2",
    question: "Ai là người không nên hiến máu?",
    answer: `
      • Người đã nhiễm hoặc đã thực hiện hành vi có nguy cơ nhiễm HIV, viêm gan B, viêm gan C, và các virus lây qua đường truyền máu.
      • Người có các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày…
    `,
    icon: AlertTriangle,
    category: "Điều kiện hiến máu",
  },
  {
    id: "3",
    question: "Máu của tôi sẽ được làm những xét nghiệm gì?",
    answer: `
      • Tất cả những đơn vị máu thu được sẽ được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét.
      • Bạn sẽ được thông báo kết quả, được giữ kín và được tư vấn (miễn phí) khi phát hiện ra các bệnh nhiễm trùng nói trên.
    `,
    icon: Shield,
    category: "Xét nghiệm",
  },
  {
    id: "4",
    question: "Máu gồm những thành phần và chức năng gì?",
    answer: `
      Máu là một chất lỏng lưu thông trong các mạch máu của cơ thể, gồm nhiều thành phần, mỗi thành phần làm nhiệm vụ khác nhau:
      • Hồng cầu làm nhiệm vụ chính là vận chuyển oxy.
      • Bạch cầu làm nhiệm vụ bảo vệ cơ thể.
      • Tiểu cầu tham gia vào quá trình đông cầm máu.
      • Huyết tương: gồm nhiều thành phần khác nhau: kháng thể, các yếu tố đông máu, các chất dinh dưỡng...
    `,
    icon: Heart,
    category: "Kiến thức cơ bản",
  },
  {
    id: "5",
    question: "Tại sao lại có nhiều người cần phải được truyền máu?",
    answer: `
      Mỗi giờ có hàng trăm người bệnh cần phải được truyền máu vì:
      • Bị mất máu do chấn thương, tai nạn, thảm hoạ, xuất huyết tiêu hoá...
      • Do bị các bệnh gây thiếu máu, chảy máu: ung thư máu, suy tuỷ xương, máu khó đông...
      • Các phương pháp điều trị hiện đại cần truyền nhiều máu: phẫu thuật tim mạch, ghép tạng...
    `,
    icon: AlertTriangle,
    category: "Nhu cầu máu",
  },
  {
    id: "6",
    question: "Nhu cầu máu điều trị ở nước ta hiện nay?",
    answer: `
      • Mỗi năm nước ta cần khoảng 1.800.000 đơn vị máu điều trị.
      • Máu cần cho điều trị hằng ngày, cho cấp cứu, cho dự phòng các thảm họa, tai nạn cần truyền máu với số lượng lớn.
      • Hiện tại chúng ta đã đáp ứng được khoảng 54% nhu cầu máu cho điều trị.
    `,
    icon: Heart,
    category: "Nhu cầu máu",
  },
  {
    id: "7",
    question: "Tại sao khi tham gia hiến máu lại cần phải có giấy CMND?",
    answer: `
      Mỗi đơn vị máu đều phải có hồ sơ, trong đó có các thông tin về người hiến máu. Theo quy định, đây là một thủ tục cần thiết trong quy trình hiến máu để đảm bảo tính xác thực thông tin về người hiến máu.
    `,
    icon: Shield,
    category: "Thủ tục",
  },
  {
    id: "8",
    question: "Hiến máu nhân đạo có hại đến sức khoẻ không?",
    answer: `
      Hiến máu theo hướng dẫn của thầy thuốc không có hại cho sức khỏe. Điều đó đã được chứng minh bằng các cơ sở khoa học và cơ sở thực tế:

      Cơ sở khoa học:
      • Máu có nhiều thành phần, mỗi thành phần chỉ có đời sống nhất định và luôn luôn được đổi mới hằng ngày. Ví dụ: Hồng cầu sống được 120 ngày, huyết tương thường xuyên được thay thế và đổi mới.
      • Nhiều công trình nghiên cứu đã chứng minh rằng, sau khi hiến máu, các chỉ số máu có thay đổi chút ít nhưng vẫn nằm trong giới hạn sinh lý bình thường không hề gây ảnh hưởng đến các hoạt động thường ngày của cơ thể.

      Cơ sở thực tế:
      • Thực tế đã có hàng triệu người hiến máu nhiều lần mà sức khỏe vẫn hoàn toàn tốt. Trên thế giới có người hiến máu trên 400 lần. Ở Việt Nam, người hiến máu nhiều lần nhất đã hiến gần 100 lần, sức khỏe hoàn toàn tốt.
      • Như vậy, mỗi người nếu thấy sức khoẻ tốt, không có các bệnh lây nhiễm qua đường truyền máu, đạt tiêu chuẩn hiến máu thì có thể hiến máu từ 3-4 lần trong một năm, vừa không ảnh hưởng xấu đến sức khoẻ của bản thân, vừa đảm bảo máu có chất lượng tốt, an toàn cho người bệnh.
    `,
    icon: CheckCircle,
    category: "An toàn sức khỏe",
  },
  {
    id: "9",
    question: "Quyền lợi đối với người hiến máu tình nguyện?",
    answer: `
      Quyền lợi và chế độ đối với người hiến máu tình nguyện theo Thông tư số 05/2017/TT-BYT:
      • Được khám và tư vấn sức khỏe miễn phí.
      • Được kiểm tra và thông báo kết quả các xét nghiệm máu (hoàn toàn bí mật): nhóm máu, HIV, virut viêm gan B, virut viêm gan C, giang mai, sốt rét.
      • Được bồi dưỡng và chăm sóc theo các quy định hiện hành:
        + Phục vụ ăn nhẹ tại chỗ: tương đương 30.000 đồng.
        + Hỗ trợ chi phí đi lại (bằng tiền mặt): 50.000 đồng.
        + Lựa chọn nhận quà tặng bằng hiện vật có giá trị như sau:
          - Một đơn vị máu thể tích 250 ml: 100.000 đồng.
          - Một đơn vị máu thể tích 350 ml: 150.000 đồng.
          - Một đơn vị máu thể tích 450 ml: 180.000 đồng.
        + Được cấp giấy chứng nhận hiến máu tình nguyện của Ban chỉ đạo hiến máu nhân đạo Tỉnh, Thành phố.
    `,
    icon: Heart,
    category: "Quyền lợi",
  },
  {
    id: "10",
    question: "Khi hiến máu có thể bị nhiễm bệnh không?",
    answer: `
      Kim dây lấy máu vô trùng, chỉ sử dụng một lần cho một người, vì vậy không thể lây bệnh cho người hiến máu.
    `,
    icon: Shield,
    category: "An toàn",
  },
  {
    id: "11",
    question: "Ngày mai tôi sẽ hiến máu, tôi nên chuẩn bị như thế nào?",
    answer: `
      • Tối nay bạn không nên thức quá khuya (ngủ trước 23:00).
      • Nên ăn và không uống rượu, bia trước khi hiến máu.
      • Mang giấy CMND, đủ giấy tờ tùy thân và thẻ hiến máu(nếu có) khi đi hiến máu.
    `,
    icon: CheckCircle,
    category: "Chuẩn bị",
  },
  {
    id: "12",
    question: "Những trường hợp nào cần phải trì hoãn hiến máu?",
    answer: `
      Những người phải trì hoãn hiến máu trong 12 tháng kể từ thời điểm:
      • Phục hồi hoàn toàn sau các can thiệp ngoại khoa.
      • Khỏi bệnh sau khi mắc một trong các bệnh sốt rét, giang mai, lao, uốn ván, viêm não, viêm màng não.
      • Kết thúc đợt tiêm vắc xin phòng bệnh dại sau khi bị động vật cắn hoặc tiêm, truyền máu, chế phẩm máu và các chế phẩm sinh học nguồn gốc từ máu.
      • Sinh con hoặc chấm dứt thai nghén.

      Những người phải trì hoãn hiến máu trong 06 tháng kể từ thời điểm:
      • Xăm trổ trên da.
      • Bấm dái tai, bấm mũi, bấm rốn hoặc các vị trí khác của cơ thể.
      • Phơi nhiễm với máu và dịch cơ thể từ người có nguy cơ hoặc đã nhiễm các bệnh lây truyền qua đường máu.
      • Khỏi bệnh sau khi mắc một trong các bệnh thương hàn, nhiễm trùng huyết, bị rắn cắn, viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tuỷ xương, viêm tụy.

      Những người phải trì hoãn hiến máu trong 04 tuần kể từ thời điểm:
      • Khỏi bệnh sau khi mắc một trong các bệnh viêm dạ dày ruột, viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, rubella, tả, quai bị.
      • Kết thúc đợt tiêm vắc xin phòng rubella, sởi, thương hàn, tả, quai bị, thủy đậu, BCG.

      Những người phải trì hoãn hiến máu trong 07 ngày kể từ thời điểm:
      • Khỏi bệnh sau khi mắc một trong các bệnh cúm, cảm lạnh, dị ứng mũi họng, viêm họng, đau nửa đầu Migraine.
      • Tiêm các loại vắc xin, trừ các loại đã được quy định tại Điểm c Khoản 1 và Điểm b Khoản 3 Điều này.
    `,
    icon: Clock,
    category: "Trì hoãn hiến máu",
  },
  {
    id: "13",
    question: "Tôi có thể hiến máu sau khi tiêm vắc xin Covid-19 không?",
    answer: `
      Khi tiêm vắc xin ngừa Covid-19, có thể tham gia hiến máu sau: 7 NGÀY, để đảm bảo bạn không bị tác dụng phụ và đảm bảo đủ sức khỏe vào ngày hiến máu.
    `,
    icon: Shield,
    category: "COVID-19",
  },
  {
    id: "14",
    question: "Tôi bị nhiễm Covid-19. Tôi có thể hiến máu sau khi hồi phục không?",
    answer: `
      Khi mắc bệnh Covid-19, có thể tham gia hiến máu sau: 14 ngày kể từ thời điểm có kết quả khẳng định "ÂM TÍNH" với virus SarS-CoV-2.
    `,
    icon: Shield,
    category: "COVID-19",
  },
  {
    id: "15",
    question: "Khi phát hiện bất thường, cảm thấy không an toàn với túi máu vừa hiến",
    answer: `
      Sau khi tham gia hiến máu, nếu phát hiện có bất cứ điều gì khiến bạn cảm thấy không an toàn với túi máu vừa hiến (chợt nhớ ra 1 hành vi nguy cơ, có sử dụng loại thuốc nào đó mà bạn quên báo bác sĩ khi thăm khám, có xét nghiệm "DƯƠNG TÍNH" với SarS-CoV-2 bằng kỹ thuật test nhanh hoặc Real time RT-PCR,...) vui lòng báo lại cho đơn vị tiếp nhận túi máu nơi mà bạn đã tham gia hiến.
    `,
    icon: AlertTriangle,
    category: "Sau hiến máu",
  },
  {
    id: "16",
    question: "Cảm thấy không khỏe sau khi hiến máu?",
    answer: `
      Sau khi hiến máu, nếu có các triệu chứng chóng mặt, mệt mỏi, buồn nôn,... hãy liên hệ ngay cho đơn vị tiếp nhận máu để được hỗ trợ về mặt y khoa.
    `,
    icon: AlertTriangle,
    category: "Sau hiến máu",
  },
  {
    id: "17",
    question: "Có dấu hiệu sưng, phù nơi vết chích?",
    answer: `
      Sau khi hiến máu, nếu bạn có các dấu hiệu sưng, phù nơi vết chích. Xin đừng quá lo lắng, hãy chườm lạnh ngay vị trí sưng đó và theo dõi các dấu hiệu trên, nếu không giảm sau 24 giờ hãy liên hệ lại cho đơn vị tiếp nhận máu để được hỗ trợ.
    `,
    icon: AlertTriangle,
    category: "Sau hiến máu",
  },
]

const categories = [
  "Tất cả",
  "Điều kiện hiến máu",
  "Xét nghiệm",
  "Kiến thức cơ bản",
  "Nhu cầu máu",
  "Thủ tục",
  "An toàn sức khỏe",
  "Quyền lợi",
  "An toàn",
  "Chuẩn bị",
  "Trì hoãn hiến máu",
  "COVID-19",
  "Sau hiến máu",
]

export default function QnAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-6">
            Hỏi đáp về hiến máu
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tìm hiểu tất cả thông tin cần thiết về hiến máu nhân đạo. Những câu hỏi thường gặp và câu trả lời chi tiết
            từ các chuyên gia y tế.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Stats */}
                <Card className="bg-white/80 backdrop-blur-sm border-red-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-red-700">Thống kê nhanh</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Câu hỏi</p>
                        <p className="font-semibold text-gray-900">{qnaData.length} câu hỏi</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nhu cầu hàng năm</p>
                        <p className="font-semibold text-gray-900">1.8 triệu đơn vị</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Đáp ứng hiện tại</p>
                        <p className="font-semibold text-gray-900">54%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="bg-white/80 backdrop-blur-sm border-red-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-red-700">Liên hệ hỗ trợ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Hotline 24/7</p>
                        <p className="text-sm text-gray-600">1900 1234</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">support@scarletblood.vn</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Địa chỉ</p>
                        <p className="text-sm text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Q&A Content */}
            <div className="lg:col-span-3">
              <Card className="bg-white/80 backdrop-blur-sm border-red-100">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    Câu hỏi thường gặp
                  </CardTitle>
                  <p className="text-gray-600">
                    Tìm hiểu thông tin chi tiết về quy trình hiến máu, điều kiện tham gia và các quyền lợi của người
                    hiến máu.
                  </p>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {qnaData.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="border border-red-100 rounded-lg px-4 bg-white/50"
                        >
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-start space-x-3 text-left">
                              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                <IconComponent className="w-4 h-4 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{item.question}</h3>
                                <span className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4">
                            <div className="ml-11 text-gray-700 leading-relaxed">
                              {item.answer.split("\n").map((line, index) => (
                                <div key={index} className="mb-2">
                                  {line.trim() && (
                                    <p className={line.trim().startsWith("•") ? "ml-4" : ""}>{line.trim()}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="mt-8 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-white" />
                  <h3 className="text-2xl font-bold mb-4">Sẵn sàng trở thành người hùng?</h3>
                  <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                    Mỗi lần hiến máu của bạn có thể cứu sống tới 3 người. Hãy tham gia cùng chúng tôi để mang lại hy
                    vọng cho những người cần máu.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/donate"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors duration-200"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Đăng ký hiến máu
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors duration-200"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Liên hệ tư vấn
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
