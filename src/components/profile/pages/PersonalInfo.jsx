import React, { useState, useEffect } from 'react';
import '../pages/PersonalInfo.css';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const PersonalInfo = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    gender: null,
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    avatar: null,
    avatarUrl: '',


    specialty: '',
    experienceYears: '',
    education: '',
    certifications: '',
    consultationFee: '',
    description: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/auth/profileuser', {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });

        const data = res.data;

        setFormData(prev => ({
          ...prev,
          fullName: data.fullName || '',
          gender: data.gender,
          dateOfBirth: data.dateOfBirth || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          avatarUrl: data.avatarUrl || '',


          specialty: data.specialty || '',
          experienceYears: data.experienceYears || '',
          education: data.education || '',
          certifications: data.certifications || '',
          consultationFee: data.consultationFee || '',
          description: data.description || ''
        }));
      } catch (err) {
        console.error('❌ Lỗi khi lấy profile:', err.response?.data || err.message);
        alert('Không thể tải thông tin cá nhân!');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' ? value === 'true' : value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file,
        avatarUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('fullName', formData.fullName);
    submitData.append('gender', formData.gender);
    submitData.append('dateOfBirth', formData.dateOfBirth);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('address', formData.address);
    if (formData.avatar) {
      submitData.append('avatar', formData.avatar);
    }


    if (user?.role?.toLowerCase() === 'consultant') {
      submitData.append('specialty', formData.specialty);
      submitData.append('experienceYears', formData.experienceYears);
      submitData.append('education', formData.education);
      submitData.append('certifications', formData.certifications);
      submitData.append('consultationFee', formData.consultationFee);
      submitData.append('description', formData.description);
    }

    try {
      await axios.put('http://localhost:8080/api/auth/profileuser', submitData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = {
        ...user,
        name: formData.fullName,
        avatarUrl: formData.avatarUrl,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('✅ Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật:', err);
      alert('❌ Cập nhật thất bại!');
    }
  };

  if (loading) return <p>Đang tải thông tin...</p>;

  return (
    <div className="info-wrapper">
      <div className="info-header">
        <h2>Thông tin cá nhân</h2>
        <p>Cập nhật thông tin cá nhân của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="info-form">
        <div className="form-row">
          <div className="form-col">
            <label>Họ và tên đầy đủ</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} />
          </div>
          <div className="form-col">
            <label>Giới tính</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="true"
                  checked={formData.gender === true}
                  onChange={handleChange}
                /> Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="false"
                  checked={formData.gender === false}
                  onChange={handleChange}
                /> Nữ
              </label>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="form-col">
            <label>Số điện thoại</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label>Email</label>
            <input name="email" value={formData.email} readOnly />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label>Địa chỉ</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ của bạn"
            />
          </div>
        </div>


        {user?.role?.toLowerCase() === 'consultant' && (
          <>
            <div className="form-row">
              <div className="form-col">
                <label>Chuyên ngành</label>
                <input
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                />
              </div>
              <div className="form-col">
                <label>Kinh nghiệm (năm)</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label>Phí tư vấn</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                />
              </div>
              <div className="form-col">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label>Học vấn</label>
                <input
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>
              <div className="form-col">
                <label>Chứng chỉ</label>
                <input
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        <div className="form-row">
          <div className="form-col">
            <label>Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {formData.avatarUrl && (
              <div className="avatar-preview">
                <img src={formData.avatarUrl} alt="Avatar preview" />
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Cập nhật thông tin cá nhân</button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
