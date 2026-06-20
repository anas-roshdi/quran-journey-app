import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, StatusBar, Modal, TouchableWithoutFeedback } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Mock Data ---
const availableTests = [
    {
        id: "1",
        title: "اختبار خمسة أجزاء (1-5)",
        amount: "5",
        organization: "مقرأة مكة المكرمة",
        teacher: "الشيخ عبدالله عبدالرحمن",
        type: "حضوري",
        slots: [
            { id: "s1", date: "الأحد، 31 مايو", time: "04:30 عصراً" },
            { id: "s2", date: "الاثنين، 1 يونيو", time: "05:00 عصراً" }
        ]
    },
    {
        id: "2",
        title: "اختبار جزء عمّ كامل",
        amount: "1",
        organization: "حلقة مسجد التقوى",
        teacher: "أ. أحمد محمود",
        type: "عن بعد",
        slots: [
            { id: "s3", date: "الخميس، 28 مايو", time: "04:00 عصراً" }
        ]
    },
    {
        id: "3",
        title: "اختبار الزهراوين (سورة البقرة وسورة آل عمران مع مراجعة المتشابهات)",
        amount: "3",
        organization: "الجمعية الخيرية لتحفيظ القرآن",
        teacher: "لجنة الاختبارات المركزية",
        type: "حضوري",
        slots: [
            { id: "s4", date: "الثلاثاء، 2 يونيو", time: "06:00 مساءً" },
            { id: "s5", date: "الثلاثاء، 2 يونيو", time: "06:30 مساءً" },
            { id: "s6", date: "الأربعاء، 3 يونيو", time: "04:00 عصراً" }
        ]
    },
];

export default function BookTestScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    // --- States for the Custom Interactive Range Slider ---
    const [selectedType, setSelectedType] = useState<string>('all');
    const [minAmount, setMinAmount] = useState<number>(1);
    const [maxAmount, setMaxAmount] = useState<number>(30);

    // مرجع لحساب عرض الشريط وتحديد الدائرة التي يتم سحبها
    const trackWidth = useRef(0);
    const activeThumb = useRef<'min' | 'max' | null>(null);

    const isFilterActive = selectedType !== 'all' || minAmount !== 1 || maxAmount !== 30;

    // Expansion State for Test Titles
    const [expandedTestIds, setExpandedTestIds] = useState<Record<string, boolean>>({});

    // Modals States
    const [isSlotModalVisible, setIsSlotModalVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const [selectedTest, setSelectedTest] = useState<any>(null);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    // Toggle title expansion
    const toggleTestTitle = (id: string) => {
        setExpandedTestIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Open slot selection modal
    const openSlotSelection = (test: any) => {
        setSelectedTest(test);
        if (test.slots.length === 1) {
            setSelectedSlotId(test.slots[0].id);
        } else {
            setSelectedSlotId(null);
        }
        setIsSlotModalVisible(true);
    };

    // Handle Confirm Booking
    const handleConfirmBooking = () => {
        setIsSlotModalVisible(false);
        setTimeout(() => setIsSuccessModalVisible(true), 300);
    };

    // --- Custom Range Slider Logic ---
    const calculateValueFromTouch = (locationX: number) => {
        if (trackWidth.current === 0) return 1;
        // حساب النسبة المئوية لمكان اللمس وتحويلها لقيمة من 1 إلى 30
        const percentage = Math.max(0, Math.min(1, locationX / trackWidth.current));
        return Math.round(1 + percentage * 29);
    };

    const handleTouchStart = (evt: any) => {
        const val = calculateValueFromTouch(evt.nativeEvent.locationX);
        // تحديد أي دائرة هي الأقرب لمكان اللمس لتحريكها
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
        if (activeThumb.current === 'min') {
            setMinAmount(Math.min(val, maxAmount));
        } else if (activeThumb.current === 'max') {
            setMaxAmount(Math.max(val, minAmount));
        }
    };

    // حساب النسب المئوية لرسم الشريط بصرياً
    const minPercent = ((minAmount - 1) / 29) * 100;
    const maxPercent = ((maxAmount - 1) / 29) * 100;

    // Filter Logic
    const filteredTests = availableTests.filter(test => {
        const matchesSearch = test.title.includes(searchQuery) || test.organization.includes(searchQuery);
        const testParts = parseInt(test.amount);
        const matchesAmount = testParts >= minAmount && testParts <= maxAmount;
        const matchesType = selectedType === 'all' || (selectedType === 'online' && test.type === 'عن بعد') || (selectedType === 'inperson' && test.type === 'حضوري');

        return matchesSearch && matchesAmount && matchesType;
    });

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header --- */}
            <View className="h-16 bg-card border-b border-border justify-center items-center z-10 relative w-full">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    حجز موعد اختبار
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="absolute right-5 w-10 h-10 bg-background rounded-full border border-border items-center justify-center active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
            >
                {/* --- Search & Filter Bar --- */}
                <View className="px-5 mb-6 flex-row-reverse items-center gap-3">
                    <View className="flex-1 flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-12 shadow-sm">
                        <Feather name="search" size={20} color="#94a3b8" />
                        <TextInput
                            placeholder="ابحث باسم الاختبار أو الجهة..."
                            placeholderTextColor="#94a3b8"
                            className="flex-1 text-right text-foreground mr-3 text-sm h-full"
                            style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0, textAlignVertical: 'center' }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsFilterModalVisible(true)}
                        className={`w-12 h-12 rounded-xl items-center justify-center shadow-sm border ${isFilterActive ? 'bg-primary border-primary' : 'bg-white border-gray-200'
                            }`}
                    >
                        <Feather name="sliders" size={20} color={isFilterActive ? "white" : "#64748b"} />
                    </TouchableOpacity>
                </View>

                {/* --- Available Tests List --- */}
                <View className="px-5 space-y-4">
                    <Text className="text-sm text-foreground mb-2 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                        الاختبارات المتاحة لمستواك الحفظي
                    </Text>

                    {filteredTests.length > 0 ? (
                        filteredTests.map((test) => (
                            <View key={test.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm mb-4">
                                <View className="flex-row items-start justify-between mb-4 border-b border-gray-50 pb-4">
                                    <View className={`px-2.5 py-1 rounded-full ${test.type === 'عن بعد' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                                        <Text className={`text-[11px] ${test.type === 'عن بعد' ? 'text-blue-600' : 'text-orange-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                            {test.type}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => toggleTestTitle(test.id)}
                                        className="flex-1 items-end mr-3"
                                    >
                                        <Text
                                            className="text-base text-foreground mb-3 text-right w-full leading-relaxed"
                                            style={{ fontFamily: 'Tajawal-Bold' }}
                                            numberOfLines={expandedTestIds[test.id] ? 0 : 1}
                                        >
                                            {test.title}
                                        </Text>

                                        <View className="flex-row items-center w-full mb-2 justify-end">
                                            <View className="flex-1 items-end">
                                                <Text className="text-xs text-slate-600 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>
                                                    الجهة: {test.organization}
                                                </Text>
                                            </View>
                                            <Feather name="bookmark" size={14} color="#10b981" style={{ marginLeft: 6, marginTop: 2 }} />
                                        </View>

                                        <View className="flex-row items-center w-full justify-end">
                                            <View className="flex-1 items-end">
                                                <Text className="text-xs text-muted text-right" style={{ fontFamily: 'Tajawal-Medium' }} numberOfLines={1}>
                                                    المشرف: {test.teacher}
                                                </Text>
                                            </View>
                                            <Feather name="user" size={14} color="#9ca3af" style={{ marginLeft: 6 }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => openSlotSelection(test)}
                                    className="w-full h-11 bg-primary rounded-xl flex-row-reverse items-center justify-center shadow-sm"
                                >
                                    <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                        استعراض الأوقات المتاحة
                                    </Text>
                                    <Feather name="calendar" size={16} color="white" style={{ marginRight: 8 }} />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <View className="items-center justify-center py-10">
                            <Feather name="inbox" size={40} color="#cbd5e1" className="mb-4" />
                            <Text className="text-muted text-base" style={{ fontFamily: 'Tajawal-Medium' }}>لا توجد اختبارات مطابقة للفلتر</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* --- Filter Modal --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isFilterModalVisible}
                onRequestClose={() => setIsFilterModalVisible(false)}
            >
                <TouchableOpacity activeOpacity={1} className="flex-1 justify-center items-center px-5 bg-black/40" onPress={() => setIsFilterModalVisible(false)}>
                    <TouchableWithoutFeedback>
                        <View className="bg-card w-full rounded-3xl p-6 shadow-2xl">
                            <View className="flex-row-reverse items-center justify-between mb-6">
                                <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تصفية الاختبارات</Text>
                                <TouchableOpacity onPress={() => setIsFilterModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                    <Feather name="x" size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            {/* Section 1: Interactive Range Slider */}
                            <View className="mb-8 mt-2">
                                <View className="flex-row-reverse justify-between items-center mb-6">
                                    <Text className="text-sm text-slate-500" style={{ fontFamily: 'Tajawal-Medium' }}>مقدار الاختبار (بالأجزاء)</Text>
                                    <View className="bg-primary-light px-3 py-1.5 rounded-full border border-primary/20">
                                        <Text className="text-primary text-xs" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                            من {minAmount} إلى {maxAmount}
                                        </Text>
                                    </View>
                                </View>

                                {/* The Draggable Track Area */}
                                <View
                                    className="w-full h-12 justify-center px-4"
                                    onLayout={(e) => trackWidth.current = e.nativeEvent.layout.width - 32} // خصم الحواف
                                    onStartShouldSetResponder={() => true}
                                    onMoveShouldSetResponder={() => true}
                                    onResponderGrant={handleTouchStart}
                                    onResponderMove={handleTouchMove}
                                >
                                    {/* Background Track */}
                                    <View className="w-full h-2 bg-gray-200 rounded-full relative justify-center">
                                        {/* Active Highlighted Track */}
                                        <View
                                            className="absolute h-full bg-primary rounded-full"
                                            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                                        />

                                        {/* Min Thumb */}
                                        <View
                                            className="absolute w-7 h-7 bg-white border-[3px] border-primary rounded-full shadow-sm items-center justify-center"
                                            style={{ left: `${minPercent}%`, transform: [{ translateX: -14 }] }}
                                            pointerEvents="none"
                                        >
                                            <View className="w-2 h-2 bg-primary rounded-full" />
                                        </View>

                                        {/* Max Thumb */}
                                        <View
                                            className="absolute w-7 h-7 bg-white border-[3px] border-primary rounded-full shadow-sm items-center justify-center"
                                            style={{ left: `${maxPercent}%`, transform: [{ translateX: -14 }] }}
                                            pointerEvents="none"
                                        >
                                            <View className="w-2 h-2 bg-primary rounded-full" />
                                        </View>
                                    </View>
                                </View>

                                {/* Labels under the slider */}
                                <View className="flex-row justify-between px-2">
                                    <Text className="text-xs text-slate-400" style={{ fontFamily: 'Tajawal-Bold' }}>1</Text>
                                    <Text className="text-xs text-slate-400" style={{ fontFamily: 'Tajawal-Bold' }}>30</Text>
                                </View>
                            </View>

                            {/* Section 2: Test Type */}
                            <View className="mb-8">
                                <Text className="text-sm text-slate-500 mb-3 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>نوع الاختبار</Text>
                                <View className="flex-row-reverse flex-wrap gap-2.5">
                                    {[{ id: 'all', label: 'الكل' }, { id: 'online', label: 'عن بعد' }, { id: 'inperson', label: 'حضوري' }].map((opt) => (
                                        <TouchableOpacity
                                            key={opt.id}
                                            activeOpacity={0.8}
                                            onPress={() => setSelectedType(opt.id)}
                                            className={`px-6 py-2.5 rounded-full border ${selectedType === opt.id ? 'bg-primary border-primary shadow-sm' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`text-sm ${selectedType === opt.id ? 'text-white' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>{opt.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View className="flex-row-reverse gap-3 pb-2">
                                <TouchableOpacity activeOpacity={0.8} onPress={() => setIsFilterModalVisible(false)} className="flex-1 bg-primary h-12 rounded-xl items-center justify-center shadow-sm border border-primary">
                                    <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>عرض النتائج</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => { setSelectedType('all'); setMinAmount(1); setMaxAmount(30); }} className="w-24 bg-white border border-gray-200 h-12 rounded-xl items-center justify-center shadow-sm">
                                    <Text className="text-slate-600 text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>مسح</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

            {/* --- Slot Selection Modal --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isSlotModalVisible}
                onRequestClose={() => setIsSlotModalVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-center items-center px-5 bg-black/40"
                    onPress={() => setIsSlotModalVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <View className="bg-card w-full rounded-3xl p-6 shadow-2xl max-h-[80%]">

                            <View className="flex-row-reverse items-center justify-between mb-4">
                                <Text className="text-lg text-foreground flex-1 text-right ml-4 leading-relaxed" style={{ fontFamily: 'Tajawal-Bold' }} numberOfLines={2}>
                                    {selectedTest?.title}
                                </Text>
                                <TouchableOpacity onPress={() => setIsSlotModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                    <Feather name="x" size={18} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <Text className="text-sm text-muted text-right mb-6" style={{ fontFamily: 'Tajawal-Medium' }}>
                                اختر الموعد المناسب لك لإجراء الاختبار
                            </Text>

                            <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
                                {selectedTest?.slots.map((slot: any) => {
                                    const isSelected = selectedSlotId === slot.id;
                                    return (
                                        <TouchableOpacity
                                            key={slot.id}
                                            activeOpacity={0.8}
                                            onPress={() => setSelectedSlotId(slot.id)}
                                            className={`flex-row-reverse items-center justify-between p-4 mb-3 rounded-xl border ${isSelected ? 'bg-primary-light border-primary shadow-sm' : 'bg-white border-gray-200'
                                                }`}
                                        >
                                            <View className="flex-row-reverse items-center">
                                                <View className={`w-10 h-10 rounded-full items-center justify-center ml-3 ${isSelected ? 'bg-primary' : 'bg-gray-100'}`}>
                                                    <Feather name="clock" size={18} color={isSelected ? 'white' : '#64748b'} />
                                                </View>
                                                <View className="items-end">
                                                    <Text className={`text-sm mb-1 ${isSelected ? 'text-primary' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                                        {slot.date}
                                                    </Text>
                                                    <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                                        {slot.time}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${isSelected ? 'border-primary' : 'border-gray-300'}`}>
                                                {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={!selectedSlotId}
                                onPress={handleConfirmBooking}
                                className={`w-full h-14 rounded-xl flex-row-reverse items-center justify-center shadow-md ${selectedSlotId ? 'bg-primary shadow-primary/30' : 'bg-gray-300 shadow-none'
                                    }`}
                            >
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    تأكيد الحجز
                                </Text>
                                <Feather name="check-circle" size={18} color="white" style={{ marginRight: 8 }} />
                            </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

            {/* --- Success Modal --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isSuccessModalVisible}
                onRequestClose={() => {
                    setIsSuccessModalVisible(false);
                    navigation.goBack();
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-center items-center px-5 bg-black/50"
                >
                    <TouchableWithoutFeedback>
                        <View className="bg-card w-full rounded-3xl p-8 shadow-2xl items-center">

                            <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-5 border-4 border-emerald-50">
                                <Feather name="check" size={40} color="#10b981" />
                            </View>

                            <Text className="text-2xl text-foreground mb-3" style={{ fontFamily: 'Tajawal-Bold' }}>
                                تم الحجز بنجاح!
                            </Text>

                            <Text className="text-base text-muted text-center mb-8 leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                تم تأكيد موعد اختبارك بنجاح. نتمنى لك التوفيق والسداد.
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    setIsSuccessModalVisible(false);
                                    navigation.goBack();
                                }}
                                className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-sm"
                            >
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    العودة للاختبارات
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

        </View>
    );
}