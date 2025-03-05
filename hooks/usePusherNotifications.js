import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Pusher from "pusher-js";
import AsyncStorage from '@react-native-async-storage/async-storage';


const getData = async (key) => {
  try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
  } catch (e) {
      console.error("Error retrieving data", e);
  }
};


// إعداد إشعارات Expo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const usePusherNotifications = () => {
  useEffect(() => {

    const user = getData('auth');
    console.log('pusher', user)
    // تهيئة Pusher
    const pusher = new Pusher("bf44387807be40582ca2", {
      cluster: "ap3",
      encrypted: true,
    });

    // الاشتراك في القناة
    const channel = pusher.subscribe(`private-App.Models.User.4`); // غير "my-channel" إلى القناة الصحيحة

    // الاستماع للأحداث القادمة من Laravel
    channel.bind("get-current-notification", (data) => {
      console.log("📩 إشعار جديد:", data);
      sendPushNotification(data.title, data.message);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);


















  // دالة إرسال الإشعار داخل التطبيق
  const sendPushNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // يُعرض الإشعار فورًا
    });
  };
};

export default usePusherNotifications;
