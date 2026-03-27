import { useNavigate } from "react-router-dom";

function PageHeader({ title, subtitle = "", showBack = true }) {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="topbar-left">
        {showBack && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
        )}

        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;