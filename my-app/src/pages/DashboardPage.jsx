import Dashboard from "../components/Dashboard";
import Notifications from "../components/Notifications";

const DashboardPage = () => {
  // TEMP userId (replace later with logged-in user)
  const userId = "USER_ID_FROM_MONGODB";

  return (
    <div className="dashboard-page">
      <header className="dl-header">
        <div>
          <h1>Welcome Back</h1>
          <p className="muted">Here's your timeline and recent activity</p>
        </div>
        <div className="dl-actions">
          <button className="btn-primary">New Appointment</button>
        </div>
      </header>

      <div className="dl-grid">
        <main className="dl-main">
          <Dashboard userId={userId} />
        </main>
        <aside className="dl-aside">
          <Notifications userId={userId} />
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
