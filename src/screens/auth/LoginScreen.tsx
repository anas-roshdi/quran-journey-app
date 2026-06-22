import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }} showsVerticalScrollIndicator={false}>

                    {/* Top Section: Logo and Title */}
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

                    {/* Input Fields Section */}
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
                                    style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right' }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} className="items-start mb-6 w-full">
                        <Text className="text-primary text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>
                            نسيت كلمة المرور؟
                        </Text>
                    </TouchableOpacity>

                    {/* --- Navigation Buttons for Development --- */}

                    {/* 1. Student Login */}
                    <TouchableOpacity
                        onPress={() => navigation.replace('Dashboard')}
                        activeOpacity={0.8}
                        className="bg-primary h-14 rounded-xl items-center justify-center mb-3 shadow-sm"
                    >
                        <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            دخول الطالب
                        </Text>
                    </TouchableOpacity>

                    {/* 2. Teacher Login */}
                    <TouchableOpacity
                        onPress={() => navigation.replace('TeacherDashboard')}
                        activeOpacity={0.8}
                        className="bg-slate-800 h-14 rounded-xl items-center justify-center mb-3 shadow-sm"
                    >
                        <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            دخول المعلم
                        </Text>
                    </TouchableOpacity>

                    {/* 3. Parent Login */}
                    <TouchableOpacity
                        onPress={() => navigation.replace('ParentDashboard')}
                        activeOpacity={0.8}
                        className="bg-white h-14 rounded-xl items-center justify-center mb-8 border-2 border-primary shadow-sm"
                    >
                        <Text className="text-primary text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            دخول ولي
                        </Text>
                    </TouchableOpacity>

                    {/* Footer Section */}
                    <View className="flex-row justify-center items-center mb-8">
                        <TouchableOpacity onPress={() => navigation.replace('Register')} activeOpacity={0.7}>
                            <Text className="text-primary text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                إنشاء حساب
                            </Text>
                        </TouchableOpacity>
                        <Text className="text-muted text-base ml-2" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>
                            ليس لديك حساب؟
                        </Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}