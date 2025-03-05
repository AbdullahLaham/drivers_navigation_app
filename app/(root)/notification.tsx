import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { icons, images } from '@/constants';
import { router } from 'expo-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { useInfiniteQuery } from '@tanstack/react-query';

const Notification = () => {
  // current user
  const { currentUser: user } = useSelector((state: any) => state?.auth);

  // تحويل تاريخ ISO إلى تنسيق مناسب
  const convertToDate = (isoString: string) => format(parseISO(isoString), 'yyyy-MM-dd');
  const convertToTime = (isoString: string) => format(parseISO(isoString), 'HH:mm');

  // دالة جلب البيانات مع التمرير اللانهائي
  const fetchNotifications = async ({ pageParam = 1 }) => {
    console.log(`🔄 جلب الصفحة ${pageParam} من الإشعارات...`);
    const res = await axios.get(`https://ajwan.mahmoudalbatran.com/api/notifications?page=${pageParam}&limit=15`, {
      headers: { Authorization: `Bearer ${user?.data?.token}` },
    });

    return {
      data: res?.data?.notifications?.data || [],
      nextPage: res?.data?.notifications?.next_page_url ? pageParam + 1 : null,
    };
  };

  // استخدام useInfiniteQuery لتحميل البيانات تدريجيًا
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    getNextPageParam: (lastPage) => lastPage.nextPage || null,
  });

  const notifications = data?.pages.flatMap((page) => page.data) || [];

  return (
    <View>
      <View className="flex items-center justify-center p-3 bg-[#6d6969] relative">
        <Text className="text-white text-center font-bold text-lg block">الإشعارات</Text>
        <TouchableOpacity className="ml-auto absolute right-4 top-2 rounded-full px-2 py-1" onPress={() => router.push('/(root)/(tabs)/home')}>
          <Image source={icons.arrowRight} className="w-8 h-8 rounded-full p-2" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item: any) => item?.id}
        renderItem={({ item }) => (
          <View className="w-[100%] flex flex-col items-end justify-start mb-2 mx-1 border-b border-gray-400 p-1 rounded-sm px-7">
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
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <Text className="text-center py-2">جارٍ تحميل المزيد...</Text> : <View style={{ height: 200 }} />}
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
