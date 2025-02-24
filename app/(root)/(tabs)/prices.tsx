import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';

const Profile = () => {
  const prices = [
    {
      from: '',
      to: '',
      price: '',
      time: '',
    }
  ]
  return (
    <View>
      <Text className='flex items-center justify-center p-3 bg-[#2b2b2b] text-white text-center font-bold text-lg'>
        التسعيرات
      </Text>
      
      
      

    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})