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
  ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import axios from "axios";

const Profile = () => {
  const { currentUser: user } = useSelector((state: any) => state?.auth);
  const dispatch = useAppDispatch();

  // State for profile image and modals
  const [profileImage, setProfileImage] = useState(
    user?.data?.client?.profile_photo_url || user?.data?.user?.profile_photo_url
  );
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // States for password change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
  const uploadProfileImage = async (imageUri: string) => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("profile_photo", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      // Replace with your API call, e.g.: await yourApi.updateProfileImage(formData);

      Alert.alert("Success", "Profile image updated successfully.");
      setImageModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile image.");
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

      Alert.alert("Success", "Password changed successfully.");
      setPasswordModalVisible(false);
      // Reset fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error ", `Failed to change password.with message ${error}`);
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
                <View  className=" rounded-full h-[110px] w-[110px] border-[3px] border-gray-300 shadow-sm shadow-neutral-300 flex items-center justify-center bg-purple-500 "><Text className="uppercase font-bold text-6xl text-white">{user?.data?.client?.name.charAt(0) || user?.data?.user?.name.charAt(0)}</Text></View>
                
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
            placeholder={user?.data?.phone_number || "Not Found"}
            containerStyle="w-full"
            inputStyle="p-3.5"
            editable={false}
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
            <CustomButton title="اختيار صورة" onPress={pickImage} className="mb-2" />
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
            {loading ?<View className="w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 h-[3rem] bg-blue-400 mt-5 mb-2">
                        <ActivityIndicator size={30} color="blue" />
                      </View> : 
                      <CustomButton title="حفظ" onPress={changePassword} className="mb-2" />}
            <CustomButton title="إلغاء" onPress={() => setPasswordModalVisible(false)} />
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
