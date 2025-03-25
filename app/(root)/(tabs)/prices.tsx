import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '@/constants';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Profile = () => {
  const prices = [
    {
      id: 1,
      from: 'من غزة',
      to: 'الى الزهرة',
      price: '5',
      time: '5',
    },
    {
      id: 2,
      from: 'من غزة',
      to: 'الى الزهرة',
      price: '5',
      time: '5',
    },
    {
      id: 3,
      from: 'من غزة',
      to: 'الى الزهرة',
      price: '5',
      time: '5',
    },
    {
      id: 4,
      from: 'من غزة',
      to: 'الى الزهرة',
      price: '5',
      time: '5',
    }
    ,
    {
      id: 5,
      from: 'من غزة',
      to: 'الى الزهرة',
      price: '5',
      time: '5',
    },
    {
      id: 6,
      from: 'من غزة',
      to: 'الى الزهرة',
      price: '5',
      time: '5',
    }
  ];
  


  // const [prices, setPrices] = useState([]);
  // const {currentUser: user} = useSelector((state) => state?.auth);
  // const getPrices = async () => {
  //   const res = await axios.get('https://ajwan.mahmoudalbatran.com/api/prices', {
  //     headers: { Authorization: `Bearer ${user?.data?.token}` },
  //   })
  // }
  return (
    <View>
      <Text className='flex items-center justify-center p-3 bg-[#2b2b2b] text-white text-center font-bold text-lg'>
        التسعيرات
      </Text>
      <Text className='font-bold text-xl text-gray-600 my-2 w-full flex flex-row-reverse ' style={{textAlign: 'right'}}>   تسعيرات غزة </Text>      

      <View className='mx-1 my-1 bg-white  p-5 rounded-lg '>
      <FlatList
        data={prices}

        keyExtractor={(item: any) => item?.id}

        renderItem={({ item }: { item: any }) => (
          <View className='w-[100%] flex flex-col items-end justify-start mb-3 border-gray-400 p-1 rounded-sm'>
            <View className='flex flex-row-reverse items-start '>
              <View>
                <View className='flex items-center flex-row-reverse '>
                  {/* <MapPin color="green" size={20} /> */}
                  <Image source={icons.dollar} className={`w-6 h-6 ml-4 fill-black`} />
                  <Text className='text-gray-400 my-1  text-md'>{item?.price} شيكل</Text>
                </View>
                <View className='flex items-center flex-row-reverse mt-1'>
                  {/* <Target color="red" size={20} /> */}
                  {/* <Image source={icons.selectedMarker} className={`w-6 h-6 ml-4`} /> */}
                  <Image source={icons.clock} className={`w-6 h-6 ml-4`} />
                  <Text className='text-gray-400 my-1  text-md'>{item?.time} دقيقة</Text>
                </View>
              </View>
              <View className=' mr-4'>
                <View className='flex items-center flex-row-reverse'>
                  {/* <MapPin color="green" size={20} /> */}
                  <Image source={icons.point} className={`w-6 h-6 ml-4`} />
                  <Text className='text-gray-400 my-1  text-md'>{item?.from}</Text>
                </View>
                <View className='flex items-center flex-row-reverse mt-1'>
                  {/* <Target color="red" size={20} /> */}
                  {/* <Image source={icons.selectedMarker} className={`w-6 h-6 ml-4`} /> */}
                  <Image source={icons.to} className={`w-6 h-6 ml-4`} />
                  <Text className='text-gray-400 my-1  text-md'>{item?.to}</Text>
                </View>
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
        ListFooterComponent={<View style={{ height: 100 }} />} // يضيف هامشًا بعد العنصر الأخير
      />

      </View>




    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})