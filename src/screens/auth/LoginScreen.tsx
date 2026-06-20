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
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>

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
                        <View className="mb-5">
                            <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                البريد الإلكتروني
                            </Text>
                            <TextInput
                                className="bg-background p-4 rounded-xl text-right text-foreground"
                                placeholder="example@email.com"
                                placeholderTextColor="#9ca3af"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={{ fontFamily: 'Tajawal-Regular' }}
                            />
                        </View>

                        <View>
                            <Text className="text-right text-slate-700 mb-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                كلمة المرور
                            </Text>
                            <View className="flex-row items-center bg-background rounded-xl px-4">
                                <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                                    <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                                <TextInput
                                    className="flex-1 p-4 text-right text-foreground"
                                    placeholder="أدخل كلمة المرور"
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry={!isPasswordVisible}
                                    style={{ fontFamily: 'Tajawal-Regular' }}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity className="items-start mb-6 w-full">
                        <Text className="text-primary" style={{ fontFamily: 'Tajawal-Medium' }}>
                            نسيت كلمة المرور؟
                        </Text>
                    </TouchableOpacity>

                    {/* --- Navigation Buttons for Development --- */}

                    {/* 1. Student Login */}
                    <TouchableOpacity
                        onPress={() => navigation.replace('Dashboard')}
                        className="bg-primary py-3.5 rounded-xl items-center mb-3 shadow-sm shadow-emerald-200"
                    >
                        <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold' }}>
                            دخول الطالب
                        </Text>
                    </TouchableOpacity>

                    {/* 2. Teacher Login */}
                    <TouchableOpacity
                        onPress={() => navigation.replace('TeacherDashboard')}
                        className="bg-slate-800 py-3.5 rounded-xl items-center mb-3 shadow-sm"
                    >
                        <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold' }}>
                            دخول المعلم
                        </Text>
                    </TouchableOpacity>

                    {/* 3. Parent Login (New) */}
                    <TouchableOpacity
                        onPress={() => navigation.replace('ParentDashboard')}
                        className="bg-card py-3.5 rounded-xl items-center mb-8 border-2 border-primary shadow-sm"
                    >
                        <Text className="text-primary text-lg" style={{ fontFamily: 'Tajawal-Bold' }}>
                            دخول ولي الأمر
                        </Text>
                    </TouchableOpacity>

                    {/* Footer Section */}
                    <View className="flex-row justify-center items-center mb-8">
                        <TouchableOpacity>
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
        </SafeAreaView>
    );
}