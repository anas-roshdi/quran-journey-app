import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ResetPasswordScreen({ navigation }: any) {
    // State management for passwords and modal
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    // Validation logic for matching passwords
    const isFormValid = password.length >= 6 && password === confirmPassword;

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                        className="w-11 h-11 bg-white rounded-full border border-gray-200 items-center justify-center shadow-sm mb-10 self-end"
                    >
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>

                    {/* Header Section */}
                    <View className="items-center mb-10">
                        <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-6 border-4 border-white shadow-sm">
                            <Feather name="key" size={40} color="#3b82f6" />
                        </View>
                        <Text className="text-3xl text-foreground mb-3 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                            كلمة مرور جديدة
                        </Text>
                        <Text className="text-muted text-base text-center leading-relaxed px-4" style={{ fontFamily: 'Tajawal-Medium' }}>
                            يرجى إدخال كلمة المرور الجديدة. تأكد من اختيار كلمة مرور قوية وتذكرها جيداً.
                        </Text>
                    </View>

                    {/* Input Fields */}
                    <View className="mb-10">
                        {/* New Password Input */}
                        <View className="mb-5">
                            <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                كلمة المرور الجديدة
                            </Text>
                            <View className="flex-row items-center bg-white border border-gray-200 h-14 rounded-xl px-4 shadow-sm focus:border-primary">
                                <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)} className="p-2 -ml-2">
                                    <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                                <TextInput
                                    className="flex-1 h-full text-right text-foreground ml-2"
                                    placeholder="6 أحرف على الأقل"
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry={!isPasswordVisible}
                                    value={password}
                                    onChangeText={setPassword}
                                    style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right' }}
                                />
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View>
                            <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                تأكيد كلمة المرور
                            </Text>
                            <View className={`flex-row items-center bg-white border h-14 rounded-xl px-4 shadow-sm ${confirmPassword.length > 0 && password !== confirmPassword ? 'border-red-400' : 'border-gray-200'}`}>
                                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)} className="p-2 -ml-2">
                                    <Feather name={isConfirmPasswordVisible ? "eye" : "eye-off"} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                                <TextInput
                                    className="flex-1 h-full text-right text-foreground ml-2"
                                    placeholder="أعد إدخال كلمة المرور"
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry={!isConfirmPasswordVisible}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right' }}
                                />
                            </View>
                            {/* Error Warning */}
                            {confirmPassword.length > 0 && password !== confirmPassword && (
                                <Text className="text-red-500 text-xs text-right mt-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                    كلمتا المرور غير متطابقتين
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className={`h-14 rounded-xl items-center justify-center shadow-sm transition-colors mb-6 ${isFormValid ? 'bg-primary' : 'bg-gray-300'}`}
                        disabled={!isFormValid}
                        onPress={() => setIsSuccessModalVisible(true)}
                    >
                        <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            تحديث كلمة المرور
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <Modal animationType="fade" transparent={true} visible={isSuccessModalVisible} onRequestClose={() => { setIsSuccessModalVisible(false); navigation.navigate('Login'); }}>
                <TouchableOpacity activeOpacity={1} className="flex-1 justify-center items-center px-5 bg-black/50">
                    <TouchableWithoutFeedback>
                        <View className="bg-card w-full rounded-3xl p-8 shadow-2xl items-center">
                            <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-5 border-4 border-emerald-50">
                                <Feather name="check" size={40} color="#10b981" />
                            </View>
                            <Text className="text-2xl text-foreground mb-3 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                                تم التحديث بنجاح!
                            </Text>
                            <Text className="text-base text-muted text-center mb-8 leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                لقد تم تغيير كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { setIsSuccessModalVisible(false); navigation.navigate('Login'); }}
                                className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-sm"
                            >
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    الانتقال لتسجيل الدخول
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}