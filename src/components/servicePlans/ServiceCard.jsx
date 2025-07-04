import {
  Calendar,
  ShieldCheck,
  TestTube,
  Microscope,
  User,
  Brain,
  CheckCircle
} from 'lucide-react';

const iconMap = {
  TestTube: <TestTube className="service-icon" />,
  Microscope: <Microscope className="service-icon" />,
  User: <User className="service-icon" />,
  ShieldCheck: <ShieldCheck className="service-icon" />,
  Calendar: <Calendar className="service-icon" />,
  Brain: <Brain className="service-icon" />
};

// Chuẩn hóa tên icon từ API (VD: test-tube → TestTube)
const normalizeIcon = (icon) => {
  if (!icon) return <ShieldCheck className="service-icon" />;
  const key = icon.replace(/[-_]/g, '').toLowerCase();
  const matchedKey = Object.keys(iconMap).find(k => k.toLowerCase() === key);
  return iconMap[matchedKey] ?? <ShieldCheck className="service-icon" />;
};

const ServiceCard = ({ data, viewMode }) => {
  const priceDisplay = data.price === 0
    ? 'Miễn phí'
    : `${data.price.toLocaleString()}đ`;

  const oldPriceDisplay =
    data.oldPrice && data.oldPrice > data.price
      ? `${data.oldPrice.toLocaleString()}đ`
      : null;

  return (
    <div className={`service-card ${viewMode}`}>
      <div className="service-icon-wrapper">
        {normalizeIcon(data.icon)}
      </div>

      <div className="service-content">
        {/* Tiêu đề */}
        <div className="service-header">
          <h3>{data.title || data.name || 'Không có tiêu đề'}</h3>
        </div>

        {/* Mô tả ngắn */}
        <p className="service-description">
          {data.description || 'Không có mô tả.'}
        </p>

        {/* Danh sách tính năng (nếu có) */}
        {Array.isArray(data.features) && data.features.length > 0 && (
          <ul className="features">
            {data.features.map((feature, i) => (
              <li key={i}>
                <CheckCircle size={14} style={{ marginRight: '6px' }} />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Giá tiền + nút đặt lịch */}
        <div className="service-footer">
          <div className="price">
            {oldPriceDisplay && (
              <span className="old-price">{oldPriceDisplay}</span>
            )}
            <span className="current-price">{priceDisplay}</span>
          </div>

          <button className="book-btn">
            <Calendar size={16} style={{ marginRight: '6px' }} /> Đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;