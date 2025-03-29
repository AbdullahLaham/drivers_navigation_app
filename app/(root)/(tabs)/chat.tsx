// import React, { useEffect, useState } from "react";
// import { FlatList, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Alert, Linking, ActivityIndicator } from "react-native";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import * as Notifications from "expo-notifications";
// import Pusher from "pusher-js";
// import { runPusher } from "../_layout";
// import { FontAwesome } from "@expo/vector-icons";


// const API_BASE = "https://ajwan.mahmoudalbatran.com/api";





// Pusher.logToConsole = true;





// const Chat = () => {
//   let i = 1;
//   const { currentUser: user } = useSelector((state) => state?.auth);
//   const [messages, setMessages] = useState<any>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [conversation, setConversation] = useState(null);
//   const [userId, setUserId] = useState(user?.data?.client?.id || user?.data?.user?.id)
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false)


// console.log('user?.data?.token',user?.data?.token, 'user?.data?.tokenuser?.data?.tokenuser?.data?.token')
//   // 🔹 جلب المحادثة والرسائل عند تحميل الصفحة
// //   useEffect(() => {
// //     const fetchConversation = async () => {
// //       try {

// // // const res = await axios.get("https://ajwan.mahmoudalbatran.com/api/conversations", {
// // //   headers: {
// // //     Authorization: `Bearer ${user?.data?.token}`,
// // //     Accept: "application/json",
// // //     "Content-Type": "application/json"
// // //   },
// // //   withCredentials: false
// // // });


// //         // if (res?.data?.[0]?.id) {
// //         //   const conv = res.data[0];
// //         //   setConversation(conv);
// //         //   fetchMessages(conv.id);
// //         // } else {
// //         //   const newConv = await axios.post(`${API_BASE}/AddConversation`, {}, {
// //         //     headers: { Authorization: `Bearer ${user?.data?.token}` },
// //         //   });

// //         //   if (newConv?.data?.[0]?.id) {
// //         //     setConversation(newConv.data[0]);
// //         //     fetchMessages(newConv.data[0].id);
// //         //   }
// //         // }
// //       } catch (error) {
// //         console.error("Error fetching conversation:::::::", error);
// //       }
// //     };

// //     fetchConversation();
// //   }, [user]);



//   // 🔹 جلب المحادثة والرسائل عند تحميل الصفحة
//   useEffect(() => {
//     const fetchConversation = async () => {
//       try {
//         const res = await axios.get(`https://ajwan.mahmoudalbatran.com/api/myConversactions`, {
//           headers: { Authorization: `Bearer ${user?.data?.token}` },
//         });

//         if (res?.data?.[0]?.id) {
//           const conv = res.data[0];
//           setConversation(conv);
//           fetchMessages(conv.id);
//         } else {
//           const newConv = await axios.post(`${API_BASE}/AddConversation`, {}, {
//             headers: { Authorization: `Bearer ${user?.data?.token}` },
//           });

//           if (newConv?.data?.[0]?.id) {
//             setConversation(newConv.data[0]);
//             fetchMessages(newConv.data[0].id);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching conversation:", error?.message, 'hello');
//       }
//     };

//     fetchConversation();
//   }, [user]);



//   // 🔹 جلب الرسائل
//   const fetchMessages = async (conversationId) => {
//     setFetching(true)
//     try {
//       const res = await axios.get(`${API_BASE}/conversations/${conversationId}/messages`, {
//         headers: { Authorization: `Bearer ${user?.data?.token}` },
//       });
//       setMessages(res?.data?.messages?.data || []);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }finally {
//       setFetching(false);
//     }
//   };

//   // 🔹 إرسال الرسالة
//   const sendMessage = async () => {
//     setLoading(true);
//     if (!newMessage.trim() || !conversation?.id) return;

//     try {
//       const res = await axios.post(
//         `${API_BASE}/messages`,
//         {
//           conversation_id: conversation.id,
//           message: newMessage,
//         },
//         {
//           headers: { Authorization: `Bearer ${user?.data?.token}` },
//         }
//       );

//       if (res?.data) {
//         setMessages((prev) => [
//           {
//             id: Date.now(),
//             body: newMessage,
//             user_id: userId,
//           },
//           ...prev
//         ]);
//         setNewMessage("");
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//     finally {
//       setLoading(false);
//     }
//   };



//   const renderMessage = ({ item }: { item: any }) => {
//     if (item.type === "attachment") {
//       return (
//         <TouchableOpacity
//           className="mb-3 p-3 rounded-lg bg-gray-700 self-start flex-row items-center"
//           onPress={() => Linking.openURL(`${API_BASE}/${item.body.file_path}`)}
//         >
//           <FontAwesome name="file" size={24} color="white" className="mr-2" />
//           <Text className="text-white">{item.body.file_name}</Text>
//         </TouchableOpacity>
//       );
//     }
//     return (
//       <View
//         className={`mb-3 p-3 rounded-lg max-w-[75%] ${item.user_id == userId ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
//           }`}
//       >
//         <Text className="text-white">{item?.body}</Text>
//       </View>
//     );
//   };
//   const skeletonMessages = () => {
//     return (
//       <View className="flex-1 bg-gray-900 px-[30px]">
//         <View className="bg-gray-800 p-4">
//         <Text className="text-white text-center text-lg font-bold">
//          {conversation?.participants?.[0]?.name || ""} <View  className=" rounded-full h-[15px] w-[15px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-purple-500 "><Text className="uppercase font-bold text-6xl text-white">{conversation?.participants?.[0]?.name.charAt(0)}</Text></View>
//         </Text>
//       </View>
//         <View className='mt-[2rem] h-[100px] w-[40px] mb-3 p-5 rounded-lg max-w-[75%]   bg-gray-700 self-start' />
//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg  bg-blue-500 self-end  ' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />
//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]   bg-gray-700 self-start' />
//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end  ' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 self-start' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end  ' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%]  bg-gray-700 ' />

//         <View className='h-[15px] w-[100px] mb-3 p-5 rounded-lg max-w-[75%] bg-blue-500 self-end ' />


//       </View>
      
//     )
//   }

//   // 🔹 الاستماع للرسائل الجديدة من `Pusher`
// useEffect(() => {
  
//   try {
//     const pusher = runPusher(user);
//     // الاشتراك في القناة الخاصة بالمستخدم
//     const channel = pusher.subscribe(`presence-Messenger.${userId}`);

//     // استقبال الرسائل الجديدة من الحدث "new-message"
//     channel.bind("new-message", (event: any) => {
//       console.log("📩 رسالة جديدة:", event);
//       const newMessage: any = event?.message;
//       console.log("📩 رسالة جديدة:", newMessage);
//       setMessages((prev) => [newMessage, ...prev]);
//       sendPushNotification(newMessage?.user?.name, newMessage?.body);

//       if (newMessage?.conversation_id === conversation?.id) {

//       }
//     });

//     // return () => {
//     //   pusher.unsubscribe(`presence-Messenger.${user?.data?.id}`);
//     // };
//   } catch (error) {
//     console.log("Error initializing Pusher:", error);
//   }
// }, [user])

//   // 🔹 دالة إرسال الإشعار عند استقبال رسالة جديدة
//   const sendPushNotification = async (senderName, messageBody) => {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: `رسالة جديدة من ${senderName}`,
//         body: messageBody,
//         sound: true,
//       },
//       trigger: null, // يُعرض الإشعار فورًا
//     });
//   };

//   if (fetching) {
//     return skeletonMessages()
//   }
//   return (
//     <View className="flex-1 bg-gray-900">
//       {/* العنوان */}
//       <View className="bg-gray-800 p-4 flex flex-row items-center gap-2 justify-center">
//         <Text className="text-white text-center text-lg font-bold flex flex-row items-center">
//          {conversation?.participants?.[0]?.name || ""} 
//         </Text>
//         <View  className=" rounded-full h-[30px] w-[30px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-purple-500 "><Text className="uppercase font-bold text-md text-white ">{conversation?.participants?.[0]?.name.charAt(0)}</Text></View>
//       </View>

//       {/* قائمة الرسائل باستخدام FlatList */}
//       <FlatList
//         data={messages}
//         inverted={true}
//         // keyExtractor={(item) => item.id.toString()}
//         keyExtractor={(item) => ++i}

//         // renderItem={({ item }) => (
//         //   <View
//         //     className={`mb-3 p-3 rounded-lg max-w-[75%] ${
//         //       item.user_id == userId ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
//         //     }`}
//         //   >
//         //     <Text className="text-white">{item?.body}</Text>
//         //   </View>
//         // )}
//         renderItem={renderMessage}
//         contentContainerStyle={{ padding: 10 }}
//       />

//       {/* إدخال رسالة جديدة */}
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
//         <View className="flex-row items-center bg-gray-800 p-3 mb-[6rem]">
//           <TextInput
//             className="flex-1 bg-gray-700 text-white p-3 rounded-lg mr-2"
//             placeholder="اكتب رسالة..."
//             placeholderTextColor="#bbb"
//             value={newMessage}
//             onChangeText={setNewMessage}
//           />
//           <TouchableOpacity onPress={sendMessage} className="bg-blue-500 p-3 rounded-lg">
//             {loading ? <ActivityIndicator size={30} color="blue" /> : <Text className="text-white font-bold">إرسال</Text>}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default Chat;









import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TextInput, Image, TouchableOpacity, View,StyleSheet, KeyboardAvoidingView, Platform, Alert, Linking, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import * as Notifications from "expo-notifications";
import Pusher from "pusher-js";
import { runPusher } from "../_layout";
import { FontAwesome } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useConversationStore } from "@/lib/conversationStore";

let i = 0;
const ChatConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  // addConversation
const setConversation = useConversationStore((state) => state.setConversation);

    const { currentUser: user } = useSelector((state) => state?.auth);


  // Fetch conversations when page changes or app loads
  const fetchConversations = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`https://ajwan.mahmoudalbatran.com/api/myConversactions?page=${page}`, {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const newConversations = response.data.data;

      console.log(response.data?.data, 'daaaaaaaataaaaaaaaaaaa');
      if (newConversations?.length > 0) {
        setConversations((prev) => [...prev, ...newConversations]);
        setHasMore(response.data.next_page_url !== null);
        setPage((prev) => prev + 1);
        return;
      }


      if (response?.data.data?.length == 0) {
          const newConv = await axios.post(`https://ajwan.mahmoudalbatran.com/api/AddConversation`, {}, {
            headers: { Authorization: `Bearer ${user?.data?.token}` },
          });
          console.log( 'no daat daaaaaaaataaaaaaaaaaaa', newConv?.data)


          if (newConv?.data?.[0]?.id) {
            setConversations(newConv?.data);
            return;
            // setConversation(newConv.data[0]);
            // fetchMessages(newConv.data[0].id);
            // fetchConversations();
          }


        } 
      

      // Check if there are more conversations to load
  
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


// useFocusEffect(
//     useCallback(() => {
//       console.log('Page reloaded');
//       fetchConversations();
//       // You can also trigger state updates or re-fetch data here.
//     }, [])
//   );

  useEffect(() => {
    setConversation(null)
    fetchConversations();
  }, []);

  // Render a single conversation item
  const renderConversation = ({ item }) => {
    const lastMessage = item.last_message ? (item.last_message?.type !== 'attachment' ? item?.last_message?.body : "attachment") : "ليس لديك رسائل بعد" ;
    const participant = item.participants[0]; // Assuming there is at least one participant

    return (
      <TouchableOpacity style={styles.conversationItem} onPress={() => {router.push(`/(root)/currentConversation/${item?.id}`); setConversation(item)}} className="relative">
        <Image source={{ uri: participant.profile_photo_url }} style={styles.avatar} />
        <View style={styles.conversationInfo}>
          <Text style={styles.name}>{participant.name}</Text>
          <Text style={styles.lastMessage}>{lastMessage} </Text>
          {item?.new_messages > 0 ? <Text className="absolute  right-2 border border-gray-200 rounded-full p-1">{item?.new_messages}</Text> : ''}
        </View>
      </TouchableOpacity>
    );
  };

  // Handle reaching the bottom of the list
  const handleLoadMore = () => {
    if (hasMore) {
      fetchConversations();
    }
  };

  if (loading) {
    return (
      <View className="space-y-4 p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <View key={i} className="flex-row items-center space-x-4 p-3 bg-gray-100 rounded-lg animate-pulse">
          {/* صورة بروفايل دائرية */}
          <View className="w-12 h-12 bg-gray-300 rounded-full"></View>

          {/* تفاصيل المحادثة الوهمية */}
          <View className="flex-1 space-y-2">
            <View className="w-3/4 h-4 bg-gray-300 rounded"></View>
            <View className="w-1/2 h-3 bg-gray-300 rounded"></View>
          </View>
        </View>
      ))}
    </View>
    )
  }
  return (
    <View style={styles.container}>
    <Text className='flex items-center justify-center p-3 bg-[#2b2b2b] text-white text-center font-bold text-lg'>
            محادثاتك 
          </Text>
      <FlatList
        data={loading ? [...conversations, "loading"] : conversations} // Add "loading" as a placeholder
        renderItem={(item) => item?.item == 'loading'  ? 
        <View className="`p-4 bg-white m-2 rounded-lg shadow items-center`">
          <ActivityIndicator size="large" color="gray" />
          <Text className="`text-gray-500 mt-2`">Loading more...</Text>
      </View> : 
      renderConversation(item)}
        keyExtractor={(item) => i++}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Trigger next page load when 50% of the list is visible
        // ListFooterComponent={loading && <Text>Loading...</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: '#888',
    fontSize: 14,
  },
});

export default ChatConversationsPage;
