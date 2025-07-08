import React, { useState } from 'react';
import axios from 'axios';
import './BookingModal.css';

const BookingModal = ({ service, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    note: ''
  });

  const availableDates = [
    'Th 2, 07/07', 'Th 3, 08/07', 'Th 4, 09/07', 'Th 5, 10/07',
    'Th 6, 11/07', 'Th 7, 12/07', 'CN, 13/07',
    'Th 2, 14/07', 'Th 3, 15/07', 'Th 4, 16/07', 'Th 5, 17/07',
    'Th 6, 18/07', 'Th 7, 19/07', 'CN, 20/07'
  ];

  const availableTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00'
  ];

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmBooking = async () => {
    try {
      // Parse date & time to ISO
      const [_, dateString] = selectedDate.split(', ');
      const [day, month] = dateString.split('/').map(Number);
      const [hour, minute] = selectedTime.split(':').map(Number);
      const pad = (n) => n.toString().padStart(2, '0');
      const appointmentDate = `2025-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;

      const bookingPayload = {
        serviceId: service.id,
        appointmentDate,
        name: contactInfo.name,
        phone: contactInfo.phone,
        email: contactInfo.email,
        note: contactInfo.note
      };
      console.log("📦 Payload gửi:", bookingPayload);

   const response = await axios.post(
  "http://localhost:8080/api/examinations/book",
  bookingPayload,
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);

      console.log("✅ Đặt lịch thành công:", response.data);

      // Sang bước thanh toán
      setStep(5);

      // Redirect sang VNPay nếu có paymentUrl
      if (response.data && response.data.paymentUrl) {
        setTimeout(() => {
          window.location.href = response.data.paymentUrl;
        }, 1500); // chờ 1.5s rồi chuyển
      }
    } catch (error) {
      console.error("❌ Lỗi khi đặt lịch:", error);
      alert("Đặt lịch thất bại: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="bm-modal-overlay">
      <div className="bm-modal-content">
        <h2>Đặt lịch dịch vụ y tế</h2>

        <div className="bm-modal-section">
          <h3>{service.title || service.name}</h3>
          <p>Giá: {service.price.toLocaleString()}đ</p>
          <p>Thời gian: 15 phút</p>
        </div>

        {step === 1 && (
          <>
            <h4>📅 Chọn ngày khám</h4>
            <div className="bm-options-grid">
              {availableDates.map((date, index) => (
                <button
                  key={index}
                  className={selectedDate === date ? 'bm-selected' : ''}
                  onClick={() => {
                    setSelectedDate(date);
                    setStep(2);
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h4>⏰ Chọn giờ khám</h4>
            <div className="bm-options-grid">
              {availableTimes.map((time, index) => (
                <button
                  key={index}
                  className={selectedTime === time ? 'bm-selected' : ''}
                  onClick={() => {
                    setSelectedTime(time);
                    setStep(3);
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h4>👤 Thông tin liên hệ</h4>
            <div className="bm-form-group">
              <label>Họ và tên *</label>
              <input type="text" name="name" value={contactInfo.name} onChange={handleContactChange} />
            </div>
            <div className="bm-form-group">
              <label>Số điện thoại *</label>
              <input type="text" name="phone" value={contactInfo.phone} onChange={handleContactChange} />
            </div>
            <div className="bm-form-group">
              <label>Email</label>
              <input type="email" name="email" value={contactInfo.email} onChange={handleContactChange} />
            </div>
            <div className="bm-form-group">
              <label>Ghi chú</label>
              <textarea name="note" value={contactInfo.note} onChange={handleContactChange} />
            </div>
            <button className="bm-next-btn" onClick={() => setStep(4)} disabled={!contactInfo.name || !contactInfo.phone}>
              Tiếp tục
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <h4>✅ Xác nhận thông tin</h4>
            <div className="bm-confirm-box">
              <p><strong>Dịch vụ:</strong> {service.title || service.name}</p>
              <p><strong>Giá:</strong> {service.price.toLocaleString()}đ</p>
              <p><strong>Ngày:</strong> {selectedDate}</p>
              <p><strong>Giờ:</strong> {selectedTime}</p>
              <p><strong>Họ tên:</strong> {contactInfo.name}</p>
              <p><strong>Điện thoại:</strong> {contactInfo.phone}</p>
              <p><strong>Email:</strong> {contactInfo.email}</p>
              <p><strong>Ghi chú:</strong> {contactInfo.note}</p>
            </div>
            <div className="bm-confirm-actions">
              <button className="bm-cancel-btn" onClick={onClose}>Huỷ</button>
              <button className="bm-confirm-btn" onClick={handleConfirmBooking}>Xác nhận</button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h4>💳 Đang chuyển sang thanh toán</h4>
            <p>Vui lòng chờ trong giây lát để thanh toán bằng mã QR VNPay...</p>
            <button className="bm-close-btn" onClick={onClose}>Đóng</button>
          </>
        )}

        <button className="bm-close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default BookingModal;