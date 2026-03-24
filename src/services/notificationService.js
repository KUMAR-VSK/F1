export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const triggerNotification = (title, body) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else {
    requestNotificationPermission().then(granted => {
      if (granted) new Notification(title, { body });
    });
  }
};
