// import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
// import React, { useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { icons, images } from '@/constants';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// const Profile = () => {
//   const prices = [
//     {
//       id: 1,
//       from: 'من غزة',
//       to: 'الى الزهرة',
//       price: '5',
//       time: '5',
//     },
//     {
//       id: 2,
//       from: 'من غزة',
//       to: 'الى الزهرة',
//       price: '5',
//       time: '5',
//     },
//     {
//       id: 3,
//       from: 'من غزة',
//       to: 'الى الزهرة',
//       price: '5',
//       time: '5',
//     },
//     {
//       id: 4,
//       from: 'من غزة',
//       to: 'الى الزهرة',
//       price: '5',
//       time: '5',
//     }
//     ,
//     {
//       id: 5,
//       from: 'من غزة',
//       to: 'الى الزهرة',
//       price: '5',
//       time: '5',
//     },
//     {
//       id: 6,
//       from: 'من غزة',
//       to: 'الى الزهرة',
//       price: '5',
//       time: '5',
//     }
//   ];



//   // const [prices, setPrices] = useState([]);
//   // const {currentUser: user} = useSelector((state) => state?.auth);
//   // const getPrices = async () => {
//   //   const res = await axios.get('https://ajwan.mahmoudalbatran.com/api/prices', {
//   //     headers: { Authorization: `Bearer ${user?.data?.token}` },
//   //   })
//   // }
//   return (
//     <View>
//       <Text className='flex items-center justify-center p-3 bg-[#2b2b2b] text-white text-center font-bold text-lg'>
//         التسعيرات
//       </Text>
//       <Text className='font-bold text-xl text-gray-600 my-2 w-full flex flex-row-reverse ' style={{textAlign: 'right'}}>   تسعيرات غزة </Text>      

//       <View className='mx-1 my-1 bg-white  p-5 rounded-lg '>
//       <FlatList
//         data={prices}

//         keyExtractor={(item: any) => item?.id}

//         renderItem={({ item }: { item: any }) => (
//           <View className='w-[100%] flex flex-col items-end justify-start mb-3 border-gray-400 p-1 rounded-sm'>
//             <View className='flex flex-row-reverse items-start '>
//               <View>
//                 <View className='flex items-center flex-row-reverse '>
//                   {/* <MapPin color="green" size={20} /> */}
//                   <Image source={icons.dollar} className={`w-6 h-6 ml-4 fill-black`} />
//                   <Text className='text-gray-400 my-1  text-md'>{item?.price} شيكل</Text>
//                 </View>
//                 <View className='flex items-center flex-row-reverse mt-1'>
//                   {/* <Target color="red" size={20} /> */}
//                   {/* <Image source={icons.selectedMarker} className={`w-6 h-6 ml-4`} /> */}
//                   <Image source={icons.clock} className={`w-6 h-6 ml-4`} />
//                   <Text className='text-gray-400 my-1  text-md'>{item?.time} دقيقة</Text>
//                 </View>
//               </View>
//               <View className=' mr-4'>
//                 <View className='flex items-center flex-row-reverse'>
//                   {/* <MapPin color="green" size={20} /> */}
//                   <Image source={icons.point} className={`w-6 h-6 ml-4`} />
//                   <Text className='text-gray-400 my-1  text-md'>{item?.from}</Text>
//                 </View>
//                 <View className='flex items-center flex-row-reverse mt-1'>
//                   {/* <Target color="red" size={20} /> */}
//                   {/* <Image source={icons.selectedMarker} className={`w-6 h-6 ml-4`} /> */}
//                   <Image source={icons.to} className={`w-6 h-6 ml-4`} />
//                   <Text className='text-gray-400 my-1  text-md'>{item?.to}</Text>
//                 </View>
//               </View>
//             </View>

//           </View>
//         )

//         }

//         nestedScrollEnabled={true}
//         ListEmptyComponent={() => (
//           <View className="flex flex-col items-center justify-center">

//             <>
//               <Image
//                 source={images.noResult}
//                 className="w-40 h-40"
//                 alt="No recent rides found"
//                 resizeMode="contain"
//               />
//               <Text className="text-sm">No recent rides found</Text>
//             </>

//           </View>
//         )}
//         ListFooterComponent={<View style={{ height: 100 }} />} // يضيف هامشًا بعد العنصر الأخير
//       />

//       </View>




//     </View>
//   )
// }

// export default Profile

// const styles = StyleSheet.create({})

import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '@/constants';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Profile = () => {
  const [prices, setPrices] = useState([]);
  const [groupedPrices, setGroupedPrices] = useState({});
  const [expandedStart, setExpandedStart] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currentUser: user } = useSelector((state) => state?.auth);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://ajwan.mahmoudalbatran.com/api/allPrices", {
          headers: { Authorization: `Bearer ${user?.data?.token}` },
        });
        setPrices(response.data.prices);
        groupByStart(response.data.prices);
      } catch (error) {
        if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
                Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
              }
      }finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, [user]);

  const groupByStart = (pricesList) => {
    const grouped = pricesList.reduce((acc, item) => {
      if (!acc[item.start]) {
        acc[item.start] = [];
      }
      acc[item.start].push(item);
      return acc;
    }, {});
    setGroupedPrices(grouped);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Text className='text-2xl font-extrabold text-center p-5 bg-[#2b2b2b] text-white rounded-b-xl mt-1 mx-1 shadow-lg'>
        🚖 التسعيرات
      </Text>
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]} // Dummy data for skeleton effect
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <View className="bg-white p-5 mx-4 my-3 rounded-xl shadow-md border border-gray-200">
              <View>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-gray-400 mr-3" />
                    <View className="w-32 h-6 bg-gray-400 rounded-md" />
                  </View>
                  <View className="w-6 h-6 bg-gray-400 rounded-full" />
                </View>
                <View className="mt-4">
                  <View className="w-full h-6 bg-gray-400 rounded-md mb-3" />
                  <View className="w-3/4 h-6 bg-gray-400 rounded-md" />
                </View>
              </View>
            </View>
          )}
        />
      ) : 
      (<FlatList
        data={Object.keys(groupedPrices)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View className='bg-white p-5 mx-4 my-3 rounded-xl shadow-md border border-gray-200'>
            <TouchableOpacity
              className='flex-row items-center justify-between my-2'
              onPress={() => setExpandedStart(expandedStart === item ? null : item)}
            >
              <View className='flex-row items-center '>
                <Image source={icons.map} className='w-8 h-8 mr-3' />
                <Text className='text-lg font-semibold text-gray-800'>{item}</Text>
              </View>
              <Image source={icons.arrowDown} className={`w-6 h-6 ${expandedStart === item ? 'rotate-180' : ''}`} />
            </TouchableOpacity>
            {expandedStart === item && (
              <FlatList
                data={groupedPrices[item]}
                keyExtractor={(subItem) => subItem.id.toString()}
                renderItem={({ item: subItem }) => (
                  // <View className='mt-3 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-300'>
                  //   <Text className='text-md font-semibold text-gray-700'>من: {subItem.name_one}</Text>
                  //   <Text className='text-md font-semibold text-gray-700'>إلى: {subItem.name_two}</Text>
                  //   <Text className='text-md font-semibold text-green-600'>💰 {subItem.price} شيكل</Text>
                  // </View>

                  <View className='w-[100%] flex flex-col items-end justify-start mb-3 border-gray-400 p-1 rounded-sm'>
                    <View className='flex flex-row items-start '>
                      <View className='flex-1'>
                        <View className='flex items-center flex-row gap-2'>
                          {/* <MapPin color="green" size={20} /> */}
                          <Image source={icons.dollar} className={`w-6 h-6 ml-4 fill-black`} />
                          <Text className='text-gray-600 my-1  text-lg font-bold '>{subItem?.price} شيكل</Text>
                        </View>
                        <View className='flex items-center flex-row gap-2 mt-1'>
                          {/* <Target color="red" size={20} /> */}
                          {/* <Image source={icons.selectedMarker} className={`w-6 h-6 ml-4`} /> */}
                          {/* <Image source={icons.clock} className={`w-6 h-6 ml-4`} /> */}
                          <Text className='text-gray-400 my-1  text-md'></Text>
                        </View>
                      </View>
                      <View className='flex-1'>
                        <View className='flex items-center flex-row gap-2'>
                          {/* <MapPin color="green" size={20} /> */}
                          <Image source={icons.point} className={`w-6 h-6 ml-4`} />
                          <Text className='text-gray-500 my-1  text-lg'>{subItem?.name_one}</Text>
                        </View>
                        <View className='flex items-center flex-row mt-1 gap-2'>
                          {/* <Target color="red" size={20} /> */}
                          {/* <Image source={icons.selectedMarker} className={`w-6 h-6 ml-4`} /> */}
                          <Image source={icons.to} className={`w-6 h-6 ml-4`} />
                          <Text className='text-gray-500 my-1  text-lg'>{subItem?.name_two}</Text>
                        </View>
                      </View>
                    </View>

                  </View>
                )}
              />
            )}
          </View>
        )}
      />)
}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
