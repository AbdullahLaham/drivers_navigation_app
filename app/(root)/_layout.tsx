import { Stack } from "expo-router";
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect } from 'expo-router'
import enableRTL from "@/utils/rtlSetup";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Pusher from "pusher-js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { newNotification } from "@/redux/features/auth/authSlice";

Pusher.logToConsole = true;


const Layout = () => {
  console.log('hekko');
  const dispatch = useAppDispatch();
  const {currentUser: user} = useSelector((state) => state?.auth);
  // إعداد إشعارات Expo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

  useEffect(() => {

    // const user = getData('auth');
    // console.log('pusher', user)
    // تهيئة Pusher
    console.log('hellllllllllllo');
   
  }, []);


  try {
    const pusher = new Pusher("e555a04b01aa13290f85", {
      cluster: "ap3",
      encrypted: true,
      
      authEndpoint: "https://ajwan.mahmoudalbatran.com/broadcasting/auth", // Laravel API للمصادقة
        auth: {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`, // إرسال JWT Token للمصادقة
          },
        },
    });
    

    // الاشتراك في القناة
    const channel = pusher.subscribe(`private-App.Models.User.${user?.data?.user?.id || user?.data?.client?.id}`); // غير "my-channel" إلى القناة الصحيحة

    // الاستماع للأحداث القادمة من Laravel
    // channel.bind("Illuminate\Notifications\Events\BroadcastNotificationCreated", (data: any) => {
    //   console.log("📩 إشعار جديد:", data, 'new notification');
    //   sendPushNotification('data.title', 'data.message');
    // });

    channel.bind("Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", (event: any) => {
      // console.log("📩 إشعار جديد: oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo", event?.data);
      console.log(event?.data?.title, 'title');
      console.log(event?.data?.body, 'body');
      dispatch(newNotification());

      // استخراج البيانات المهمة من الحدث
      // const { title, body, icon, url } = event;

      sendPushNotification(event?.data?.title, event?.data?.body);
    });
  } catch(error) {
    console.log(error);
  }

  // channel.unbind_all();
  // channel.unsubscribe();



  // دالة إرسال الإشعار داخل التطبيق
    const sendPushNotification = async (title: any = 'hi', body: any = 'by') => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null, // يُعرض الإشعار فورًا
      });
    };
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ headerShown: false }} />
      {/* <Stack.Screen name="currentRide" options={{ headerShown: false }} /> */}
      <Stack.Screen name="currentRide/[orderId]" options={{ headerShown: false }} />
     
    </Stack>
  );
};

export default Layout;
