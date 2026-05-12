'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Testimonial.module.css';

type TestimonialData = {
  id: number;
  name: string;
  address: string;
  content: string;
  avatar: string;
  productImage?: string;
};

const testimonials: TestimonialData[] = [
  {
    id: 1,
    name: 'HẢI NGUYỄN NGÔ TRƯỜNG',
    address: '315 Lê Văn Sỹ, Phường Nhiêu Lộc, Hồ Chí Minh',
    content: 'Tiệm kính sạch sẽ, nhân viên tư vấn chuyên nghiệp, nhiệt tình, KTV đo mắt kỹ. Chất lượng kính OK, có thương hiệu rõ ràng.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png', // Khách hàng đính kèm ảnh sản phẩm
  },
  {
    id: 2,
    name: 'TRẦN THỊ HƯƠNG',
    address: 'Quận Cầu Giấy, Hà Nội',
    content: 'Kính rất đẹp và chất lượng. Dịch vụ chăm sóc khách hàng cực kỳ chu đáo và tận tâm. Sẽ quay lại ủng hộ shop nhiều lần nữa!',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  },
  {
    id: 3,
    name: 'LÊ VĂN MINH',
    address: 'Hải Châu, Đà Nẵng',
    content: 'Đa dạng mẫu mã, giá cả hợp lý so với chất lượng. Rất ưng ý với chiếc gọng kính mới mua tại đây. Mọi người nên thử nhé.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png',
  },
  {
    id: 4,
    name: 'NGUYỄN THỊ MAI',
    address: 'Quận 1, Hồ Chí Minh',
    content: 'Mắt kính cắt rất chuẩn độ, đeo vào không bị choáng như mấy chỗ cũ mình hay làm. Gọng kính mạ vàng rất sang trọng.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  },
  {
    id: 5,
    name: 'PHẠM HOÀNG LONG',
    address: 'Thành phố Thủ Đức',
    content: 'Không gian tiệm xịn xò, mùi hương dễ chịu. Mình được đo mắt bằng máy móc hiện đại nhất từ trước đến giờ.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png',
  },
  {
    id: 6,
    name: 'VŨ THỊ LAN ANH',
    address: 'Quận Đống Đa, Hà Nội',
    content: 'Lần đầu tiên mình thấy một cửa hàng kính có dịch vụ hậu mãi tốt như vậy. Vệ sinh và nắn gọng miễn phí trọn đời.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  },
  {
    id: 7,
    name: 'ĐINH QUANG TIẾN',
    address: 'Ninh Kiều, Cần Thơ',
    content: 'Giao hàng cực kỳ nhanh, đóng gói cẩn thận. Mình đặt online mà nhận hàng ưng ý không khác gì ra tiệm thử.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png',
  },
  {
    id: 8,
    name: 'BÙI THU TRANG',
    address: 'Thành phố Huế',
    content: 'Chuyên viên tư vấn chọn gọng rất hợp với khuôn mặt tròn của mình. Cảm ơn Andu đã giúp mình tự tin hơn nhiều.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  },
  {
    id: 9,
    name: 'TRỊNH VĂN THÀNH',
    address: 'Quận 7, Hồ Chí Minh',
    content: 'Mua kính râm ở đây để đi du lịch, chống chói rất tốt. Chụp ảnh lên nhìn cực kỳ ngầu, ai cũng hỏi mua ở đâu.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png',
  },
  {
    id: 10,
    name: 'ĐỖ THUẬN PHONG',
    address: 'Quận Hoàn Kiếm, Hà Nội',
    content: 'Chất liệu gọng titan nhẹ tênh, đeo cả ngày dài làm việc máy tính mà không hề thấy mỏi sống mũi hay đau vành tai.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  },
  {
    id: 11,
    name: 'LÝ THỊ HỒNG',
    address: 'Thành phố Đà Lạt',
    content: 'Tròng kính đổi màu hoạt động rất nhạy. Ra nắng chuyển màu ngay lập tức, bảo vệ mắt cực kỳ tốt. 10 điểm cho chất lượng.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png',
  },
  {
    id: 12,
    name: 'NGÔ KIẾN HUY',
    address: 'Quận 3, Hồ Chí Minh',
    content: 'Bộ sưu tập kính ở đây toàn hàng chính hãng, đầy đủ thẻ bảo hành và tem mác. Rất an tâm khi mua sắm tại Andu.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  },
  {
    id: 13,
    name: 'PHAN BẢO NGỌC',
    address: 'Thành phố Nha Trang',
    content: 'Giá thành đi đôi với chất lượng. Lúc đầu thấy hơi cao nhưng nhận hàng và sử dụng thì thấy cực kỳ xứng đáng với số tiền bỏ ra.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png',
  },
  {
    id: 14,
    name: 'HỒ QUỐC ANH',
    address: 'Quận Bình Thạnh, TP.HCM',
    content: 'Gọng nhựa acetate lên màu rất đẹp, đánh bóng thủ công sắc sảo. Mình là một người kỹ tính nhưng cũng phải gật gù khen ngợi.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  },
  {
    id: 15,
    name: 'TRƯƠNG QUỲNH NHƯ',
    address: 'Thành phố Vũng Tàu',
    content: 'Được tặng kèm hộp da đựng kính và nước lau kính chuyên dụng rất cao cấp. Packaging đúng chuẩn đồ hiệu.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png',
  },
  {
    id: 16,
    name: 'DƯƠNG TUẤN KIỆT',
    address: 'Quận Thanh Xuân, Hà Nội',
    content: 'Kính râm phân cực (Polarized) chạy xe máy buổi trưa không bị lóa mắt chút nào. Đáng đồng tiền bát gạo.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  },
  {
    id: 17,
    name: 'LƯƠNG BÍCH HỮU',
    address: 'Biên Hòa, Đồng Nai',
    content: 'Đội ngũ CSKH trả lời tin nhắn Fanpage siêu nhanh. Tư vấn nhiệt tình dù lúc đó là 10h tối. Thái độ tuyệt vời!',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png',
  },
  {
    id: 18,
    name: 'VƯƠNG ĐÌNH PHÚC',
    address: 'Quận 10, Hồ Chí Minh',
    content: 'Bác sĩ đo mắt giải thích kỹ về tình trạng loạn thị của mình và tư vấn dùng tròng chiết suất cao để kính mỏng và nhẹ hơn.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  },
  {
    id: 19,
    name: 'TẠ MINH TÂM',
    address: 'Thành phố Vinh, Nghệ An',
    content: 'Cửa hàng thiết kế theo phong cách Minimalism rất sang. Trải nghiệm mua sắm không khác gì vào các store thời trang lớn.',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product1.png',
  },
  {
    id: 20,
    name: 'ĐOÀN BẢO CHÂU',
    address: 'Quận Hai Bà Trưng, Hà Nội',
    content: 'Kính mua tặng sinh nhật bố, ông cụ khen nức nở. Form dáng cổ điển nhưng rất tôn mặt. Cảm ơn Andu!',
    avatar: '/assets/avatar1.png',
    productImage: '/assets/product2.png',
  }
];

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000); // Auto slide mỗi 5s
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.leftCol}>
        <div className={styles.quoteIcon}>&ldquo;</div>
        <h2>KHÁCH HÀNG NÓI<br/>GÌ VỀ ANDU</h2>
      </div>

      <div className={styles.rightCol}>
        <div className={styles.feedbackBox}>
          <div className={styles.feedbackHeader}>
            <span className={styles.badge}>Cảm nghĩ của khách hàng</span>
            <div className={styles.controls}>
              <div className={styles.dots}>
                {testimonials.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                    onClick={() => handleDotClick(idx)}
                  />
                ))}
              </div>
              <div className={styles.arrows}>
                <button onClick={prevSlide}>&lsaquo;</button>
                <button onClick={nextSlide}>&rsaquo;</button>
              </div>
            </div>
          </div>

          <div className={styles.customerInfo}>
            <div className={styles.avatarWrapper}>
              <Image 
                src={currentTestimonial.avatar} 
                alt={currentTestimonial.name} 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className={styles.customerDetails}>
              <h3>{currentTestimonial.name}</h3>
              <p>{currentTestimonial.address}</p>
              <div className={styles.stars}>
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>

          <div className={styles.feedbackContent}>
            <p className={styles.feedbackText}>{currentTestimonial.content}</p>
            {currentTestimonial.productImage && (
              <div className={styles.feedbackImageWrapper}>
                <Image 
                  src={currentTestimonial.productImage} 
                  alt="Customer Feedback Photo" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
