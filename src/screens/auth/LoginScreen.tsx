import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import OtpVerificationModal from './OtpVerificationModal';

export default function LoginScreen({ navigation }: any) {
    // Form state management
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    // Modals and Routing states
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false); // حالة نافذة الخطأ الجديدة
    const [pendingRole, setPendingRole] = useState<'student' | 'teacher' | 'parent' | null>(null);

    // Ensure basic validation before opening OTP
    const isFormFilled = email.trim().length > 0 && password.trim().length > 0;

    // Trigger OTP Flow instead of direct navigation
    const handleLoginPress = (role: 'student' | 'teacher' | 'parent') => {
        if (!isFormFilled) {
            // إظهار النافذة المنبثقة الأنيقة بدلاً من الـ alert
            setIsErrorModalVisible(true);
            return;
        }
        setPendingRole(role);
        setIsOtpModalVisible(true);
    };

    // Complete navigation after OTP success
    const handleOtpVerify = (code: string) => {
        setIsOtpModalVisible(false);
        // تم إضافة تأخير زمني بسيط لضمان إغلاق نافذة OTP قبل الانتقال
        setTimeout(() => {
            if (pendingRole === 'teacher') navigation.replace('TeacherDashboard');
            else if (pendingRole === 'parent') navigation.replace('ParentDashboard');
            else navigation.replace('Dashboard');
        }, 300);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* تم إضافة keyboardShouldPersistTaps="handled" لحل مشكلة النقرة الضائعة */}
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* Top Section */}
                    <View className="items-center mb-10">
                        <View className="bg-primary-light p-4 rounded-2xl mb-4">
                            <Feather name="book-open" size={32} color="#10b981" />
                        </View>
                        <Text className="text-2xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                            رحلة القرآن
                        </Text>
                    </View>

                    {/* Greeting Section */}
                    <View className="mb-8 items-end">
                        <Text className="text-3xl text-foreground mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>
                            مرحباً بك..
                        </Text>
                        <Text className="text-muted text-base" style={{ fontFamily: 'Tajawal-Regular' }}>
                            سجل دخولك لمتابعة رحلة الحفظ
                        </Text>
                    </View>

                    {/* Input Fields */}
                    <View className="mb-4">
                        {/* Email Input */}
                        <View className="mb-5">
                            <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                البريد الإلكتروني
                            </Text>
                            <TextInput
                                className="bg-white border border-gray-200 h-14 px-4 rounded-xl text-right text-foreground shadow-sm"
                                placeholder="example@email.com"
                                placeholderTextColor="#9ca3af"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right' }}
                            />
                        </View>

                        {/* Password Input */}
                        <View>
                            <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                كلمة المرور
                            </Text>
                            <View className="flex-row items-center bg-white border border-gray-200 h-14 rounded-xl px-4 shadow-sm">
                                <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)} className="p-2 -ml-2">
                                    <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                                <TextInput
                                    className="flex-1 h-full text-right text-foreground ml-2"
                                    placeholder="أدخل كلمة المرور"
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry={!isPasswordVisible}
                                    value={password}
                                    onChangeText={setPassword}
                                    style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right' }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} className="items-start mb-6 w-full">
                        <Text className="text-primary" style={{ fontFamily: 'Tajawal-Medium' }}>
                            نسيت كلمة المرور؟
                        </Text>
                    </TouchableOpacity>

                    {/* Navigation Buttons for Development */}
                    <TouchableOpacity
                        onPress={() => handleLoginPress('student')}
                        className="bg-primary py-3.5 rounded-xl items-center mb-3 shadow-sm shadow-emerald-200"
                    >
                        <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold' }}>
                            دخول الطالب
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleLoginPress('teacher')}
                        className="bg-slate-800 py-3.5 rounded-xl items-center mb-3 shadow-sm"
                    >
                        <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold' }}>
                            دخول المعلم
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleLoginPress('parent')}
                        className="bg-card py-3.5 rounded-xl items-center mb-8 border-2 border-primary shadow-sm"
                    >
                        <Text className="text-primary text-lg" style={{ fontFamily: 'Tajawal-Bold' }}>
                            دخول ولي الأمر
                        </Text>
                    </TouchableOpacity>

                    {/* Footer */}
                    <View className="flex-row justify-center items-center mb-8">
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-primary text-base" style={{ fontFamily: 'Tajawal-Bold' }}>
                                إنشاء حساب
                            </Text>
                        </TouchableOpacity>
                        <Text className="text-muted text-base ml-2" style={{ fontFamily: 'Tajawal-Regular' }}>
                            ليس لديك حساب؟
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* --- Error Modal (بيانات ناقصة) --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isErrorModalVisible}
                onRequestClose={() => setIsErrorModalVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-center items-center px-5 bg-black/50"
                    onPress={() => setIsErrorModalVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <View className="bg-card w-full rounded-3xl p-8 shadow-2xl items-center">

                            <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-5 border-4 border-red-100">
                                <Feather name="alert-circle" size={40} color="#ef4444" />
                            </View>

                            <Text className="text-2xl text-foreground mb-3 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                                بيانات ناقصة
                            </Text>

                            <Text className="text-base text-muted text-center mb-8 leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                يرجى إدخال البريد الإلكتروني وكلمة المرور أولاً لنتمكن من تسجيل دخولك بأمان.
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setIsErrorModalVisible(false)}
                                className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-sm"
                            >
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    حسناً، فهمت
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

            {/* OTP Verification Modal for 2FA Secure Layer */}
            <OtpVerificationModal
                visible={isOtpModalVisible}
                email={email || "حسابك المسجل"}
                onClose={() => setIsOtpModalVisible(false)}
                onVerify={handleOtpVerify}
            />
        </SafeAreaView>
    );
}