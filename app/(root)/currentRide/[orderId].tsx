import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { icons, images } from '@/constants';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { useInfiniteQuery } from '@tanstack/react-query';
import WebView from 'react-native-webview';

const SkeletonLoader = () => (
  <View>
    <View className='flex items-center justify-center p-3 bg-[#6d6969] relative'>
      <Text className='text-white text-center font-bold text-lg'>تفاصيل الطلب</Text>
    </View>
    <View className='flex flex-row items-center gap-3 mx-5 mt-5'>
      <View style={styles.skeletonImage} />
      <View className='flex-1'>
        <View style={styles.skeletonText} />
        <View style={styles.skeletonText} />
      </View>
      <View style={styles.skeletonImage} />
    </View>
    <View className='mt-5 bg-gray-200 my-3 py-3 px-5'>
      <View style={styles.skeletonText} />
    </View>
    <View className='w-full flex flex-col items-end justify-start mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm px-4'>
      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
    </View>
    <View className='mt-5 bg-gray-200 my-5 py-3 px-5'>
      <View style={styles.skeletonText} />
    </View>
    {[...Array(3)].map((_, index) => (
      <View key={index} className='border-b border-gray-400 p-2'>
        <View style={styles.skeletonText} />
      </View>
    ))}
  </View>
);
const Notification = () => {
  // current user
  const { currentUser: user, isNewNotification } = useSelector((state: any) => state?.auth);
  const [loading, setLoading] = useState(true);

  const [orderDetails, setOrderDetails] = useState<any>({});
  const { orderId } = useLocalSearchParams();

  const getOrderDetails = async () => {
    setLoading(true);
    const res = await axios.get(`https://ajwan.mahmoudalbatran.com/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${user?.data?.token}` },
    });
    setOrderDetails(res?.data);
    setLoading(false);
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

console.log(orderDetails?.driver?.profile_photo_url, 'ttttttttttttttttttttttttttt')
  return (
    <View>
      {loading ? <SkeletonLoader /> : (
        <View>

          <View className="flex items-center justify-center p-3 bg-[#6d6969] relative">
            <Text className="text-white text-center font-bold text-lg block">تفاصيل الطلب</Text>
            <TouchableOpacity className="ml-auto absolute right-4 top-2 rounded-full px-2 py-1" onPress={() => router.push('/(root)/(tabs)/home')}>
              <Image source={icons.arrowRight} className="w-8 h-8 rounded-full p-2" />
            </TouchableOpacity>
          </View>
          {orderDetails?.driver?.car_name ? (<View className='flex flex-row items-center gap-3 mx-5 mt-5'>
            <View className="mr-4 rounded-full h-[80px] w-[80px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-gray-300 "><Image source={{ uri: `${orderDetails?.driver?.profile_photo_url}` }} style={{ width: 80, height: 80 }} /></View>
            <View className='flex flex-col justify-start items-start gap-2 flex-1 '>
              <View className=''><Text className='text-gray-600 font-semibold  '> <Text className='w-[300px] text-start '>اسم السائق : </Text><Text className='w-[500px] text-end'>{orderDetails?.driver?.name}</Text></Text></View>
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
          <View className=' mt-5 bg-gray-200  my-3 py-3 px-5'><Text className='text-2xl font-bold text-start  text-gray-600'>معلومات طلبك </Text></View>

          <View className='w-[100%]  flex flex-col  justify-start mb-2 mx-1  border-b r border-gray-400 p-1 rounded-sm px-4'>
            <View className='flex items-center flex-row gap-2'>
              {/* <MapPin color="green" size={20} /> */}
              <Image source={icons.point} className={`w-6 h-6 ml-4`} />
              {/* <Text className='text-gray-500 my-1 font-semibold text-md'><Text className='font-bold text-gray-800 text-md'>   {orderDetails?.order?.from}  </Text>   </Text> */}
              <View className=''><Text className='text-gray-600 font-semibold  '> <Text className='w-[300px] text-start '>نقطة الانطلاق : </Text><Text className='w-[500px] text-end'>{orderDetails?.order?.from}</Text></Text></View>
            </View>
            
            <View className='flex items-center flex-row gap-2 '>
              {/* <Target color="red" size={20} /> */}
              <Image source={icons.to} className={`w-6 h-6 ml-4`} />
              {/* <Text className='text-gray-500 my-1 font-semibold text-md'><Text className='font-bold text-gray-800 text-md'>{orderDetails?.order?.to} </Text>     </Text> */}
              <View className=' '><Text className='text-gray-600 font-semibold  '> <Text className=' text-start '>نقطة الوصول :</Text> <Text className='text-end'>{orderDetails?.order?.to}</Text></Text></View>

            </View>


         



            <View className='flex flex-row items-center justify-between w-full mt-1'>
              <View className='flex flex-row items-center gap-5'>
                <Image source={icons.clock} className={`w-6 h-6 ml-3`} />
                <Text className='text-gray-500 text-sm font-semibold -ml-2'>{convertToDate(orderDetails?.order?.created_at || '2025-03-08T12:00:00Z')} </Text>
                {/* <CalendarDaysIcon size={22} color="gray" /> */}

              </View>
              <View className='flex flex-row  items-center'>
                <Image source={icons.date} className={`w-6 h-6 ml-1`} />
                <Text className='text-gray-500 text-sm font-semibold'>{convertToTime(orderDetails?.order?.created_at || '2025-03-08T12:00:00Z')} </Text>
                {/* <Clock size={22} color="gray" className='font-bold' /> */}

              </View>
            </View>

            <View className='flex flex-row items-center justify-between w-full mt-1'>
              <View className='flex flex-row items-center gap-2'><Text className='text-lg' style={{ fontWeight: "bold", color: "black" }}> السعر بالشيكل ₪ :</Text><Text className='text-gray-500 text-lg font-bold' >{orderDetails?.order?.price || "لم يتم تحديد السعر"}</Text></View>
              <View><Text className='text-xl text-gray-700 font-bold'>{orderDetails?.order?.created_date}</Text></View>
            </View>
            




          </View>
          <View className=' mt-5 bg-gray-200  my-5 py-3 px-5'><Text className='text-2xl font-bold text-start text-gray-600'>الاشعارات </Text></View>

          <FlatList
            data={orderDetails?.notification}
            keyExtractor={(item: any) => item?.id}
            renderItem={({ item }) => (
              <View className={`w-[100%] flex flex-col mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm px-5 ${item?.read_at == null ? 'bg-gray-200' : ''}`}>


                <View className="flex items-center flex-row">
                  <View className="flex items-center flex-row gap-2">
                    <Image source={{ uri: item?.data?.from?.profile_photo_url }} className="w-[2.5rem] h-[2.5rem] object-cover rounded-full" />
                    <Text className='text-gray-600 font-bold text-sm'>{item?.data?.from?.name}</Text>
                    {/* <Text className="text-gray-400 my-1 text-md">{item?.data?.body} </Text> */}
                  </View>
                  <Text className="text-gray-800 my-1 text-lg font-bold  mx-5">{item?.data?.body} </Text>
                </View>

                <View className="flex flex-row items-center justify-between w-full mt-1 px-5">
                  <View className="flex flex-row items-center">
                    <Text className="text-gray-500 text-md font-semibold -ml-4">{item?.driver?.name} {convertToDate(item?.created_at)}</Text>
                    <Image source={icons.date} className="w-5 h-5 ml-3" />
                  </View>
                  <View className="flex flex-row items-center">
                    <Text className="text-gray-500 text-md font-semibold">{convertToTime(item?.created_at)}</Text>
                    <Image source={icons.clock} className="w-5 h-5 ml-1" />
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
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
  },
  skeletonText: {
    height: 16,
    backgroundColor: '#e0e0e0',
    width: '80%',
    borderRadius: 4,
    marginVertical: 4,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'gray',
  }
});
export default Notification;
