import { useUser } from "@clerk/clerk-expo";
import { Image, ImageBackground, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InputField from "@/components/InputField";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const Profile = () => {
  // const { user } = useUser();
  const { currentUser: user, error, isError } = useSelector((state: any) => state?.auth);
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(logout());
    router.replace("/(auth)/sign-in")

  }
console.log(user?.data?.client?.profile_photo_url, 'img')


  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className='mt-1 flex items-center justify-center p-3 bg-[#2b2b2b] text-white text-center font-bold text-lg'>
          الملف الشخصي
        </Text>
        
       

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
          <View className="flex items-center justify-center my-5 w-full">
          {/* <ImageBackground
            source={{
              uri: user?.data?.client?.profile_photo_url || user?.data?.user?.profile_photo_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDayEMn7CibtcpD5rSfr-DDT3YwKG7QfLZrXCwngQ0NE7lhiJm8jetVaJhbpUks-81eeE&usqp=CAU',
            }}
             style={{ width: 110, height: 110, borderRadius: 55, resizeMode: 'cover' }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300"
          /> */}
          <View  className=" rounded-full h-[110px] w-[110px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-purple-500 "><Text className="uppercase font-bold text-6xl text-white">{user?.data?.client?.name.charAt(0) || user?.data?.user?.name.charAt(0)}</Text></View>
        </View>
            
            <InputField
              label="Name"
              placeholder={user?.data?.client?.name || user?.data?.user?.name}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Email"
              placeholder={user?.data?.client?.email || user?.data?.user?.email}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Phone"
              placeholder={user?.data?.name || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
            <CustomButton
                  
              title="تسجيل الخروج"
              onPress={onLogout}
              className="mt-6"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
