import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import OtpVerificationModal from './OtpVerificationModal';

export default function ForgotPasswordScreen({ navigation }: any) {
    // State for email input and modal visibility
    const [email, setEmail] = useState('');
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);

    // Basic email validation to enable the submit button
    const isEmailValid = email.trim().length > 5 && email.includes('@');

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
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
                        <View className="w-24 h-24 bg-emerald-50 rounded-full items-center justify-center mb-6 border-4 border-white shadow-sm">
                            <Feather name="lock" size={40} color="#10b981" />
                        </View>
                        <Text className="text-3xl text-foreground mb-3 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                            استعادة كلمة المرور
                        </Text>
                        <Text className="text-muted text-base text-center leading-relaxed px-4" style={{ fontFamily: 'Tajawal-Medium' }}>
                            أدخل بريدك الإلكتروني المسجل لدينا وسنقوم بإرسال رمز للتحقق.
                        </Text>
                    </View>

                    {/* Email Input Field */}
                    <View className="mb-10">
                        <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                            البريد الإلكتروني
                        </Text>
                        <TextInput
                            className="bg-white border border-gray-200 h-14 px-4 rounded-xl text-right text-foreground shadow-sm focus:border-primary"
                            placeholder="example@email.com"
                            placeholderTextColor="#9ca3af"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right' }}
                        />
                    </View>

                    {/* Submit Button to Trigger OTP Modal */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className={`h-14 rounded-xl items-center justify-center shadow-sm transition-colors mb-6 ${isEmailValid ? 'bg-primary' : 'bg-gray-300'}`}
                        disabled={!isEmailValid}
                        onPress={() => setIsOtpModalVisible(true)}
                    >
                        <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            إرسال رمز التحقق
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* OTP Verification Modal */}
            <OtpVerificationModal
                visible={isOtpModalVisible}
                email={email}
                onClose={() => setIsOtpModalVisible(false)}
                onVerify={(code) => {
                    setIsOtpModalVisible(false);
                    // Navigate to the new reset password screen upon successful OTP
                    navigation.navigate('ResetPassword', { email });
                }}
            />
        </SafeAreaView>
    );
}