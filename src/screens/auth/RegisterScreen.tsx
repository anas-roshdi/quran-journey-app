import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }: any) {
    // --- State Management ---
    const [role, setRole] = useState<'student' | 'teacher' | 'parent'>('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // --- File Upload State (Teacher Only) ---
    const [certificateName, setCertificateName] = useState<string | null>(null);

    // --- Visibility & Modal Toggles ---
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // حالة النافذة المنبثقة

    // --- Validation Logic ---
    const isFormValid =
        name.trim().length > 2 &&
        email.includes('@') &&
        password.length >= 6 &&
        password === confirmPassword &&
        (role !== 'teacher' || certificateName !== null);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >

                    {/* --- Back Button --- */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.7}
                        className="w-11 h-11 bg-white rounded-full border border-gray-200 items-center justify-center shadow-sm mb-6 mt-12 self-end z-10"
                    >
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>

                    {/* --- Header Section --- */}
                    <View className="items-end mb-8">
                        <Text className="text-3xl text-foreground mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>
                            حساب جديد
                        </Text>
                        <Text className="text-muted text-base text-right" style={{ fontFamily: 'Tajawal-Medium' }}>
                            انضم إلينا وابدأ رحلتك القرآنية اليوم
                        </Text>
                    </View>

                    {/* --- Role Selection --- */}
                    <View className="mb-8">
                        <Text className="text-right text-slate-700 mb-3" style={{ fontFamily: 'Tajawal-Bold' }}>
                            نوع الحساب
                        </Text>
                        <View className="flex-row-reverse bg-gray-100 p-1 rounded-xl">
                            <TouchableOpacity
                                onPress={() => setRole('student')}
                                activeOpacity={0.7}
                                className={`flex-1 py-3 px-1 rounded-lg items-center justify-center ${role === 'student' ? 'bg-white shadow-sm border border-gray-200' : ''}`}
                            >
                                <Text numberOfLines={1} adjustsFontSizeToFit className={`text-sm ${role === 'student' ? 'text-primary' : 'text-slate-500'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>طالب</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setRole('teacher')}
                                activeOpacity={0.7}
                                className={`flex-1 py-3 px-1 rounded-lg items-center justify-center ${role === 'teacher' ? 'bg-white shadow-sm border border-gray-200' : ''}`}
                            >
                                <Text numberOfLines={1} adjustsFontSizeToFit className={`text-sm ${role === 'teacher' ? 'text-primary' : 'text-slate-500'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>معلم</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setRole('parent')}
                                activeOpacity={0.7}
                                className={`flex-1 py-3 px-1 rounded-lg items-center justify-center ${role === 'parent' ? 'bg-white shadow-sm border border-gray-200' : ''}`}
                            >
                                <Text numberOfLines={1} adjustsFontSizeToFit className={`text-sm ${role === 'parent' ? 'text-primary' : 'text-slate-500'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>ولي أمر</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- Input Fields --- */}
                    <View className="mb-8">

                        <View className="mb-5">
                            <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                الاسم الكامل
                            </Text>
                            <View className="flex-row items-center bg-white border border-gray-200 h-14 rounded-xl px-4 shadow-sm focus:border-primary">
                                <Feather name="user" size={18} color="#9ca3af" />
                                <TextInput
                                    className="flex-1 h-full text-right text-foreground ml-2"
                                    placeholder="أحمد محمود"
                                    placeholderTextColor="#9ca3af"
                                    value={name}
                                    onChangeText={setName}
                                    style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right' }}
                                />
                            </View>
                        </View>

                        <View className="mb-5">
                            <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                البريد الإلكتروني
                            </Text>
                            <View className="flex-row items-center bg-white border border-gray-200 h-14 rounded-xl px-4 shadow-sm focus:border-primary">
                                <Feather name="mail" size={18} color="#9ca3af" />
                                <TextInput
                                    className="flex-1 h-full text-right text-foreground ml-2"
                                    placeholder="example@email.com"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right' }}
                                />
                            </View>
                        </View>

                        <View className="mb-5">
                            <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                كلمة المرور
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

                        <View className={role === 'teacher' ? 'mb-6' : 'mb-2'}>
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
                            {confirmPassword.length > 0 && password !== confirmPassword && (
                                <Text className="text-red-500 text-xs text-right mt-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                    كلمتا المرور غير متطابقتين
                                </Text>
                            )}
                        </View>

                        {/* --- Teacher Verification Section --- */}
                        {role === 'teacher' && (
                            <View className="mb-2 bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
                                <View className="flex-row items-start justify-end mb-4">
                                    <View className="flex-1 mr-2 items-end">
                                        <Text className="text-blue-900 text-xs text-right leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                            يتطلب حساب المعلم مراجعة وموافقة الإدارة. يرجى إرفاق إثبات أهليتك (شهادة أو إجازة).
                                        </Text>
                                    </View>
                                    <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mt-0.5">
                                        <Feather name="info" size={14} color="#1e40af" />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setCertificateName('شهادة_حفظ_القرآن.pdf')}
                                    className={`h-14 border-2 border-dashed rounded-xl items-center justify-center flex-row-reverse transition-colors ${certificateName ? 'border-emerald-400 bg-emerald-50' : 'border-blue-300 bg-white'}`}
                                >
                                    <Feather name={certificateName ? "check-circle" : "upload-cloud"} size={20} color={certificateName ? "#10b981" : "#3b82f6"} />
                                    <Text className={`text-sm mr-2 mt-1 ${certificateName ? 'text-emerald-700' : 'text-blue-600'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                        {certificateName ? certificateName : 'اضغط لرفع الشهادة (PDF / صورة)'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>

                    {/* --- Submit Button --- */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className={`h-14 rounded-xl items-center justify-center shadow-sm transition-colors mb-8 ${isFormValid ? 'bg-primary' : 'bg-gray-300'}`}
                        disabled={!isFormValid}
                        onPress={() => setIsSuccessModalVisible(true)} // إظهار النافذة بدلاً من alert
                    >
                        <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            {role === 'teacher' ? 'إرسال طلب التسجيل' : 'إنشاء الحساب'}
                        </Text>
                    </TouchableOpacity>

                    {/* --- Footer Section --- */}
                    <View className="flex-row justify-center items-center">
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                            <Text className="text-primary text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                تسجيل الدخول
                            </Text>
                        </TouchableOpacity>
                        <Text className="text-muted text-base ml-2" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>
                            لديك حساب بالفعل؟
                        </Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* --- Success Modal (Dynamic Text) --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isSuccessModalVisible}
                onRequestClose={() => {
                    setIsSuccessModalVisible(false);
                    navigation.navigate('Login');
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-center items-center px-5 bg-black/50"
                >
                    <TouchableWithoutFeedback>
                        <View className="bg-card w-full rounded-3xl p-8 shadow-2xl items-center">

                            <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-5 border-4 border-emerald-50">
                                <Feather name="check" size={40} color="#10b981" />
                            </View>

                            <Text className="text-2xl text-foreground mb-3 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                                {role === 'teacher' ? 'تم إرسال الطلب بنجاح!' : 'تم إنشاء الحساب بنجاح!'}
                            </Text>

                            <Text className="text-base text-muted text-center mb-8 leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                {role === 'teacher'
                                    ? 'تم إرسال طلبك للإدارة للمراجعة والاعتماد. سيتم إشعارك فور تفعيل حسابك كمعلم.'
                                    : `تم إنشاء حسابك كـ ${role === 'student' ? 'طالب' : 'ولي أمر'} بنجاح. أهلاً بك في رحلة القرآن.`}
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setIsSuccessModalVisible(false);
                                    navigation.navigate('Login');
                                }}
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