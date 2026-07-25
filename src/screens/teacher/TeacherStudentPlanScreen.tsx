import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, Modal, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Dynamic Data Structure for ALL timeframes and tabs ---
const initialPlanData: any = {
    new: {
        'هذا الأسبوع': [
            { id: "1", day: "الأحد", date: "25", surah: "سورة الانفطار", status: "completed" },
            { id: "2", day: "الاثنين", date: "26", surah: "سورة المطففين (1-15)", status: "current" },
            { id: "3", day: "الثلاثاء", date: "27", surah: "سورة المطففين (16-36)", status: "upcoming" },
            { id: "4", day: "الأربعاء", date: "28", surah: "سورة الانشقاق", status: "upcoming" },
            { id: "5", day: "الخميس", date: "29", surah: "سورة البروج", status: "upcoming" },
        ],
        'الأسبوع القادم': [
            { id: "6", day: "الأحد", date: "2", surah: "سورة الطارق والأعلى", status: "upcoming" },
            { id: "7", day: "الاثنين", date: "3", surah: "سورة الغاشية", status: "upcoming" },
            { id: "8", day: "الثلاثاء", date: "4", surah: "سورة الفجر", status: "upcoming" },
            { id: "9", day: "الأربعاء", date: "5", surah: "سورة البلد", status: "upcoming" },
            { id: "10", day: "الخميس", date: "6", surah: "مراجعة الأسبوع", status: "upcoming" },
        ],
        'الشهر الحالي': [
            { id: "11", day: "الأسبوع 1", date: "W1", surah: "من الانفطار إلى البروج", status: "completed" },
            { id: "12", day: "الأسبوع 2", date: "W2", surah: "من الطارق إلى البلد", status: "current" },
            { id: "13", day: "الأسبوع 3", date: "W3", surah: "من الشمس إلى الضحى", status: "upcoming" },
            { id: "14", day: "الأسبوع 4", date: "W4", surah: "من الشرح إلى الناس", status: "upcoming" },
        ],
        'الفصل الدراسي كامل': [
            { id: "15", day: "الشهر 1", date: "M1", surah: "حفظ جزء عم كامل", status: "current" },
            { id: "16", day: "الشهر 2", date: "M2", surah: "حفظ جزء تبارك", status: "upcoming" },
            { id: "17", day: "الشهر 3", date: "M3", surah: "حفظ جزء قد سمع", status: "upcoming" },
            { id: "18", day: "النهاية", date: "🏆", surah: "الاختبار النهائي للمقرر", status: "upcoming" },
        ],
    },
    review: {
        'هذا الأسبوع': [
            { id: "19", day: "الأحد", date: "25", surah: "الجزء الثامن والعشرون", status: "completed" },
            { id: "20", day: "الاثنين", date: "26", surah: "الجزء التاسع والعشرون", status: "current" },
            { id: "21", day: "الثلاثاء", date: "27", surah: "سورة الملك والقلم", status: "upcoming" },
            { id: "22", day: "الأربعاء", date: "28", surah: "سورة الحاقة والمعارج", status: "upcoming" },
            { id: "23", day: "الخميس", date: "29", surah: "مراجعة عامة للمقرر", status: "upcoming" },
        ],
        'الأسبوع القادم': [
            { id: "24", day: "الأحد", date: "2", surah: "سورة نوح والجن", status: "upcoming" },
            { id: "25", day: "الاثنين", date: "3", surah: "سورة المزمل والمدثر", status: "upcoming" },
            { id: "26", day: "الثلاثاء", date: "4", surah: "سورة القيامة والإنسان", status: "upcoming" },
            { id: "27", day: "الأربعاء", date: "5", surah: "سورة المرسلات", status: "upcoming" },
            { id: "28", day: "الخميس", date: "6", surah: "اختبار الجزء 29", status: "upcoming" },
        ],
        'الشهر الحالي': [
            { id: "29", day: "الأسبوع 1", date: "W1", surah: "مراجعة الجزء 29", status: "completed" },
            { id: "30", day: "الأسبوع 2", date: "W2", surah: "مراجعة الجزء 28", status: "current" },
            { id: "31", day: "الأسبوع 3", date: "W3", surah: "مراجعة الجزء 27", status: "upcoming" },
            { id: "32", day: "الأسبوع 4", date: "W4", surah: "اختبار الأجزاء الثلاثة", status: "upcoming" },
        ],
        'الفصل الدراسي كامل': [
            { id: "33", day: "الشهر 1", date: "M1", surah: "تثبيت 5 أجزاء", status: "current" },
            { id: "34", day: "الشهر 2", date: "M2", surah: "تثبيت 10 أجزاء", status: "upcoming" },
            { id: "35", day: "الشهر 3", date: "M3", surah: "تثبيت 15 جزء", status: "upcoming" },
            { id: "36", day: "النهاية", date: "🏆", surah: "اختبار الخاتمة الشامل", status: "upcoming" },
        ],
    }
};

export default function TeacherStudentPlanScreen({ route, navigation }: any) {
    // --- Master States ---
    const [hasActivePlan, setHasActivePlan] = useState(false);
    const [activeTab, setActiveTab] = useState<'new' | 'review'>('new');
    const [timeframe, setTimeframe] = useState('هذا الأسبوع');
    const [editablePlan, setEditablePlan] = useState(initialPlanData);

    // --- Assessment Input States ---
    const [actualMemorized, setActualMemorized] = useState("");
    const [dailyCapacity, setDailyCapacity] = useState("نصف صفحة");
    const [reviewIntensity, setReviewIntensity] = useState("متوسط");
    const [planDuration, setPlanDuration] = useState("3");

    // --- Dynamic Goals States ---
    const [newGoalText, setNewGoalText] = useState("حفظ الجزء الثلاثون (عمّ)");
    const [reviewGoalText, setReviewGoalText] = useState("تثبيت الأجزاء 28 و 29");

    // --- Modal Visibility States ---
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isFinalSuccessModalVisible, setIsFinalSuccessModalVisible] = useState(false);
    const [isEditGoalModalVisible, setIsEditGoalModalVisible] = useState(false);
    const [isEditDayModalVisible, setIsEditDayModalVisible] = useState(false);

    // --- Temp Editing States ---
    const [editingDay, setEditingDay] = useState<any>(null);
    const [editSurahValue, setEditSurahValue] = useState("");
    const [tempGoalText, setTempGoalText] = useState("");

    // --- Static Indicators Sync ---
    const progress = activeTab === 'new' ? 65 : 80;
    const currentSteps = editablePlan[activeTab][timeframe];
    const timeframeOptions = ['هذا الأسبوع', 'الأسبوع القادم', 'الشهر الحالي', 'الفصل الدراسي كامل'];

    // --- Action Handlers ---
    const handleGeneratePlanClick = () => {
        setIsSuccessModalVisible(true);
    };

    const confirmPlanGeneration = () => {
        setIsSuccessModalVisible(false);
        setHasActivePlan(true);
    };

    const handleEditGoalClick = () => {
        setTempGoalText(activeTab === 'new' ? newGoalText : reviewGoalText);
        setIsEditGoalModalVisible(true);
    };

    const handleSaveGoal = () => {
        if (activeTab === 'new') setNewGoalText(tempGoalText);
        else setReviewGoalText(tempGoalText);
        setIsEditGoalModalVisible(false);
    };

    const handleEditDayClick = (dayItem: any) => {
        setEditingDay(dayItem);
        setEditSurahValue(dayItem.surah);
        setIsEditDayModalVisible(true);
    };

    const handleSaveDayEdit = () => {
        setEditablePlan((prev: any) => {
            const updatedPlan = { ...prev };
            const currentArray = updatedPlan[activeTab][timeframe];
            const dayIndex = currentArray.findIndex((d: any) => d.id === editingDay.id);
            if (dayIndex > -1) {
                currentArray[dayIndex].surah = editSurahValue;
            }
            return updatedPlan;
        });
        setIsEditDayModalVisible(false);
    };

    const handleFinalSuccessClose = () => {
        setIsFinalSuccessModalVisible(false);
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }} className="flex-1">

                {/* --- Header Component --- */}
                <View className="flex-row-reverse items-center justify-between px-5 py-4 bg-card border-b border-border z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-background rounded-full border border-border active:opacity-70">
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>إعداد خطة الطالب</Text>
                        <Text className="text-xs text-primary mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>عمر خالد</Text>
                    </View>
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
                    {/* VIEW A: ASSESSMENT & INITIAL FORM (NO PLAN GENERATED YET)                 */}
                    {/* ========================================================================= */}
                    {!hasActivePlan && (
                        <View className="px-5 mt-6">

                            {/* Student's Claimed Registration Data */}
                            <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
                                <View className="flex-row-reverse items-center mb-4 border-b border-gray-100 pb-3">
                                    <Feather name="info" size={18} color="#64748b" style={{ marginLeft: 8 }} />
                                    <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>البيانات المدخلة من الطالب</Text>
                                </View>

                                {/* Fixed layout display with removed circle background for help icon */}
                                <View className="flex-row-reverse items-center justify-start mb-3 w-full">
                                    <Text className="text-sm text-slate-500" style={{ fontFamily: 'Tajawal-Medium' }}>الحفظ السابق المدعى: </Text>
                                    <Text className="text-sm text-foreground mr-1" style={{ fontFamily: 'Tajawal-Bold' }}>3 أجزاء</Text>
                                    <TouchableOpacity onPress={() => setIsDetailsModalVisible(true)} className="mr-1.5 p-0.5">
                                        <Feather name="help-circle" size={15} color="#f97316" />
                                    </TouchableOpacity>
                                </View>

                                {/* Fixed layout with tight horizontal constraints */}
                                <View className="flex-row-reverse items-center justify-start w-full">
                                    <Text className="text-sm text-slate-500" style={{ fontFamily: 'Tajawal-Medium' }}>المقدار اليومي المقترح: </Text>
                                    <Text className="text-sm text-foreground mr-1" style={{ fontFamily: 'Tajawal-Bold' }}>نصف صفحة</Text>
                                </View>
                            </View>

                            {/* Teacher's Assessment and Generation Inputs */}
                            <View className="bg-white border border-primary/20 rounded-2xl p-5 shadow-sm mb-6">
                                <View className="flex-row-reverse items-center mb-6">
                                    <View className="w-8 h-8 bg-primary-light rounded-full items-center justify-center ml-2 border border-primary">
                                        <Feather name="edit-3" size={14} color="#10b981" />
                                    </View>
                                    <Text className="text-lg text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>تقييم المعلم</Text>
                                </View>

                                {/* Actual Verified Amount */}
                                <Text className="text-sm text-slate-700 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>مقدار الحفظ الفعلي المتأكد منه</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 text-right text-sm text-foreground mb-5 focus:border-primary"
                                    placeholder="مثال: جزء عم وتبارك فقط"
                                    placeholderTextColor="#9ca3af"
                                    value={actualMemorized}
                                    onChangeText={setActualMemorized}
                                    style={{ fontFamily: 'Tajawal-Medium' }}
                                />

                                {/* Form Duration in Months */}
                                <Text className="text-sm text-slate-700 mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>مدة الخطة المطلوبة (بالأشهر)</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl h-12 px-4 text-right text-sm text-foreground mb-5 focus:border-primary"
                                    placeholder="أدخل عدد الأشهر كـ 3 أو 6 أو 12"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="numeric"
                                    value={planDuration}
                                    onChangeText={setPlanDuration}
                                    style={{ fontFamily: 'Tajawal-Medium' }}
                                />

                                {/* Daily Learning Capacity */}
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

                                {/* Review Intensity Selection */}
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

                            {/* Generate Trigger */}
                            <TouchableOpacity
                                onPress={handleGeneratePlanClick}
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
                    {/* VIEW B: ACTIVE PLAN DASHBOARD (MIRRORS STUDENT SCREEN VIEW)                */}
                    {/* ========================================================================= */}
                    {hasActivePlan && (
                        <View>
                            {/* Tab Toggler (New Memorization vs Review Plan) */}
                            <View className="mx-5 mt-6 bg-gray-100 p-1 rounded-xl flex-row-reverse">
                                <TouchableOpacity onPress={() => setActiveTab('new')} className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'new' ? 'bg-card shadow-sm border border-border' : ''}`}>
                                    <Text className={`text-sm ${activeTab === 'new' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>الحفظ الجديد</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('review')} className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'review' ? 'bg-card shadow-sm border border-border' : ''}`}>
                                    <Text className={`text-sm ${activeTab === 'review' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>خطة المراجعة</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Current Assignment Card Conditional Display */}
                            {timeframe === 'هذا الأسبوع' && (
                                <View className="mx-5 mt-6 p-5 bg-primary-light rounded-2xl border border-primary shadow-sm">
                                    <View className="w-full items-end">
                                        <Text className="text-xs text-emerald-700 mb-1 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>المقرر لليوم الحالي</Text>
                                        <Text className="text-base text-foreground text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {activeTab === 'new' ? 'سورة المطففين (الآيات 1 - 15)' : 'الجزء التاسع والعشرون (كامل)'}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Main Semester Goal Card (Editable by Teacher) */}
                            <View className={`mx-5 p-5 bg-card rounded-2xl border border-border shadow-sm ${timeframe === 'هذا الأسبوع' ? 'mt-5' : 'mt-6'}`}>
                                <View className="flex-row-reverse items-center justify-between mb-4">
                                    <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>الهدف العام للفصل</Text>
                                    <TouchableOpacity onPress={handleEditGoalClick} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full flex-row-reverse items-center">
                                        <Feather name="edit-2" size={11} color="#64748b" style={{ marginLeft: 4 }} />
                                        <Text className="text-[11px] text-slate-600" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 1 }}>تعديل الهدف</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text className="text-xl text-foreground text-right mb-5" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    {activeTab === 'new' ? newGoalText : reviewGoalText}
                                </Text>

                                {/* Visual Progress Indicator Bar */}
                                <View className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6 flex-row justify-end">
                                    <View className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                                </View>

                                {/* Synchronization Statistics Grid Row */}
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

                            {/* Roadmap Timelines Container Block */}
                            <View className="mx-5 mt-6 p-5 bg-card rounded-2xl border border-border shadow-sm mb-8">
                                <View className="flex-row-reverse items-center justify-between mb-8">
                                    <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>طريق الوصول</Text>

                                    {/* Swappable Timeframe Selector Button */}
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

                                {/* Zigzag Render Matrix */}
                                <View className="relative w-full py-2">
                                    <View className="absolute top-0 bottom-0 w-[2px] bg-gray-200" style={{ left: '50%', transform: [{ translateX: -1 }] }} />

                                    {currentSteps.map((step: any, index: number) => {
                                        const isRight = index % 2 === 0;
                                        const isCompleted = step.status === "completed";
                                        const isCurrent = step.status === "current";

                                        return (
                                            <View key={step.id || index} className="flex-row-reverse items-center w-full mb-8">

                                                {/* Right Node Layout Selection */}
                                                <View className={`w-1/2 ${isRight ? 'pl-6 items-start' : ''}`}>
                                                    {isRight && (
                                                        <TouchableOpacity onPress={() => handleEditDayClick(step)} activeOpacity={0.7} className="items-end w-full bg-gray-50 p-3 rounded-xl border border-gray-200">
                                                            <View className="flex-row-reverse justify-between w-full mb-1">
                                                                <Text className={`text-sm ${isCompleted ? 'text-muted' : isCurrent ? 'text-primary' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>{step.day}</Text>
                                                                <Feather name="edit-2" size={12} color="#9ca3af" />
                                                            </View>
                                                            <Text className={`text-xs text-right ${isCompleted ? 'text-gray-300 line-through' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Medium' }}>{step.surah}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>

                                                {/* Central Progress Point Graphic */}
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

                                                {/* Left Node Layout Selection */}
                                                <View className={`w-1/2 ${!isRight ? 'pr-6 items-end' : ''}`}>
                                                    {!isRight && (
                                                        <TouchableOpacity onPress={() => handleEditDayClick(step)} activeOpacity={0.7} className="items-start w-full bg-gray-50 p-3 rounded-xl border border-gray-200">
                                                            <View className="flex-row justify-between w-full mb-1">
                                                                <Text className={`text-sm ${isCompleted ? 'text-muted' : isCurrent ? 'text-primary' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>{step.day}</Text>
                                                                <Feather name="edit-2" size={12} color="#9ca3af" />
                                                            </View>
                                                            <Text className={`text-xs text-left ${isCompleted ? 'text-gray-300 line-through' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Medium' }}>{step.surah}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>

                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* Permanent Finalization Save Trigger */}
                            <View className="px-5 mb-8">
                                <TouchableOpacity
                                    onPress={() => setIsFinalSuccessModalVisible(true)}
                                    activeOpacity={0.8}
                                    className="w-full bg-primary h-14 rounded-xl items-center justify-center shadow-sm"
                                >
                                    <Text numberOfLines={1} className="text-white text-lg text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                        اعتماد الخطة المخصصة نهائياً
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                </ScrollView>

                {/* ========================================================================= */}
                {/* SYSTEM DIALOG MODALS INTERFACES                                           */}
                {/* ========================================================================= */}

                {/* Modal: Claimed Parts Explanatory Details */}
                <Modal animationType="fade" transparent={true} visible={isDetailsModalVisible} onRequestClose={() => setIsDetailsModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-5 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 shadow-2xl">
                            <View className="flex-row-reverse items-center justify-between mb-4 border-b border-gray-100 pb-3">
                                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تفاصيل الحفظ السابق</Text>
                                <TouchableOpacity onPress={() => setIsDetailsModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                    <Feather name="x" size={18} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                            <Text className="text-base text-slate-700 text-right leading-relaxed mb-6" style={{ fontFamily: 'Tajawal-Medium' }}>
                                الأجزاء الثلاثة المسجلة في ملف الطالب عند الاستبيان هي: {"\n"}
                                <Text style={{ fontFamily: 'Tajawal-Bold' }} className="text-primary">جزء عمَّ، وجزء تبارك، وجزء قد سمع.</Text>
                            </Text>
                            <TouchableOpacity onPress={() => setIsDetailsModalVisible(false)} className="w-full bg-primary h-12 rounded-xl items-center justify-center shadow-sm">
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>إغلاق نافذة التفاصيل</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal: Generation Success Custom Dialog */}
                <Modal animationType="fade" transparent={true} visible={isSuccessModalVisible} onRequestClose={() => setIsSuccessModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-6 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">
                            <View className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full items-center justify-center mb-5">
                                <Feather name="check" size={40} color="#10b981" />
                            </View>
                            <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>تم توليد الخطة بنجاح</Text>
                            <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                قمنا بحساب الفترات الزمنية وتوليد خطة مخصصة للطالب بناءً على قياس السبر المدخل. يمكنك الآن تعديلها يدوياً أو اعتمادها.
                            </Text>
                            <TouchableOpacity onPress={confirmPlanGeneration} activeOpacity={0.8} className="w-full h-12 bg-primary rounded-xl items-center justify-center shadow-sm">
                                <Text numberOfLines={1} className="text-white text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                    عرض الخطة المتولدة
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal: Final Plan Approval Confirmation Custom Dialog */}
                <Modal animationType="fade" transparent={true} visible={isFinalSuccessModalVisible} onRequestClose={handleFinalSuccessClose}>
                    <View className="flex-1 justify-center items-center px-6 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">
                            <View className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full items-center justify-center mb-5">
                                <Feather name="check" size={40} color="#10b981" />
                            </View>
                            <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>تم اعتماد الخطة نهائياً</Text>
                            <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                تم حفظ الجدول التعليمي والمراجعات وإرسال نسخة منها مباشرة إلى ملف الطالب وولي الأمر للمتابعة والالتزام اليومي.
                            </Text>
                            <TouchableOpacity onPress={handleFinalSuccessClose} activeOpacity={0.8} className="w-full h-12 bg-primary rounded-xl items-center justify-center shadow-sm">
                                <Text numberOfLines={1} className="text-white text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                    العودة للوحة التحكم
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal: Custom Semester Target/Goal Editor */}
                <Modal animationType="fade" transparent={true} visible={isEditGoalModalVisible} onRequestClose={() => setIsEditGoalModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-5 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 shadow-2xl">
                            <View className="flex-row-reverse items-center justify-between mb-4 border-b border-gray-100 pb-3">
                                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تعديل الهدف العام</Text>
                                <TouchableOpacity onPress={() => setIsEditGoalModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                    <Feather name="x" size={18} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                            <Text className="text-sm text-slate-700 mb-2 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>الهدف العام للفصل</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl h-14 px-4 text-right text-base text-foreground mb-6 focus:border-primary"
                                value={tempGoalText}
                                onChangeText={setTempGoalText}
                                style={{ fontFamily: 'Tajawal-Medium' }}
                            />
                            <TouchableOpacity onPress={handleSaveGoal} className="w-full bg-primary h-12 rounded-xl items-center justify-center shadow-sm">
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>حفظ تغيير الهدف</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal: Daily Roadmap Content Editor */}
                <Modal animationType="fade" transparent={true} visible={isEditDayModalVisible} onRequestClose={() => setIsEditDayModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-5 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 shadow-2xl">
                            <View className="flex-row-reverse items-center justify-between mb-4 border-b border-gray-100 pb-3">
                                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تعديل مقرر {editingDay?.day}</Text>
                                <TouchableOpacity onPress={() => setIsEditDayModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                    <Feather name="x" size={18} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                            <Text className="text-sm text-slate-700 mb-2 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>السورة / المقدار المطلوب</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl h-14 px-4 text-right text-base text-foreground mb-6 focus:border-primary"
                                value={editSurahValue}
                                onChangeText={setEditSurahValue}
                                style={{ fontFamily: 'Tajawal-Medium' }}
                            />
                            <TouchableOpacity onPress={handleSaveDayEdit} className="w-full bg-primary h-12 rounded-xl items-center justify-center shadow-sm">
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>حفظ التعديل اليومي</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal: Timeframe Selection Matrix Toggler */}
                <Modal animationType="fade" transparent={true} visible={isCalendarVisible} onRequestClose={() => setIsCalendarVisible(false)}>
                    <TouchableOpacity activeOpacity={1} className="flex-1 justify-center items-center px-5 bg-black/40" onPress={() => setIsCalendarVisible(false)}>
                        <TouchableWithoutFeedback>
                            <View className="bg-card w-full rounded-3xl p-6 shadow-2xl">
                                <View className="flex-row-reverse items-center justify-between mb-6">
                                    <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>اختر الإطار الزمني</Text>
                                    <TouchableOpacity onPress={() => setIsCalendarVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                        <Feather name="x" size={20} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                                <View className="space-y-3 mb-2">
                                    {timeframeOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            activeOpacity={0.8}
                                            onPress={() => { setTimeframe(option); setIsCalendarVisible(false); }}
                                            className={`flex-row-reverse items-center justify-between p-4 rounded-xl border ${timeframe === option ? 'bg-primary-light border-primary shadow-sm' : 'bg-white border-gray-100'}`}
                                        >
                                            <Text className={`text-sm ${timeframe === option ? 'text-primary' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>{option}</Text>
                                            {timeframe === option && <Feather name="check-circle" size={18} color="#10b981" />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>

            </View>
        </KeyboardAvoidingView>
    );
}