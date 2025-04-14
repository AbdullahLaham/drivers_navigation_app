import { useState } from "react";
import {
  Modal,
  Image,
  ScrollView,
  Text,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { logout, updateUser } from "@/redux/features/auth/authSlice";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import axios from "axios";
import mime from "mime";



const Profile = () => {
  const { currentUser: user, updatedUser } = useSelector((state: any) => state?.auth);
  const dispatch = useAppDispatch();
  console.log('pppppppppppppppppppp',user?.data?.client?.profile_photo_url, user?.data?.user?.profile_photo_url)

  // State for profile image and modals
  const [profileImage, setProfileImage] = useState(
    updatedUser?.profile_photo_url || user?.data?.client?.profile_photo_url || user?.data?.user?.profile_photo_url
  );
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [personalDataModalVisible, setPersonalDataModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // States for password change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");


  const [updateName, setUpdateName] = useState("");
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [personalDataError, setPersonalDataError] = useState("");




  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    router.replace("/(auth)/sign-in");

  };

  // Function to pick a new image from the library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });



    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      uploadProfileImage(uri);
    }


  };

  // Dummy function to simulate uploading a profile image
  // const uploadProfileImage = async (imageUri: string) => {
  //   setLoading(true)
  //   try {
  //   //   const fileType = mime.getType(imageUri) || "image/jpeg";
  //   // const fileExtension = fileType.split("/")[1]; // استخراج الامتداد

  //   // const imageName = imageUri.split('/').pop(); // استخراج اسم الصورة

  //   // const formData = new FormData();
  //   // formData.append("profile_photo", {
  //   //   uri: imageUri,
  //   //   name: `profile.${fileExtension}`, // اسم الملف مع الامتداد الصحيح
  //   //   type: fileType, // نوع الملف الصحيح
  //   // } as any); // تحويل البيانات إلى النوع المناسب


  //   const formData = new FormData();

  //   // If you want to send the imageUri directly as the file (without modification)
  //   formData.append("profile_photo", {
  //     uri: imageUri,  // The path of the image
  //     name: imageUri.split('/').pop(),  // Use the file name extracted from the URI
  //     type: 'image/jpeg', // Default type (you can adjust this if you know the exact mime type)
  //   } as any)
  //   formData.append("name", user?.data?.client?.name || user?.data?.user?.name);
  //   formData.append("phone_number", user?.data?.client?.phone_number || user?.data?.user?.phone_number || '202020',);
  //   formData.append("email", user?.data?.client?.email || user?.data?.user?.email);




  //   console.log('formmmmmmmmmmm', formData)
  //     const response = await axios.post(
  //       "https://ajwan.mahmoudalbatran.com/api/updateprofile",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${user?.data?.token}`,
  //         },
  //       }
  //     );

  //     if (response?.data) {
  //       Alert.alert("نجاح", "تم تحديث صورة الملف الشخصي بنجاح.");

  //     } else {
  //       Alert.alert("خطأ", "حدث خطأ أثناء تحديث الصورة.");
  //       console.log(response?.data, 'rrrrrrrrrrrrrrrrrrrr')
  //     }
  //     setImageModalVisible(false);

  //   } catch (error: any) {
  //     console.error("Upload Error:", error.response?.data?.message);

  //     if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
  //       Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
  //     } else {
  //       Alert.alert("خطأ", error.response?.data?.message || "فشل في تحديث صورة الملف الشخصي.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const uploadProfileImage = async (imageUri: string) => {
    setLoading(true);
    try {
      //     console.log(imageUri, 'uriiiiiiiiiiiiii')
      //     const fileType = mime.getType(imageUri) || "image/jpeg";
      //     const fileExtension = fileType.split("/")[1];
      //     const imageName = `profile.${fileExtension}`;

      //     const formData = new FormData();

      //     formData.append("profile_photo", {
      //       uri: imageUri,
      //       name: imageName,
      //       type: fileType,
      //     } as any);

      //     formData.append("name", user?.data?.client?.name || user?.data?.user?.name);
      //     formData.append(
      //       "phone_number",
      //       user?.data?.client?.phone_number || user?.data?.user?.phone_number || "202020"
      //     );
      //     formData.append("email", user?.data?.client?.email || user?.data?.user?.email);

      //     const response = await axios.post(
      //       "https://ajwan.mahmoudalbatran.com/api/updateprofile",
      //       formData,
      //       {
      //         headers: {
      //           "Content-Type": "multipart/form-data",
      //           Authorization: `Bearer ${user?.data?.token}`,
      //         },
      //       }
      //     );
      // console.log(response)
      //     if (response?.data) {
      //       Alert.alert("نجاح", "تم تحديث صورة الملف الشخصي بنجاح.");
      //       setImageModalVisible(false);
      //     } else {
      //       Alert.alert("خطأ", "حدث خطأ أثناء تحديث الصورة.");
      //       console.log(response?.data, "rrrrrrrrrrrrrrrrrrrr");
      //     }

      const formData = new FormData();
      const fileType = mime.getType(imageUri) || "image/jpeg";
      const fileExtension = fileType.split("/")[1];
      const imageName = `profile.${fileExtension}`;
      formData.append("name", user?.data?.client?.name || user?.data?.user?.name);
      formData.append(
        "phone_number",
        user?.data?.client?.phone_number || user?.data?.user?.phone_number || "202020"
      );
      formData.append("email", user?.data?.client?.email || user?.data?.user?.email);

      //     // إعداد ملف الصورة
      // formData.append("profile_photo_path", {
      //   uri: imageUri, // حط uri الخاص بك هنا
      //   name: "profile.jpg", // اسم عشوائي أو الاسم الحقيقي
      //   type: "image/jpeg",   // لازم تحدد نوع الصورة
      // });

      formData.append("profile_photo_path", {
        uri: imageUri, // حط uri الخاص بك هنا
        name: imageName, // اسم عشوائي أو الاسم الحقيقي
        type: fileType,   // لازم تحدد نوع الصورة
      });

      const response = await fetch("https://ajwan.mahmoudalbatran.com/api/updateprofile", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          Authorization: `Bearer ${user?.data?.token}`,
          // لا تحط Content-Type هنا! خلي React Native يحطها تلقائيًا
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data, 'tttttttttttttttttttttttttttttttttttttttttttt');
      if (data) {
        Alert.alert("نجاح", "تم تحديث صورة الملف الشخصي بنجاح.");
        setImageModalVisible(false);
        dispatch(updateUser(data?.user));
      } else {
        Alert.alert("خطأ", "حدث خطأ أثناء تحديث الصورة.");
        console.log(data, "rrrrrrrrrrrrrrrrrrrr");
      }

    } catch (error: any) {
      console.error("Upload Error:", error.response?.data || error.message);

      if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
        Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
      } else {
        Alert.alert("خطأ", error.response?.data?.message || "فشل في تحديث صورة الملف الشخصي.");
      }
    } finally {
      setLoading(false);
    }
  };


  // Function to handle password change
  const changePassword = async () => {
    // Basic validation: ensure new password and confirmation match
    setLoading(true)
    if (newPassword !== confirmPassword) {
      Alert.alert("Validation Error", "New password and confirmation do not match.");
      return;
    }

    try {
      // Replace with your API call to update the password:
      // e.g., await yourApi.changePassword({ oldPassword, newPassword });
      const res = await axios.post(`https://ajwan.mahmoudalbatran.com/api/updatepassword`, {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token}`
          }
        });

      Alert.alert("تم بنجاح", "تم تغيير الرقم السري بنجاح");
      setPasswordError("")  
      setPasswordModalVisible(false);
      // Reset fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
        Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
        return; // لا نسجل خروج المستخدم
      }
      setPasswordError(error?.response?.data?.message)
      console.log('eeeeeeeeeeeeeeeeeeee', error?.response?.data?.message)


      // Alert.alert(`${error?.response?.data?.message}`);


    } finally {
      setLoading(false)
    }
  };


  // Function to handle personal data (name, email, phone_nu,ber) change
const changePersonalData = async () => {
  // Basic validation: ensure new password and confirmation match
  setLoading(true)


  try {
    // Replace with your API call to update the password:
    // e.g., await yourApi.changePassword({ oldPassword, newPassword });
    const res = await axios.post(`https://ajwan.mahmoudalbatran.com/api/updateotherprofile`, {
      name: updateName || user?.data?.client?.name || user?.data?.user?.name ,
      email: updateEmail || user?.data?.client?.email || user?.data?.user?.email,
      phone_number: updatePhoneNumber || user?.data?.client?.phone_number || user?.data?.user?.phone_number,
    },
      {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`
        }
      });
      dispatch(updateUser(res?.data?.user));
      // console.log(res?.data, 'ddddddddddddddddddddddddddddddddd')

    Alert.alert("تم بنجاح", "تم نغيير بياناتك الشخصيه بنجاح.");
    setPersonalDataError("")
    setPasswordModalVisible(false);
    setPersonalDataModalVisible(false);
    // Reset fields
    setUpdateEmail("");
    setUpdateName("");
    setUpdatePhoneNumber("");
  } catch (error) {
    if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
      Alert.alert("خطأ في الاتصال", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
      return; // لا نسجل خروج المستخدم
    }
    setPersonalDataError(error?.response?.data?.message)
    // Alert.alert("خطأ ", `فشل في تغيير بياناتك الشخصيه ${error}`);


  } finally {
    setLoading(false)
  }
};
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}>
        <Text style={styles.headerText}>الملف الشخصي</Text>

        <View style={styles.card}>
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
              {profileImage?.startsWith('https://ui-avatars.com/api') ? (
                <View className=" rounded-full h-[110px] w-[110px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-purple-500 "><Text className="uppercase font-bold text-6xl text-white">{user?.data?.client?.name.charAt(0) || user?.data?.user?.name.charAt(0)}</Text></View>

              ) : (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />

              )}
            </TouchableOpacity>
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
            placeholder={user?.data?.client?.phone_number || user?.data?.user?.phone_number ||"Not Found"}
            containerStyle="w-full"
            inputStyle="p-3.5"
            editable={false}
          />
          <CustomButton
            title="تغيير البيانات الشخصية "
            onPress={() => setPersonalDataModalVisible(true)}
            className="mt-4"
          />
          <CustomButton
            title="تغيير كلمة المرور"
            onPress={() => setPasswordModalVisible(true)}
            className="mt-4"
          />

          <CustomButton
            title="تسجيل الخروج"
            onPress={onLogout}
            className="mt-6"
          />
        </View>
      </ScrollView>

      {/* Modal for changing profile image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تغيير الصورة الشخصية</Text>
            {loading ? (
              <View className="w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 h-[3rem] bg-blue-400 mt-5 mb-2">
                <ActivityIndicator size={30} color="blue" />
              </View>
            ) : <CustomButton title="اختيار صورة" onPress={pickImage} className="mb-2" />}
            <CustomButton title="إلغاء" onPress={() => setImageModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal for changing password */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تغيير كلمة المرور</Text>
            {passwordError && <Text className="mx-5 text-red-500 font-JakartaBold text-md bg-gray-100 rounded-lg p-2">{passwordError}</Text>}
            <TextInput
              placeholder="أدخل كلمة المرور القديمة"
              secureTextEntry
              style={styles.input}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              placeholder="أدخل كلمة المرور الجديدة"
              secureTextEntry
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="تأكيد كلمة المرور الجديدة"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {loading ? <View className="w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 h-[3rem] bg-blue-400 mt-5 mb-2">
              <ActivityIndicator size={30} color="blue" />
            </View> :
              <CustomButton title="حفظ" onPress={changePassword} className="mb-2" />}
            <CustomButton title="إلغاء" onPress={() => setPasswordModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal for changing personal data */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={personalDataModalVisible}
        onRequestClose={() => setPersonalDataModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تغيير البيانات الشخصية </Text>
            {personalDataError && <Text className="mx-5 text-red-500 font-JakartaBold text-md bg-gray-100 rounded-lg p-2">{personalDataError}</Text>}
            <TextInput
              placeholder={user?.data?.client?.name || user?.data?.user?.name}
              style={styles.input}
              value={updateName}
              onChangeText={setUpdateName}
            />
            <TextInput
              placeholder={user?.data?.client?.phone_number || user?.data?.user?.phone_number}
              style={styles.input}
              value={updatePhoneNumber}
              onChangeText={setUpdatePhoneNumber}
            />
            <TextInput
              placeholder={user?.data?.client?.email || user?.data?.user?.email}
              style={styles.input}
              value={updateEmail}
              onChangeText={setUpdateEmail}
            />
            {loading ? <View className="w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 h-[3rem] bg-blue-400 mt-5 mb-2">
              <ActivityIndicator size={30} color="blue" />
            </View> :
              <CustomButton title="حفظ" onPress={changePersonalData} className="mb-2" />}
            <CustomButton title="إلغاء" onPress={() => setPersonalDataModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    marginTop: 16,
    textAlign: "center",
    padding: 12,
    backgroundColor: "#2b2b2b",
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#ccc",
  },
  initialImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#ccc",
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
});

export default Profile;
