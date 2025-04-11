import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { format, formatDistanceToNow, parseISO, startOfDay } from "date-fns";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { icons, images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { DatePickerModal } from "react-native-paper-dates";
import { LocaleConfig } from 'react-native-calendars'; // This can help with month/year rendering issues
import { Card } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useConversationStore } from '@/lib/conversationStore';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import DatePicker from 'react-native-date-picker';

const Rides = () => {
  const [state, setState] = useState("rides");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFilter, setLoadingFilter] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const [fromDate, setFromDate] = useState<any>();
  const [toDate, setToDate] = useState<any>();

  const setStartDate = useConversationStore((state: any) => state.setStartDate);
  const setEndDate = useConversationStore((state: any) => state.setEndDate);

  const filterReportsStartDate = useConversationStore((state: any) => state.filterReportsStartDate);
  const filterReportsEndDate = useConversationStore((state: any) => state.filterReportsEndDate);



  const [visibleFrom, setVisibleFrom] = useState(false);
  const [visibleTo, setVisibleTo] = useState(false);
  const [filteredReports, setFilteredReports] = useState([]);
  console.log(filterReportsStartDate, filterReportsEndDate, 'ttttttttttttt');




  const filterReports = async () => {
    let start = format(filterReportsStartDate, "yyyy-MM-dd")
    let end = format(filterReportsEndDate, "yyyy-MM-dd");
    setLoadingFilter(true);

    console.log(`https://ajwan.mahmoudalbatran.com/api/filter?start_at=${start}&end_at=${end}`, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
    // console.log('ssssssssssssss', start, end, 'eeeeeeeeeeeeeeeeeeeeeeeeeee')
    try {
      const res = await axios.get(`https://ajwan.mahmoudalbatran.com/api/filter?start_at=${start}&end_at=${end}`, {
        headers: { Authorization: `Bearer ${user?.data?.token}` }
      })
      // console.log(res?.data, 'ffffffffuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');

      if (res?.data) {
        console.log(res?.data,'dataaaaaaaaaaaaaa')
        setFilteredReports(res?.data);
        const total = res?.data.reduce((acc, item) => {
          return acc + (parseFloat(item?.price) || 0);
        }, 0);
        setTotalPrice(total);
      }



    } catch (error) {
      if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
        Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
        return; // لا نسجل خروج المستخدم
      }

      if (!error.response) {
        Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
        return; // لا نسجل خروج المستخدم
      }

    } finally {
      setLoadingFilter(false);

    }
  };

  const lastDate = requests?.length ? format(requests?.[requests?.length - 1]?.['created_at'], "MM/yyyy") : '02/2025';

  const { currentUser: user, isNewRide } = useSelector((state) => state?.auth);



  // const getOrders = async () => {
  //   setLoading(true);
  //   try {
  //     // const res = await axios.get('https://ajwan.mahmoudalbatran.com/api/orders', {
  //     //   headers: {
  //     //     Authorization: `Bearer ${user?.data?.token}`
  //     //   }
  //     // });

  //     const res = await axios.get(`https://ajwan.mahmoudalbatran.com/api/orders?page=${pageParam}`, {
  //       headers: { Authorization: `Bearer ${user?.data?.token}` },
  //     });
  //     return res?.data?.data
  //   } catch (error) {
  //     console.error("Error fetching orders", error);
  //   }
  //   setLoading(false);
  // };

  const getOrders = async (nextPage = 1) => {
    if (loadingMore || !hasMore) return;

    if (nextPage === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await axios.get(`https://ajwan.mahmoudalbatran.com/api/orders?page=${nextPage}`, {
        headers: { Authorization: `Bearer ${user?.data?.token}` }
      });

      const newData = res?.data?.data;

      setRequests(prevRequests => nextPage === 1 ? newData : [...prevRequests, ...newData]);

      setHasMore(res?.data?.next_page_url !== null);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching orders", error);
      if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
        Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
        return; // لا نسجل خروج المستخدم
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      console.log('Page reloaded');
      getOrders();
      filterReports();
      // You can also trigger state updates or re-fetch data here.
    }, [])
  );

  const calculateTotalPrice  = () => {
    // for (let item of filteredReports) { 
    //   if (item?.price) 
    //   {setTotalPrice((prev) => parseFloat(prev) + parseFloat(item.price));}
    // }
    const total = filteredReports.reduce((acc, item) => {
      return acc + (parseFloat(item?.price) || 0);
    }, 0);
    setTotalPrice(total);
  }

  useEffect(() => {
    getOrders();
    calculateTotalPrice()
  }, [isNewRide]);

  useEffect(() => {
    filterReports();
  }, [filterReportsStartDate, filterReportsEndDate]);

  const loadMoreOrders = () => {
    if (hasMore && !loadingMore) {
      getOrders(page + 1);
    }
  };

  const convertToDate = (isoString: any) => format(parseISO(isoString), "yyyy-MM-dd");
  const convertToTime = (isoString: any) => format(parseISO(isoString), "HH:mm:ss");


  const renderSkeleton = () => (
    <View className='w-[100%] flex flex-col items-end justify-start mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm'>
      <View className='flex items-center flex-row'>

        <View className='w-40 h-4 bg-gray-300 rounded-md' />
        <View className='w-6 h-6 bg-gray-300 rounded-full ml-4' />
      </View>
      <View className='flex items-center flex-row mt-2'>

        <View className='w-40 h-4 bg-gray-300 rounded-md' />
        <View className='w-6 h-6 bg-gray-300 rounded-full ml-4' />
      </View>
      <View className='flex flex-row items-center justify-between w-full mt-2'>
        <View className='w-20 h-4 bg-gray-300 rounded-md' />
        <View className='w-16 h-4 bg-gray-300 rounded-md' />
      </View>
      <View className='flex flex-row items-center justify-between w-full mt-2'>
        <View className='w-12 h-6 bg-gray-300 rounded-md' />
        <View className='w-24 h-6 bg-blue-300 rounded-md' />
      </View>
    </View>
  );

  // for reports page 

  useEffect(() => {
    const checkAuth = async () => {

      if (!user?.data?.token) {
        router.replace("/(auth)/sign-in"); // توجيه المستخدم لصفحة تسجيل الدخول إذا لم يوجد توكن
        return;
      }

      try {
        const res = await axios.get('https://ajwan.mahmoudalbatran.com/api/auth/tokens', {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`
           }
        })

        if (!res.data) {
          dispatch(logout())
          router.replace("/(auth)/sign-in");

        }

      } catch (error) {
        // dispatch(logout());
        console.log(error, 'eeeeeeeerrrrrrrrorr');

        if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
          Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
          return; // لا نسجل خروج المستخدم
        }

        if (!error.response) {
          Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
          return; // لا نسجل خروج المستخدم
        }


         // التحقق مما إذا كان الخطأ بسبب انتهاء صلاحية التوكن أو خطأ في المصادقة
         if (error.response.status === 401 || error.response.status === 403) {
          dispatch(logout());
          router.replace("/(auth)/sign-in");
        } else {
          Alert.alert("حدث خطأ", "يرجى المحاولة مرة أخرى.");
        }
        // router.replace("/(auth)/sign-in");
      }
    };

    checkAuth();
  }, [user]);



  return (
    <SafeAreaView>
      <Text className='flex items-center justify-center p-3 bg-[#2b2b2b] text-white text-center font-bold text-lg'>
        طلباتك 
      </Text>
      <View className='flex flex-row-reverse items-center justify-between p-5'>
        <TouchableOpacity className={`px-10 py-3 rounded-lg ${state === 'rides' ? 'bg-blue-400 text-white' : ''}`} onPress={() => setState('rides')}>
          <Text className={` font-semibold ${state === 'rides' ? 'text-white' : 'text-black border border-gray-500 px-5 py-2 rounded-lg'}`}>الطلبات</Text>
        </TouchableOpacity>
        <TouchableOpacity className={`px-10 py-3 rounded-lg ${state === 'reports' ? 'bg-blue-400 text-white' : ''}`} onPress={() => setState('reports')}>
          <Text className={` font-semibold ${state === 'reports' ? 'text-white' : 'text-black border border-gray-500 px-5 py-2 rounded-lg'}`}> التقارير</Text>
        </TouchableOpacity>
      </View>

      {
        state == 'rides' ? (
          <View>
            <Text className='font-bold text-lg text-gray-600 my-1 w-full flex flex-row mb-5 mx-5'> طلباتي مؤخرا{""}</Text>

            <FlatList
              data={loading ? Array(5).fill({}) : requests}
              keyExtractor={(item, index) => loading ? `skeleton-${index}` : item?.id}
              renderItem={({ item }) => loading ? renderSkeleton() : (
                <View className='w-[100%] flex flex-col  justify-start mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm'>
                  <View className='flex items-center flex-row gap-1'>
                    <Image source={icons.point} className='w-6 h-6 ml-3' />
                    <Text className='text-gray-400 my-1 text-md'>{item?.from}</Text>
                  </View>
                  <View className='flex items-center flex-row gap-1'>
                    <Image source={icons.to} className='w-6 h-6 ml-3' />
                    <Text className='text-gray-400 my-1 text-md'>{item?.to}</Text>
                  </View>
                  <View className='flex flex-row items-center justify-between w-full'>
                    <View className='flex flex-row-reverse items-center gap-1'>
                      <Text className='text-gray-500 text-sm font-semibold'>{convertToDate(item?.created_at)}</Text>
                      <Image source={icons.clock} className='w-6 h-6 ml-3' />
                    </View>
                    <View className='flex flex-row-reverse items-center gap-1'>
                      <Text className='text-gray-500 text-sm font-semibold'>{convertToTime(item?.created_at)}</Text>
                      <Image source={icons.date} className='w-6 h-6 ml-1' />
                    </View>
                  </View>
                  <View className='flex flex-row items-center justify-between w-full px-4'>
                    <View className='flex flex-row items-center gap-2'>
                      <Text className='text-lg font-bold text-black'>₪</Text>
                      <Text className='text-gray-500 text-md'>{item?.price || "لم يتم تحديد السعر "}</Text>
                    </View>

                    <TouchableOpacity onPress={() => router.push(`/(root)/currentRide/${item?.id}`)}>
                      <Text className='text-blue-500 font-semibold text-lg'>عرض التفاصيل</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View><Text>{formatDistanceToNow(new Date(item?.created_at), { addSuffix: true })}</Text></View> */}
                </View>
              )}
              onEndReached={loadMoreOrders}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="blue" /> : (
                <View className='h-[28rem]' style={{ padding: 10, backgroundColor: 'white' }}>
                </View>
              )}


            />
          </View>
        ) : (
          <View style={{ padding: 12, backgroundColor: "#f0f0f0", }}>
            {/* Title */}
            <Text className='text-black text-center text-xl font-semibold '>
              قم بتحديد التاريخ لعرض الطلبات
            </Text>

            {/* Date pickers */}
            <View className='flex flex-row my-[1rem]'>
            <Text className='mb-[2rem] text-black mt-5 px-2 font-semibold text-md '>من</Text>
              <TouchableOpacity className='h-[4rem]'
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  flex: 1,
                  alignItems: "center",
                }}
                onPress={() => setVisibleFrom(true)}
              >
                <Text className='font-bold text-xl '>  {format(filterReportsStartDate, "yyyy-MM-dd")}</Text>
              </TouchableOpacity>
              

              <Text className='mb-[2rem] text-black mt-5 px-2 font-semibold text-md '>إلى</Text>
              <TouchableOpacity
                className='h-[4rem] '
                style={{
                  padding: 15,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  flex: 1,
                  alignItems: "center",
                }}
                onPress={() => setVisibleTo(true)}
              >
                <Text className='font-bold text-xl '>{format(filterReportsEndDate, "yyyy-MM-dd")}</Text>
              </TouchableOpacity>

              

            </View>

            {/* DatePickerModal for 'From' date */}
            {/* <DatePickerModal
              mode="single"
              visible={visibleFrom}
              date={filterReportsStartDate}
              onDismiss={() => setVisibleFrom(false)}
              onConfirm={(date) => {
                setStartDate(date?.date);
                setVisibleFrom(false);
              }}
            /> */}

            {/* DatePickerModal for 'To' date */}
            {/* <DatePickerModal
              mode="single"
              visible={visibleTo}
              date={filterReportsEndDate}
              onDismiss={() => setVisibleTo(false)}
              onConfirm={(date) => {
                setEndDate(date?.date);
                setVisibleTo(false);
              }}
            /> */}




             {/* DatePickerModal for 'From' date */}
            {/* <DatePicker
              modal
              mode="date"
              open={visibleFrom}
              date={filterReportsStartDate}
              onCancel={() => setVisibleFrom(false)}
              onConfirm={(date) => {
                setStartDate(date?.date);
                setVisibleFrom(false);
              }}
            /> */}

            {/* DatePickerModal for 'To' date */}
            {/* <DatePicker
              modal
              mode="date"
              open={visibleTo}
              date={filterReportsEndDate}
              onCancel={() => setVisibleTo(false)}
              onConfirm={(date) => {
                setEndDate(date?.date);
                setVisibleTo(false);
              }}
            />
             */}

<DateTimePickerModal
        isVisible={visibleFrom}
        date={filterReportsStartDate}
        mode="date"
        onConfirm={(selectedDate) => {
          console.log(selectedDate)
          setStartDate(selectedDate);
          setVisibleFrom(false);
        }}
        onCancel={() => setVisibleFrom(false)}
      />
      <DateTimePickerModal
        isVisible={visibleTo}
        date={filterReportsEndDate}
        mode="date"
        onConfirm={(selectedDate) => {
          setEndDate(selectedDate);
                setVisibleTo(false);
        }}
        onCancel={() => setVisibleTo(false)}
      />

{/* {visibleFrom && (
        <DateTimePicker
          value={filterReportsStartDate} // Set the initial date
          mode="date" // Show date picker mode (can also be "time" or "datetime")
          display="default" // Default display style
          onChange={(e, date) => {
            console.log(date, 'dddddddddddddddddddddddddd')
            // setStartDate(date?.date);
            //     setVisibleFrom(false);
          }} // Handle date change
        />
      )} */}

{/* {visibleFrom && (
        <DateTimePicker
          value={filterReportsEndDate} // Set the initial date
          mode="date" // Show date picker mode (can also be "time" or "datetime")
          display="default" // Default display style
          onChange={(e, date) => {
            console.log(date, 'dddddddddddddddddddddddddd')
            // setStartDate(date?.date);
            //     setVisibleFrom(false);
          }} // Handle date change
        />
      )} */}

            {/* Search Button */}
            <TouchableOpacity className='w-full py-2 px-3 bg-black rounded-md h-[3rem] -mt-2'

              onPress={filterReports}
            >
              <Text className='text-white text-lg text-center'>عرض</Text>
            </TouchableOpacity>

            {filteredReports?.length > 0 ? (<View className='flex flex-row items-center gap-2 my-2'>
              <Text className='text-lg font-semibold text-gray-600'>السعر الكلي لطلباتك خلال هذه الفترة : </Text>
              <Text className='text-lg font-bold'>{totalPrice} ₪</Text>
            </View>) : (<View></View>)}

            {/* Report List */}

            {/* <FlatList
              data={loading ? Array(5).fill({}) : filteredReports}
              keyExtractor={(item, index) => loading ? `skeleton-${index}` : item?.id}
              renderItem={({ item }) => loadingFilter ? renderSkeleton() : (
                <View className='w-[100%] flex flex-col  justify-start mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm'>
                  <View className='flex items-center flex-row gap-1'>
                    <Image source={icons.point} className='w-6 h-6 ml-3' />
                    <Text className='text-gray-400 my-1 text-md'>{item?.from}</Text>
                  </View>
                  <View className='flex items-center flex-row gap-1'>
                    <Image source={icons.to} className='w-6 h-6 ml-3' />
                    <Text className='text-gray-400 my-1 text-md'>{item?.to}</Text>
                  </View>
                  <View className='flex flex-row items-center justify-between w-full'>
                    <View className='flex flex-row-reverse items-center gap-1'>
                      <Text className='text-gray-500 text-sm font-semibold'>{convertToDate(item?.created_at)}</Text>
                      <Image source={icons.clock} className='w-6 h-6 ml-3' />
                    </View>
                    <View className='flex flex-row-reverse items-center gap-1'>
                      <Text className='text-gray-500 text-sm font-semibold'>{convertToTime(item?.created_at)}</Text>
                      <Image source={icons.date} className='w-6 h-6 ml-1' />
                    </View>
                  </View>
                  <View className='flex flex-row items-center justify-between w-full'>
                    <Text className='text-lg font-bold text-black'>₪</Text> <View className='flex flex-row items-center gap-2'> <Text className='text-gray-500 text-md'>{item?.price || "لم يتم تحديد السعر"}</Text></View>

                    <TouchableOpacity onPress={() => router.push(`/(root)/currentRide/${item?.id}`)}>
                      <Text className='text-blue-500 font-semibold text-lg'>عرض التفاصيل</Text>
                    </TouchableOpacity>
                  </View>
                  <View><Text>{formatDistanceToNow(new Date(item?.created_at), { addSuffix: true })}</Text></View>
                </View>
              )}
              onEndReached={loadMoreOrders}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="blue" /> : (
                <View className='h-[28rem]' style={{ padding: 10, backgroundColor: 'white' }}>
                </View>
              )}


            />
             */}

             
            <FlatList
              data={loadingFilter ? Array(5).fill({}) : filteredReports}
              keyExtractor={(item, index) => loadingFilter ? `skeleton-${index}` : item?.id}
              renderItem={({ item }) => loadingFilter ? renderSkeleton() : (
                <View className='w-[100%] flex flex-col  justify-start mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm'>
                  <View className='flex items-center flex-row gap-1'>
                    <Image source={icons.point} className='w-6 h-6 ml-3' />
                    <Text className='text-gray-400 my-1 text-md'>{item?.from}</Text>
                  </View>
                  <View className='flex items-center flex-row gap-1'>
                    <Image source={icons.to} className='w-6 h-6 ml-3' />
                    <Text className='text-gray-400 my-1 text-md'>{item?.to}</Text>
                  </View>
                  <View className='flex flex-row items-center justify-between w-full'>
                    <View className='flex flex-row-reverse items-center gap-1'>
                      <Text className='text-gray-500 text-sm font-semibold'>{convertToDate(item?.created_at)}</Text>
                      <Image source={icons.clock} className='w-6 h-6 ml-3' />
                    </View>
                    <View className='flex flex-row-reverse items-center gap-1'>
                      <Text className='text-gray-500 text-sm font-semibold'>{convertToTime(item?.created_at)}</Text>
                      <Image source={icons.date} className='w-6 h-6 ml-1' />
                    </View>
                  </View>
                  <View className='flex flex-row items-center justify-between w-full px-4'>
                    <View className='flex flex-row items-center gap-2'>
                      <Text className='text-lg font-bold text-black'>₪</Text>
                      <Text className='text-gray-500 text-md'>{item?.price || "لم يتم تحديد السعر "}</Text>
                    </View>

                    <TouchableOpacity onPress={() => router.push(`/(root)/currentRide/${item?.id}`)}>
                      <Text className='text-blue-500 font-semibold text-lg'>عرض التفاصيل</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              onEndReached={loadMoreOrders}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="blue" /> : (
                <View className='h-[58rem]' style={{ padding: 10, backgroundColor: 'white' }}>
                </View>
              )}


            />

          </View>
        )
      }
    </SafeAreaView>
  );
};

export default Rides;


// eas build --profile preview --platform android











// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const reports = () => {
//   return (
//     <View>
//       <Text className='flex items-center justify-center p-3 bg-[#2b2b2b] text-white text-center font-bold text-lg'>
//                   التقارير
//                 </Text>
//     </View>
//   )
// }

// export default reports

// const styles = StyleSheet.create({})


// import React, { useState } from "react";
// import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import DatePicker from "react-native-date-picker";
// import { Card } from "react-native-paper";

// const reports = [
//   {
//     id: "1",
//     date: "2025-03-13",
//     employees: ["اسمهان", "رحمة", "سهير"],
//     description: "من البريج نقطتين الى الزوايدة الشاليهات ثم دير البلح صحة المرأة",
//     team: "6",
//   },
//   {
//     id: "2",
//     date: "2025-03-10",
//     employees: ["بيسان"],
//     description: "من دير البلح أبو صفر الى الأقصى",
//     team: "9",
//   },
//   {
//     id: "3",
//     date: "2025-03-09",
//     employees: ["بتينة"],
//     description: "من المغازي الى دير البلح مقر بنقو",
//     team: "3",
//   },
// ];

// const ReportsScreen = () => {
//   const [fromDate, setFromDate] = useState(new Date("2025-02-01"));
//   const [toDate, setToDate] = useState(new Date("2025-03-26"));
//   const [openFrom, setOpenFrom] = useState(false);
//   const [openTo, setOpenTo] = useState(false);
//   const [filteredReports, setFilteredReports] = useState(reports);

//   const filterReports = () => {
//     const filtered = reports.filter((report) => {
//       const reportDate = new Date(report.date);
//       return reportDate >= fromDate && reportDate <= toDate;
//     });
//     setFilteredReports(filtered);
//   };

//   return (
//     <View className="p-4 bg-gray-100 flex-1">
//       {/* عنوان */}
//       <Text className="text-xl font-bold text-center mb-4">
//         قم بتحديد التاريخ لعرض الطلبات
//       </Text>

//       {/* حقول إدخال التواريخ */}
//       <View className="flex flex-row justify-between items-center mb-4">
//         <TouchableOpacity
//           className="p-3 border rounded-lg bg-white"
//           onPress={() => setOpenFrom(true)}
//         >
//           <Text>{fromDate.toISOString().split("T")[0]}</Text>
//         </TouchableOpacity>
//         <Text>إلى</Text>
//         <TouchableOpacity
//           className="p-3 border rounded-lg bg-white"
//           onPress={() => setOpenTo(true)}
//         >
//           <Text>{toDate.toISOString().split("T")[0]}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* أزرار اختيار التواريخ */}
//       <DatePicker
//         modal
//         open={openFrom}
//         date={fromDate}
//         mode="date"
//         onConfirm={(date) => {
//           setFromDate(date);
//           setOpenFrom(false);
//         }}
//         onCancel={() => setOpenFrom(false)}
//       />
//       <DatePicker
//         modal
//         open={openTo}
//         date={toDate}
//         mode="date"
//         onConfirm={(date) => {
//           setToDate(date);
//           setOpenTo(false);
//         }}
//         onCancel={() => setOpenTo(false)}
//       />

//       {/* زر البحث */}
//       <TouchableOpacity
//         className="bg-black p-3 rounded-lg mb-4"
//         onPress={filterReports}
//       >
//         <Text className="text-white text-center font-bold">عرض</Text>
//       </TouchableOpacity>

//       {/* عرض التقارير */}
//       {filteredReports.length > 0 ? (
//         <FlatList
//           data={filteredReports}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <Card className="mb-3 p-3">
//               <Text className="font-bold">التاريخ: {item.date}</Text>
//               <Text>الموظفين: {item.employees.join("، ")}</Text>
//               <Text>الوصف: {item.description}</Text>
//               <Text>الفريق: {item.team}</Text>
//             </Card>
//           )}
//         />
//       ) : (
//         <Text className="text-center text-gray-500">لا يوجد طلبات لعرضها</Text>
//       )}
//     </View>
//   );
// };

// export default ReportsScreen;
