import Dashboard from "../components/Dashboard";
import Notifications from "../components/Notifications";

const DashboardPage = () => {
  // TEMP userId (replace later with logged-in user)
  const userId = "USER_ID_FROM_MONGODB";

  return (
    <>
      <Dashboard userId={userId} />
      <Notifications userId={userId} />
    </>
  );
};

export default DashboardPage;
