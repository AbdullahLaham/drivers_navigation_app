import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { format, formatDistanceToNow, parseISO } from "date-fns";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { icons, images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';


const Rides = () => {
  const [state, setState] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const lastDate = requests?.length ? format(requests?.[requests?.length - 1]?.['created_at'], "MM/yyyy") : '02/2025';

  const { currentUser: user, isNewRide } = useSelector((state) => state?.auth);
console.log(requests, 'rrrrrrrrrrrrrr')
  const getOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://ajwan.mahmoudalbatran.com/api/orders', {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`
        }
      });
      setRequests(res?.data?.orders);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
    setLoading(false);
  };


  useFocusEffect(
    useCallback(() => {
      console.log('Page reloaded'); 
      getOrders();
      // You can also trigger state updates or re-fetch data here.
    }, [])
  );


  
  useEffect(() => {
    getOrders();
  }, [isNewRide]);

  const convertToDate = (isoString) => format(parseISO(isoString), "yyyy-MM-dd");
  const convertToTime = (isoString) => format(parseISO(isoString), "HH:mm:ss");
  const renderSkeleton = () => (
    <View className='w-[100%] flex flex-col items-end justify-start mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm'>
      <View className='flex items-center flex-row-reverse'>
        <View className='w-6 h-6 bg-gray-300 rounded-full ml-4' />
        <View className='w-40 h-4 bg-gray-300 rounded-md' />
      </View>
      <View className='flex items-center flex-row-reverse mt-2'>
        <View className='w-6 h-6 bg-gray-300 rounded-full ml-4' />
        <View className='w-40 h-4 bg-gray-300 rounded-md' />
      </View>
      <View className='flex flex-row-reverse items-center justify-between w-full mt-2'>
        <View className='w-20 h-4 bg-gray-300 rounded-md' />
        <View className='w-16 h-4 bg-gray-300 rounded-md' />
      </View>
      <View className='flex flex-row-reverse items-center justify-between w-full mt-2'>
        <View className='w-12 h-6 bg-gray-300 rounded-md' />
        <View className='w-24 h-6 bg-blue-300 rounded-md' />
      </View>
    </View>
  );

  return (
    <SafeAreaView>
      <Text className='flex items-center justify-center p-3 bg-[#2b2b2b] text-white text-center font-bold text-lg'>
        طلباتك {requests?.length}
      </Text>
      <View className='flex flex-row-reverse items-center justify-between p-5'>
        <TouchableOpacity className={`px-10 py-3 rounded-lg ${state === 'done' ? 'bg-blue-400 text-white' : ''}`} onPress={() => setState('done')}>
          <Text className={`font-semibold ${state === 'done' ? 'text-white' : 'text-black'}`}>مكتمله</Text>
        </TouchableOpacity>
        <TouchableOpacity className={`px-10 py-3 rounded-lg ${state === 'pending' ? 'bg-blue-400 text-white' : ''}`} onPress={() => setState('pending')}>
          <Text className={`font-semibold ${state === 'pending' ? 'text-white' : 'text-black'}`}>قيد الانتظار</Text>
        </TouchableOpacity>
        <TouchableOpacity className={`px-10 py-3 rounded-lg ${state === 'canceled' ? 'bg-blue-400 text-white' : ''}`} onPress={() => setState('canceled')}>
          <Text className={`font-semibold ${state === 'canceled' ? 'text-white' : 'text-black'}`}>تم الغائها</Text>
        </TouchableOpacity>
      </View>

      <TextInput className='w-full border-none outline-none rtl px-3 py-2 bg-gray-100 placeholder:text-gray-300 placeholder:text-end' placeholder='بحث' />
      <Text className='font-bold text-lg text-gray-600 my-1 w-full flex flex-row-reverse mb-5' style={{ textAlign: "right", writingDirection: "rtl" }}> طلباتي في شهر {lastDate}</Text>

      <FlatList
        data={loading ? Array(5).fill({}) : requests}
        keyExtractor={(item, index) => loading ? `skeleton-${index}` : item?.id}
        renderItem={({ item }) => loading ? renderSkeleton() : (
          <View className='w-[100%] flex flex-col items-end justify-start mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm'>
            <View className='flex items-center flex-row-reverse'>
              <Image source={icons.point} className='w-6 h-6 ml-4' />
              <Text className='text-gray-400 my-1 text-md'>{item?.from}</Text>
            </View>
            <View className='flex items-center flex-row-reverse'>
              <Image source={icons.to} className='w-6 h-6 ml-4' />
              <Text className='text-gray-400 my-1 text-md'>{item?.to}</Text>
            </View>
            <View className='flex flex-row-reverse items-center justify-between w-full'>
              <View className='flex flex-row items-center'>
                <Text className='text-gray-500 text-sm font-semibold'>{convertToDate(item?.created_at)}</Text>
                <Image source={icons.clock} className='w-6 h-6 ml-3' />
              </View>
              <View className='flex flex-row items-center'>
                <Text className='text-gray-500 text-sm font-semibold'>{convertToTime(item?.created_at)}</Text>
                <Image source={icons.date} className='w-6 h-6 ml-1' />
              </View>
            </View>
            <View className='flex flex-row-reverse items-center justify-between w-full'>
              <View className='flex flex-row items-center'><Text className='text-gray-500 text-md'>{item?.price || 5}</Text><Text className='text-lg font-bold text-black'>₪</Text></View>
              
              <TouchableOpacity onPress={() => router.push(`/(root)/currentRide/${item?.id}`)}>
                <Text className='text-blue-500 font-semibold text-lg'>عرض التفاصيل</Text>
              </TouchableOpacity>
            </View>
            <View><Text>{formatDistanceToNow(new Date(item?.created_at), { addSuffix: true })}</Text></View>
          </View>
        )}
        ListFooterComponent={
          <View  className='h-[20rem]' style={{ padding: 10, backgroundColor: 'white' }}>
          </View>
        }

      />
    </SafeAreaView>
  );
};

export default Rides;
