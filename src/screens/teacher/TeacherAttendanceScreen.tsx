import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

// --- Interfaces ---
type AttendanceStatus = 'present' | 'absent' | 'excused';

interface StudentAttendance {
    id: string;
    name: string;
    initial: string;
    theme: { bg: string, text: string };
    status: AttendanceStatus;
}

// --- Mock Data ---
// تم تعيين حالة "present" كقيمة افتراضية لجميع الطلاب
const initialStudents: StudentAttendance[] = [
    { id: '1', name: 'عمر خالد عبدالله', initial: 'ع', theme: { bg: 'bg-emerald-100', text: 'text-emerald-700' }, status: 'present' },
    { id: '2', name: 'زياد طارق محمد', initial: 'ز', theme: { bg: 'bg-blue-100', text: 'text-blue-700' }, status: 'present' },
    { id: '3', name: 'أحمد محمود سالم', initial: 'أ', theme: { bg: 'bg-purple-100', text: 'text-purple-700' }, status: 'present' },
    { id: '4', name: 'سالم عبدالله', initial: 'س', theme: { bg: 'bg-orange-100', text: 'text-orange-700' }, status: 'present' },
    { id: '5', name: 'محمد علي', initial: 'م', theme: { bg: 'bg-teal-100', text: 'text-teal-700' }, status: 'present' },
];

export default function TeacherAttendanceScreen({ route, navigation }: any) {
    // استلام اسم الحلقة من الشاشة السابقة أو وضع اسم افتراضي
    const className = route?.params?.className || 'حلقة الإمام الشاطبي';

    // --- States ---
    const [students, setStudents] = useState<StudentAttendance[]>(initialStudents);
    const [currentDate, setCurrentDate] = useState('اليوم، 25 يوليو 2026');

    // --- Handlers ---
    const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
        setStudents(prev => prev.map(student =>
            student.id === studentId ? { ...student, status: newStatus } : student
        ));
    };

    const handleSaveAttendance = () => {
        // هنا يتم إرسال البيانات لقاعدة البيانات
        console.log("تم حفظ التحضير", students);
        navigation.goBack();
    };

    // --- Counters ---
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const excusedCount = students.filter(s => s.status === 'excused').length;

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}>

            {/* --- Header --- */}
            <View className="bg-card px-5 py-4 flex-row-reverse items-center justify-between border-b border-border shadow-sm z-10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-background rounded-full border border-border active:opacity-70">
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>سجل الحضور</Text>
                    <Text className="text-xs text-primary mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>{className}</Text>
                </View>
                <View className="w-10" />
            </View>

            {/* --- Date Navigator --- */}
            <View className="bg-white px-5 py-3 border-b border-gray-100 flex-row-reverse items-center justify-between">
                <TouchableOpacity className="p-2 bg-gray-50 rounded-full active:bg-gray-100">
                    <Feather name="chevron-right" size={20} color="#64748b" />
                </TouchableOpacity>

                <View className="flex-row-reverse items-center gap-2">
                    <Feather name="calendar" size={16} color="#10b981" />
                    <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                        {currentDate}
                    </Text>
                </View>

                <TouchableOpacity className="p-2 bg-gray-50 rounded-full active:bg-gray-100 opacity-50" disabled>
                    <Feather name="chevron-left" size={20} color="#64748b" />
                </TouchableOpacity>
            </View>

            {/* --- Main Content ScrollView --- */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* --- Stats Row --- */}
                <View className="px-5 mt-5 mb-4 flex-row-reverse items-center justify-between">
                    <Text className="text-sm text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>قائمة الطلاب ({students.length})</Text>

                    <View className="flex-row-reverse items-center gap-3">
                        {presentCount > 0 && <Text className="text-xs text-emerald-600" style={{ fontFamily: 'Tajawal-Medium' }}>{presentCount} حاضر</Text>}
                        {absentCount > 0 && <Text className="text-xs text-red-500" style={{ fontFamily: 'Tajawal-Medium' }}>{absentCount} غائب</Text>}
                        {excusedCount > 0 && <Text className="text-xs text-orange-500" style={{ fontFamily: 'Tajawal-Medium' }}>{excusedCount} مستأذن</Text>}
                    </View>
                </View>

                {/* --- Students List --- */}
                <View className="px-5 space-y-3">
                    {students.map((student) => (
                        <View key={student.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">

                            {/* Student Info */}
                            <View className="flex-row-reverse items-center gap-3 mb-4">
                                <View className={`w-10 h-10 ${student.theme.bg} rounded-full items-center justify-center`}>
                                    <Text className={student.theme.text} style={{ fontFamily: 'Tajawal-Bold', fontSize: 14, includeFontPadding: false, marginTop: 4 }}>
                                        {student.initial}
                                    </Text>
                                </View>
                                <Text className="text-base text-foreground flex-1 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    {student.name}
                                </Text>
                            </View>

                            {/* Attendance Action Buttons */}
                            <View className="flex-row-reverse items-center justify-between gap-2">

                                {/* Present Button */}
                                <TouchableOpacity
                                    onPress={() => handleStatusChange(student.id, 'present')}
                                    activeOpacity={0.8}
                                    className={`flex-1 h-10 rounded-xl flex-row-reverse items-center justify-center gap-1.5 border ${student.status === 'present'
                                            ? 'bg-emerald-500 border-emerald-600'
                                            : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <Feather name="check" size={14} color={student.status === 'present' ? 'white' : '#64748b'} />
                                    <Text className={`text-sm ${student.status === 'present' ? 'text-white' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                        حاضر
                                    </Text>
                                </TouchableOpacity>

                                {/* Excused Button */}
                                <TouchableOpacity
                                    onPress={() => handleStatusChange(student.id, 'excused')}
                                    activeOpacity={0.8}
                                    className={`flex-1 h-10 rounded-xl flex-row-reverse items-center justify-center gap-1.5 border ${student.status === 'excused'
                                            ? 'bg-orange-500 border-orange-600'
                                            : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <Feather name="clock" size={14} color={student.status === 'excused' ? 'white' : '#64748b'} />
                                    <Text className={`text-sm ${student.status === 'excused' ? 'text-white' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                        مستأذن
                                    </Text>
                                </TouchableOpacity>

                                {/* Absent Button */}
                                <TouchableOpacity
                                    onPress={() => handleStatusChange(student.id, 'absent')}
                                    activeOpacity={0.8}
                                    className={`flex-1 h-10 rounded-xl flex-row-reverse items-center justify-center gap-1.5 border ${student.status === 'absent'
                                            ? 'bg-red-500 border-red-600'
                                            : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <Feather name="x" size={14} color={student.status === 'absent' ? 'white' : '#64748b'} />
                                    <Text className={`text-sm ${student.status === 'absent' ? 'text-white' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                        غائب
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* --- Sticky Footer Action --- */}
            <View className="absolute bottom-0 w-full bg-white border-t border-border px-5 py-4 pb-8 shadow-2xl">
                <TouchableOpacity
                    onPress={handleSaveAttendance}
                    activeOpacity={0.8}
                    className="w-full bg-primary h-14 rounded-xl items-center justify-center shadow-sm flex-row-reverse gap-2"
                >
                    <Feather name="save" size={20} color="white" />
                    <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                        اعتماد سجل الحضور
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}