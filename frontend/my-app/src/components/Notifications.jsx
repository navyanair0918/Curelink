import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/dashboard.css";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    API.get(`/notifications/${userId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <aside className="notifications-panel">
      <div className="panel-head">
        <h3>Notifications</h3>
        <p className="muted">Latest alerts</p>
      </div>
      <div className="notes">
        {notifications.length === 0 && <div className="empty">No notifications</div>}
        {notifications.map(note => (
          <div key={note._id} className="note">
            <p>{note.message}</p>
            <div className="note-meta">{note.date}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Notifications;
