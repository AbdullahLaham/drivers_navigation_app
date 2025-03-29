import { Link, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
// import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { login } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
// import { Loader, LoaderCircle } from "lucide-react-native";
const SignIn = () => {

  const [loading, setLoading] = useState(false);


  const dispatch = useAppDispatch();
  
  const router = useRouter();
  const {currentUser: user, error, isError} = useSelector((state: any) => state?.auth);
  


  // const { signIn, setActive, isLoaded } = useSignIn();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    // if (!isLoaded) return;
    setLoading(true);

    try {

      const res = dispatch(login({
        email: form?.email,
        password: form?.password,
      }));

      const client = await res;


      if (client?.payload?.data) {
        router.push(`/(root)/(tabs)/home`);
      } else {
      }

      // if (signInAttempt.status === "complete") {
      //   await setActive({ session: signInAttempt.createdSessionId });
      //   router.replace("/(root)/(tabs)/home");
      // } else {
      //   // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
      //   console.log(JSON.stringify(signInAttempt, null, 2));
      //   Alert.alert("Error", "Log in failed. Please try again.");
      // }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error");
    }finally {
      setLoading(false);
    }
  }, [ form]);

  useEffect(() => {
    if (user?.data?.token) {
      router.push(`/(root)/(tabs)/home`);
    }
  }, []);
 


  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.auth} className="z-0 w-full h-[250px]" />
          
        </View>
<Text className="text-2xl text-black font-JakartaSemiBold my-1">
            أهلا وسهلا 👋
          </Text>
        {isError && <Text className="mx-5 text-red-500 font-JakartaBold text-md bg-gray-100 rounded-lg p-2">{error}</Text>}

        <View className="p-5">
          <InputField
            label="الايميل"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="الرقم السري"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          {/* {loading ?  (
            <View className="w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 h-[3rem] bg-blue-400 mt-5">
              <Loader size={30} color="blue" className="animate-spin" /> 
            </View>
          ) :<CustomButton
          
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />} */}

        
        {loading ? (
            <View className="w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 h-[3rem] bg-blue-400 mt-5">
              <ActivityIndicator size={30} color="blue" />
            </View>
          ) : (
            <CustomButton
                  
          title="تسجيل الدخول"
          onPress={onSignInPress}
          className="mt-6"
        />
          )}

          {/* <OAuth /> */}

          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}

            // href="/sign-up"
            className="text-lg text-center text-general-200 mt-10 flex flex-row-reverse items-center gap-2 "
          >
            <Text className="font-semibold">هل أنت زبون جديد?</Text>
            <Text className="text-primary-500 font-JakartaExtraBold">أنشىء حسابا</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
