import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, StatusBar, Modal, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Mock Data for Pickers ---
const availableDates = [
    "اليوم (30 مايو)", "غداً (31 مايو)", "الاثنين (1 يونيو)", "الثلاثاء (2 يونيو)", "الأربعاء (3 يونيو)", "الخميس (4 يونيو)"
];

const availableTimes = [
    "03:30 عصراً", "04:00 عصراً", "04:30 عصراً", "05:00 عصراً", "05:30 عصراً", "06:00 مساءً", "06:30 مساءً", "07:00 مساءً"
];

const teacherClasses = [
    { id: 'asr', name: 'حلقة العصر' },
    { id: 'maghrib', name: 'حلقة المغرب' }
];

export default function CreateTestSessionScreen({ navigation }: any) {
    // --- Form States ---
    const [title, setTitle] = useState("");
    const [testType, setType] = useState<'online' | 'inperson'>('inperson');

    // --- Visibility & Scope States ---
    const [maxStudents, setMaxStudents] = useState("");
    const [visibility, setVisibility] = useState<'private' | 'public'>('private');
    const [selectedClasses, setSelectedClasses] = useState<string[]>(['asr']);

    // --- Date & Time States ---
    const [testDate, setDate] = useState(availableDates[0]);
    const [testTime, setTime] = useState(availableTimes[2]);
    const [isDateModalVisible, setIsDateModalVisible] = useState(false);
    const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);

    // --- Range Slider States (Min/Max Ajzaa) ---
    const [minAmount, setMinAmount] = useState<number>(1);
    const [maxAmount, setMaxAmount] = useState<number>(5);
    const trackWidth = useRef(0);
    const activeThumb = useRef<'min' | 'max' | null>(null);

    // --- Success Modal State ---
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);

    // --- Toggle Class Selection ---
    const toggleClass = (classId: string) => {
        setSelectedClasses(prev => {
            if (prev.includes(classId)) {
                return prev.filter(id => id !== classId);
            } else {
                return [...prev, classId];
            }
        });
    };

    // --- Validation Logic ---
    const isFormValid = title.trim() !== "" && (visibility === 'public' || (visibility === 'private' && selectedClasses.length > 0));

    // --- Range Slider Logic ---
    const calculateValueFromTouch = (locationX: number) => {
        if (trackWidth.current === 0) return 1;
        const percentage = Math.max(0, Math.min(1, locationX / trackWidth.current));
        return Math.round(1 + percentage * 29);
    };

    const handleTouchStart = (evt: any) => {
        const val = calculateValueFromTouch(evt.nativeEvent.locationX);
        if (Math.abs(val - minAmount) <= Math.abs(val - maxAmount)) {
            activeThumb.current = 'min';
            setMinAmount(Math.min(val, maxAmount));
        } else {
            activeThumb.current = 'max';
            setMaxAmount(Math.max(val, minAmount));
        }
    };

    const handleTouchMove = (evt: any) => {
        const val = calculateValueFromTouch(evt.nativeEvent.locationX);
        if (activeThumb.current === 'min') setMinAmount(Math.min(val, maxAmount));
        else if (activeThumb.current === 'max') setMaxAmount(Math.max(val, minAmount));
    };

    const minPercent = ((minAmount - 1) / 29) * 100;
    const maxPercent = ((maxAmount - 1) / 29) * 100;

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }} className="flex-1">

                {/* --- Header --- */}
                <View className="h-16 bg-card border-b border-border justify-center items-center z-10 relative w-full">
                    <View className="absolute left-0 right-0 items-center justify-center pointer-events-none z-10">
                        <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>إنشاء جلسة اختبار</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.goBack()} className="absolute right-5 w-10 h-10 bg-background rounded-full border border-border items-center justify-center active:opacity-70 z-20">
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24, paddingBottom: 60 }}>

                    {/* 1. Test Title */}
                    <View className="px-5 mb-8">
                        <Text className="text-sm text-foreground mb-3 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>عنوان الاختبار</Text>
                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm focus:border-primary">
                            <Feather name="edit-3" size={18} color="#94a3b8" />
                            <TextInput
                                placeholder="مثال: اختبار خاتمة جزء عم"
                                placeholderTextColor="#94a3b8"
                                className="flex-1 text-right text-foreground mr-3 text-sm h-full"
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', textAlignVertical: 'center' }}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>
                    </View>

                    {/* 2. Amount Selection (Range Slider) */}
                    <View className="px-5 mb-8">
                        <View className="flex-row-reverse justify-between items-center mb-6">
                            <Text className="text-sm text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>نطاق الأجزاء المسموح بها</Text>
                            <View className="bg-primary-light px-3 py-1.5 rounded-full border border-primary/20">
                                <Text className="text-primary text-xs" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>من {minAmount} إلى {maxAmount}</Text>
                            </View>
                        </View>
                        <View className="w-full h-12 justify-center px-4" onLayout={(e) => trackWidth.current = e.nativeEvent.layout.width - 32}
                            onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true}
                            onResponderGrant={handleTouchStart} onResponderMove={handleTouchMove}>
                            <View className="w-full h-2 bg-gray-200 rounded-full relative justify-center">
                                <View className="absolute h-full bg-primary rounded-full" style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }} />
                                <View className="absolute w-7 h-7 bg-white border-[3px] border-primary rounded-full shadow-sm items-center justify-center" style={{ left: `${minPercent}%`, transform: [{ translateX: -14 }] }} pointerEvents="none">
                                    <View className="w-2 h-2 bg-primary rounded-full" />
                                </View>
                                <View className="absolute w-7 h-7 bg-white border-[3px] border-primary rounded-full shadow-sm items-center justify-center" style={{ left: `${maxPercent}%`, transform: [{ translateX: -14 }] }} pointerEvents="none">
                                    <View className="w-2 h-2 bg-primary rounded-full" />
                                </View>
                            </View>
                        </View>
                        <View className="flex-row justify-between px-2 mt-2">
                            <Text className="text-xs text-slate-400" style={{ fontFamily: 'Tajawal-Bold' }}>1</Text>
                            <Text className="text-xs text-slate-400" style={{ fontFamily: 'Tajawal-Bold' }}>30</Text>
                        </View>
                    </View>

                    {/* 3. Visibility / Scope Selection */}
                    <View className="px-5 mb-8">
                        <Text className="text-sm text-foreground mb-4 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>نطاق ظهور الاختبار</Text>
                        <View className="flex-row-reverse gap-3">
                            <TouchableOpacity onPress={() => setVisibility('private')} activeOpacity={0.8} className={`flex-1 h-14 rounded-xl items-center justify-center border shadow-sm transition-colors ${visibility === 'private' ? 'bg-primary-light border-primary' : 'bg-white border-gray-100'}`}>
                                <Text className={`text-sm ${visibility === 'private' ? 'text-primary' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>مخصص لحلقاتي</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setVisibility('public')} activeOpacity={0.8} className={`flex-1 h-14 rounded-xl items-center justify-center border shadow-sm transition-colors ${visibility === 'public' ? 'bg-primary-light border-primary' : 'bg-white border-gray-100'}`}>
                                <Text className={`text-sm ${visibility === 'public' ? 'text-primary' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>عام للجميع</Text>
                            </TouchableOpacity>
                        </View>

                        {/* الكشف التدريجي: تم إضافة self-start و flex-shrink-0 لحل مشكلة انكسار النص */}
                        {visibility === 'private' && (
                            <View className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <Text className="text-xs text-muted mb-3 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>اختر حلقة أو أكثر:</Text>
                                <View className="flex-row-reverse flex-wrap">
                                    {teacherClasses.map(cls => {
                                        const isSelected = selectedClasses.includes(cls.id);
                                        return (
                                            <TouchableOpacity
                                                key={cls.id}
                                                onPress={() => toggleClass(cls.id)}
                                                activeOpacity={0.7}
                                                className={`px-4 py-2 rounded-full flex-row-reverse items-center border ml-2 mb-2 self-start flex-shrink-0 ${isSelected ? 'bg-primary border-primary shadow-sm' : 'bg-white border-gray-300'}`}
                                            >
                                                {isSelected && <Feather name="check" size={14} color="white" style={{ marginLeft: 6 }} />}
                                                <Text
                                                    numberOfLines={1}
                                                    className={`text-sm ${isSelected ? 'text-white' : 'text-slate-600'}`}
                                                    style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}
                                                >
                                                    {cls.name}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                                {selectedClasses.length === 0 && (
                                    <Text className="text-xs text-red-500 text-right mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>يرجى تحديد حلقة واحدة على الأقل.</Text>
                                )}
                            </View>
                        )}
                    </View>

                    {/* 4. Max Students Limit */}
                    <View className="px-5 mb-8">
                        <Text className="text-sm text-foreground mb-3 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>الحد الأقصى للطلاب (اختياري)</Text>
                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm focus:border-primary">
                            <Feather name="users" size={18} color="#94a3b8" />
                            <TextInput
                                placeholder="أدخل عدد الطلاب الأقصى (مثال: 15)"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                                className="flex-1 text-right text-foreground mr-3 text-sm h-full"
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', textAlignVertical: 'center' }}
                                value={maxStudents}
                                onChangeText={setMaxStudents}
                            />
                        </View>
                    </View>

                    {/* 5. Date & Time Selection */}
                    <View className="px-5 mb-8 flex-row-reverse gap-3">
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setIsDateModalVisible(true)} className="flex-1">
                            <Text className="text-sm text-foreground mb-3 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>التاريخ</Text>
                            <View className="flex-row-reverse items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm">
                                <View className="flex-row-reverse items-center">
                                    <Feather name="calendar" size={18} color="#10b981" />
                                    <Text className="text-sm text-slate-700 mr-2" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>{testDate}</Text>
                                </View>
                                <Feather name="chevron-down" size={16} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.7} onPress={() => setIsTimeModalVisible(true)} className="flex-1">
                            <Text className="text-sm text-foreground mb-3 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>الوقت</Text>
                            <View className="flex-row-reverse items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-14 shadow-sm">
                                <View className="flex-row-reverse items-center">
                                    <Feather name="clock" size={18} color="#f97316" />
                                    <Text className="text-sm text-slate-700 mr-2" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>{testTime}</Text>
                                </View>
                                <Feather name="chevron-down" size={16} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* 6. Test Type Selection */}
                    <View className="px-5 mb-10">
                        <Text className="text-sm text-foreground mb-4 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>نوع الاختبار</Text>
                        <View className="flex-row-reverse gap-3">
                            <TouchableOpacity onPress={() => setType('inperson')} activeOpacity={0.8} className={`flex-1 h-14 rounded-xl items-center justify-center border shadow-sm transition-colors ${testType === 'inperson' ? 'bg-primary-light border-primary' : 'bg-white border-gray-100'}`}>
                                <Text className={`text-sm ${testType === 'inperson' ? 'text-primary' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>حضوري بالمسجد</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setType('online')} activeOpacity={0.8} className={`flex-1 h-14 rounded-xl items-center justify-center border shadow-sm transition-colors ${testType === 'online' ? 'bg-primary-light border-primary' : 'bg-white border-gray-100'}`}>
                                <Text className={`text-sm ${testType === 'online' ? 'text-primary' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>عن بعد (أونلاين)</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 7. Save Button */}
                    <View className="px-5">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setIsSuccessVisible(true)}
                            className={`w-full h-14 rounded-xl items-center justify-center shadow-sm transition-colors ${isFormValid ? 'bg-primary' : 'bg-gray-300'}`}
                            disabled={!isFormValid}
                        >
                            <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>حفظ ونشر الجلسة</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>

                {/* --- Custom Date Picker Modal --- */}
                <Modal animationType="fade" transparent={true} visible={isDateModalVisible} onRequestClose={() => setIsDateModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1} className="flex-1 justify-center items-center px-5 bg-black/40" onPress={() => setIsDateModalVisible(false)}>
                        <TouchableWithoutFeedback>
                            <View className="bg-card w-full rounded-3xl p-6 shadow-2xl max-h-[70%]">
                                <View className="flex-row-reverse items-center justify-between mb-4">
                                    <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>اختر التاريخ</Text>
                                    <TouchableOpacity onPress={() => setIsDateModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                        <Feather name="x" size={20} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                                    {availableDates.map((date, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            activeOpacity={0.7}
                                            onPress={() => { setDate(date); setIsDateModalVisible(false); }}
                                            className={`w-full py-4 px-4 rounded-xl mb-2 flex-row-reverse items-center justify-between border ${testDate === date ? 'bg-primary-light border-primary' : 'bg-white border-gray-100'}`}
                                        >
                                            <Text className={`text-base ${testDate === date ? 'text-primary' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>{date}</Text>
                                            {testDate === date && <Feather name="check-circle" size={18} color="#10b981" />}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>

                {/* --- Custom Time Picker Modal --- */}
                <Modal animationType="fade" transparent={true} visible={isTimeModalVisible} onRequestClose={() => setIsTimeModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1} className="flex-1 justify-center items-center px-5 bg-black/40" onPress={() => setIsTimeModalVisible(false)}>
                        <TouchableWithoutFeedback>
                            <View className="bg-card w-full rounded-3xl p-6 shadow-2xl max-h-[70%]">
                                <View className="flex-row-reverse items-center justify-between mb-4">
                                    <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>اختر الوقت</Text>
                                    <TouchableOpacity onPress={() => setIsTimeModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                        <Feather name="x" size={20} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                                    <View className="flex-row-reverse flex-wrap justify-between">
                                        {availableTimes.map((time, idx) => (
                                            <TouchableOpacity
                                                key={idx}
                                                activeOpacity={0.7}
                                                onPress={() => { setTime(time); setIsTimeModalVisible(false); }}
                                                className={`w-[48%] py-4 rounded-xl mb-3 items-center justify-center border ${testTime === time ? 'bg-primary-light border-primary' : 'bg-white border-gray-100'}`}
                                            >
                                                <Text className={`text-sm ${testTime === time ? 'text-primary' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>{time}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>

                {/* --- Success Modal --- */}
                <Modal animationType="fade" transparent={true} visible={isSuccessVisible}>
                    <TouchableOpacity activeOpacity={1} className="flex-1 justify-center items-center px-5 bg-black/50">
                        <TouchableWithoutFeedback>
                            <View className="bg-card w-full rounded-3xl p-8 items-center shadow-2xl">
                                <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-6 border-4 border-emerald-50">
                                    <Feather name="check" size={40} color="#10b981" />
                                </View>
                                <Text className="text-2xl text-foreground mb-3 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>تم إنشاء الجلسة بنجاح</Text>
                                <Text className="text-base text-muted text-center mb-8 leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                    أصبح الاختبار متاحاً للتسجيل {visibility === 'private' ? 'لطلاب الحلقات المحددة فقط' : 'لجميع طلاب البرنامج'}.
                                </Text>
                                <TouchableOpacity onPress={() => { setIsSuccessVisible(false); navigation.goBack(); }} className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-sm">
                                    <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>العودة لإدارة الاختبارات</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>

            </View>
        </KeyboardAvoidingView>
    );
}