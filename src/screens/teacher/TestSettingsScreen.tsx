import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput, KeyboardAvoidingView, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function TestSettingsScreen({ navigation }: any) {
    // --- Settings State with Defaults ---
    const [hifzRatio, setHifzRatio] = useState("70");
    const [tajweedRatio, setTajweedRatio] = useState("30");
    const [numQuestions, setNumQuestions] = useState("3");

    const [raddDeduction, setRaddDeduction] = useState("1");
    const [tanbeehDeduction, setTanbeehDeduction] = useState("0.25");
    const [tajweedDeduction, setTajweedDeduction] = useState("0.5");

    // --- Success Modal State ---
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const handleSave = () => {
        // Here you would save these settings to your global state (Zustand, Redux) or API

        // إظهار نافذة النجاح المصممة بدلاً من الـ alert العادي
        setIsSuccessModalVisible(true);
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalVisible(false);
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }} className="flex-1">

                {/* --- Header --- */}
                <View className="h-16 bg-card border-b border-border justify-center items-center z-10 relative w-full">
                    <View className="absolute left-12 right-12 items-center justify-center pointer-events-none z-10">
                        <Text numberOfLines={1} adjustsFontSizeToFit className="text-lg text-foreground text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                            إعدادات التقييم
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.goBack()} className="absolute right-5 w-10 h-10 bg-background rounded-full border border-border items-center justify-center active:opacity-70 z-20">
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24, paddingBottom: 60 }}>

                    {/* Basic Settings */}
                    <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
                        <Text className="text-base text-primary mb-5 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>النسب وعدد الأسئلة</Text>

                        <View className="flex-row-reverse justify-between items-center mb-4">
                            <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium' }}>نسبة درجات الحفظ (%)</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 text-center rounded-lg h-10 w-20 text-sm text-foreground" keyboardType="numeric" value={hifzRatio} onChangeText={setHifzRatio} style={{ fontFamily: 'Tajawal-Bold' }} />
                        </View>

                        <View className="flex-row-reverse justify-between items-center mb-4">
                            <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium' }}>نسبة درجات التجويد (%)</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 text-center rounded-lg h-10 w-20 text-sm text-foreground" keyboardType="numeric" value={tajweedRatio} onChangeText={setTajweedRatio} style={{ fontFamily: 'Tajawal-Bold' }} />
                        </View>

                        <View className="w-full h-[1px] bg-gray-100 mb-4" />

                        <View className="flex-row-reverse justify-between items-center">
                            <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium' }}>عدد الأسئلة الافتراضي</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 text-center rounded-lg h-10 w-20 text-sm text-foreground" keyboardType="numeric" value={numQuestions} onChangeText={setNumQuestions} style={{ fontFamily: 'Tajawal-Bold' }} />
                        </View>
                    </View>

                    {/* Deductions Settings */}
                    <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm">
                        <Text className="text-base text-red-500 mb-5 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>لوائح الخصم</Text>

                        <View className="flex-row-reverse justify-between items-center mb-4">
                            <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium' }}>الخصم عند (الرد)</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 text-center rounded-lg h-10 w-20 text-sm text-foreground" keyboardType="numeric" value={raddDeduction} onChangeText={setRaddDeduction} style={{ fontFamily: 'Tajawal-Bold' }} />
                        </View>

                        <View className="flex-row-reverse justify-between items-center mb-4">
                            <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium' }}>الخصم عند (التنبيه)</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 text-center rounded-lg h-10 w-20 text-sm text-foreground" keyboardType="numeric" value={tanbeehDeduction} onChangeText={setTanbeehDeduction} style={{ fontFamily: 'Tajawal-Bold' }} />
                        </View>

                        <View className="flex-row-reverse justify-between items-center">
                            <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium' }}>الخصم عند (خطأ التجويد)</Text>
                            <TextInput className="bg-gray-50 border border-gray-200 text-center rounded-lg h-10 w-20 text-sm text-foreground" keyboardType="numeric" value={tajweedDeduction} onChangeText={setTajweedDeduction} style={{ fontFamily: 'Tajawal-Bold' }} />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity onPress={handleSave} activeOpacity={0.8} className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-sm">
                        <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                            حفظ الإعدادات
                        </Text>
                    </TouchableOpacity>

                </ScrollView>

                {/* --- Success Custom Modal --- */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isSuccessModalVisible}
                    onRequestClose={handleCloseSuccessModal}
                >
                    <View className="flex-1 justify-center items-center px-6 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">

                            {/* Success Icon */}
                            <View className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full items-center justify-center mb-5">
                                <Feather name="check" size={40} color="#10b981" />
                            </View>

                            {/* Success Text */}
                            <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                                تم الحفظ بنجاح
                            </Text>
                            <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                تم حفظ إعدادات تقييم الاختبار واعتمادها لتطبيقها على الطلاب المسجلين.
                            </Text>

                            {/* Action Button */}
                            <TouchableOpacity
                                onPress={handleCloseSuccessModal}
                                activeOpacity={0.8}
                                className="w-full h-12 bg-primary rounded-xl items-center justify-center shadow-sm"
                            >
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                    العودة للاختبار
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

            </View>
        </KeyboardAvoidingView>
    );
}