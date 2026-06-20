import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform, StatusBar, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen({ navigation }: any) {
    // Local state for profile data
    const [name, setName] = useState('أنس بن محمد');
    const [phone, setPhone] = useState('0501234567');
    const [email, setEmail] = useState('anas@example.com');

    // State for the uploaded/captured profile image
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // Function to handle image picking (Camera or Gallery)
    const handleImagePick = async (useCamera: boolean) => {
        try {
            let result;

            if (useCamera) {
                // Request camera permissions first
                const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                if (permissionResult.granted === false) {
                    Alert.alert('عذراً', 'نحتاج إلى صلاحية الوصول للكاميرا لالتقاط صورة.');
                    return;
                }

                // Launch camera
                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
                });
            } else {
                // Launch gallery
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
                });
            }

            // If user didn't cancel, save the image URI to state
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Error picking image:", error);
            Alert.alert('خطأ', 'حدث خطأ أثناء محاولة اختيار الصورة.');
        }
    };

    // Function to show the action sheet/alert for image source selection
    const showImageOptions = () => {
        Alert.alert(
            "تغيير الصورة الشخصية",
            "اختر مصدر الصورة من فضلك",
            [
                { text: "إلغاء", style: "cancel" },
                { text: "التقاط بالكاميرا", onPress: () => handleImagePick(true) },
                { text: "اختيار من المعرض", onPress: () => handleImagePick(false) }
            ]
        );
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* Header */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-between border-b border-border z-10">
                <View className="w-10" />
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    تعديل البيانات
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Profile Image Section */}
                <View className="items-center mt-8 mb-8">
                    <TouchableOpacity activeOpacity={0.8} onPress={showImageOptions} className="relative">
                        <View className="w-28 h-28 rounded-full border-4 border-primary-light bg-gray-100 items-center justify-center overflow-hidden">
                            {/* Render image if selected, otherwise show placeholder icon */}
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <Feather name="user" size={50} color="#cbd5e1" />
                            )}
                        </View>
                        {/* Edit Icon Overlay */}
                        <View className="absolute bottom-0 right-0 bg-primary w-9 h-9 rounded-full border-2 border-white items-center justify-center shadow-sm">
                            <Feather name="camera" size={16} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-xs text-muted mt-3" style={{ fontFamily: 'Tajawal-Medium' }}>انقر لتغيير الصورة الشخصية</Text>
                </View>

                {/* Form Fields */}
                <View className="px-5 space-y-5">

                    {/* Full Name */}
                    <View className="w-full">
                        <Text className="text-sm text-slate-500 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>الاسم الكامل</Text>
                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm focus:border-primary">
                            <Feather name="user" size={18} color="#94a3b8" />
                            <TextInput
                                className="flex-1 text-right text-foreground mr-3 text-base h-full"
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0, textAlignVertical: 'center' }}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    {/* Phone Number */}
                    <View className="w-full mt-4">
                        <Text className="text-sm text-slate-500 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>رقم الجوال</Text>
                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm">
                            <Feather name="phone" size={18} color="#94a3b8" />
                            <TextInput
                                className="flex-1 text-right text-foreground mr-3 text-base h-full"
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0, textAlignVertical: 'center' }}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Email Address */}
                    <View className="w-full mt-4">
                        <Text className="text-sm text-slate-500 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>البريد الإلكتروني</Text>
                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm">
                            <Feather name="mail" size={18} color="#94a3b8" />
                            <TextInput
                                className="flex-1 text-right text-foreground mr-3 text-base h-full"
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0, textAlignVertical: 'center' }}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                </View>

                {/* Save Button */}
                <View className="px-5 mt-10">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-md shadow-primary/20"
                    >
                        <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            حفظ التغييرات
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}