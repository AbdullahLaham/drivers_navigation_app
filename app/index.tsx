import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect } from 'expo-router'
import enableRTL from "@/utils/rtlSetup";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Pusher from "pusher-js";
import AsyncStorage from '@react-native-async-storage/async-storage';



const Home = () => {
  //   useEffect(() => {
  //   enableRTL();
  // }, []);

  // return <Redirect href="/(auth)/welcome" />
  return <Redirect href="/(auth)/welcome" />
  
  // return <Redirect href="/(root)/(tabs)/home" />
}

export default Home

const styles = StyleSheet.create({});



