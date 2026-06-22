import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // حالة النافذة المنبثقة

    // التحقق من صحة الإدخال المبدئي لتفعيل الزر
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

                    {/* --- Back Button --- */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                        className="w-11 h-11 bg-white rounded-full border border-gray-200 items-center justify-center shadow-sm mb-10 self-end"
                    >
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>

                    {/* --- Icon & Text Section --- */}
                    <View className="items-center mb-10">
                        <View className="w-24 h-24 bg-emerald-50 rounded-full items-center justify-center mb-6 border-4 border-white shadow-sm">
                            <Feather name="lock" size={40} color="#10b981" />
                        </View>

                        <Text className="text-3xl text-foreground mb-3 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                            استعادة كلمة المرور
                        </Text>

                        <Text className="text-muted text-base text-center leading-relaxed px-4" style={{ fontFamily: 'Tajawal-Medium' }}>
                            أدخل بريدك الإلكتروني المسجل لدينا وسنقوم بإرسال رابط لإعادة تعيين كلمة المرور الخاصة بك.
                        </Text>
                    </View>

                    {/* --- Input Field --- */}
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

                    {/* --- Submit Button --- */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className={`h-14 rounded-xl items-center justify-center shadow-sm transition-colors mb-6 ${isEmailValid ? 'bg-primary' : 'bg-gray-300'}`}
                        disabled={!isEmailValid}
                        onPress={() => setIsSuccessModalVisible(true)} // إظهار النافذة بدلاً من alert
                    >
                        <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            استعادة كلمة المرور
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* --- Success Modal --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isSuccessModalVisible}
                onRequestClose={() => {
                    setIsSuccessModalVisible(false);
                    navigation.goBack();
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
                                تم الإرسال بنجاح!
                            </Text>

                            <Text className="text-base text-muted text-center mb-8 leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                لقد قمنا بإرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setIsSuccessModalVisible(false);
                                    navigation.goBack();
                                }}
                                className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-sm"
                            >
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    العودة لتسجيل الدخول
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}