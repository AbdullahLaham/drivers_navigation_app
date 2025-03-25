import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Alert, Linking, ActivityIndicator, Image } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import * as Notifications from "expo-notifications";
import Pusher from "pusher-js";
import { runPusher } from "../_layout";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { icons } from "@/constants";


const API_BASE = "https://ajwan.mahmoudalbatran.com/api";


Pusher.logToConsole = true;





const Chat = () => {
    let i = 1;
    const { currentUser: user } = useSelector((state) => state?.auth);
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState("");
    const [conversation, setConversation] = useState(null);
    const [userId, setUserId] = useState(user?.data?.client?.id || user?.data?.user?.id)
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false)


    const { conversationId } = useLocalSearchParams();


    console.log('user?.data?.token', user?.data?.token, 'user?.data?.tokenuser?.data?.tokenuser?.data?.token')


    // 🔹 جلب الرسائل عند تحميل الصفحة
    useEffect(() => {
        const fetchConversationMessages = async () => {
            await fetchMessages(conversationId);
        };

        fetchConversationMessages();
    }, [user]);



    // 🔹 جلب الرسائل
    const fetchMessages = async (conversationId: any) => {
        setFetching(true)
        try {
            const res = await axios.get(`${API_BASE}/conversations/${conversationId}/messages`, {
                headers: { Authorization: `Bearer ${user?.data?.token}` },
            });
            setMessages(res?.data?.messages?.data || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setFetching(false);
        }
    };

    // 🔹 إرسال الرسالة
    const sendMessage = async () => {
        setLoading(true);
        if (!newMessage.trim() || !conversationId) return;

        try {
            const res = await axios.post(
                `${API_BASE}/messages`,
                {
                    conversation_id: conversationId,
                    message: newMessage,
                },
                {
                    headers: { Authorization: `Bearer ${user?.data?.token}` },
                }
            );

            if (res?.data) {
                setMessages((prev) => [
                    {
                        id: Date.now(),
                        body: newMessage,
                        user_id: userId,
                    },
                    ...prev
                ]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
        finally {
            setLoading(false);
        }
    };



    const renderMessage = ({ item }: { item: any }) => {
        if (item.type === "attachment") {
            return (
                <TouchableOpacity
                    className="mb-3 p-3 rounded-lg bg-gray-700 self-start flex-row items-center"
                    onPress={() => Linking.openURL(`${API_BASE}/${item.body.file_path}`)}
                >
                    <FontAwesome name="file" size={24} color="white" className="mr-2" />
                    <Text className="text-white">{item.body.file_name}</Text>
                </TouchableOpacity>
            );
        }
        return (
            <View
                className={`mb-3 p-3 rounded-lg max-w-[75%] ${item.user_id == userId ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
                    }`}
            >
                <Text className="text-white">{item?.body}</Text>
            </View>
        );
    };
    const skeletonMessages = () => {
        return (
            <View className="flex-1 bg-gray-900 px-[30px] pb-30">
                <View className="bg-gray-800 p-4 h-[4rem]">
                    {/* <Text className="text-white text-center text-lg font-bold">
                        {conversation?.participants?.[0]?.name || ""} <View className=" rounded-full h-[15px] w-[15px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-purple-500 "><Text className="uppercase font-bold text-6xl text-white">{conversation?.participants?.[0]?.name.charAt(0)}</Text></View>
                    </Text> */}
                </View>
                <View className='mt-[2rem] w-[100px] h-[15px] mb-3 p-5 rounded-lg max-w-[75%]   bg-gray-700 self-start' />
                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg  bg-blue-500 self-end  ' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />
                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]   bg-gray-700 self-start' />
                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end  ' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end  ' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 ' />

                <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />


            </View>

        )
    }

    // 🔹 الاستماع للرسائل الجديدة من `Pusher`
    useEffect(() => {

        try {
            const pusher = runPusher(user);
            // الاشتراك في القناة الخاصة بالمستخدم
            const channel = pusher.subscribe(`presence-Messenger.${userId}`);
            const handleNewMessage = (event: any) => {
                console.log("📩 رسالة جديدة:", event);
                const newMessage: any = event?.message;
                console.log("📩 رسالة جديدة:", newMessage);
        
                setMessages((prev) => [newMessage, ...prev]);
                sendPushNotification(newMessage?.user?.name, newMessage?.body);
        
                if (newMessage?.conversation_id === conversationId) {
                    // تنفيذ أي عمليات إضافية هنا
                }
            };
            // استقبال الرسائل الجديدة من الحدث "new-message"
            // channel.bind("new-message", (event: any) => {
            //     console.log("📩 رسالة جديدة:", event);
            //     const newMessage: any = event?.message;
            //     console.log("📩 رسالة جديدة:", newMessage);
            //     setMessages((prev) => [newMessage, ...prev]);
            //     sendPushNotification(newMessage?.user?.name, newMessage?.body);

            //     if (newMessage?.conversation_id === conversationId) {
                    
            //     }
            // });

            channel.bind("new-message", handleNewMessage);

            // تنظيف الاشتراك عند التفكيك
            return () => {
                channel.unbind_all();
            };
        } catch (error) {
            console.log("Error initializing Pusher:", error);
        }
    }, [conversationId]);

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

    if (fetching) {
        return skeletonMessages()
    }
    return (
        <View className="flex-1 bg-gray-900">
            {/* العنوان */}
            <View className="bg-gray-800 p-4 flex flex-row items-center gap-2 justify-center">
                <Text className="text-white text-center text-lg font-bold flex flex-row items-center">
                    {/* {conversation?.participants?.[0]?.name || ""}  */}
                    conversation_id
                </Text>

                <TouchableOpacity className="ml-auto absolute right-4 top-2 rounded-full px-2 py-1 mt-1" onPress={() => router.push('/(root)/(tabs)/chat')}>
                    <Image source={icons.arrowRight} className="w-8 h-8 rounded-full p-2" />
                </TouchableOpacity>
                <View className=" rounded-full h-[30px] w-[30px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-purple-500 "><Text className="uppercase font-bold text-md text-white ">{conversationId}</Text></View>
            </View>

            {/* قائمة الرسائل باستخدام FlatList */}
            <FlatList
                data={messages}
                inverted={true}
                // keyExtractor={(item) => item.id.toString()}
                keyExtractor={(item) => ++i}

                // renderItem={({ item }) => (
                //   <View
                //     className={`mb-3 p-3 rounded-lg max-w-[75%] ${
                //       item.user_id == userId ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
                //     }`}
                //   >
                //     <Text className="text-white">{item?.body}</Text>
                //   </View>
                // )}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 10 }}
            />

            {/* إدخال رسالة جديدة */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View className="flex-row items-center bg-gray-800 p-3 mb-[.5rem]">
                    <TextInput
                        className="flex-1 bg-gray-700 text-white p-3 rounded-lg mr-2"
                        placeholder="اكتب رسالة..."
                        placeholderTextColor="#bbb"
                        value={newMessage}
                        onChangeText={setNewMessage}
                    />
                    <TouchableOpacity onPress={sendMessage} className="bg-blue-500 p-3 rounded-lg">
                        {loading ? <ActivityIndicator size={30} color="blue" /> : <Text className="text-white font-bold">إرسال</Text>}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Chat;
