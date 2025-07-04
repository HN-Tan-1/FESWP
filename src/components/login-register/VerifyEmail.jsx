import React, { useState } from 'react';
import { Send } from 'lucide-react';
import './VerifyEmail.css';
import axios from 'axios';

const VerifyEmail = ({ email, onBack, onNext, type = 'reset' }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next && next.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev && prev.focus();
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const code = otp.join('');

  if (code.length !== 6) {
    alert('Mã xác thực phải đủ 6 chữ số.');
    return;
  }

  try {
    await axios.post('http://localhost:8080/api/auth/verify-code', { email, code });

    if (type === 'reset') {
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('resetCode', code);
      if (onNext) onNext(code);
    } else {
      // 👉 Đăng ký: xác thực thành công thì về trang login
      alert("✅ Tài khoản đã được kích hoạt! Vui lòng đăng nhập.");
      if (onNext) onNext(); // nếu có truyền onNext từ Register thì gọi
      else window.location.href = '/login';
    }
  } catch (err) {
    const msg = err.response?.data;
    alert("Xác thực thất bại: " + (typeof msg === 'string' ? msg : msg?.message || 'Lỗi máy chủ'));
  }
};

  const handleResendCode = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/resend-code', {
        email,
        type: type === 'reset' ? 'reset-password' : 'register'
      });
      alert('✅ Mã xác thực đã được gửi lại.');
    } catch (err) {
      alert('❌ Không thể gửi lại mã: ' + (err.response?.data || 'Lỗi máy chủ'));
    }
  };

  return (
    <div className="verify-form-web">
      <h2 className="title-email">Xác thực email</h2>
      <p className="subtitle">
        Chúng tôi đã gửi mã xác thực 6 chữ số đến<br />
        <span className="email">{email}</span>
      </p>

      <form onSubmit={handleSubmit}>
        <label className="input-label">Nhập mã xác thực</label>
        <div className="otp-inputs">
          {otp.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              required
            />
          ))}
        </div>

        <button type="submit" className="btn-verify">✓ Xác thực tài khoản</button>

        <div className="resend-group">
          <p className="resend-question">Không nhận được mã xác thực?</p>
          <button type="button" className="resend-button" onClick={handleResendCode}>
            <Send size={16} className="resend-icon" />
            Gửi lại mã xác thực
          </button>
        </div>

        <div className="back-button">
          <button type="button" onClick={onBack}>← Quay lại quên mật khẩu</button>
        </div>
      </form>
    </div>
  );
};

export default VerifyEmail;