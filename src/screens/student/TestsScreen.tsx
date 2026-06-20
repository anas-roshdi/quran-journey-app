import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Mock Data ---
const selfQuizzes = [
    { id: "1", title: "اختبار أحكام النون الساكنة", topic: "تجويد", questions: 10, time: "5 دقائق", status: "pending", score: null },
    { id: "2", title: "اختبار المدود الأساسية", topic: "تجويد", questions: 15, time: "8 دقائق", status: "completed", score: "14/15" },
    { id: "3", title: "مراجعة معاني الكلمات (جزء عم)", topic: "تفسير", questions: 20, time: "10 دقائق", status: "pending", score: null },
];

const oralTests = [
    {
        id: "1",
        title: "اختبار نهاية الجزء الثلاثون",
        organization: "الجمعية الخيرية لتحفيظ القرآن الكريم بمكة المكرمة",
        teacher: "لجنة الاختبارات",
        date: "28 مايو 2026",
        time: "04:30 عصراً",
        status: "scheduled"
    },
    {
        id: "2",
        title: "اختبار سورة تبارك",
        organization: "حلقة مسجد التقوى",
        teacher: "أستاذ أحمد",
        date: "20 مايو 2026",
        time: "05:00 عصراً",
        status: "completed"
    },
];

// --- مكون بطاقة الاختبار الشفوي ---
const OralTestCard = ({ test }: { test: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View className="bg-card p-5 rounded-2xl border border-border shadow-sm mb-4">
            <View className="flex-row items-start justify-between mb-4 border-b border-gray-50 pb-4">

                <View className={`px-2.5 py-1 rounded-full ${test.status === 'scheduled' ? 'bg-orange-50' : 'bg-emerald-50'}`}>
                    <Text className={`text-[11px] ${test.status === 'scheduled' ? 'text-orange-600' : 'text-primary'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                        {test.status === 'scheduled' ? 'مجدول' : 'تم التقييم'}
                    </Text>
                </View>

                <View className="flex-1 items-end mr-3">
                    <Text className="text-base text-foreground mb-3 text-right w-full" style={{ fontFamily: 'Tajawal-Bold' }}>
                        {test.title}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => setIsExpanded(!isExpanded)}
                        className="flex-row items-start w-full mb-2 justify-end"
                    >
                        <View className="flex-1 items-end">
                            <Text
                                className="text-xs text-slate-600 text-right"
                                style={{ fontFamily: 'Tajawal-Medium' }}
                                numberOfLines={isExpanded ? undefined : 1}
                            >
                                الجهة: {test.organization}
                            </Text>
                        </View>
                        <Feather name="bookmark" size={14} color="#10b981" style={{ marginLeft: 6, marginTop: 2 }} />
                    </TouchableOpacity>

                    <View className="flex-row items-center w-full justify-end">
                        <View className="flex-1 items-end">
                            <Text className="text-xs text-muted text-right" style={{ fontFamily: 'Tajawal-Medium' }} numberOfLines={1}>
                                المشرف: {test.teacher}
                            </Text>
                        </View>
                        <Feather name="user" size={14} color="#9ca3af" style={{ marginLeft: 6 }} />
                    </View>
                </View>

            </View>

            <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
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
        </View>
    );
};

export default function TestsScreen({ navigation }: any) {
    const [activeTab, setActiveTab] = useState<'quizzes' | 'oral'>('quizzes');

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header --- */}
            <View className="flex-row items-center justify-between px-5 py-4 bg-card border-b border-border z-10">
                <View className="w-10" />
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    الاختبارات والتقييم
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- Tab Switcher --- */}
                <View className="mx-5 mt-6 bg-gray-100 p-1 rounded-xl flex-row mb-6">
                    <TouchableOpacity
                        onPress={() => setActiveTab('oral')}
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'oral' ? 'bg-card shadow-sm border border-border' : ''}`}
                    >
                        <Text className={`text-sm ${activeTab === 'oral' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                            الاختبارات الشفوية
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('quizzes')}
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'quizzes' ? 'bg-card shadow-sm border border-border' : ''}`}
                    >
                        <Text className={`text-sm ${activeTab === 'quizzes' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                            تقييم ذاتي (تفاعلي)
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- Content: Quizzes (التقييم الذاتي) --- */}
                {activeTab === 'quizzes' && (
                    <View className="px-5 space-y-4">
                        {selfQuizzes.map((quiz) => {
                            const isCompleted = quiz.status === 'completed';
                            return (
                                <View key={quiz.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm mb-4">
                                    <View className="flex-row items-center justify-between mb-3">
                                        {isCompleted ? (
                                            <View className="bg-primary-light px-2 py-1 rounded-md border border-primary/20">
                                                <Text className="text-primary text-xs" style={{ fontFamily: 'Tajawal-Bold' }}>{quiz.score}</Text>
                                            </View>
                                        ) : <View />}

                                        <View className="flex-row items-center">
                                            <View className="items-end mr-3">
                                                <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{quiz.title}</Text>
                                                <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>{quiz.topic}</Text>
                                            </View>
                                            <View className={`w-10 h-10 rounded-full items-center justify-center ${isCompleted ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                                                <Feather name={isCompleted ? 'check-circle' : 'help-circle'} size={20} color={isCompleted ? '#10b981' : '#3b82f6'} />
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-end gap-4 mb-5 pt-3 border-t border-gray-50">
                                        <View className="flex-row items-center">
                                            <Text className="text-xs text-muted mr-1.5" style={{ fontFamily: 'Tajawal-Medium' }}>{quiz.time}</Text>
                                            <Feather name="clock" size={14} color="#9ca3af" />
                                        </View>
                                        <View className="flex-row items-center">
                                            <Text className="text-xs text-muted mr-1.5" style={{ fontFamily: 'Tajawal-Medium' }}>{quiz.questions} أسئلة</Text>
                                            <Feather name="list" size={14} color="#9ca3af" />
                                        </View>
                                    </View>

                                    {/* زر الإجراء: تم إضافة marginTop: 4 و includeFontPadding: false لموازنة الخط مع الأيقونة */}
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        className={`w-full h-12 rounded-xl flex-row items-center justify-center border shadow-sm ${isCompleted ? 'bg-white border-gray-200' : 'bg-primary border-primary'
                                            }`}
                                    >
                                        <Text
                                            className={`text-sm ${isCompleted ? 'text-slate-700' : 'text-white'}`}
                                            style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}
                                            numberOfLines={1}
                                        >
                                            {isCompleted ? 'إعادة الاختبار' : 'ابدأ الاختبار'}
                                        </Text>
                                        <Feather
                                            name={isCompleted ? "refresh-cw" : "play-circle"}
                                            size={18}
                                            color={isCompleted ? "#334155" : "#ffffff"}
                                            style={{ marginLeft: 8 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* --- Content: Oral Tests (الاختبارات الشفوية) --- */}
                {activeTab === 'oral' && (
                    <View className="px-5">

                        {/* زر حجز موعد جديد: تم إضافة marginTop: 4 لموازنة الخط مع الأيقونة */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('BookTest')}
                            className="w-full h-12 bg-primary rounded-xl flex-row items-center justify-center shadow-sm mb-6 border border-primary"
                        >
                            <Text
                                className="text-white text-base"
                                style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}
                            >
                                حجز موعد اختبار جديد
                            </Text>
                            <Feather name="calendar" size={18} color="white" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>

                        <Text className="text-right text-foreground text-base mb-4" style={{ fontFamily: 'Tajawal-Bold' }}>سجل الاختبارات</Text>

                        {oralTests.map((test) => (
                            <OralTestCard key={test.id} test={test} />
                        ))}
                    </View>
                )}

            </ScrollView>
        </View>
    );
}