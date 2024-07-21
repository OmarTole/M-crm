
import React, { useState, useEffect } from 'react';

import './Notification.css';

const Notification = ({ duration, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <>
      {visible && (
        <div className="notification">
          <p>Форма успешно отправлена!</p>
        </div>
      )}
    </>
  );
};

export default Notification;
