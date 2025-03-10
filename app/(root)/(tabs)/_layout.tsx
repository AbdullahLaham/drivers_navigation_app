import { Tabs } from "expo-router";

import { Image, ImageSourcePropType, View } from "react-native";

import { icons } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <SafeAreaView
    className={`flex flex-row justify-center items-center rounded-full ${focused ? "bg-general-700" : ""}`}
  >
    <View
      className={`rounded-full w-12 h-12 p-5 items-center justify-center  ${focused ? "bg-general-400" : ""}`}
    >
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-10 h-10"
      />
    </View>
  </SafeAreaView>
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderRadius: 50,
          paddingBottom: 20, // ios only
          paddingTop: 0,
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 10,
          height: 60,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
        },
      }}
    >
  
      

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
      
      
      <Tabs.Screen
        name="prices"
        options={{
          title: "Prices",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.dollar} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.chat} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
