import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Calendar, Clock } from "lucide-react-native";

const Rides = () => {
  const [state, setState] = useState<any>("");
  const requests = [
    {
      id: 1,
      startLoc: 'المغازي السوق بجانب الاحسان',
      endLoca: 'غزة الاحسان. بجانب السوق',
      date: '5/4/2023',
      price: '5 $',
      time: '12:5 pm',
    },
    {
      id: 2,
      startLoc: 'المغازي السوق بجانب الاحسان',
      endLoca: 'غزة الاحسان. بجانب السوق',
      date: '5/4/2023',
      price: '5 $',
      time: '12:5 pm',
    },
    {
      id: 3,
      startLoc: 'المغازي السوق بجانب الاحسان',
      endLoca: 'غزة الاحسان. بجانب السوق',
      date: '5/4/2023',
      price: '5 $',
      time: '12:5 pm',
    }
  ]
  return (
    <View>
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
      <View className='px-5'>
        <Text className='font-bold text-xl my-3'> طلباتي في شهر 9/2023</Text>
        {requests.length > 0 && (
          <FlatList
            data={requests}
            keyExtractor={(item: any) => item?.id}
            renderItem={({ item }) => (
              <View className='w-[100%] flex flex-col items-end justify-start'>
                <Text className='text-gray-400 my-2  text-lg'>{item?.startLoc}</Text>
                <Text className='text-gray-400 my-2  text-lg'>{item?.endLoca}</Text>
                
                <View className='flex flex-row-reverse justify-between w-full'>
                  <Text className='text-gray-500 text-lg'>{item?.date} <Calendar size={32} color="blue" /></Text>
                  <Text className='text-gray-500 text-lg'>{item?.time} <Clock size={32} color="blue" /></Text>
                </View>
                <Text className='text-gray-500 text-lg'>{item?.price}</Text>
              </View>
            )}
          />
        )}


      </View>

    </View>
  )
}

export default Rides

const styles = StyleSheet.create({})