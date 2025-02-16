import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

export default function Page() {

  const [changeLoc, setChangeLoc] = useState(false);

  const mapRef = useRef<MapView>(null);

  const [inpuStartLocation, setInpuStartLocation] = useState('')
  const [inpuEndLocation, setInpuEndLocation] = useState('')
  const [startLocation, setStartLocation] = useState({
    latitude: 31.5003,
    longitude: 34.4662,
  });
  const [endLocation, setEndLocation] = useState<any | null>(null);

  console.log(startLocation, endLocation);
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
  {
    "place_id": 41861832,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "node",
    "osm_id": 432191180,
    "lat": "31.5336282",
    "lon": "35.0979762",
    "class": "amenity",
    "type": "university",
    "place_rank": 30,
    "importance": 0.3448456713926686,
    "addresstype": "amenity",
    "name": "جامعة بوليتكنيك فلسطين",
    "display_name": "جامعة بوليتكنيك فلسطين, شارع عين خير الدين, الخليل, المدينة القديمة, مركز المدينة, الخليل, منطقة H1, الضفة الغربية, 150, Palestinian Territory",
    "boundingbox": [
      "31.5335782",
      "31.5336782",
      "35.0979262",
      "35.0980262"
    ]
  },
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


  useEffect(() => {
    requestLocationPermission();
  }, []);



  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please enable location services.");
      return;
    }
    setLocationPermission(true);
    getCurrentLocation();
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) return;
    const location = await Location.getCurrentPositionAsync({});
    console.log(location, 'location')
    setStartLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const searchPlaces = async (text: string) => {
    // setQuery(text);
    if (text.length > 3) {
      console.log('Fetching data...');
      // const response = await fetch(
      //   `https://nominatim.openstreetmap.org/search?format=json&q=${text}`
      // );

      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${text}`);

      console.log(res, 'ser');
      console.log('ok', res.status);
      console.log('Data received:', res.data);
      setSuggestions(res?.data);
    } else {
      setSuggestions([]);
    }
  };

  // create new Ride
  const onCreateRide = () => {
    alert("تم تأكيد الرحلة");
  }


  return (
    <View className="flex-1 relative ">
      {/* 🔍 مربع البحث */}
      <TextInput
        // dir='rtl'
        className="w-full py-2 px-3 my-1 border-none outline-none placeholder:"
        placeholder="ابحث عن موقع..."
        value={query}
        onChangeText={(text) => { setQuery(text); console.log(query, 'qq'); searchPlaces(query) }}
      />

      <View className="">
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item: any) => item?.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setSelectedSug(item);
                  setChangeLoc(true)
                  setEndLocation({
                    latitude: parseFloat(item?.lat),
                    longitude: parseFloat(item?.lon),
                  });
                  console.log({
                    latitude: parseFloat(item?.lat),
                    longitude: parseFloat(item?.lon),
                  })
                  setQuery(item.display_name);
                  // setSuggestions([]);
                }}
              >
                <Text>{item?.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* 🗺️ الخريطة */}



      {/* 📌  بيانات الرحلة */}
      <View className="mt-auto mb-[5rem]">
        <View className="flex flex-raw w-full items-center justify-start gap-1 rounded-md mx-2">
          <TextInput className="rounded-md placeholder:text-gray-600 placeholder:text-end placeholder:text-lg my-1 border-none outline-none flex-1 bg-gray-200 w-full py-2 px-3" placeholder="موقعي الحالي" value={inpuStartLocation} onChangeText={(text) => setInpuStartLocation(text)} />
        </View>
        <View className="flex flex-raw-reverse items-center justify-start gap-1  rounded-md mx-2">
          <TextInput
            className="rounded-md  placeholder:text-gray-600 placeholder:text-end placeholder:text-lg my-1 border-none outline-none flex-1 bg-gray-200 w-full py-2 px-3"
            // value={query}
            value={inpuEndLocation}
            onChangeText={(text) => setInpuEndLocation(text)}
            placeholder="الوجهة"
          />
        </View>

        {/* <Text>المسافة: 🚗 (يتم الحساب...) | الوقت: ⏳ | السعر: 💰</Text> */}
        <Button title="تأكيد الرحلة" onPress={() => onCreateRide()} />

        {/* {endLocation && (
          
        )} */}
      </View>
    </View>
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
