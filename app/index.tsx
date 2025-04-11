import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect, router } from 'expo-router'

import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';


// import * as Updates from 'expo-updates';


I18nManager.forceRTL(true); // فرض الاتجاه من اليمين إلى اليسار
I18nManager.allowRTL(true); // السماح بالتبديل إلى RTL إذا كانت اللغة تدعمه

const isRTL = Localization.isRTL; // التحقق مما إذا كانت اللغة الحالية RTL

const Home = () => {
  const [mounted, setMounted]  = useState(false);
  //   useEffect(() => {
  //   enableRTL();
  // }, []);

  // return <Redirect href="/(auth)/welcome" />

  // if (!mounted) {
  //   return 
  // }

  
  // useEffect(() => {
  //   setMounted(true)
  //   if (mounted) {
  //     return router.replace("/(auth)/welcome");
  //   }
  // }, [])


  return <Redirect href="/(auth)/welcome" />
  
  // return <Redirect href="/(root)/(tabs)/home" />
}

export default Home

const styles = StyleSheet.create({});

