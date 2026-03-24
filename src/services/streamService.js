export const getDefaultStream = () => {
  return localStorage.getItem('defaultStream') || '';
};

export const setDefaultStream = (url) => {
  if (url) {
    localStorage.setItem('defaultStream', url);
  } else {
    localStorage.removeItem('defaultStream');
  }
};

export const getSessionStream = (sessionId) => {
  // Logic for picking stream depending on session type. For now, rely on default saved stream.
  return getDefaultStream();
};
