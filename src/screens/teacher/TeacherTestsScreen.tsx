import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import BottomNav from '../../components/BottomNav';

// --- Mock Data: Grouped by Test Session ---
const scheduledTests = [
    {
        id: "t1",
        title: "اختبار نهاية الجزء الثلاثون (عمّ)",
        amount: "جزء عم كامل",
        date: "اليوم",
        time: "04:30 عصراً",
        studentsCount: 15,
        status: "scheduled"
    },
    {
        id: "t2",
        title: "اختبار خمسة أجزاء (1-5)",
        amount: "5 أجزاء",
        date: "غداً",
        time: "05:15 عصراً",
        studentsCount: 8,
        status: "scheduled"
    },
];

const archivedTests = [
    {
        id: "t3",
        title: "اختبار سورة تبارك",
        amount: "نصف جزء",
        date: "28 مايو 2026",
        time: "05:00 عصراً",
        studentsCount: 12,
        status: "completed",
    },
    {
        id: "t4",
        title: "اختبار الزهراوين",
        amount: "جزأين ونصف",
        date: "25 مايو 2026",
        time: "04:00 عصراً",
        studentsCount: 22,
        status: "completed",
    },
];

// --- Test Session Card Component ---
const TestSessionCard = ({ test, isArchive, navigation }: { test: any, isArchive?: boolean, navigation?: any }) => {
    return (
        <View className="bg-card p-5 rounded-2xl border border-border shadow-sm mb-4">

            <View className="flex-row items-start justify-between mb-4 border-b border-gray-50 pb-4">
                {/* Status Badge */}
                <View className={`px-2.5 py-1 rounded-full ${isArchive ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                    <Text className={`text-[11px] ${isArchive ? 'text-primary' : 'text-orange-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                        {isArchive ? 'مكتمل' : 'مجدول'}
                    </Text>
                </View>

                {/* Title & Amount */}
                <View className="flex-1 items-end mr-3">
                    <Text className="text-base text-foreground mb-3 text-right w-full leading-relaxed" style={{ fontFamily: 'Tajawal-Bold' }}>
                        {test.title}
                    </Text>
                    <View className="flex-row items-center w-full justify-end">
                        <View className="flex-1 items-end">
                            <Text className="text-xs text-muted text-right" style={{ fontFamily: 'Tajawal-Medium' }} numberOfLines={1}>
                                المقدار: {test.amount}
                            </Text>
                        </View>
                        <Feather name="book-open" size={14} color="#9ca3af" style={{ marginLeft: 6 }} />
                    </View>
                </View>
            </View>

            {/* Time & Date Row */}
            <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 mb-5">
                <View className="flex-row items-center">
                    <View className="items-end mr-2.5">
                        <Text className="text-[10px] text-muted mb-0.5" style={{ fontFamily: 'Tajawal-Regular' }}>الوقت</Text>
                        <Text className="text-xs text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{test.time}</Text>
                    </View>
                    <View className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm border border-border">
                        <Feather name="clock" size={14} color="#f97316" />
                    </View>
                </View>

                <View className="w-[1px] h-6 bg-gray-200" />

                <View className="flex-row items-center">
                    <View className="items-end mr-2.5">
                        <Text className="text-[10px] text-muted mb-0.5" style={{ fontFamily: 'Tajawal-Regular' }}>التاريخ</Text>
                        <Text className="text-xs text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{test.date}</Text>
                    </View>
                    <View className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm border border-border">
                        <Feather name="calendar" size={14} color="#10b981" />
                    </View>
                </View>
            </View>

            {/* Action & Stats Row */}
            <View className="flex-row items-center justify-between">

                {/* Action Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => !isArchive && navigation.navigate('ManageTestSession', { test })}
                    className={`h-11 px-4 rounded-xl flex-row-reverse items-center justify-center shadow-sm ${isArchive ? 'bg-white border border-gray-200' : 'bg-primary'
                        }`}
                >
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        className={`text-sm ${isArchive ? 'text-slate-700' : 'text-white'}`}
                        style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}
                    >
                        {isArchive ? 'سجل الدرجات' : 'إدارة الاختبار'}
                    </Text>
                    <Feather name={isArchive ? "file-text" : "users"} size={16} color={isArchive ? "#475569" : "white"} style={{ marginRight: 8 }} />
                </TouchableOpacity>

                {/* Students Counter */}
                <View className="flex-row-reverse items-center flex-shrink-0">
                    <View className={`w-9 h-9 rounded-full items-center justify-center ml-2 ${isArchive ? 'bg-emerald-50' : 'bg-primary-light border border-primary/10'}`}>
                        <Feather name="users" size={16} color="#10b981" />
                    </View>
                    <View className="items-end">
                        <Text className="text-[10px] text-muted mb-0.5" style={{ fontFamily: 'Tajawal-Medium' }}>
                            {isArchive ? 'تم تقييم' : 'الطلاب المسجلين'}
                        </Text>
                        <Text className="text-sm text-foreground" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>
                            {test.studentsCount} طالب
                        </Text>
                    </View>
                </View>

            </View>
        </View>
    );
};

export default function TeacherTestsScreen({ navigation }: any) {
    const [activeTab, setActiveTab] = useState<'scheduled' | 'archive'>('scheduled');

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header --- */}
            <View className="h-16 bg-card border-b border-border justify-center items-center z-10 relative w-full">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    إدارة الاختبارات
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* --- Tab Switcher --- */}
                <View className="mx-5 mt-6 bg-gray-100 p-1 rounded-xl flex-row mb-6">
                    <TouchableOpacity
                        onPress={() => setActiveTab('archive')}
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'archive' ? 'bg-card shadow-sm border border-border' : ''}`}
                    >
                        <Text className={`text-sm ${activeTab === 'archive' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                            السجل والأرشيف
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('scheduled')}
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'scheduled' ? 'bg-card shadow-sm border border-border' : ''}`}
                    >
                        <Text className={`text-sm ${activeTab === 'scheduled' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                            مجدولة {/* تم تغيير الكلمة بناءً على طلبك */}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- Content Area --- */}
                <View className="px-5">

                    {/* Action Button: Schedule New Test Session */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("CreateTestSession")}
                        activeOpacity={0.8}
                        className="w-full h-12 bg-primary rounded-xl flex-row items-center justify-center shadow-sm mb-6 border border-primary"
                    >
                        <Text
                            className="text-white text-base"
                            style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}
                        >
                            إنشاء جلسة اختبار جديدة
                        </Text>
                        <Feather name="plus-circle" size={18} color="white" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    {/* Section Title */}
                    <Text className="text-right text-foreground text-base mb-4" style={{ fontFamily: 'Tajawal-Bold' }}>
                        {activeTab === 'scheduled' ? 'جلسات الاختبار القادمة' : 'جلسات الاختبار السابقة'}
                    </Text>

                    {/* Render List Based on Tab */}
                    {activeTab === 'scheduled' && scheduledTests.map((test) => (
                        <TestSessionCard key={test.id} test={test} isArchive={false} navigation={navigation} />
                    ))}

                    {activeTab === 'archive' && archivedTests.map((test) => (
                        <TestSessionCard key={test.id} test={test} isArchive={true} navigation={navigation} />
                    ))}

                </View>

            </ScrollView>

            <BottomNav role="teacher" activeTab="tests" navigation={navigation} />
        </View>
    );
}