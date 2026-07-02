const authenticate = async (email: string, password: string): Promise<void> => {
  return chrome.runtime.sendMessage({
    action: "authenticate",
    data: {
      email,
      password,
    },
  });
};

const sendNotification = async (
  recipient: string,
  displayName: string,
  notifications: {
    label: string;
    desc: string;
    created: number;
    type: "todo" | "weather";
  }[],
): Promise<void> => {
  return chrome.runtime.sendMessage({
    action: "send_notification",
    data: {
      recipient,
      displayName,
      notifications,
    },
  });
};

export { authenticate, sendNotification };
