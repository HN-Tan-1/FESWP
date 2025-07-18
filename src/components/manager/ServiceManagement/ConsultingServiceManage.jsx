import { useEffect, useState } from "react";
import axios from "axios";
import "./ConsultingServiceManage.css";
import ConsultingServiceDetailModal from "./ConsultingServiceDetailModal";
import AddConsultingServiceModal from "./AddConsultingServiceModal";

const ConsultingServiceManage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 3;

  const getToken = () => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    try {
      return stored ? JSON.parse(stored).token : null;
    } catch {
      return null;
    }
  };

  const fetchServices = () => {
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/api/prices", {
        params: { type: "advice" },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setServices(res.data))
      .catch((err) => console.error("❌ Lỗi tải dịch vụ:", err));
  };

  const fetchCategories = () => {
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("❌ Lỗi tải danh mục:", err));
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("❌ Token không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }
    fetchServices();
    fetchCategories();
  }, []);

  const getCategoryName = (id) => {
    const found = categories.find((cat) => cat.id === id);
    return found ? found.name : "-";
  };

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const visibleServices = services.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const formatCurrency = (number) =>
    typeof number === "number"
      ? number.toLocaleString("vi-VN") + " VNĐ"
      : "-";

  const handleView = (service) => {
    setSelectedId(service.id);
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="status-badge gray">-</span>;
    let lower = status.toLowerCase();
    let color = "gray";
    if (lower === "active" || lower === "đang áp dụng") color = "green";
    else if (lower === "inactive" || lower === "ngừng áp dụng") color = "red";
    else if (lower === "pending" || lower === "chờ duyệt") color = "yellow";
    return <span className={`status-badge ${color}`}>{status}</span>;
  };

  return (
    <div className="csm-container">
      <div className="csm-header">
        <h1 className="csm-title">Quản lý dịch vụ tư vấn</h1>
        <p className="csm-subtitle">
          Quản lý danh sách dịch vụ, giá tư vấn và trạng thái áp dụng
        </p>
        <button
          className="csm-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          Thêm dịch vụ mới
        </button>
      </div>

      <div className="csm-table-container">
        <h2>Danh sách dịch vụ tư vấn ({services.length})</h2>
        <table className="csm-table">
          <thead>
            <tr>
              <th>DỊCH VỤ</th>
              <th>DANH MỤC</th>
              <th>GIÁ</th>
              <th>MÔ TẢ</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {visibleServices.map((service, idx) => (
              <tr key={service.id || idx}>
                <td>
                  <strong>{service.name}</strong>
                  <div className="csm-meta">ID: {service.id}</div>
                </td>
                <td>
                  <span className="csm-badge gray">
                    {getCategoryName(service.categoryId)}
                  </span>
                </td>
                <td>{formatCurrency(service.price)}</td>
                <td className="csm-description">
                  <span className="csm-tooltip">
                    {service.description || "—"}
                    <span className="csm-tooltip-text">
                      {service.description || "—"}
                    </span>
                  </span>
                </td>
                <td>{getStatusBadge(service.status)}</td>
                <td>
                  <div className="csm-actions">
                    <button
                      className="csm-view-btn"
                      onClick={() => handleView(service)}
                    >
                      Xem
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="csm-pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              ‹ Trước
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={page === idx + 1 ? "active" : ""}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Sau ›
            </button>
          </div>
        )}
      </div>

      {selectedId && (
        <ConsultingServiceDetailModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onStatusUpdate={fetchServices}
        />
      )}

      {showAddModal && (
        <AddConsultingServiceModal
          onClose={() => setShowAddModal(false)}
          onAdded={fetchServices}
        />
      )}
    </div>
  );
};

export default ConsultingServiceManage;
