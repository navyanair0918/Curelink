import React, { useEffect, useState } from "react";
import API from "../services/api";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    API.get(`/notifications/${userId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map(note => (
        <div key={note._id} className="card">
          <p>{note.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
