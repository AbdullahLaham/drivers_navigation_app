import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity, Image, SafeAreaView } from "react-native";
// import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import API from "@/redux/features/MainApi";
import { useSelector } from "react-redux";
import WebView from "react-native-webview";
import { useAppDispatch } from "@/redux/store";
import { createRide } from "@/redux/features/auth/authSlice";
import { icons } from "@/constants";
import { router } from "expo-router";
import usePusherNotifications from "@/hooks/usePusherNotifications";
// import {  Target } from "lucide-react-native";

export default function Page() {
  // current user
  const {currentUser: user} = useSelector((state: any) => state?.auth);
  // dispatch
  const dispatch = useAppDispatch();


  const [changeLoc, setChangeLoc] = useState(false);

  const mapRef = useRef<any>(null);

  const [inpuStartLocation, setInpuStartLocation] = useState('')
  const [inpuEndLocation, setInpuEndLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [address, setAddress] = useState('');

  const [startLocation, setStartLocation] = useState<any>(null);
  const [endLocation, setEndLocation] = useState<any | null>(null);

  // console.log(startLocation, endLocation);
  const [selectedSug, setSelectedSug] = useState<any | null>(null)
  const [query, setQuery] = useState("");

  const [suggestions, setSuggestions] = useState([{
    "place_id": 390129430,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 1338243107,
    "lat": "30.0541134",
    "lon": "31.32286366816771",
    "class": "amenity",
    "type": "university",
    "place_rank": 30,
    "importance": 0.000079604028381735,
    "addresstype": "amenity",
    "name": "جامعة الأزهر (فرع البنات)",
    "display_name": "جامعة الأزهر (فرع البنات), طريق النصر, منطقه السينما, ثان مدينة نصر, القاهرة, 11759, مصر",
    "boundingbox": [
      "30.0515288",
      "30.0564047",
      "31.3209371",
      "31.3246005"
    ]
  },
  // {
  //   "place_id": 41861832,
  //   "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
  //   "osm_type": "node",
  //   "osm_id": 432191180,
  //   "lat": "31.5336282",
  //   "lon": "35.0979762",
  //   "class": "amenity",
  //   "type": "university",
  //   "place_rank": 30,
  //   "importance": 0.3448456713926686,
  //   "addresstype": "amenity",
  //   "name": "جامعة بوليتكنيك فلسطين",
  //   "display_name": "جامعة بوليتكنيك فلسطين, شارع عين خير الدين, الخليل, المدينة القديمة, مركز المدينة, الخليل, منطقة H1, الضفة الغربية, 150, Palestinian Territory",
  //   "boundingbox": [
  //     "31.5335782",
  //     "31.5336782",
  //     "35.0979262",
  //     "35.0980262"
  //   ]
  // },
  {
    "place_id": 42016742,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 41306746,
    "lat": "31.4771994",
    "lon": "34.405015151544774",
    "class": "amenity",
    "type": "university",
    "place_rank": 30,
    "importance": 0.32649689072535304,
    "addresstype": "amenity",
    "name": "جامعة فلسطين",
    "display_name": "جامعة فلسطين, شارع عكا, الزهراء‎, الزهرة مدينة, محافظة غزة, قطاع غزة, Palestinian Territory",
    "boundingbox": [
      "31.4758106",
      "31.4783958",
      "34.4032858",
      "34.4067669"
    ]
  },]);

  const [locationPermission, setLocationPermission] = useState(false);





  // const requestLocationPermission = async () => {
  //   const { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     Alert.alert("Permission Denied", "Please enable location services.");
  //     return;
  //   }
  //   setLocationPermission(true);
  //   getCurrentLocation();
  // };

  // const getCurrentLocation = async () => {
  //   if (!locationPermission) return;
  //   const location = await Location.getCurrentPositionAsync({});
  //   console.log("الموقع الحالي:", location.coords);
  //   console.log(location, 'location')
  //   setStartLocation({
  //     latitude: location.coords.latitude,
  //     longitude: location.coords.longitude,
  //   });
  //   const newRegion = {
  //     latitude: location.coords.latitude,
  //     longitude: location.coords.longitude,
  //     latitudeDelta: 0.01,
  //     longitudeDelta: 0.01,
  //   };
  //   mapRef.current?.animateToRegion(newRegion, 1000);

  // };
  
  const selectNewLocation = (region: any) => {

    const newRegion = {
      latitude: parseFloat(region?.lat),
      longitude: parseFloat(region?.lon),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
  }




  // const searchPlaces = async (text: string) => {

  //   // setQuery(text);
  //   if (text.length > 3) {
  //     console.log('Fetching data...');
  //     // const response = await fetch(
  //     //   `https://nominatim.openstreetmap.org/search?format=json&q=${text}`
  //     // );

  //     const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${text}`);

  //     console.log(res, 'ser');
  //     console.log('ok', res.status);
  //     console.log('Data received:', res.data);
  //     setSuggestions(res?.data);
  //   } else {
  //     setSuggestions([]);
  //   }
  // };

  // create new Ride
  
  const onCreateRide = async () => {
    console.log(user?.data?.token, 'token');
    try {
      console.log({
        from: inpuStartLocation,
        to: inpuEndLocation,
      })
      const res = await axios.post('https://ajwan.mahmoudalbatran.com/api/orders', {
        from: inpuStartLocation,
        to: inpuEndLocation,
      },
    {
     headers: {
      Authorization: `Bearer ${user?.data?.token}`
     } 
    });


    console.log('res', res);
    if (res?.data) {
      setInpuEndLocation("");
      setInpuStartLocation("");
        alert("تم تأكيد الرحلة");
    }
    dispatch(createRide());

    } catch(error) {

    }


  }

  // useEffect(() => {
  //   requestLocationPermission();
  // }, []);






  // useEffect(() => {
  //   const fetchLocation = async () => {
  //     await getCurrentLocation();
  //   };
  
  //   fetchLocation();
  // }, []);
  
  // useEffect(() => {
  //   if (mapRef.current && startLocation) {
  //     mapRef?.current?.animateToRegion({
  //     latitude: startLocation.latitude,
  //     longitude: startLocation.longitude,
  //     latitudeDelta: 0.01,
  //     longitudeDelta: 0.01,
  //   });
  //   }
    
  // }, [startLocation]);
  



// const getLocationName = async (location: any) => {
//   const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${location?.latitude}&lon=${location?.longitude}&format=json`);
//   console.log(res?.data, 'resres');
//   setCurrentLocation(res?.data?.display_name  || "Location not found");
//   return res?.data?.display_name;
// }






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












  // useEffect(() => {
    // if (mapRef.current && startLocation) {
    //   mapRef.current.animateToRegion({
    //     latitude: startLocation.latitude,
    //     longitude: startLocation.longitude,
    //     latitudeDelta: 0.01,
    //     longitudeDelta: 0.01,
    //   }, 1000);
    // }
  // }, [startLocation]);




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
  

  usePusherNotifications();
  
  return (
    <SafeAreaView className="flex-1 relative ">
      <TouchableOpacity onPress={() => router.push('/(root)/notification')} className=" absolute top-3 right-3 flex items-center justify-center bg-emerald-200 rounded-full w-10 h-10 z-10 p-5 active:bg-green-300 transition-all ">
        <Image source={icons.bell} className="w-8 h-8" />
        <View className="w-2 h-2 rounded-full bg-red-500 absolute left-1 bottom-1"></View>
      </TouchableOpacity>
      {/* 🔍 مربع البحث */}
      
      

      <View className="absolute -top-10 left-0 right-0    z-10 ">
        
      {/* <TextInput
        // dir='rtl'
        className="  h-[3rem] py-3 mt-[3rem]   px-3 my-1 border-none outline-none bg-gray-200 placeholder:text-gray-600 rounded-lg mx-2"
        placeholder="ابحث عن موقع..."
        value={query}
        onChangeText={(text) => setQuery(text) }
      /> */}
      
        {/* {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item: any) => item?.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  selectNewLocation(item);
                  setSelectedSug(item);
                  // setChangeLoc(true);
                  setEndLocation({
                    latitude: parseFloat(item?.lat),
                    longitude: parseFloat(item?.lon),
                  });
                  console.log({
                    latitude: parseFloat(item?.lat),
                    longitude: parseFloat(item?.lon),
                  })
                  setQuery(item.display_name);
                  setSuggestions([]);
                }}
              >
                <Text>{item?.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        )} */}
      </View>

      <WebView ref={mapRef} originWhitelist={["*"]} source={{ html: generateMap() }} />

      {/* 📌  بيانات الرحلة */}
      <View className=" mt-auto mb-[5rem] flex flex-col ">
      {/* className="flex flex-raw w-full items-center justify-start gap-1 rounded-md mx-2" */}
      <View className="flex flex-row ">
        <TouchableOpacity  onPress={() => { setInpuStartLocation(JSON.stringify(startLocation));  console.log('')}}>
          <View className="bg-gray-300 ml-1  h-[3rem] w-[3rem] rounded-lg mt-1 flex items-center justify-center" >
            {/* <Target color="gray" size={25} className="text-red-500 bg-red-800" /> */}
            <Image source={icons.pin} className={`w-5 h-6`}/>
          </View>
        </TouchableOpacity>
        <TextInput className="flex-1 rounded-lg mx-2 placeholder:text-gray-400 placeholder:text-end placeholder:text-lg my-1 border-none outline-none  bg-gray-200   h-[3rem]" placeholder="موقعي الحالي" value={inpuStartLocation} onChangeText={(text) => setInpuStartLocation(text)} />
      </View>
      <TextInput
        className="rounded-lg mx-2 placeholder:text-gray-400 placeholder:text-end placeholder:text-lg my-1 border-none outline-none  bg-gray-200   h-[3rem]"
        // value={query}
        value={inpuEndLocation}
        onChangeText={(text) => setInpuEndLocation(text)}
        placeholder="الوجهة"
      />

        {/* <Text>المسافة: 🚗 (يتم الحساب...) | الوقت: ⏳ | السعر: 💰</Text> */}
        <Button  title="تأكيد الرحلة" onPress={() => onCreateRide()} />

        {/* {endLocation && (
          
        )} */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  inputContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  input: {
    height: 60,
    padding: 20,
    borderColor: 'none',
    outline: 'none',
    marginBottom: 10,
    paddingLeft: 8,
  },
  searchInput: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    margin: 10,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
});
