import { Alert, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popNotification } from "../data/notificationSlice";

export default function Notification() {
  const [notification, setNotification] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useSelector(state => state.notification.notifications);
  const dispatch = useDispatch();

  function handleClose() {
    setIsOpen(false);
  }
  
  let timeout;
  useEffect(() => {
    if(notifications.length > 0) {
      const notify = notifications[0];
      setNotification(notify);
      setIsOpen(true);
      timeout = setTimeout(() => {
        setIsOpen(false);
        dispatch(popNotification());
      }, notify.duration + 500);
    }

    return () => clearTimeout(timeout);
  }, [notifications]);
  

  return (
    <>
        <Snackbar
          open={isOpen}
          onClose={handleClose}
          autoHideDuration={notification?.duration}
        >
          <Alert
            onClose={handleClose}
            severity={notification?.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notification?.content}
          </Alert>
        </Snackbar>
    </>
  );
}
