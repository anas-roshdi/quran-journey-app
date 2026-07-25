import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar, TextInput, KeyboardAvoidingView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

// --- Mock Data Interface ---
interface EnrolledStudent {
    id: string;
    name: string;
    initial: string;
    theme: { bg: string, text: string };
    attendanceRate: number;
    lastEvaluation: string;
}

// --- Mock Data ---
const initialEnrolledStudents: EnrolledStudent[] = [
    { id: '1', name: 'عمر خالد عبدالله', initial: 'ع', theme: { bg: 'bg-emerald-100', text: 'text-emerald-700' }, attendanceRate: 95, lastEvaluation: 'ممتاز' },
    { id: '2', name: 'زياد طارق محمد', initial: 'ز', theme: { bg: 'bg-blue-100', text: 'text-blue-700' }, attendanceRate: 80, lastEvaluation: 'جيد جداً' },
    { id: '3', name: 'أحمد محمود سالم', initial: 'أ', theme: { bg: 'bg-purple-100', text: 'text-purple-700' }, attendanceRate: 100, lastEvaluation: 'ممتاز' },
];

export default function ManageStudentsScreen({ route, navigation }: any) {
    // --- States ---
    const [searchQuery, setSearchQuery] = useState('');
    const [enrolledStudents, setEnrolledStudents] = useState(initialEnrolledStudents);

    // --- Modals States ---
    const [selectedStudent, setSelectedStudent] = useState<EnrolledStudent | null>(null);
    const [isConfirmRemoveModalVisible, setConfirmRemoveModalVisible] = useState(false);

    // --- Filtered Data ---
    const filteredEnrolled = enrolledStudents.filter(s => s.name.includes(searchQuery));

    // --- Handlers ---
    const handleRemoveClick = (student: EnrolledStudent) => {
        setSelectedStudent(student);
        setConfirmRemoveModalVisible(true);
    };

    const handleRemoveStudent = () => {
        if (selectedStudent) {
            setEnrolledStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
            setConfirmRemoveModalVisible(false);
            setSelectedStudent(null);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
            <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }} className="flex-1">

                {/* --- Header --- */}
                <View className="bg-card px-5 py-4 flex-row-reverse items-center justify-between border-b border-border shadow-sm z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-background rounded-full border border-border active:opacity-70">
                        <Feather name="chevron-right" size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>إدارة الطلاب</Text>
                        <Text className="text-xs text-primary mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>حلقة الإمام الشاطبي</Text>
                    </View>
                    <View className="w-10" />
                </View>

                {/* --- Main Content ScrollView --- */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* --- Elegant Header & Search Bar --- */}
                    <View className="px-5 mt-6 mb-6">
                        <View className="flex-row-reverse items-center justify-between mb-4">
                            <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>الطلاب المعتمدين</Text>
                            <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>{enrolledStudents.length} طلاب</Text>
                        </View>

                        <View className="flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-12 shadow-sm">
                            <Feather name="search" size={20} color="#94a3b8" />
                            <TextInput
                                placeholder="ابحث باسم الطالب..."
                                placeholderTextColor="#94a3b8"
                                className="flex-1 text-right text-foreground mr-3 text-sm h-full"
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0 }}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* --- Enrolled Students List --- */}
                    <View className="px-5 space-y-4">
                        {filteredEnrolled.length > 0 ? filteredEnrolled.map(student => (
                            <View key={student.id} className="bg-white rounded-2xl p-4 border border-border shadow-sm mb-4">

                                {/* Student Info Section & Direct Remove Button */}
                                <View className="flex-row-reverse items-start justify-between mb-4">
                                    <View className="flex-row-reverse items-center gap-3 pl-2 flex-1">
                                        <View className={`w-12 h-12 ${student.theme.bg} rounded-full items-center justify-center`}>
                                            <Text className={student.theme.text} style={{ fontFamily: 'Tajawal-Bold', fontSize: 16, includeFontPadding: false, marginTop: 4 }}>{student.initial}</Text>
                                        </View>
                                        <View className="items-end flex-1">
                                            <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{student.name}</Text>
                                            <View className="flex-row-reverse items-center mt-1">
                                                <View className={`w-2 h-2 rounded-full ${student.attendanceRate > 85 ? 'bg-emerald-500' : 'bg-orange-500'} ml-1.5`} />
                                                <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>نسبة الحضور: {student.attendanceRate}%</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Direct Remove Button */}
                                    <TouchableOpacity
                                        onPress={() => handleRemoveClick(student)}
                                        className="p-2 -mt-1 -ml-1 active:bg-red-50 rounded-full"
                                    >
                                        <Feather name="user-x" size={18} color="#94a3b8" />
                                    </TouchableOpacity>
                                </View>

                                {/* Divider */}
                                <View className="border-t border-gray-100 w-full mb-4" />

                                {/* Action Buttons */}
                                <View className="flex-row-reverse gap-3">
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('TeacherStudentPlan', { student })}
                                        activeOpacity={0.8}
                                        className="flex-1 bg-primary h-11 rounded-xl flex-row-reverse items-center justify-center shadow-sm gap-2"
                                    >
                                        <Feather name="map" size={16} color="white" />
                                        <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>خطة الطالب</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        className="flex-1 bg-gray-50 border border-gray-200 h-11 rounded-xl flex-row-reverse items-center justify-center gap-2"
                                    >
                                        <Feather name="calendar" size={16} color="#64748b" />
                                        <Text className="text-slate-600 text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>سجل التقييم</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )) : (
                            <View className="items-center justify-center py-16">
                                <Feather name="users" size={40} color="#cbd5e1" className="mb-4" />
                                <Text className="text-muted text-sm" style={{ fontFamily: 'Tajawal-Medium' }}>لا يوجد طلاب مطابقين للبحث</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* ========================================================================= */}
                {/* MODALS                                                                    */}
                {/* ========================================================================= */}

                {/* Confirmation Modal for Removal */}
                <Modal animationType="fade" transparent={true} visible={isConfirmRemoveModalVisible} onRequestClose={() => setConfirmRemoveModalVisible(false)}>
                    <View className="flex-1 justify-center items-center px-6 bg-black/50">
                        <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">

                            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4 border border-red-100">
                                <Feather name="alert-triangle" size={30} color="#ef4444" />
                            </View>

                            <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                                تأكيد الإزالة
                            </Text>
                            <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                هل أنت متأكد من رغبتك في إزالة الطالب ({selectedStudent?.name}) من الحلقة بشكل نهائي؟
                            </Text>

                            <View className="flex-row-reverse w-full justify-between mt-2 gap-3">
                                <TouchableOpacity onPress={handleRemoveStudent} activeOpacity={0.8} className="flex-1 h-12 bg-red-500 rounded-xl justify-center shadow-sm">
                                    <Text numberOfLines={1} className="text-white text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>نعم، إزالة</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setConfirmRemoveModalVisible(false)} activeOpacity={0.8} className="flex-1 h-12 bg-gray-100 rounded-xl justify-center border border-gray-200">
                                    <Text numberOfLines={1} className="text-slate-700 text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تراجع</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        </KeyboardAvoidingView>
    );
}