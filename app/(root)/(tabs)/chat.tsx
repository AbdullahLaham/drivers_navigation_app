import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import * as Notifications from "expo-notifications";
import Pusher from "pusher-js";
import { runPusher } from "../_layout";


const API_BASE = "https://ajwan.mahmoudalbatran.com/api";





Pusher.logToConsole = true;





const Chat = () => {
  const { currentUser: user } = useSelector((state) => state?.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [userId, setUserId] = useState(user?.data?.client?.id || user?.data?.user?.id)

  // 🔹 جلب المحادثة والرسائل عند تحميل الصفحة
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await axios.get(`${API_BASE}/conversations`, {
          headers: { Authorization: `Bearer ${user?.data?.token}` },
        });

        if (res?.data?.[0]?.id) {
          const conv = res.data[0];
          setConversation(conv);
          fetchMessages(conv.id);
        } else {
          const newConv = await axios.post(`${API_BASE}/AddConversation`, {}, {
            headers: { Authorization: `Bearer ${user?.data?.token}` },
          });

          if (newConv?.data?.[0]?.id) {
            setConversation(newConv.data[0]);
            fetchMessages(newConv.data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [user]);
  // 🔹 جلب الرسائل
  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(`${API_BASE}/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${user?.data?.token}` },
      });
      setMessages(res?.data?.messages?.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // 🔹 إرسال الرسالة
  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation?.id) return;

    try {
      const res = await axios.post(
        `${API_BASE}/messages`,
        {
          conversation_id: conversation.id,
          message: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${user?.data?.token}` },
        }
      );

      if (res?.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            body: newMessage,
            user_id: userId,
          },
        ]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // 🔹 الاستماع للرسائل الجديدة من `Pusher`

    try {
     const pusher = runPusher(user);
      // الاشتراك في القناة الخاصة بالمستخدم
      const channel = pusher.subscribe(`presence-Messenger.${userId}`);

      // استقبال الرسائل الجديدة من الحدث "new-message"
      channel.bind("new-message", (event) => {
        const newMessage = event?.message;
        console.log("📩 رسالة جديدة:", newMessage);

        if (newMessage?.conversation_id === conversation?.id) {
          setMessages((prev) => [...prev, newMessage]);
          sendPushNotification(newMessage?.user?.name, newMessage?.body);
        }
      });

      // return () => {
      //   pusher.unsubscribe(`presence-Messenger.${user?.data?.id}`);
      // };
    } catch (error) {
      console.log("Error initializing Pusher:", error);
    }

  // 🔹 دالة إرسال الإشعار عند استقبال رسالة جديدة
  const sendPushNotification = async (senderName, messageBody) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `رسالة جديدة من ${senderName}`,
        body: messageBody,
        sound: true,
      },
      trigger: null, // يُعرض الإشعار فورًا
    });
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* العنوان */}
      <View className="bg-gray-800 p-4">
        <Text className="text-white text-center text-lg font-bold">
          {conversation?.id}المحادثة {conversation?.participants?.[0]?.name || ""}
        </Text>
      </View>

      {/* قائمة الرسائل باستخدام FlatList */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            className={`mb-3 p-3 rounded-lg max-w-[75%] ${
              item.user_id == userId ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
            }`}
          >
            <Text className="text-white">{item?.body}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* إدخال رسالة جديدة */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View className="flex-row items-center bg-gray-800 p-3 mb-[6rem]">
          <TextInput
            className="flex-1 bg-gray-700 text-white p-3 rounded-lg mr-2"
            placeholder="اكتب رسالة..."
            placeholderTextColor="#bbb"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity onPress={sendMessage} className="bg-blue-500 p-3 rounded-lg">
            <Text className="text-white font-bold">إرسال</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;
