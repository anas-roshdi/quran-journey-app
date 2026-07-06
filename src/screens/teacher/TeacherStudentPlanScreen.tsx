import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, Modal, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Mock Data: Initial Editable Plan ---
const initialPlanData: any = {
    new: {
        'هذا الأسبوع': [
            { id: '1', day: "الأحد", date: "25", surah: "سورة الانفطار", status: "completed" },
            { id: '2', day: "الاثنين", date: "26", surah: "سورة المطففين (1-15)", status: "current" },
            { id: '3', day: "الثلاثاء", date: "27", surah: "سورة المطففين (16-36)", status: "upcoming" },
            { id: '4', day: "الأربعاء", date: "28", surah: "سورة الانشقاق", status: "upcoming" },
            { id: '5', day: "الخميس", date: "29", surah: "سورة البروج", status: "upcoming" },
        ],
    },
    review: {
        'هذا الأسبوع': [
            { id: '1', day: "الأحد", date: "25", surah: "الجزء 28", status: "completed" },
            { id: '2', day: "الاثنين", date: "26", surah: "الجزء 29", status: "current" },
            { id: '3', day: "الثلاثاء", date: "27", surah: "سورة الملك والقلم", status: "upcoming" },
            { id: '4', day: "الأربعاء", date: "28", surah: "سورة الحاقة والمعارج", status: "upcoming" },
            { id: '5', day: "الخميس", date: "29", surah: "مراجعة عامة", status: "upcoming" },
        ],
    }
};

export default function TeacherStudentPlanScreen({ route, navigation }: any) {
    // --- Master State: Has the plan been generated? ---
    // في التطبيق الحقيقي سيتم تمرير هذا المتغير من الشاشة السابقة أو من قاعدة البيانات
    const [hasActivePlan, setHasActivePlan] = useState(false);

    // --- Roadmap States ---
    const [activeTab, setActiveTab] = useState<'new' | 'review'>('new');
    const [editablePlan, setEditablePlan] = useState(initialPlanData);
    const [isEditDayModalVisible, setIsEditDayModalVisible] = useState(false);
    const [editingDay, setEditingDay] = useState<any>(null);
    const [editSurahValue, setEditSurahValue] = useState("");

    // --- Assessment Form States (For New Students) ---
    const [actualMemorized, setActualMemorized] = useState("");
    const [dailyCapacity, setDailyCapacity] = useState("نصف صفحة");
    const [reviewIntensity, setReviewIntensity] = useState("متوسط");

    // --- Handlers ---
    const handleGeneratePlan = () => {
        // هنا يتم استدعاء الخوارزمية لإنشاء الخطة بناءً على المدخلات
        alert("تم توليد الخطة السنوية للطالب بنجاح!");
        setHasActivePlan(true); // تحويل الشاشة لعرض الخطة
    };

    const handleEditDayClick = (dayItem: any) => {
        setEditingDay(dayItem);
        setEditSurahValue(dayItem.surah);
        setIsEditDayModalVisible(true);
    };

    const handleSaveDayEdit = () => {
        setEditablePlan((prev: any) => {
            const updatedPlan = { ...prev };
            const currentArray = updatedPlan[activeTab]['هذا الأسبوع'];
            const dayIndex = currentArray.findIndex((d: any) => d.id === editingDay.id);
            if (dayIndex > -1) {
                currentArray[dayIndex].surah = editSurahValue;
            }
            return updatedPlan;
        });
        setIsEditDayModalVisible(false);
    };

    const currentSteps = editablePlan[activeTab]['هذا الأسبوع'];

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }} className="flex-1">

                {/* --- Header --- */}
                <View className="flex-row-reverse items-center justify-between px-5 py-4 bg-card border-b border-border z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-background rounded-full border border-border active:opacity-70">
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>إعداد خطة الطالب</Text>
                        <Text className="text-xs text-primary mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>عمر خالد</Text>
                    </View>
                    {/* إذا كانت الخطة موجودة، نعرض زر لإعادة التقييم */}
                    {hasActivePlan ? (
                        <TouchableOpacity onPress={() => setHasActivePlan(false)} className="p-2 bg-orange-50 rounded-full border border-orange-100 active:opacity-70">
                            <Feather name="refresh-ccw" size={20} color="#f97316" />
                        </TouchableOpacity>
                    ) : (
                        <View className="w-10" />
                    )}
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* ========================================================================= */}
                    {/* VIEW A: ASSESSMENT & PLAN GENERATION (NO ACTIVE PLAN)                     */}
                    {/* ========================================================================= */}
                    {!hasActivePlan && (
                        <View className="px-5 mt-6">

                            {/* 1. Student's Claimed Data */}
                            <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
                                <View className="flex-row-reverse items-center mb-4 border-b border-gray-100 pb-3">
                                    <Feather name="info" size={18} color="#64748b" style={{ marginLeft: 8 }} />
                                    <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>البيانات المدخلة من الطالب</Text>
                                </View>

                                <View className="flex-row-reverse justify-between items-center mb-3">
                                    <Text className="text-sm text-slate-500" style={{ fontFamily: 'Tajawal-Medium' }}>الحفظ السابق المدعى:</Text>
                                    <Text className="text-sm text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>3 أجزاء (عم، تبارك، قد سمع)</Text>
                                </View>
                                <View className="flex-row-reverse justify-between items-center">
                                    <Text className="text-sm text-slate-500" style={{ fontFamily: 'Tajawal-Medium' }}>المقدار اليومي المقترح:</Text>
                                    <Text className="text-sm text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>نصف صفحة</Text>
                                </View>
                            </View>

                            {/* 2. Teacher's Actual Assessment Form */}
                            <View className="bg-white border border-primary/20 rounded-2xl p-5 shadow-sm mb-6">
                                <View className="flex-row-reverse items-center mb-6">
                                    <View className="w-8 h-8 bg-primary-light rounded-full items-center justify-center ml-2 border border-primary">
                                        <Feather name="edit-3" size={14} color="#10b981" />
                                    </View>
                                    <Text className="text-lg text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>تقييم المعلم للسبر</Text>
                                </View>

                                {/* Actual Memorized */}
                                <Text className="text-sm text-slate-700 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>مقدار الحفظ الفعلي المتأكد منه</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 text-right text-sm text-foreground mb-5 focus:border-primary"
                                    placeholder="مثال: جزء عم وتبارك فقط"
                                    placeholderTextColor="#9ca3af"
                                    value={actualMemorized}
                                    onChangeText={setActualMemorized}
                                    style={{ fontFamily: 'Tajawal-Medium' }}
                                />

                                {/* Daily Capacity */}
                                <Text className="text-sm text-slate-700 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>قدرة الطالب اليومية للحفظ الجديد</Text>
                                <View className="flex-row-reverse flex-wrap gap-2 mb-5">
                                    {['ربع صفحة', 'نصف صفحة', 'صفحة كاملة', 'صفحتين'].map(cap => (
                                        <TouchableOpacity
                                            key={cap}
                                            onPress={() => setDailyCapacity(cap)}
                                            className={`px-4 py-2 rounded-lg border ${dailyCapacity === cap ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`text-xs ${dailyCapacity === cap ? 'text-white' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>{cap}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Review Intensity */}
                                <Text className="text-sm text-slate-700 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>كثافة المراجعة المطلوبة</Text>
                                <View className="flex-row-reverse flex-wrap gap-2 mb-2">
                                    {['خفيف', 'متوسط', 'مكثف'].map(intensity => (
                                        <TouchableOpacity
                                            key={intensity}
                                            onPress={() => setReviewIntensity(intensity)}
                                            className={`px-4 py-2 rounded-lg border ${reviewIntensity === intensity ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`text-xs ${reviewIntensity === intensity ? 'text-white' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>{intensity}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Action Button */}
                            <TouchableOpacity
                                onPress={handleGeneratePlan}
                                activeOpacity={0.8}
                                className="w-full bg-primary h-14 rounded-xl items-center justify-center shadow-sm"
                            >
                                <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    توليد خطة الطالب التلقائية
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* ========================================================================= */}
                    {/* VIEW B: ROADMAP VIEW (HAS ACTIVE PLAN)                                    */}
                    {/* ========================================================================= */}
                    {hasActivePlan && (
                        <View>
                            {/* --- Tab Switcher --- */}
                            <View className="mx-5 mt-6 bg-gray-100 p-1 rounded-xl flex-row-reverse">
                                <TouchableOpacity onPress={() => setActiveTab('new')} className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'new' ? 'bg-card shadow-sm border border-border' : ''}`}>
                                    <Text className={`text-sm ${activeTab === 'new' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>الحفظ الجديد</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('review')} className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'review' ? 'bg-card shadow-sm border border-border' : ''}`}>
                                    <Text className={`text-sm ${activeTab === 'review' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>المراجعة</Text>
                                </TouchableOpacity>
                            </View>

                            {/* --- Main Goal Card (Editable) --- */}
                            <View className="mx-5 mt-5 p-5 bg-card rounded-2xl border border-border shadow-sm">
                                <View className="flex-row-reverse items-center justify-between mb-4">
                                    <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>الهدف الأسبوعي للطالب</Text>
                                    <TouchableOpacity className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200 flex-row-reverse items-center">
                                        <Feather name="edit-2" size={12} color="#64748b" style={{ marginLeft: 4 }} />
                                        <Text className="text-xs text-slate-700" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تعديل الهدف</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-xl text-foreground text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    {activeTab === 'new' ? 'إتمام سورة الانشقاق والبروج' : 'تثبيت الجزء التاسع والعشرين'}
                                </Text>
                            </View>

                            {/* --- Roadmap (Teacher View with Edit Icons) --- */}
                            <View className="mx-5 mt-6 p-5 bg-card rounded-2xl border border-border shadow-sm mb-8">
                                <Text className="text-lg text-foreground text-right mb-8" style={{ fontFamily: 'Tajawal-Bold' }}>توزيع الأيام (هذا الأسبوع)</Text>

                                <View className="relative w-full py-2">
                                    <View className="absolute top-0 bottom-0 w-[2px] bg-gray-200" style={{ left: '50%', transform: [{ translateX: -1 }] }} />

                                    {currentSteps.map((step: any, index: number) => {
                                        const isRight = index % 2 === 0;
                                        const isCompleted = step.status === "completed";
                                        const isCurrent = step.status === "current";

                                        return (
                                            <View key={step.id} className="flex-row-reverse items-center w-full mb-8">
                                                <View className={`w-1/2 ${isRight ? 'pl-6 items-start' : ''}`}>
                                                    {isRight && (
                                                        <TouchableOpacity onPress={() => handleEditDayClick(step)} activeOpacity={0.7} className="items-end w-full bg-gray-50 p-3 rounded-xl border border-gray-200">
                                                            <View className="flex-row-reverse justify-between w-full mb-1">
                                                                <Text className="text-sm text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>{step.day}</Text>
                                                                <Feather name="edit-2" size={14} color="#9ca3af" />
                                                            </View>
                                                            <Text className="text-xs text-slate-700 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>{step.surah}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>

                                                <View
                                                    className="absolute left-1/2 w-8 h-8 rounded-full items-center justify-center z-10 border-4 border-card"
                                                    style={{ marginLeft: -16, backgroundColor: isCompleted || isCurrent ? '#10b981' : '#f3f4f6' }}
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
                                                        <TouchableOpacity onPress={() => handleEditDayClick(step)} activeOpacity={0.7} className="items-start w-full bg-gray-50 p-3 rounded-xl border border-gray-200">
                                                            <View className="flex-row justify-between w-full mb-1">
                                                                <Text className="text-sm text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>{step.day}</Text>
                                                                <Feather name="edit-2" size={14} color="#9ca3af" />
                                                            </View>
                                                            <Text className="text-xs text-slate-700 text-left" style={{ fontFamily: 'Tajawal-Medium' }}>{step.surah}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            <View className="px-5 mb-8">
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    className="w-full bg-white border border-primary h-14 rounded-xl items-center justify-center shadow-sm"
                                >
                                    <Text className="text-primary text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                        اعتماد الخطة المخصصة
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                </ScrollView>

                {/* --- Edit Specific Day Modal --- */}
                <Modal animationType="fade" transparent={true} visible={isEditDayModalVisible} onRequestClose={() => setIsEditDayModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-5 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 shadow-2xl">
                            <View className="flex-row-reverse items-center justify-between mb-6">
                                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تعديل مقرَّر {editingDay?.day}</Text>
                                <TouchableOpacity onPress={() => setIsEditDayModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                    <Feather name="x" size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <Text className="text-sm text-slate-700 mb-2 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>السورة / المقدار</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl h-14 px-4 text-right text-base text-foreground mb-6 focus:border-primary"
                                value={editSurahValue}
                                onChangeText={setEditSurahValue}
                                style={{ fontFamily: 'Tajawal-Medium' }}
                            />

                            <TouchableOpacity onPress={handleSaveDayEdit} className="w-full bg-primary h-12 rounded-xl items-center justify-center shadow-sm">
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>حفظ التعديل</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </KeyboardAvoidingView>
    );
}