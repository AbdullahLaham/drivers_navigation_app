import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect } from 'expo-router'
import enableRTL from "@/utils/rtlSetup";

const Home = () => {
    useEffect(() => {
    enableRTL();
  }, []);
  // return <Redirect href="/(auth)/welcome" />
  return <Redirect href="/(root)/(tabs)/home" />
}

export default Home

const styles = StyleSheet.create({});



