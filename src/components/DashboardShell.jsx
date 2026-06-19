// DashboardShell now only renders the page content area (title/description/children).
export default function DashboardShell({ title, description, children }) {
  return (
    <section className="content-area">
      <div className="page-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

