import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const ROLE_LABELS = { CUSTOMER: "Müşteri", SELLER: "Satıcı" };

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        LocalShop
      </Link>

      <nav className="navbar__links">
        <Link to="/">Ürünler</Link>

        {isAuthenticated && user.role === "CUSTOMER" && (
          <>
            <Link to="/cart">Sepet{itemCount > 0 ? ` (${itemCount})` : ""}</Link>
            <Link to="/orders">Siparişlerim</Link>
          </>
        )}

        {isAuthenticated && user.role === "SELLER" && <Link to="/seller">Satıcı Paneli</Link>}

        {isAuthenticated ? (
          <>
            <span className="navbar__user">
              {user.name} ({ROLE_LABELS[user.role] || user.role})
            </span>
            <button type="button" className="btn btn--link" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Giriş Yap</Link>
            <Link to="/register">Kayıt Ol</Link>
          </>
        )}
      </nav>
    </header>
  );
}
