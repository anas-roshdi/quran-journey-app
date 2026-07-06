import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, KeyboardAvoidingView, Modal, TextInput, Keyboard } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Mock Data: Only Graded and Absent students for the archive ---
const initialStudents = [
    { id: "s1", name: "أحمد محمود سالم", status: "absent", score: null },
    { id: "s2", name: "عمر خالد عبدالله", status: "graded", score: 98 },
    { id: "s3", name: "زياد طارق محمد", status: "absent", score: null },
    { id: "s4", name: "يوسف إبراهيم", status: "graded", score: 85 },
    { id: "s5", name: "خالد عبدالرحمن", status: "graded", score: 92 },
    { id: "s6", name: "عبدالله سعيد", status: "graded", score: 78 },
];

// --- Default Settings for Calculation ---
const TEST_SETTINGS = {
    hifzRatio: 70,
    tajweedRatio: 30,
    numQuestions: 3,
    raddDeduction: 1,
    tanbeehDeduction: 0.25,
    tajweedDeduction: 0.5
};

export default function TestGradesRecordScreen({ route, navigation }: any) {
    const [students, setStudents] = useState(initialStudents);

    // --- Search & Filter States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<'all' | 'absent' | 'graded'>('all');

    // --- Modal States ---
    const [isConfirmEditModalVisible, setIsConfirmEditModalVisible] = useState(false);
    const [isEvalModalVisible, setIsEvalModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // --- Evaluation Form State ---
    const [evaluationData, setEvaluationData] = useState<{ questionText: string, radd: number, tanbeeh: number, tajweed: number }[]>([]);

    const testDetails = {
        title: "اختبار نهاية الجزء الثلاثون (عمّ)",
        amount: "جزء عم كامل",
        date: "28 مايو 2026",
        time: "05:00 عصراً",
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

    // --- Handlers ---

    // 1. Triggered when the teacher clicks "Edit Grade" or "Grade" (for absent)
    const handleEditClick = (student: any) => {
        setSelectedStudent(student);
        // Show confirmation warning first instead of jumping to evaluation
        setIsConfirmEditModalVisible(true);
    };

    // 2. Triggered when the teacher confirms they want to edit
    const confirmProceedToEdit = () => {
        setIsConfirmEditModalVisible(false);
        // Generate fields based on the number of questions in settings
        setEvaluationData(Array.from({ length: TEST_SETTINGS.numQuestions }, () => ({
            questionText: "", radd: 0, tanbeeh: 0, tajweed: 0
        })));
        // Slight delay to allow the first modal to close smoothly before opening the next
        setTimeout(() => {
            setIsEvalModalVisible(true);
        }, 150);
    };

    // 3. Update counter (+ / -) in the evaluation modal
    const updateCounter = (index: number, field: 'radd' | 'tanbeeh' | 'tajweed', increment: boolean) => {
        const newData = [...evaluationData];
        if (increment) {
            newData[index][field] += 1;
        } else {
            if (newData[index][field] > 0) newData[index][field] -= 1;
        }
        setEvaluationData(newData);
    };

    // 4. Update question text
    const updateQuestionText = (index: number, text: string) => {
        const newData = [...evaluationData];
        newData[index].questionText = text;
        setEvaluationData(newData);
    };

    // 5. Calculate live score
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

    // 6. Save modified evaluation
    const handleSaveEvaluation = () => {
        const finalScore = calculateLiveScore();
        setStudents(prev => prev.map(s =>
            s.id === selectedStudent?.id ? { ...s, status: "graded", score: finalScore } : s
        ));
        setIsEvalModalVisible(false);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }} className="flex-1">

                {/* --- Header (No Settings Button) --- */}
                <View className="h-16 bg-card border-b border-border justify-center items-center z-10 relative w-full">
                    <View className="absolute left-16 right-16 items-center justify-center pointer-events-none z-10">
                        <Text numberOfLines={1} adjustsFontSizeToFit className="text-lg text-foreground text-center" style={{ fontFamily: 'Tajawal-Bold' }}>سجل الدرجات</Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.goBack()} className="absolute right-5 w-10 h-10 bg-background rounded-full border border-border items-center justify-center active:opacity-70 z-20">
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20, paddingBottom: 20 }}>

                    {/* --- Test Summary Card --- */}
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

                    {/* --- Search & Filters --- */}
                    <View className="px-5 mb-4">
                        <View className="flex-row-reverse justify-between items-end mb-4">
                            <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>سجل الطلاب</Text>
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
                                onPress={() => setFilterType('graded')}
                                activeOpacity={0.8}
                                className={`px-4 py-2 rounded-full border ${filterType === 'graded' ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`text-xs ${filterType === 'graded' ? 'text-white' : 'text-slate-500'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تم التقييم</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setFilterType('absent')}
                                activeOpacity={0.8}
                                className={`px-4 py-2 rounded-full border ${filterType === 'absent' ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`text-xs ${filterType === 'absent' ? 'text-white' : 'text-slate-500'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>غائب</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- Students List --- */}
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
                                            <Text numberOfLines={1} className={`text-[11px] ${student.status === 'graded' ? 'text-emerald-600' : 'text-red-500'}`} style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', includeFontPadding: false }}>
                                                {student.status === 'graded' ? 'تم التقييم' : 'غائب'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="items-center justify-center min-w-[70px] pl-1">
                                        {/* If graded, show score and edit button */}
                                        {student.status === 'graded' && (
                                            <View className="items-center justify-center">
                                                <Text className="text-lg text-primary mb-0.5" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>{student.score}%</Text>
                                                <TouchableOpacity onPress={() => handleEditClick(student)}>
                                                    <Text className="text-[10px] text-slate-400 underline" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false }}>تعديل الدرجة</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                        {/* If absent, show absent badge but allow editing to add a grade retroactively */}
                                        {student.status === 'absent' && (
                                            <View className="items-center justify-center w-full">
                                                <View className="bg-red-50 px-3 h-8 rounded-lg items-center justify-center border border-red-100 w-full mb-1">
                                                    <Text numberOfLines={1} className="text-red-500 text-[11px] text-center" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>لم يحضر</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => handleEditClick(student)}>
                                                    <Text className="text-[10px] text-slate-400 underline" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false }}>إضافة تقييم</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className="items-center justify-center py-10">
                                <Feather name="search" size={40} color="#e2e8f0" />
                                <Text className="text-slate-400 mt-4 text-sm" style={{ fontFamily: 'Tajawal-Medium' }}>لم يتم العثور على نتائج</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* --- Confirmation Modal before Editing --- */}
                <Modal animationType="fade" transparent={true} visible={isConfirmEditModalVisible} onRequestClose={() => setIsConfirmEditModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-6 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">

                            <View className="w-16 h-16 bg-orange-50 rounded-full items-center justify-center mb-4 border border-orange-100">
                                <Feather name="edit-3" size={30} color="#f97316" />
                            </View>

                            <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                                تعديل الدرجة
                            </Text>
                            <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                هذا الاختبار تم تقييمه مسبقاً وإنهاء جلسته. هل أنت متأكد من رغبتك في تعديل درجات الطالب ({selectedStudent?.name})؟
                            </Text>

                            <View className="flex-row-reverse w-full justify-between mt-2">
                                <TouchableOpacity onPress={confirmProceedToEdit} activeOpacity={0.8} className="flex-1 h-12 bg-primary rounded-xl justify-center shadow-sm ml-2">
                                    <Text numberOfLines={1} className="text-white text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تأكيد التعديل</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setIsConfirmEditModalVisible(false)} activeOpacity={0.8} className="flex-1 h-12 bg-gray-100 rounded-xl justify-center">
                                    <Text numberOfLines={1} className="text-slate-700 text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تراجع</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* --- Full Evaluation Modal (Centered) --- */}
                <Modal animationType="fade" transparent={true} visible={isEvalModalVisible} onRequestClose={() => setIsEvalModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-4 bg-black/60 pt-10 pb-10">
                        <View className="bg-white w-full rounded-3xl overflow-hidden shadow-2xl flex-1 max-h-[90%]">

                            <View className="flex-row-reverse justify-between items-center p-5 border-b border-gray-100 bg-white z-10">
                                <View>
                                    <Text className="text-lg text-foreground text-right" style={{ fontFamily: 'Tajawal-Bold' }}>تعديل تقييم الطالب</Text>
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
                                    <Text className="text-base text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>الدرجة النهائية (المعدلة):</Text>
                                    <Text className="text-2xl text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>
                                        {calculateLiveScore()} <Text className="text-base text-muted">/ 100</Text>
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={handleSaveEvaluation} activeOpacity={0.8} className="w-full h-14 bg-primary rounded-xl justify-center shadow-sm">
                                    <Text numberOfLines={1} className="text-white text-lg text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>حفظ التعديلات</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

            </View>
        </KeyboardAvoidingView>
    );
}