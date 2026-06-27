import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, KeyboardAvoidingView, Modal, TextInput, Keyboard } from "react-native";
import { Feather } from "@expo/vector-icons";

// Mock Data: Registered Students
const initialStudents = [
    { id: "s1", name: "أحمد محمود سالم", status: "pending", score: null },
    { id: "s2", name: "عمر خالد عبدالله", status: "graded", score: 98 },
    { id: "s3", name: "زياد طارق محمد", status: "pending", score: null },
    { id: "s4", name: "يوسف إبراهيم", status: "pending", score: null },
    { id: "s5", name: "خالد عبدالرحمن", status: "pending", score: null },
    { id: "s6", name: "عبدالله سعيد", status: "graded", score: 85 },
];

// Default settings
const TEST_SETTINGS = {
    hifzRatio: 70,
    tajweedRatio: 30,
    numQuestions: 3,
    raddDeduction: 1,
    tanbeehDeduction: 0.25,
    tajweedDeduction: 0.5
};

export default function ManageTestSessionScreen({ route, navigation }: any) {
    const [students, setStudents] = useState(initialStudents);

    // --- Search & Filter States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<'all' | 'pending' | 'graded'>('all');

    // --- Modal States ---
    const [isEvalModalVisible, setIsEvalModalVisible] = useState(false);
    const [isEndTestModalVisible, setIsEndTestModalVisible] = useState(false);
    const [isSuccessEndModalVisible, setIsSuccessEndModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // Evaluation Form State
    const [evaluationData, setEvaluationData] = useState<{ questionText: string, radd: number, tanbeeh: number, tajweed: number }[]>([]);

    const testDetails = {
        title: "اختبار نهاية الجزء الثلاثون (عمّ)",
        amount: "جزء عم كامل",
        date: "اليوم",
        time: "04:30 عصراً",
        studentsCount: students.length,
    };

    // --- Search & Filter Logic ---
    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterType === 'all' || student.status === filterType;
            return matchesSearch && matchesFilter;
        });
    }, [students, searchQuery, filterType]);

    // Open evaluation modal
    const handleEvaluateClick = (student: any) => {
        setSelectedStudent(student);
        setEvaluationData(Array.from({ length: TEST_SETTINGS.numQuestions }, () => ({
            questionText: "", radd: 0, tanbeeh: 0, tajweed: 0
        })));
        setIsEvalModalVisible(true);
    };

    // Function to update counters (+ / -)
    const updateCounter = (index: number, field: 'radd' | 'tanbeeh' | 'tajweed', increment: boolean) => {
        const newData = [...evaluationData];
        if (increment) {
            newData[index][field] += 1;
        } else {
            if (newData[index][field] > 0) newData[index][field] -= 1;
        }
        setEvaluationData(newData);
    };

    // Function to update question text
    const updateQuestionText = (index: number, text: string) => {
        const newData = [...evaluationData];
        newData[index].questionText = text;
        setEvaluationData(newData);
    };

    // Calculate live score
    const calculateLiveScore = () => {
        let totalRadd = 0, totalTanbeeh = 0, totalTajweed = 0;
        evaluationData.forEach(q => {
            totalRadd += (q.radd * TEST_SETTINGS.raddDeduction);
            totalTanbeeh += (q.tanbeeh * TEST_SETTINGS.tanbeehDeduction);
            totalTajweed += (q.tajweed * TEST_SETTINGS.tajweedDeduction);
        });

        const hifzScore = Math.max(0, TEST_SETTINGS.hifzRatio - totalRadd - totalTanbeeh);
        const tajweedScore = Math.max(0, TEST_SETTINGS.tajweedRatio - totalTajweed);

        return hifzScore + tajweedScore;
    };

    // Save student evaluation
    const handleSaveEvaluation = () => {
        const finalScore = calculateLiveScore();
        setStudents(prev => prev.map(s =>
            s.id === selectedStudent?.id ? { ...s, status: "graded", score: finalScore } : s
        ));
        setIsEvalModalVisible(false);
    };

    // Confirm ending the test
    const confirmEndTest = () => {
        setIsEndTestModalVisible(false);
        setIsSuccessEndModalVisible(true); // إظهار نافذة النجاح بدلاً من alert
    };

    // Close success modal and navigate back
    const handleCloseSuccessEndModal = () => {
        setIsSuccessEndModalVisible(false);
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }} className="flex-1">

                {/* Header */}
                <View className="h-16 bg-card border-b border-border justify-center items-center z-10 relative w-full">
                    <TouchableOpacity onPress={() => navigation.navigate('TestSettings')} className="absolute left-5 w-10 h-10 bg-gray-50 rounded-full border border-border items-center justify-center active:opacity-70 z-20">
                        <Feather name="settings" size={20} color="#64748b" />
                    </TouchableOpacity>

                    <View className="absolute left-16 right-16 items-center justify-center pointer-events-none z-10">
                        <Text numberOfLines={1} adjustsFontSizeToFit className="text-lg text-foreground text-center" style={{ fontFamily: 'Tajawal-Bold' }}>إدارة الاختبار</Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.goBack()} className="absolute right-5 w-10 h-10 bg-background rounded-full border border-border items-center justify-center active:opacity-70 z-20">
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20, paddingBottom: 20 }}>

                    {/* Test Summary Card */}
                    <View className="px-5 mb-6">
                        <View className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <Text className="text-lg text-slate-700 mb-4 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>{testDetails.title}</Text>
                            <View className="flex-row-reverse items-center mb-3">
                                <View className="flex-row-reverse items-center mr-4 ml-4">
                                    <Feather name="book-open" size={16} color="#10b981" style={{ marginLeft: 8 }} />
                                    <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>{testDetails.amount}</Text>
                                </View>
                                <View className="flex-row-reverse items-center mr-14">
                                    <Feather name="users" size={16} color="#10b981" style={{ marginLeft: 8 }} />
                                    <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>{testDetails.studentsCount} طلاب</Text>
                                </View>
                            </View>
                            <View className="flex-row-reverse justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">
                                <View className="flex-row-reverse items-center">
                                    <Feather name="calendar" size={16} color="#f97316" style={{ marginLeft: 8 }} />
                                    <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>{testDetails.date}</Text>
                                </View>
                                <View className="w-[1px] h-4 bg-gray-300" />
                                <View className="flex-row-reverse items-center">
                                    <Feather name="clock" size={16} color="#f97316" style={{ marginLeft: 8 }} />
                                    <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>{"\u200F" + testDetails.time}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Students Section Header with Search & Filters */}
                    <View className="px-5 mb-4">
                        <View className="flex-row-reverse justify-between items-end mb-4">
                            <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>الطلاب المسجلين</Text>
                            <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>{students.filter(s => s.status === 'graded').length} تم تقييمهم</Text>
                        </View>

                        {/* Search Bar */}
                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-12 mb-3 shadow-sm">
                            <Feather name="search" size={18} color="#9ca3af" />
                            <TextInput
                                className="flex-1 text-right text-sm text-foreground mr-2 h-full"
                                placeholder="ابحث عن اسم الطالب..."
                                placeholderTextColor="#9ca3af"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={{ fontFamily: 'Tajawal-Medium' }}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2 p-1">
                                    <Feather name="x-circle" size={18} color="#cbd5e1" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Filter Pills */}
                        <View className="flex-row-reverse items-center gap-2">
                            <TouchableOpacity
                                onPress={() => setFilterType('all')}
                                activeOpacity={0.8}
                                className={`px-4 py-2 rounded-full border ${filterType === 'all' ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`text-xs ${filterType === 'all' ? 'text-white' : 'text-slate-500'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>الكل</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setFilterType('pending')}
                                activeOpacity={0.8}
                                className={`px-4 py-2 rounded-full border ${filterType === 'pending' ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                            >
                                <Text numberOfLines={1} className={`text-xs ${filterType === 'pending' ? 'text-white' : 'text-slate-500'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>في الانتظار</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setFilterType('graded')}
                                activeOpacity={0.8}
                                className={`px-4 py-2 rounded-full border ${filterType === 'graded' ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`text-xs ${filterType === 'graded' ? 'text-white' : 'text-slate-500'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تم التقييم</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Students List */}
                    <View className="px-5">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <View key={student.id} className="bg-white border border-border p-4 rounded-2xl flex-row-reverse items-center justify-between mb-3 shadow-sm">
                                    <View className="flex-row-reverse items-center flex-1">
                                        <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center ml-3 border border-gray-200">
                                            <Feather name="user" size={20} color="#64748b" />
                                        </View>
                                        <View className="justify-center flex-1 mr-1 items-end">
                                            <Text className="text-sm text-foreground mb-1 text-right w-full" style={{ fontFamily: 'Tajawal-Bold', textAlign: 'right' }} numberOfLines={1}>{student.name}</Text>
                                            <Text numberOfLines={1} className={`text-[11px] ${student.status === 'graded' ? 'text-emerald-600' : 'text-orange-500'}`} style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', includeFontPadding: false }}>
                                                {student.status === 'graded' ? 'تم التقييم' : 'في الانتظار'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="items-center justify-center min-w-[70px] pl-1">
                                        {student.status !== 'graded' && (
                                            <TouchableOpacity
                                                onPress={() => handleEvaluateClick(student)}
                                                activeOpacity={0.8}
                                                className="bg-primary px-4 h-10 rounded-xl items-center justify-center shadow-sm w-full"
                                            >
                                                <Text className="text-white text-xs" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                                    تقييم
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {student.status === 'graded' && (
                                            <View className="items-center justify-center">
                                                <Text className="text-lg text-primary mb-0.5" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>{student.score}%</Text>
                                                <TouchableOpacity onPress={() => handleEvaluateClick(student)}>
                                                    <Text className="text-[10px] text-slate-400 underline" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false }}>تعديل الدرجة</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className="items-center justify-center py-10">
                                <Feather name="search" size={40} color="#e2e8f0" />
                                <Text className="text-slate-400 mt-4 text-sm" style={{ fontFamily: 'Tajawal-Medium' }}>لم يتم العثور على طالب بهذا الاسم</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Sticky Bottom Button for Ending Test */}
                <View className="p-5 bg-white border-t border-gray-100">
                    <TouchableOpacity
                        onPress={() => setIsEndTestModalVisible(true)}
                        activeOpacity={0.8}
                        className="w-full h-14 bg-red-500 rounded-xl justify-center shadow-sm"
                    >
                        <Text numberOfLines={1} className="text-white text-lg text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                            إنهاء الاختبار
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Full Evaluation Modal (Centered) */}
                <Modal animationType="fade" transparent={true} visible={isEvalModalVisible} onRequestClose={() => setIsEvalModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-4 bg-black/60 pt-10 pb-10">
                        <View className="bg-white w-full rounded-3xl overflow-hidden shadow-2xl flex-1 max-h-[90%]">

                            <View className="flex-row-reverse justify-between items-center p-5 border-b border-gray-100 bg-white z-10">
                                <View>
                                    <Text className="text-lg text-foreground text-right" style={{ fontFamily: 'Tajawal-Bold' }}>تقييم الطالب</Text>
                                    <Text className="text-sm text-primary text-right mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>{selectedStudent?.name}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setIsEvalModalVisible(false)} className="bg-gray-100 p-2 rounded-full">
                                    <Feather name="x" size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView className="px-5 py-4" showsVerticalScrollIndicator={false}>
                                {evaluationData.map((item, index) => (
                                    <View key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4">
                                        <Text className="text-primary text-base mb-3 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>السؤال {index + 1}</Text>

                                        <TextInput
                                            className="bg-white border border-gray-200 rounded-xl h-12 px-4 text-right text-sm text-foreground mb-4 focus:border-primary"
                                            placeholder="أدخل بداية الآية (اختياري)"
                                            placeholderTextColor="#9ca3af"
                                            value={item.questionText}
                                            onChangeText={(text) => updateQuestionText(index, text)}
                                            style={{ fontFamily: 'Tajawal-Medium' }}
                                        />

                                        {[
                                            { label: 'خطأ حفظ (رد)', field: 'radd', color: 'red' },
                                            { label: 'تنبيه', field: 'tanbeeh', color: 'orange' },
                                            { label: 'خطأ تجويد', field: 'tajweed', color: 'slate' }
                                        ].map((counterInfo) => (
                                            <View key={counterInfo.field} className="flex-row-reverse justify-between items-center mb-3 bg-white p-2 rounded-xl border border-gray-100">
                                                <Text className="text-sm text-foreground mr-2" style={{ fontFamily: 'Tajawal-Medium' }}>{counterInfo.label}</Text>
                                                <View className="flex-row-reverse items-center">
                                                    <TouchableOpacity onPress={() => updateCounter(index, counterInfo.field as any, true)} className={`w-8 h-8 rounded-lg items-center justify-center bg-${counterInfo.color}-50 border border-${counterInfo.color}-100`}>
                                                        <Feather name="plus" size={16} color={counterInfo.color === 'slate' ? '#475569' : counterInfo.color === 'red' ? '#ef4444' : '#f97316'} />
                                                    </TouchableOpacity>
                                                    <Text className="w-10 text-center text-base" style={{ fontFamily: 'Tajawal-Bold' }}>
                                                        {item[counterInfo.field as keyof typeof item]}
                                                    </Text>
                                                    <TouchableOpacity onPress={() => updateCounter(index, counterInfo.field as any, false)} className="w-8 h-8 rounded-lg items-center justify-center bg-gray-50 border border-gray-200">
                                                        <Feather name="minus" size={16} color="#64748b" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </ScrollView>

                            <View className="p-5 bg-white border-t border-gray-100">
                                <View className="flex-row-reverse justify-between items-center mb-4 px-2">
                                    <Text className="text-base text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>الدرجة النهائية:</Text>
                                    <Text className="text-2xl text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>
                                        {calculateLiveScore()} <Text className="text-base text-muted">/ 100</Text>
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={handleSaveEvaluation} activeOpacity={0.8} className="w-full h-14 bg-primary rounded-xl justify-center shadow-sm">
                                    <Text numberOfLines={1} className="text-white text-lg text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>اعتماد التقييم</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                {/* Confirm End Test Modal */}
                <Modal animationType="fade" transparent={true} visible={isEndTestModalVisible} onRequestClose={() => setIsEndTestModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-6 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">

                            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4 border border-red-100">
                                <Feather name="alert-triangle" size={30} color="#ef4444" />
                            </View>

                            <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                                إنهاء الاختبار
                            </Text>
                            <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                هل أنت متأكد من إنهاء الاختبار وإغلاق الجلسة؟ سيتم تحويل الطلاب غير المقيّمين إلى حالة "غائب".
                            </Text>

                            <View className="flex-row-reverse w-full justify-between mt-2">
                                <TouchableOpacity onPress={confirmEndTest} activeOpacity={0.8} className="flex-1 h-12 bg-red-500 rounded-xl justify-center shadow-sm ml-2">
                                    <Text numberOfLines={1} className="text-white text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تأكيد الإنهاء</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setIsEndTestModalVisible(false)} activeOpacity={0.8} className="flex-1 h-12 bg-gray-100 rounded-xl justify-center">
                                    <Text numberOfLines={1} className="text-slate-700 text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تراجع</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Success End Test Custom Modal */}
                <Modal animationType="fade" transparent={true} visible={isSuccessEndModalVisible} onRequestClose={handleCloseSuccessEndModal}>
                    <View className="flex-1 justify-center items-center px-6 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">

                            <View className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full items-center justify-center mb-5">
                                <Feather name="check" size={40} color="#10b981" />
                            </View>

                            <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                                تم إنهاء الاختبار بنجاح
                            </Text>
                            <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                تم حفظ جميع التقييمات وإغلاق الجلسة بشكل سليم. يمكنك مراجعة الدرجات من سجل الدرجات.
                            </Text>

                            <TouchableOpacity onPress={handleCloseSuccessEndModal} activeOpacity={0.8} className="w-full h-12 bg-primary rounded-xl justify-center shadow-sm">
                                <Text numberOfLines={1} className="text-white text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                    العودة
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

            </View>
        </KeyboardAvoidingView>
    );
}