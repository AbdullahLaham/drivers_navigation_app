import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { icons, images } from '@/constants';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { useInfiniteQuery } from '@tanstack/react-query';
import WebView from 'react-native-webview';

const Notification = () => {
  // current user
  const { currentUser: user, isNewNotification } = useSelector((state: any) => state?.auth);

  const [orderDetails, setOrderDetails] = useState<any>({});
  const { orderId } = useLocalSearchParams();

  const getOrderDetails = async () => {
    const res = await axios.get(`https://ajwan.mahmoudalbatran.com/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${user?.data?.token}` },
    });
    setOrderDetails(res?.data);
  }


  useEffect(() => {
    getOrderDetails();
  }, [isNewNotification]);






  // تحويل تاريخ ISO إلى تنسيق مناسب
  const convertToDate = (isoString: any) => {
    return format(parseISO(isoString), "yyyy-MM-dd");
  };

  const convertToTime = (isoString: any) => {
    return format(parseISO(isoString), "HH:mm:ss");
  };


  return (
    <View>

      <View className="flex items-center justify-center p-3 bg-[#6d6969] relative">
        <Text className="text-white text-center font-bold text-lg block">تفاصيل الطلب</Text>
        <TouchableOpacity className="ml-auto absolute right-4 top-2 rounded-full px-2 py-1" onPress={() => router.push('/(root)/(tabs)/home')}>
          <Image source={icons.arrowRight} className="w-8 h-8 rounded-full p-2" />
        </TouchableOpacity>
      </View>

      {orderDetails?.driver?.car_name ? (<View className='flex flex-row items-center gap-3 mx-5 mt-5'>
        <View className="mr-4 rounded-full h-[80px] w-[80px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-gray-300 "><Image source={{ uri: `https://ajwan.mahmoudalbatran.com/${orderDetails?.driver?.profile_photo_path}` }} style={{ width: 80, height: 80 }} /></View>
        <View className='flex flex-col justify-start items-start gap-2 flex-1 '>
          <View className='-ml-5'><Text className='text-gray-600 font-semibold  '> <Text className='w-[300px] text-start '>اسم السائق : </Text><Text className='w-[500px] text-end'>{orderDetails?.driver?.name}</Text></Text></View>
          <View className=' '><Text className='text-gray-600 font-semibold  '> <Text className=' text-start '>نوع السيارة :</Text> <Text className='text-end'>{orderDetails?.driver?.car_name}</Text></Text></View>
          {/* <Text className='text-4xl'>{orderId}{JSON.stringify(startLocation)}</Text> */}

        </View>
        <View className="ml-auto rounded-full h-[80px] w-[80px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-gray-300 "><Image source={{ uri: `https://ajwan.mahmoudalbatran.com/${orderDetails?.driver?.car_photo}` }} style={{ width: 80, height: 80 }} /></View>

      </View>) : (
        <View>
          
        </View>
      )}

      {/* <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${startLocation?.longitude},${startLocation?.latitude}&zoom=14&apiKey=816fe04741cb4a56a974fb7866dc798f`,
            }}
            />
     */}
      <View className=' mt-5 bg-gray-200  my-3 py-3 px-5'><Text className='text-2xl font-bold text-start ml-auto text-gray-600'>معلومات طلبك </Text></View>

      <View className='w-[100%]  flex flex-col items-end justify-start mb-2 mx-1  border-b r border-gray-400 p-1 rounded-sm px-4'>
        <View className='flex items-center flex-row-reverse '>
          {/* <MapPin color="green" size={20} /> */}
          <Image source={icons.point} className={`w-6 h-6 ml-4`} />
          <Text className='text-gray-500 my-1 font-semibold text-md'><Text className='font-bold text-gray-800 text-md'>نقطة الانطلاق : </Text>{orderDetails?.order?.from} </Text>
        </View>
        <View className='flex items-center flex-row-reverse '>
          {/* <Target color="red" size={20} /> */}
          <Image source={icons.to} className={`w-6 h-6 ml-4`} />
          <Text className='text-gray-500 my-1 font-semibold text-md'><Text className='font-bold text-gray-800 text-md'>نقطة الوصول : </Text> {orderDetails?.order?.to}</Text>
        </View>



        <View className='flex flex-row-reverse items-center justify-between w-full mt-1'>
          <View className='flex flex-row items-center '>
            <Text className='text-gray-500 text-sm font-semibold -ml-2'>{convertToDate(orderDetails?.order?.created_at || '2025-03-08T12:00:00Z')} </Text>
            {/* <CalendarDaysIcon size={22} color="gray" /> */}
            <Image source={icons.clock} className={`w-6 h-6 ml-3`} />
          </View>
          <View className='flex flex-row  items-center'>
            <Text className='text-gray-500 text-sm font-semibold'>{convertToTime(orderDetails?.order?.created_at || '2025-03-08T12:00:00Z')} </Text>
            {/* <Clock size={22} color="gray" className='font-bold' /> */}
            <Image source={icons.date} className={`w-6 h-6 ml-1`} />
          </View>
        </View>

        <View className='flex flex-row-reverse items-center justify-between w-full mt-1'>
          <View className='flex flex-row items-center gap-2'><Text className='text-gray-500 text-lg font-bold' >{orderDetails?.order?.price || 5}</Text><Text className='text-lg' style={{ fontWeight: "bold", color: "black" }}> السعر بالشيكل ₪ :</Text></View>
        </View>



      </View>
      <View className=' mt-5 bg-gray-200  my-5 py-3 px-5'><Text className='text-2xl font-bold text-start ml-auto text-gray-600'>الاشعارات </Text></View>

      <FlatList
        data={orderDetails?.notification}
        keyExtractor={(item: any) => item?.id}
        renderItem={({ item }) => (
          <View className="w-[100%] flex flex-col items-end justify-start mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm px-4">
            <View className="flex items-center flex-row-reverse">
              <Image source={icons.bell} className="w-6 h-6 ml-4" />
              <Text className="text-gray-400 my-1 text-md">{item?.data?.body}</Text>
            </View>

            <View className="flex flex-row-reverse items-center justify-between w-full">
              <View className="flex flex-row items-center">
                <Text className="text-gray-500 text-sm font-semibold -ml-4">{convertToDate(item?.created_at)}</Text>
                <Image source={icons.clock} className="w-4 h-4 ml-3" />
              </View>
              <View className="flex flex-row items-center">
                <Text className="text-gray-500 text-sm font-semibold">{convertToTime(item?.created_at)}</Text>
                <Image source={icons.date} className="w-6 h-6 ml-1" />
              </View>
            </View>

          </View>
        )}

        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            <Image source={images.noResult} className="w-40 h-40" resizeMode="contain" />
            <Text className="text-sm">لا توجد إشعارات حديثة</Text>
          </View>
        )}
      />
      
    </View>
  );
};

export default Notification;
