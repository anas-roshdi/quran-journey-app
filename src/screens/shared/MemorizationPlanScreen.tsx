import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, Modal, TouchableWithoutFeedback } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Dynamic Data Structure for ALL timeframes and tabs ---
const planData: any = {
    new: {
        'هذا الأسبوع': [
            { day: "الأحد", date: "25", surah: "سورة الانفطار", status: "completed" },
            { day: "الاثنين", date: "26", surah: "سورة المطففين (1-15)", status: "current" },
            { day: "الثلاثاء", date: "27", surah: "سورة المطففين (16-36)", status: "upcoming" },
            { day: "الأربعاء", date: "28", surah: "سورة الانشقاق", status: "upcoming" },
            { day: "الخميس", date: "29", surah: "سورة البروج", status: "upcoming" },
        ],
        'الأسبوع القادم': [
            { day: "الأحد", date: "2", surah: "سورة الطارق والأعلى", status: "upcoming" },
            { day: "الاثنين", date: "3", surah: "سورة الغاشية", status: "upcoming" },
            { day: "الثلاثاء", date: "4", surah: "سورة الفجر", status: "upcoming" },
            { day: "الأربعاء", date: "5", surah: "سورة البلد", status: "upcoming" },
            { day: "الخميس", date: "6", surah: "مراجعة الأسبوع", status: "upcoming" },
        ],
        'الشهر الحالي': [
            { day: "الأسبوع 1", date: "W1", surah: "من الانفطار إلى البروج", status: "completed" },
            { day: "الأسبوع 2", date: "W2", surah: "من الطارق إلى البلد", status: "current" },
            { day: "الأسبوع 3", date: "W3", surah: "من الشمس إلى الضحى", status: "upcoming" },
            { day: "الأسبوع 4", date: "W4", surah: "من الشرح إلى الناس", status: "upcoming" },
        ],
        'الفصل الدراسي كامل': [
            { day: "الشهر 1", date: "M1", surah: "حفظ جزء عم كامل", status: "current" },
            { day: "الشهر 2", date: "M2", surah: "حفظ جزء تبارك", status: "upcoming" },
            { day: "الشهر 3", date: "M3", surah: "حفظ جزء قد سمع", status: "upcoming" },
            { day: "النهاية", date: "🏆", surah: "الاختبار النهائي للمقرر", status: "upcoming" },
        ],
    },
    review: {
        'هذا الأسبوع': [
            { day: "الأحد", date: "25", surah: "الجزء الثامن والعشرون", status: "completed" },
            { day: "الاثنين", date: "26", surah: "الجزء التاسع والعشرون", status: "current" },
            { day: "الثلاثاء", date: "27", surah: "سورة الملك والقلم", status: "upcoming" },
            { day: "الأربعاء", date: "28", surah: "سورة الحاقة والمعارج", status: "upcoming" },
            { day: "الخميس", date: "29", surah: "مراجعة عامة للمقرر", status: "upcoming" },
        ],
        'الأسبوع القادم': [
            { day: "الأحد", date: "2", surah: "سورة نوح والجن", status: "upcoming" },
            { day: "الاثنين", date: "3", surah: "سورة المزمل والمدثر", status: "upcoming" },
            { day: "الثلاثاء", date: "4", surah: "سورة القيامة والإنسان", status: "upcoming" },
            { day: "الأربعاء", date: "5", surah: "سورة المرسلات", status: "upcoming" },
            { day: "الخميس", date: "6", surah: "اختبار الجزء 29", status: "upcoming" },
        ],
        'الشهر الحالي': [
            { day: "الأسبوع 1", date: "W1", surah: "مراجعة الجزء 29", status: "completed" },
            { day: "الأسبوع 2", date: "W2", surah: "مراجعة الجزء 28", status: "current" },
            { day: "الأسبوع 3", date: "W3", surah: "مراجعة الجزء 27", status: "upcoming" },
            { day: "الأسبوع 4", date: "W4", surah: "اختبار الأجزاء الثلاثة", status: "upcoming" },
        ],
        'الفصل الدراسي كامل': [
            { day: "الشهر 1", date: "M1", surah: "تثبيت 5 أجزاء", status: "current" },
            { day: "الشهر 2", date: "M2", surah: "تثبيت 10 أجزاء", status: "upcoming" },
            { day: "الشهر 3", date: "M3", surah: "تثبيت 15 جزء", status: "upcoming" },
            { day: "النهاية", date: "🏆", surah: "اختبار الخاتمة الشامل", status: "upcoming" },
        ],
    }
};

export default function MemorizationPlanScreen({ navigation }: any) {
    // State to toggle between New Memorization and Review
    const [activeTab, setActiveTab] = useState<'new' | 'review'>('new');

    // State for the timeframe selection
    const [timeframe, setTimeframe] = useState('هذا الأسبوع');

    // State to control the visibility of the Calendar/Timeframe Modal
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    // Calculate progress dynamically just for the UI (Mock logic)
    const progress = activeTab === 'new' ? 65 : 80;

    // Get the current steps based on both activeTab and selected timeframe
    const currentSteps = planData[activeTab][timeframe];

    // Array of available timeframes for the modal
    const timeframeOptions = ['هذا الأسبوع', 'الأسبوع القادم', 'الشهر الحالي', 'الفصل الدراسي كامل'];

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header --- */}
            <View className="flex-row-reverse items-center justify-between px-5 py-4 bg-card border-b border-border z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    خطة الحفظ
                </Text>

                {/* Spacer to replace the removed top-left button and maintain center alignment */}
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- Tab Switcher --- */}
                <View className="mx-5 mt-6 bg-gray-100 p-1 rounded-xl flex-row-reverse">
                    <TouchableOpacity
                        onPress={() => setActiveTab('new')}
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'new' ? 'bg-card shadow-sm border border-border' : ''}`}
                    >
                        <Text className={`text-sm ${activeTab === 'new' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                            الحفظ الجديد
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('review')}
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'review' ? 'bg-card shadow-sm border border-border' : ''}`}
                    >
                        <Text className={`text-sm ${activeTab === 'review' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                            خطة المراجعة
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- 1. Today's Assignment Card --- */}
                {/* Only show "Today's Assignment" if looking at this week, otherwise hide it to make sense */}
                {timeframe === 'هذا الأسبوع' && (
                    <View className="mx-5 mt-6 p-5 bg-primary-light rounded-2xl border border-primary shadow-sm">
                        <View className="w-full items-end">
                            <Text className="text-xs text-emerald-700 mb-1 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>
                                المقرر لليوم الحالي
                            </Text>
                            <Text className="text-base text-foreground text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                                {activeTab === 'new' ? 'سورة المطففين (الآيات 1 - 15)' : 'الجزء التاسع والعشرون (كامل)'}
                            </Text>
                        </View>
                    </View>
                )}

                {/* --- 2. Main Goal Card --- */}
                <View className={`mx-5 p-5 bg-card rounded-2xl border border-border shadow-sm ${timeframe === 'هذا الأسبوع' ? 'mt-5' : 'mt-6'}`}>
                    <View className="flex-row-reverse items-center justify-between mb-4">
                        <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>الهدف العام للفصل</Text>
                        <View className="px-3 py-1 bg-primary-light rounded-full border border-primary">
                            <Text className="text-xs text-primary" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>{progress}%</Text>
                        </View>
                    </View>

                    <Text className="text-xl text-foreground text-right mb-5" style={{ fontFamily: 'Tajawal-Bold' }}>
                        {activeTab === 'new' ? 'حفظ الجزء الثلاثون (عمّ)' : 'تثبيت الأجزاء 28 و 29'}
                    </Text>

                    {/* Progress Bar */}
                    <View className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6 flex-row justify-end">
                        <View className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                    </View>

                    {/* Stats Row */}
                    <View className="flex-row-reverse justify-between gap-3">
                        <View className="flex-1 items-center py-4 bg-background rounded-xl border border-border">
                            <Text className="text-xs text-muted mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>المقدار المتبقي</Text>
                            <View className="flex-row-reverse items-baseline gap-1">
                                <Text className="text-2xl text-foreground" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>
                                    {activeTab === 'new' ? '12' : '2'}
                                </Text>
                                <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                    {activeTab === 'new' ? 'سورة' : 'جزء'}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1 items-center py-4 bg-orange-50 rounded-xl border border-orange-100">
                            <Text className="text-xs text-orange-600 mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>الأيام المتبقية</Text>
                            <View className="flex-row-reverse items-baseline gap-1">
                                <Text className="text-2xl text-orange-500" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>14</Text>
                                <Text className="text-sm text-orange-500" style={{ fontFamily: 'Tajawal-Medium' }}>يوم</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* --- 3. Weekly/Monthly Roadmap (Zigzag Timeline) --- */}
                <View className="mx-5 mt-6 p-5 bg-card rounded-2xl border border-border shadow-sm mb-8">
                    <View className="flex-row-reverse items-center justify-between mb-8">
                        <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>طريق الوصول</Text>

                        {/* Timeframe Selector Button */}
                        <TouchableOpacity
                            onPress={() => setIsCalendarVisible(true)}
                            activeOpacity={0.7}
                            className="flex-row-reverse items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-border"
                        >
                            <Feather name="calendar" size={12} color="#64748b" />
                            <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>{timeframe}</Text>
                            <Feather name="chevron-down" size={14} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    {/* Zigzag Container */}
                    <View className="relative w-full py-2">
                        {/* Center Dashed Line */}
                        <View
                            className="absolute top-0 bottom-0 w-[2px] bg-gray-200"
                            style={{ left: '50%', transform: [{ translateX: -1 }] }}
                        />

                        {currentSteps.map((step: any, index: number) => {
                            const isRight = index % 2 === 0;
                            const isCompleted = step.status === "completed";
                            const isCurrent = step.status === "current";

                            return (
                                <View key={index} className="flex-row-reverse items-center w-full mb-8">
                                    <View className={`w-1/2 ${isRight ? 'pl-6 items-start' : ''}`}>
                                        {isRight && (
                                            <View className="items-end w-full">
                                                <Text className={`text-sm mb-1 ${isCompleted ? 'text-muted' : isCurrent ? 'text-primary' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                                    {step.day}
                                                </Text>
                                                <Text className={`text-xs text-right ${isCompleted ? 'text-gray-300 line-through' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Medium' }}>
                                                    {step.surah}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <View
                                        className="absolute left-1/2 w-8 h-8 rounded-full items-center justify-center z-10 border-4 border-card"
                                        style={{
                                            marginLeft: -16,
                                            backgroundColor: isCompleted || isCurrent ? '#10b981' : '#f3f4f6'
                                        }}
                                    >
                                        {isCompleted ? (
                                            <Feather name="check" size={14} color="#ffffff" />
                                        ) : isCurrent ? (
                                            <View className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                                        ) : (
                                            <Text className="text-[10px] text-gray-400" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>{step.date}</Text>
                                        )}
                                    </View>

                                    <View className={`w-1/2 ${!isRight ? 'pr-6 items-end' : ''}`}>
                                        {!isRight && (
                                            <View className="items-start w-full">
                                                <Text className={`text-sm mb-1 ${isCompleted ? 'text-muted' : isCurrent ? 'text-primary' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                                    {step.day}
                                                </Text>
                                                <Text className={`text-xs text-left ${isCompleted ? 'text-gray-300 line-through' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Medium' }}>
                                                    {step.surah}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

            </ScrollView>

            {/* --- Calendar / Timeframe Selection Modal (Centered with Fade) --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isCalendarVisible}
                onRequestClose={() => setIsCalendarVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-center items-center px-5 bg-black/40"
                    onPress={() => setIsCalendarVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <View className="bg-card w-full rounded-3xl p-6 shadow-2xl">

                            <View className="flex-row-reverse items-center justify-between mb-6">
                                <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    اختر الإطار الزمني
                                </Text>
                                <TouchableOpacity onPress={() => setIsCalendarVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                    <Feather name="x" size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <View className="space-y-3 mb-2">
                                {timeframeOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setTimeframe(option);
                                            setIsCalendarVisible(false);
                                        }}
                                        className={`flex-row-reverse items-center justify-between p-4 rounded-xl border ${timeframe === option ? 'bg-primary-light border-primary shadow-sm' : 'bg-white border-gray-100'
                                            }`}
                                    >
                                        <Text
                                            className={`text-sm ${timeframe === option ? 'text-primary' : 'text-slate-600'}`}
                                            style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}
                                        >
                                            {option}
                                        </Text>
                                        {timeframe === option && (
                                            <Feather name="check-circle" size={18} color="#10b981" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

        </View>
    );
}