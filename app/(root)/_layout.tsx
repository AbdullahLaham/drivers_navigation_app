import { Stack } from "expo-router";
import { Image, StyleSheet, Text, View } from 'react-native'
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





export const runPusher =  (user: any) => {
   const pusher = new Pusher("e555a04b01aa13290f85", {
    cluster: "ap3",
    encrypted: true,
    
    authEndpoint: "https://ajwan.mahmoudalbatran.com/broadcasting/auth", 
      auth: {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`, // إرسال JWT Token للمصادقة
        },
      },
  });
  return pusher;
}


const Layout = () => {
  console.log('hekko');
  const dispatch = useAppDispatch();
  const {currentUser: user, error, isError} = useSelector((state: any) => state?.auth);  // إعداد إشعارات Expo

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


  // try {
  //   const pusher = runPusher(user);
  //   // الاشتراك في القناة
  //   const channel = pusher.subscribe(`private-App.Models.User.${user?.data?.user?.id || user?.data?.client?.id}`); // غير "my-channel" إلى القناة الصحيحة

  //   // الاستماع للأحداث القادمة من Laravel
  //   // channel.bind("Illuminate\Notifications\Events\BroadcastNotificationCreated", (data: any) => {
  //   //   console.log("📩 إشعار جديد:", data, 'new notification');
  //   //   sendPushNotification('data.title', 'data.message');
  //   // });

  //   channel.bind("Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", (event: any) => {
  //     // console.log("📩 إشعار جديد: oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo", event?.data);
  //     console.log(event?.data?.title, 'title');
  //     console.log(event?.data?.body, 'body');
  //     dispatch(newNotification());

  //     // استخراج البيانات المهمة من الحدث
  //     // const { title, body, icon, url } = event;

  //     sendPushNotification(event?.data?.title, event?.data?.body);
  //   });
  // } catch(error) {
  //   console.log(error);
  // }

  // channel.unbind_all();
  // channel.unsubscribe();




  useEffect(() => {
    const pusher = runPusher(user);
    const channel = pusher.subscribe(`private-App.Models.User.${user?.data?.user?.id || user?.data?.client?.id}`);
  
    channel.bind("Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", (event: any) => {
      console.log(event?.data?.title, 'title');
      console.log(event?.data?.body, 'body');
      dispatch(newNotification());
      sendPushNotification(event?.data?.title, event?.data?.body);
    });
  
    // // Cleanup the subscription when the component is unmounted or when the user changes
    return () => {
      channel.unbind_all();
      // channel.unsubscribe();
    };
  }, [user]);

  


  // دالة إرسال الإشعار داخل التطبيق
    const sendPushNotification = async (title: any = 'hi', body: any = 'by') => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: {image: 'https://your-image-url.com/image.jpg' }
        },
        trigger: null, // يُعرض الإشعار فورًا
      });
      // Listen for received notifications and display images
    Notifications.addNotificationReceivedListener((notification) => {
      const imageUrl = notification.request.content.data?.image;
      console.log('Notification received with image:', imageUrl);
      
      if (imageUrl) {
        return <Image source={{ uri: imageUrl }} style={{ width: 300, height: 200 }} />;
      }
    });
    };
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ headerShown: false }} />
      {/* <Stack.Screen name="currentRide" options={{ headerShown: false }} /> */}
      <Stack.Screen name="currentRide/[orderId]" options={{ headerShown: false }} />
      <Stack.Screen name="currentConversation/[conversationId]" options={{ headerShown: false }} />
     
    </Stack>
  );
};

export default Layout;
