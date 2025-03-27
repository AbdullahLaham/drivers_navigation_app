import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
// import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/store";
// import { Loader } from "lucide-react-native";

const SignUp = () => {
  // const { isLoaded, signUp, setActive } = useSignUp();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading


  const dispatch = useAppDispatch();
  const {currentUser: user, error, isError} = useSelector((state: any) => state?.auth)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: '',
  });

  const onSignUpPress = async () => {
    setLoading(true); // Set loading to true when the sign up process starts

    // await fetchAPI("/(api)/user", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     name: form.name,
    //     email: form.email,
    //     // clerkId: completeSignUp.createdUserId,
    //   }),
      
    // });
    // console.log('hiiiiiiiiiii')
    try {

      const res = dispatch(register(
        {
          name: form?.name,
          email: form?.email,
          password: form?.password,
          phone_number: form?.phone_number
        }
      ));

      const client = await res;

      // console.log(client?.payload, 'pppp');

      if (client?.payload?.data) {
        router.push(`/(root)/(tabs)/home`);
      }

    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(err, 'errrrrrrrrr')
      Alert.alert("Error");
    }finally {
      setLoading(false); // Set loading to false after the sign up process finishes
    }
  };

  // useEffect(() => {
  //   if (user?.client?.name) {
  //     router.push(`/(root)/(tabs)/home`);

  //   }
  // }, []);

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
        <Text className="text-2xl text-black  w-full  font-JakartaSemiBold mt-2">
            أهلا وسهلا بك .انشئ حسابا 
        </Text>

        {isError && <Text className="mx-5 text-red-500 font-JakartaBold text-md bg-gray-100 rounded-lg p-2">{error}</Text>}
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Phone"
            placeholder="Phone Number"
            // textContentType="Number"
            icon={icons.phone}
            value={form.phone_number}
            onChangeText={(value) => setForm({ ...form, phone_number: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          {/* {loading ?  (
            <View className="w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 h-[3rem] bg-blue-400 mt-5">
              <Loader size={30} color="blue" className=" animate-spin" /> 
            </View>
          ) :<CustomButton
          title="انشاء حساب "
          onPress={onSignUpPress}
          className="mt-6"
        />} */}

        {loading ? (
            <View className="w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 h-[3rem] bg-blue-400 mt-5">
              <ActivityIndicator size={30} color="blue" />
            </View>
          ) : (
            <CustomButton
              title="انشاء حساب"
              onPress={onSignUpPress}
              className="mt-6"
            />
          )}
        
          
          {/* <OAuth /> */}
          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}
            className="text-lg text-center text-general-200 mt-10 flex flex-row-reverse items-center gap-2"
          >
            <Text className="font-semibold ">هل أنت زبون عند أجوان ?</Text>
            <Text className="text-primary-500 font-JakartaExtraBold">سجل الدخول</Text>
          </TouchableOpacity>
        </View>
        {/* <ReactNativeModal
          isVisible={verification.state === "pending"}
          // onBackdropPress={() =>
          //   setVerification({ ...verification, state: "default" })
          // }
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal> */}
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => router.push(`/(root)/(tabs)/home`)}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};
export default SignUp;



// import { Link, router } from "expo-router";
// import { useEffect, useState } from "react";
// import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { ReactNativeModal } from "react-native-modal";

// import CustomButton from "@/components/CustomButton";
// import InputField from "@/components/InputField";
// // import OAuth from "@/components/OAuth";
// import { icons, images } from "@/constants";
// import { fetchAPI } from "@/lib/fetch";
// import { useDispatch, useSelector } from "react-redux";
// import { login, register, verify } from "@/redux/features/auth/authSlice";
// import { useAppDispatch } from "@/redux/store";
// import axios from "axios";
// // import { Loader } from "lucide-react-native";

// const SignUp = () => {
//   // const { isLoaded, signUp, setActive } = useSignUp();

//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const dispatch = useAppDispatch();
//   const {currentUser: user, error, isError} = useSelector((state: any) => state?.auth);
//   console.log('currentUsere', user?.data)

//   const [form, setForm] = useState({
//     phone_number: '',
//   });
//   const [verification, setVerification] = useState({
//     state: "default", // "pending", "success"
//     code: "",
//     error: "",
//   });

//   const onSignUpPress = async () => {

//     try {

//       const res = await axios.post('https://ajwan.mahmoudalbatran.com/api/login', {
//         phone: form?.phone_number
//       })
      

//       if (res?.data) {
//         setVerification({ ...verification, state: "pending" });
//       }

//       console.log(res?.data?.message, 'pppp');

//       // if (client?.payload?.data) {
//       //   router.push(`/(root)/(tabs)/home`);
//       // }

//     } catch (err: any) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.log(err, 'errrrrrrrrr')
//       Alert.alert("Error");
//     }
//   };

//   const onPressVerify = async () => {
//     try {

      
//       // const res = await fetchAPI("/verify-code", {
//       //   method: "POST",
//       //   body: JSON.stringify({
//       //     phone_number: form.phone_number,
//       //     code: verification.code,
//       //   }),
//       // });




//       const res = dispatch(verify({
//         phone: form?.phone_number,
//         login_code: verification?.code,
//       }));
//       const client = await res;
//       console.log('hello', client);

//       if (client?.payload?.data) {
//         console.log('token is ', client?.payload?.data);
//         setVerification({ ...verification, state: "success" });
//       } else {
//         setVerification({ ...verification, error: "Invalid verification code." });
//       }
//     } catch (error) {
//       console.error(error);
//       setVerification({ ...verification, error: "Verification failed." });
//     }
//   };
  




//   useEffect(() => {
//     if (user?.data) {
//       router.push(`/(root)/(tabs)/home`);
//     }
//   }, []);




//   return (
//     <ScrollView className="flex-1 bg-white">
//       <View className="flex-1 bg-white">
//         <View className="relative w-full h-[250px]">
//           <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
//           <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
//             أهلا وسهلا بك .انشئ حسابا 
//           </Text>
//         </View>

//         {isError && <Text className="mx-5 text-red-500 font-JakartaBold text-md bg-gray-100 rounded-lg p-2">{error}</Text>}
//         <View className="p-5">
//           <InputField
//             label="Phone"
//             placeholder="Phone Number"
//             // textContentType="Number"
//             icon={icons.phone}
//             value={form.phone_number}
//             onChangeText={(value) => setForm({ ...form, phone_number: value })}
//           />

//         <CustomButton
//           title="انشاء حساب "
//           onPress={onSignUpPress}
//           className="mt-6"
//         />
        
          
//           {/* <OAuth /> */}
//           {/* <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}
//             className="text-lg text-center text-general-200 mt-10 flex flex-row-reverse items-center gap-2"
//           >
//             <Text className="font-semibold ">هل أنت زبون عند أجوان ?</Text>
//             <Text className="text-primary-500 font-JakartaExtraBold">سجل الدخول</Text>
//           </TouchableOpacity> */}
//         </View>
//         <ReactNativeModal
//           isVisible={verification.state === "pending"}
//           // onBackdropPress={() =>
//           //   setVerification({ ...verification, state: "default" })
//           // }
//           onModalHide={() => {
//             if (verification.state === "success") {
//               setShowSuccessModal(true);
//             }
//           }}
//         >
//           <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
//             <Text className="font-JakartaExtraBold text-2xl mb-2 فثءف-ث">
//               التحقق من رقم الهاتف
//             </Text>
//             <Text className="font-Jakarta mb-5">
//               تواصل مع صاحب المكتب لتزويدك ب كود التحقق.
//             </Text>
//             <InputField
//               label={"Code"}
//               icon={icons.lock}
//               placeholder={"12345"}
//               value={verification.code}
//               keyboardType="numeric"
//               onChangeText={(code) =>
//                 setVerification({ ...verification, code })
//               }
//             />
//             {verification.error && (
//               <Text className="text-red-500 text-sm mt-1">
//                 {verification.error}
//               </Text>
//             )}
//             <CustomButton
//               title="Verify Phone Number"
//               onPress={onPressVerify}
//               className="mt-5 bg-success-500"
//             />
//           </View>
//         </ReactNativeModal>
//         <ReactNativeModal isVisible={showSuccessModal}>
//           <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
//             <Image
//               source={images.check}
//               className="w-[110px] h-[110px] mx-auto my-5"
//             />
//             <Text className="text-3xl font-JakartaBold text-center">
//               Verified
//             </Text>
//             <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
//               تم التحقق من حسابك بنجاح
//             </Text>
//             <CustomButton
//               title="الصفحة الرئيسية"
//               onPress={() => {router.push(`/(root)/(tabs)/home`); setShowSuccessModal(false)}}
//               className="mt-5"
//             />
//           </View>
//         </ReactNativeModal>
//       </View>
//     </ScrollView>
//   );
// };
// export default SignUp;
