import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar, KeyboardAvoidingView } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Mock Data: Registered Students ---
const initialStudents = [
    { id: "s1", name: "أحمد محمود سالم", status: "pending", score: null },
    { id: "s2", name: "عمر خالد عبدالله", status: "graded", score: 98 },
    { id: "s3", name: "زياد طارق محمد", status: "pending", score: null },
    { id: "s4", name: "يوسف إبراهيم", status: "absent", score: null },
];

export default function ManageTestSessionScreen({ route, navigation }: any) {
    // --- State Management ---
    const [students, setStudents] = useState(initialStudents);

    // --- Mock Test Details ---
    const testDetails = {
        title: "اختبار نهاية الجزء الثلاثون (عمّ)",
        amount: "جزء عم كامل",
        date: "اليوم",
        time: "04:30 عصراً",
        studentsCount: 4,
    };

    // --- Action Handlers ---
    const handleEvaluate = (studentName: string) => {
        alert(`جاري فتح صفحة التقييم للطالب: ${studentName}`);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }} className="flex-1">

                {/* --- Header --- */}
                <View className="h-16 bg-card border-b border-border justify-center items-center z-10 relative w-full">
                    <View className="absolute left-12 right-12 items-center justify-center pointer-events-none z-10">
                        <Text numberOfLines={1} adjustsFontSizeToFit className="text-lg text-foreground text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                            إدارة الاختبار
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.goBack()} className="absolute right-5 w-10 h-10 bg-background rounded-full border border-border items-center justify-center active:opacity-70 z-20">
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20, paddingBottom: 60 }}>

                    {/* --- Test Summary Card (تم التعديل لتصبح متناسقة وبيضاء) --- */}
                    <View className="px-5 mb-8">
                        <View className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <Text className="text-lg text-slate-700 mb-4 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                                {testDetails.title}
                            </Text>

                            <View className="flex-row-reverse justify-between items-center mb-3">
                                <View className="flex-row-reverse items-center">
                                    <Feather name="book-open" size={16} color="#10b981" style={{ marginLeft: 8 }} />
                                    <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>
                                        {testDetails.amount}
                                    </Text>
                                </View>
                                <View className="flex-row-reverse items-center">
                                    <Feather name="users" size={16} color="#10b981" style={{ marginLeft: 8 }} />
                                    <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>
                                        {testDetails.studentsCount} طلاب
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row-reverse justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">
                                <View className="flex-row-reverse items-center">
                                    <Feather name="calendar" size={16} color="#f97316" style={{ marginLeft: 8 }} />
                                    <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                        {testDetails.date}
                                    </Text>
                                </View>
                                <View className="w-[1px] h-4 bg-gray-300" />
                                <View className="flex-row-reverse items-center">
                                    <Feather name="clock" size={16} color="#f97316" style={{ marginLeft: 8 }} />
                                    <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                        {testDetails.time}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* --- Students List Section --- */}
                    <View className="px-5">
                        <View className="flex-row-reverse justify-between items-end mb-4">
                            <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                                الطلاب المسجلين
                            </Text>
                            <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                {students.filter(s => s.status === 'graded').length} تم تقييمهم
                            </Text>
                        </View>

                        {/* List of Students */}
                        {students.map((student) => (
                            <View key={student.id} className="bg-white border border-border p-4 rounded-2xl flex-row-reverse items-center justify-between mb-3 shadow-sm">

                                {/* Student Info (تم التوسيط وضبط النصوص) */}
                                <View className="flex-row-reverse items-center flex-1">
                                    <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center ml-3 border border-gray-200">
                                        <Feather name="user" size={20} color="#64748b" />
                                    </View>
                                    <View className="justify-center flex-1 mr-1 items-end">
                                        <Text className="text-sm text-foreground mb-1 text-right w-full" style={{ fontFamily: 'Tajawal-Bold', textAlign: 'right' }} numberOfLines={1}>
                                            {student.name}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            className={`text-[11px] ${student.status === 'graded' ? 'text-emerald-600' : student.status === 'absent' ? 'text-red-500' : 'text-orange-500'}`}
                                            style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', includeFontPadding: false }}
                                        >
                                            {student.status === 'graded' ? 'تم التقييم' : student.status === 'absent' ? 'غائب' : 'في الانتظار'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Action Buttons Based on Status (تم توسيط الدرجة) */}
                                <View className="items-center justify-center min-w-[70px] pl-1">
                                    {student.status === 'pending' && (
                                        <TouchableOpacity
                                            onPress={() => handleEvaluate(student.name)}
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
                                            <Text className="text-lg text-primary mb-0.5" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>
                                                {student.score}%
                                            </Text>
                                            <TouchableOpacity onPress={() => handleEvaluate(student.name)}>
                                                <Text className="text-[10px] text-slate-400 underline" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false }}>
                                                    تعديل الدرجة
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {student.status === 'absent' && (
                                        <View className="bg-red-50 px-3 h-10 rounded-xl items-center justify-center border border-red-100 w-full">
                                            <Text className="text-red-500 text-xs text-center" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                                لم يحضر
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}