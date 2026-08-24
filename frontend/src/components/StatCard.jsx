export const StatCard = ({ title, value, color = 'primary', suffix = '' }) => (
  <div className="col-md-3 col-sm-6">
    <div className={`card stat-card border-start border-4 border-${color} h-100`}>
      <div className="card-body">
        <h6 className="card-title text-muted mb-1">{title}</h6>
        <h2 className="card-text mb-0 fw-bold">{value}{suffix}</h2>
      </div>
    </div>
  </div>
)
