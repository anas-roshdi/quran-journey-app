import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ChangePasswordScreen({ navigation }: any) {
    // State to toggle password visibility
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* Header */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-between border-b border-border z-10">
                <View className="w-10" />
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    تغيير كلمة المرور
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Informational Text */}
                <View className="px-5 mt-8 mb-8">
                    <Text className="text-base text-slate-600 text-right leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                        يجب أن تتكون كلمة المرور الجديدة من 8 خانات على الأقل لضمان أمان حسابك.
                    </Text>
                </View>

                {/* Password Fields */}
                <View className="px-5 space-y-6">

                    {/* Current Password */}
                    <View className="w-full">
                        <Text className="text-sm text-slate-500 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>كلمة المرور الحالية</Text>
                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm">
                            <Feather name="lock" size={18} color="#94a3b8" />
                            <TextInput
                                className="flex-1 text-right text-foreground mr-3 text-sm h-full"
                                // textAlignVertical: 'center' fixes the vertical alignment issue on Android
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0, textAlignVertical: 'center' }}
                                placeholder="أدخل كلمة المرور الحالية"
                                placeholderTextColor="#cbd5e1"
                                secureTextEntry={!showCurrent}
                            />
                            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                                <Feather name={showCurrent ? "eye-off" : "eye"} size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* New Password */}
                    <View className="w-full mt-4">
                        <Text className="text-sm text-slate-500 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>كلمة المرور الجديدة</Text>
                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm">
                            <Feather name="shield" size={18} color="#94a3b8" />
                            <TextInput
                                className="flex-1 text-right text-foreground mr-3 text-sm h-full"
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0, textAlignVertical: 'center' }}
                                placeholder="أدخل كلمة المرور الجديدة"
                                placeholderTextColor="#cbd5e1"
                                secureTextEntry={!showNew}
                            />
                            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                <Feather name={showNew ? "eye-off" : "eye"} size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm New Password */}
                    <View className="w-full mt-4">
                        <Text className="text-sm text-slate-500 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>تأكيد كلمة المرور الجديدة</Text>
                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm">
                            <Feather name="check-circle" size={18} color="#94a3b8" />
                            <TextInput
                                className="flex-1 text-right text-foreground mr-3 text-sm h-full"
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0, textAlignVertical: 'center' }}
                                placeholder="أعد كتابة كلمة المرور الجديدة"
                                placeholderTextColor="#cbd5e1"
                                secureTextEntry={!showConfirm}
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                <Feather name={showConfirm ? "eye-off" : "eye"} size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

                {/* Update Button */}
                <View className="px-5 mt-10">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-md shadow-primary/20"
                    >
                        <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            تحديث كلمة المرور
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}