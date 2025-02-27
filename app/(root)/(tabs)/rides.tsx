import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { ArrowRight, CalendarDaysIcon, Clock, MapPin,  Target } from "lucide-react-native";
import { format, parseISO } from "date-fns";
import axios from 'axios';
import API from '@/redux/features/MainApi';
import { useSelector } from 'react-redux';
import { icons, images } from '@/constants';
import {SafeAreaView} from 'react-native-safe-area-context';


const Rides = () => {
  const [state, setState] = useState<any>("pending");
  const [requests, setRequests] = useState([]);

  const lastDate = requests?.length ? format(requests?.[requests?.length - 1]?.['created_at'], "MM/yyyy") : '02/2025'

  // current user
  const {currentUser: user, isNewRide} = useSelector((state: any) => state?.auth);

  const getOrders = async () => {
      console.log('requsting ............................')
      const res = await axios.get('https://ajwan.mahmoudalbatran.com/api/orders',
    {
     headers: {
      Authorization: `Bearer ${user?.data?.token}`
     } 
    });
    
    setRequests(res?.data?.orders);
    
      // const res = await API.get('https://ajwan.mahmoudalbatran.com/api/orders');
  
      console.log('res', res?.data?.orders);
      // setRequests(res?.data);
    }

  useEffect(() => {
    
    
    getOrders();
    
  }, [isNewRide]);

  const convertToDate = (isoString: any) => {
    return format(parseISO(isoString), "yyyy-MM-dd");
  };

   const convertToTime = (isoString: any) => {
    return format(parseISO(isoString), "HH:mm:ss");
  };

  // const requests = [
  //   {
  //     id: 1,
  //     startLoc: 'المغازي السوق بجانب الاحسان',
  //     endLoca: 'غزة الاحسان. بجانب السوق',
  //     date: '5/4/2023',
  //     price: '5',
  //     time: '12:5 pm',
  //   },
  //   {
  //     id: 2,
  //     startLoc: 'المغازي السوق بجانب الاحسان',
  //     endLoca: 'غزة الاحسان. بجانب السوق',
  //     date: '5/4/2023',
  //     price: '5',
  //     time: '12:5 pm',
  //   },
  //   {
  //     id: 3,
  //     startLoc: 'المغازي السوق بجانب الاحسان',
  //     endLoca: 'غزة الاحسان. بجانب السوق',
  //     date: '5/4/2023',
  //     price: '5',
  //     time: '12:5 pm',
  //   },
  //   {
  //     id: 4,
  //     startLoc: 'المغازي السوق بجانب الاحسان',
  //     endLoca: 'غزة الاحسان. بجانب السوق',
  //     date: '5/4/2023',
  //     price: '5',
  //     time: '12:5 pm',
  //   },
  //   {
  //     id: 5,
  //     startLoc: 'المغازي السوق بجانب الاحسان',
  //     endLoca: 'غزة الاحسان. بجانب السوق',
  //     date: '5/4/2023',
  //     price: '5',
  //     time: '12:5 pm',
  //   }
  // ];

  return (
      <SafeAreaView>
      <Text className='flex items-center justify-center p-3 bg-[#2b2b2b] text-white text-center font-bold text-lg'>
        طلباتك
      </Text>
      <View className='flex flex-row-reverse items-center justify-between p-5 '>
        <View className={`flex items-center justify-center rounded-lg ${state == 'done' ? 'bg-blue-400 text-white ' : ''}`} >

          <TouchableOpacity className='px-10 py-3' onPress={() => setState('done')}>
            <Text className={`font-semibold ${state == 'done' ? 'text-white' : 'text-black'}`} >
              مكتمله
            </Text>
          </TouchableOpacity>


        </View>
        <View className={`flex items-center justify-center  rounded-lg  ${state == 'pending' ? 'bg-blue-400 text-white ' : ''}`}>
          <TouchableOpacity className='px-10 py-3' onPress={() => setState('pending')}>
            <Text className={`font-semibold ${state == 'pending' ? 'text-white' : 'text-black'}`} >
              قيد الانتظار
            </Text>
          </TouchableOpacity>

        </View>
        <View className={`flex items-center justify-center  rounded-lg  ${state == 'canceled' ? 'bg-blue-400 text-white ' : ''}`}>
          <TouchableOpacity className='px-10 py-3' onPress={() => setState('canceled')}>
            <Text className={`font-semibold ${state == 'canceled' ? 'text-white' : 'text-black'}`} >
              تم الغائها
            </Text>
          </TouchableOpacity>
        </View>
      </View>


      <View>
        <TextInput className='w-full border-none outline-none rtl px-3 py-2 bg-gray-100 placeholder:text-gray-300 placeholder:text-end' placeholder='بحث' />
        {/* <search /> */}

      </View>
      <Text className='font-bold text-lg text-gray-600 my-1 w-full flex-1  mb-5' style={{ textAlign: "right", writingDirection: "rtl" }}> طلباتي في شهر {lastDate}</Text>
       
      <FlatList
        data={requests}
        keyExtractor={(item: any) => item?.id}
        renderItem={({ item }) => (
          <View className='w-[100%] flex flex-col items-end justify-start mb-2 mx-1  border-b r border-gray-400 p-1 rounded-sm'>
            <View className='flex items-center flex-row-reverse '>
              {/* <MapPin color="green" size={20} /> */}
              <Image source={icons.point} className={`w-6 h-6 ml-4`}/>
              <Text className='text-gray-400 my-1  text-md'>{item?.from}</Text>
            </View>
            <View className='flex items-center flex-row-reverse '>
              {/* <Target color="red" size={20} /> */}
              <Image source={icons.to} className={`w-6 h-6 ml-4`}/>
              <Text className='text-gray-400 my-1  text-md'>{item?.to}</Text>
            </View>
            
            
            
            <View className='flex flex-row-reverse items-center justify-between w-full '>
              <View className='flex flex-row items-center '>
                <Text className='text-gray-500 text-sm font-semibold -ml-2'>{convertToDate(item?.created_at)} </Text>
                {/* <CalendarDaysIcon size={22} color="gray" /> */}
                <Image source={icons.clock} className={`w-6 h-6 ml-3`}/>
              </View>
              <View className='flex flex-row  items-center'><Text className='text-gray-500 text-sm font-semibold'>{convertToTime(item?.created_at)} </Text>
              {/* <Clock size={22} color="gray" className='font-bold' /> */}
              <Image source={icons.date} className={`w-6 h-6 ml-1`}/>
              </View>
            </View>
            <View className='flex flex-row-reverse items-center justify-between w-full '>
              <View className='flex flex-row items-center gap-2'><Text className='text-gray-500 text-md' >{item?.price || 5}</Text><Text className='text-lg' style={{  fontWeight: "bold", color: "black" }}>₪</Text></View>
              <View>
                {/* <ArrowRight  /> */}
                <Text className='text-blue-500 font-semibold text-lg'>عرض التفاصيل</Text>
              </View>
            </View>

            

          </View>
        )
        
      }

      nestedScrollEnabled={true}
      ListEmptyComponent={() => (
        <View className="flex flex-col items-center justify-center">
            
            <>
              <Image
                source={images.noResult}
                className="w-40 h-40"
                alt="No recent rides found"
                resizeMode="contain"
              />
              <Text className="text-sm">No recent rides found</Text>
            </>
          
        </View>
      )}
      ListFooterComponent={<View style={{ height: 200 }} />} // يضيف هامشًا بعد العنصر الأخير
      />



    </SafeAreaView>
  )
}

export default Rides

const styles = StyleSheet.create({})