import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { icons, images } from '@/constants';
import { router } from 'expo-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { useInfiniteQuery } from '@tanstack/react-query';
import WebView from 'react-native-webview';
import * as Location from "expo-location";

const Notification = () => {
    const [startLocation, setStartLocation] = useState<any>(null);
    const [locationPermission, setLocationPermission] = useState(false);
    
      useEffect(() => {
        const requestLocation = async () => {
          try {
            console.log("طلب الإذن للموقع...");
    
            const { status } = await Location.requestForegroundPermissionsAsync();
          
          if (status !== "granted") {
            Alert.alert("Permission Denied", "Please enable location services.");
            console.log("إذن الموقع مرفوض");
            return;
          }
    
          setLocationPermission(true);
          console.log("إذن الموقع مقبول، جاري جلب الموقع...");
    
          // بعد السماح بالموقع، جلب الموقع الحالي
          const location = await Location.getCurrentPositionAsync({});
          console.log(location, 'locat');
          // setCurrentLocation(location);
    
    
          // const address = await Location.reverseGeocodeAsync({
          //   latitude: location.coords?.latitude!,
          //   longitude: location.coords?.longitude!,
          // });
          // setAddress(`${address[0].name}, ${address[0].region}`);
    
          setStartLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
    
          
          // mapRef.current?.animateToRegion({
          //   latitude: location.coords.latitude,
          //   longitude: location.coords.longitude,
          //   latitudeDelta: 0.01,
          //   longitudeDelta: 0.01,
          // }, 1000);
    
    
          // if (mapRef.current) {
            // mapRef.current.animateToRegion(
            //   {
            //     latitude: location.coords.latitude,
            //     longitude: location.coords.longitude,
            //     latitudeDelta: 0.01,
            //     longitudeDelta: 0.01,
            //   },
            //   1000
            // );
          // } else {
          //   console.warn("mapRef.current is null, skipping animation");
          // }
    
    
    
          } catch(error) {
            console.error("Error fetching location:", error);
            Alert.alert("Error", "Failed to get location.");
          }
        };
    
        requestLocation();
      }, []);

    const generateMap = () => {
        const mapHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Map</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        </head>
        <body style="margin:0; padding:0;">
            <div id="map" style="width: 100vw; height: 100vh;"></div>
            <script>
                var map = L.map('map').setView([${startLocation?.latitude || 0}, ${startLocation?.longitude || 0}], 17);
    
                L.tileLayer('https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=28ff047a6cb14e4d8b81bc77d961a0b7', {
                    attribution: '© OpenStreetMap contributors, © Geoapify',
                    maxZoom: 20
                }).addTo(map);
    
                // إضافة علامة للموقع الحالي
                if (${startLocation ? "true" : "false"}) {
                    L.marker([${startLocation?.latitude}, ${startLocation?.longitude}])
                    .addTo(map)
                    .bindPopup('موقعك الحالي')
                    .openPopup();
                }
    
                // إضافة علامة لموقع آخر كمثال
                L.marker([31.5, 34.5]).addTo(map).bindPopup('موقع عشوائي');
    
            </script>
        </body>
        </html>
      `;
    
      // رسم الخط بين نقطتي البداية والنهاية
      // var latlngs = [[${startLat}, ${startLng}], [${endLat}, ${endLng}]];
      // var polyline = L.polyline(latlngs, {color: 'blue'}).addTo(map);
      // map.fitBounds(polyline.getBounds());
      return mapHtml;
      }
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
        <Text className="text-white text-center font-bold text-lg block">تفاصيل الطلب</Text>
        <TouchableOpacity className="ml-auto absolute right-4 top-2 rounded-full px-2 py-1" onPress={() => router.push('/(root)/(tabs)/home')}>
          <Image source={icons.arrowRight} className="w-8 h-8 rounded-full p-2" />
        </TouchableOpacity>
      </View>

      <View className='flex flex-row items-center gap-3 mx-5'>
        <View  className=" rounded-full h-[80px] w-[80px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-purple-500 "><Text className="uppercase font-bold text-6xl text-white">{user?.data?.client?.name.charAt(0) || user?.data?.user?.name.charAt(0)}</Text></View>
        <View className='flex flex-col justify-start items-start gap-2'>
            <Text className='text-gray-600 font-semibold  '>{user?.data?.client?.name} {user?.data?.client?.email}</Text>
            <Text className='text-gray-600 font-semibold  '>{user?.data?.client?.name} {user?.data?.client?.email}</Text>

        </View>

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
