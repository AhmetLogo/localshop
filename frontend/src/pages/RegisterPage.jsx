import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/common/ErrorMessage";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await register(form);
      navigate(user.role === "SELLER" ? "/seller" : "/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
        <h1>Kayıt Ol</h1>

        {error && <ErrorMessage message={error} />}

        <label>
          Ad Soyad
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </label>

        <label>
          E-posta
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </label>

        <label>
          Şifre
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="off"
            minLength={6}
            required
          />
        </label>

        <label>
          Rol
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="CUSTOMER">Müşteri</option>
            <option value="SELLER">Satıcı</option>
          </select>
        </label>

        <button type="submit" className="btn btn--primary" disabled={isLoading}>
          {isLoading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
        </button>

        <p>
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </form>
    </div>
  );
}
