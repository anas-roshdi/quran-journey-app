import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';
import DashboardHeader from '../../components/DashboardHeader';

// --- Types for Data Structure ---
type FilterStatus = 'missing_lesson' | 'missing_review' | 'missing_both' | 'completed_both';

interface Student {
    id: string;
    name: string;
    initial: string;
    theme: { bg: string, text: string };
    lesson: { text: string, isCompleted: boolean };
    review: { type: 'range' | 'multiple' | 'text', data: any, isCompleted: boolean };
}

// --- Initial Mock Data ---
const initialData: Record<string, { stats: any, students: Student[] }> = {
    asr: {
        stats: { total: 24, completed: 15, pending: 9 },
        students: [
            {
                id: '1', name: 'عمر خالد', initial: 'ع', theme: { bg: 'bg-emerald-100', text: 'text-primary' },
                lesson: { text: 'سورة البقرة (الآيات 1 - 15)', isCompleted: true },
                review: { type: 'range', data: { start: 'سورة الناس', end: 'سورة الملك' }, isCompleted: false }
            },
            {
                id: '2', name: 'محمد علي', initial: 'م', theme: { bg: 'bg-blue-100', text: 'text-blue-700' },
                lesson: { text: 'سورة النبأ (كاملة)', isCompleted: false },
                review: { type: 'multiple', data: ['سورة يس', 'سورة الصافات', 'سورة ص'], isCompleted: false }
            },
            {
                id: '5', name: 'زياد طارق', initial: 'ز', theme: { bg: 'bg-teal-100', text: 'text-teal-700' },
                lesson: { text: 'سورة المائدة (1 - 20)', isCompleted: true },
                review: { type: 'text', data: 'الجزء الثامن والعشرون', isCompleted: true }
            },
        ]
    },
    maghrib: {
        stats: { total: 18, completed: 18, pending: 0 },
        students: [
            {
                id: '3', name: 'أحمد محمود', initial: 'أ', theme: { bg: 'bg-purple-100', text: 'text-purple-700' },
                lesson: { text: 'سورة آل عمران (الآيات 1 - 20)', isCompleted: true },
                review: { type: 'text', data: 'الجزء التاسع والعشرون (كامل)', isCompleted: true }
            },
            {
                id: '4', name: 'سالم عبدالله', initial: 'س', theme: { bg: 'bg-orange-100', text: 'text-orange-700' },
                lesson: { text: 'سورة الكهف (الآيات 10 - 30)', isCompleted: false },
                review: { type: 'range', data: { start: 'سورة النبأ', end: 'سورة التكوير' }, isCompleted: true }
            }
        ]
    }
};

// All available filter options
const ALL_FILTERS: FilterStatus[] = ['missing_lesson', 'missing_review', 'missing_both', 'completed_both'];

export default function TeacherDashboardScreen({ navigation }: any) {
    // --- States ---
    const [activeClassTab, setActiveClassTab] = useState<'asr' | 'maghrib'>('asr');
    const [classData, setClassData] = useState(initialData);

    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    // --- Single Source of Truth for Filters ---
    // Start with all filters active (showing all students)
    const [activeFilters, setActiveFilters] = useState<FilterStatus[]>(ALL_FILTERS);

    // --- Handlers ---
    const handleProfilePress = () => navigation.navigate('Profile', { role: 'teacher' });

    const toggleStudentProgress = (studentId: string, type: 'lesson' | 'review') => {
        setClassData(prevData => {
            const newData = { ...prevData };
            const classStudents = newData[activeClassTab].students;
            const studentIndex = classStudents.findIndex(s => s.id === studentId);

            if (studentIndex > -1) {
                if (type === 'lesson') {
                    classStudents[studentIndex].lesson.isCompleted = !classStudents[studentIndex].lesson.isCompleted;
                } else {
                    classStudents[studentIndex].review.isCompleted = !classStudents[studentIndex].review.isCompleted;
                }
            }
            return newData;
        });
    };

    // --- Filter Modal Toggle Logic (Checkbox Behavior) ---
    const toggleFilterCheckbox = (filterId: FilterStatus) => {
        setActiveFilters(prev => {
            if (prev.includes(filterId)) {
                return prev.filter(f => f !== filterId);
            } else {
                return [...prev, filterId];
            }
        });
    };

    // --- Top Cards Click Handlers (Two-way Binding) ---
    const handleAllClick = () => setActiveFilters(ALL_FILTERS);
    const handleCompletedClick = () => setActiveFilters(['completed_both']);
    const handlePendingClick = () => setActiveFilters(['missing_lesson', 'missing_review', 'missing_both']);

    // --- Calculate Active Top Card Visually ---
    const isAllActive = activeFilters.length === 4;
    const isCompletedActive = activeFilters.length === 1 && activeFilters.includes('completed_both');
    const isPendingActive = activeFilters.length === 3 && !activeFilters.includes('completed_both');

    // --- Derived Data (Filtering & Searching) ---
    const currentClass = classData[activeClassTab];

    const filteredStudents = useMemo(() => {
        return currentClass.students.filter(student => {
            // Search
            if (searchQuery && !student.name.includes(searchQuery)) return false;

            // Determine Student Status
            const hasLesson = student.lesson.isCompleted;
            const hasReview = student.review.isCompleted;

            let status: FilterStatus;
            if (hasLesson && hasReview) status = 'completed_both';
            else if (!hasLesson && !hasReview) status = 'missing_both';
            else if (!hasLesson && hasReview) status = 'missing_lesson';
            else status = 'missing_review';

            // Check if status is in activeFilters
            return activeFilters.includes(status);
        });
    }, [currentClass.students, searchQuery, activeFilters]);

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}>

            <View className="bg-card px-5 py-4 shadow-sm border-b border-border z-10">
                <DashboardHeader
                    title="السلام عليكم، أستاذ أحمد"
                    subtitle="لوحة إدارة الحلقات"
                    notificationCount={3}
                    onProfilePress={handleProfilePress}
                    onViewAllNotifications={() => navigation.navigate('Notifications')}
                />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                <View className="px-5 py-6">

                    {/* --- Quick Stats Grid (Now fully synced with checkboxes) --- */}
                    <View className="flex-row-reverse justify-between mb-6 gap-2">
                        <TouchableOpacity
                            onPress={handleAllClick}
                            activeOpacity={0.8}
                            className={`flex-1 bg-card rounded-2xl p-3 shadow-sm border items-center transition-colors ${isAllActive ? 'border-slate-800 bg-slate-50' : 'border-border'
                                }`}
                        >
                            <Feather name="users" size={20} color="#64748b" className="mb-2" />
                            <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{currentClass.stats.total}</Text>
                            <Text className="text-[11px] text-muted mt-1 text-center" numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: 'Tajawal-Medium' }}>الكل</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleCompletedClick}
                            activeOpacity={0.8}
                            className={`flex-1 bg-card rounded-2xl p-3 shadow-sm border items-center transition-colors ${isCompletedActive ? 'border-primary bg-emerald-50' : 'border-border'
                                }`}
                        >
                            <Feather name="check-circle" size={20} color="#10b981" className="mb-2" />
                            <Text className="text-xl text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>{currentClass.stats.completed}</Text>
                            <Text className="text-[11px] text-muted mt-1 text-center" numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: 'Tajawal-Medium' }}>أتموا الورد</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handlePendingClick}
                            activeOpacity={0.8}
                            className={`flex-1 bg-card rounded-2xl p-3 shadow-sm border items-center transition-colors ${isPendingActive ? 'border-orange-500 bg-orange-50' : 'border-border'
                                }`}
                        >
                            <Feather name="clock" size={20} color="#f97316" className="mb-2" />
                            <Text className="text-xl text-orange-500" style={{ fontFamily: 'Tajawal-Bold' }}>{currentClass.stats.pending}</Text>
                            <Text className="text-[11px] text-muted mt-1 text-center" numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: 'Tajawal-Medium' }}>في الانتظار</Text>
                        </TouchableOpacity>
                    </View>

                    {/* --- Student Tracking List --- */}
                    <View className="bg-card rounded-2xl shadow-sm p-5 border border-border">

                        <Text className="text-lg text-foreground text-right mb-4" style={{ fontFamily: 'Tajawal-Bold' }}>متابعة تسميع اليوم</Text>

                        {/* Class Filter Tabs */}
                        <View className="flex-row-reverse border-b border-border mb-5 w-full">
                            <TouchableOpacity
                                onPress={() => { setActiveClassTab('asr'); handleAllClick(); }}
                                className={`w-1/2 items-center pb-3 border-b-2 ${activeClassTab === 'asr' ? 'border-primary' : 'border-transparent'}`}
                            >
                                <Text className={`text-base ${activeClassTab === 'asr' ? 'text-primary' : 'text-gray-400'}`} style={{ fontFamily: 'Tajawal-Bold' }} numberOfLines={1}>حلقة العصر</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setActiveClassTab('maghrib'); handleAllClick(); }}
                                className={`w-1/2 items-center pb-3 border-b-2 ${activeClassTab === 'maghrib' ? 'border-primary' : 'border-transparent'}`}
                            >
                                <Text className={`text-base ${activeClassTab === 'maghrib' ? 'text-primary' : 'text-gray-400'}`} style={{ fontFamily: 'Tajawal-Bold' }} numberOfLines={1}>حلقة المغرب</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Persistent Search & Filter Bar */}
                        <View className="flex-row-reverse items-center gap-2 mb-6">
                            <View className="flex-1 flex-row-reverse items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-11 shadow-sm">
                                <Feather name="search" size={18} color="#94a3b8" />
                                <TextInput
                                    placeholder="ابحث عن طالب..."
                                    placeholderTextColor="#94a3b8"
                                    className="flex-1 text-right text-foreground mr-2 text-sm h-full"
                                    style={{ fontFamily: 'Tajawal-Medium', paddingVertical: 0, textAlignVertical: 'center' }}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={() => setIsFilterModalVisible(true)}
                                className={`w-11 h-11 rounded-xl items-center justify-center border shadow-sm ${!isAllActive ? 'bg-primary border-primary' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <Feather name="filter" size={18} color={!isAllActive ? "#ffffff" : "#64748b"} />
                            </TouchableOpacity>
                        </View>

                        {/* Status Summary Text based on Quick Filter */}
                        {!isAllActive && (
                            <Text className="text-sm text-primary mb-4 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                                تعرض الآن: {isCompletedActive ? 'الطلاب الذين أتموا الورد' : isPendingActive ? 'الطلاب في الانتظار' : 'فلترة مخصصة'}
                            </Text>
                        )}

                        {/* Students List Mapping */}
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => {
                                const isLast = index === filteredStudents.length - 1;
                                return (
                                    <View key={student.id} className={`${!isLast ? 'border-b border-border pb-6 mb-6' : 'pb-2'}`}>
                                        <View className="flex-row-reverse items-center justify-between mb-5">
                                            <View className="flex-row-reverse items-center gap-3">
                                                <View className={`w-10 h-10 ${student.theme.bg} rounded-full items-center justify-center`}>
                                                    <Text className={student.theme.text} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>{student.initial}</Text>
                                                </View>
                                                <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{student.name}</Text>
                                            </View>
                                            <TouchableOpacity className="bg-background px-3 py-1.5 rounded-full border border-border">
                                                <Text className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal-Medium' }}>خطة الطالب</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View className="mb-5 px-1 w-full">
                                            {/* Lesson Section */}
                                            <View className="items-end w-full mb-4">
                                                <View className="flex-row-reverse items-center justify-start w-full mb-1.5">
                                                    <Text className="text-xs text-gray-400" style={{ fontFamily: 'Tajawal-Medium' }}>الدرس الجديد</Text>
                                                    {student.lesson.isCompleted && <Feather name="check-circle" size={14} color="#10b981" style={{ marginRight: 6 }} />}
                                                </View>
                                                <Text className={`text-sm ${student.lesson.isCompleted ? 'text-emerald-700' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                                    {student.lesson.text}
                                                </Text>
                                            </View>

                                            {/* Review Section */}
                                            <View className="items-end w-full">
                                                <View className="flex-row-reverse items-center justify-start w-full mb-2">
                                                    <Text className="text-xs text-gray-400" style={{ fontFamily: 'Tajawal-Medium' }}>المراجعة</Text>
                                                    {student.review.isCompleted && <Feather name="check-circle" size={14} color="#10b981" style={{ marginRight: 6 }} />}
                                                </View>

                                                {/* Render Review Data Based on Type */}
                                                {student.review.type === 'range' && (
                                                    <View className="flex-row-reverse items-center justify-start flex-wrap">
                                                        <View className="bg-background border border-border px-3 py-1.5 rounded-full">
                                                            <Text className="text-xs text-slate-700" style={{ fontFamily: 'Tajawal-Medium' }}>{student.review.data.start}</Text>
                                                        </View>
                                                        <Feather name="arrow-left" size={14} color="#9ca3af" className="mx-2" />
                                                        <View className="bg-background border border-border px-3 py-1.5 rounded-full">
                                                            <Text className="text-xs text-slate-700" style={{ fontFamily: 'Tajawal-Medium' }}>{student.review.data.end}</Text>
                                                        </View>
                                                    </View>
                                                )}

                                                {student.review.type === 'multiple' && (
                                                    <View className="flex-row-reverse flex-wrap justify-start w-full">
                                                        {student.review.data.map((surah: string, idx: number) => (
                                                            <View key={idx} className="bg-background border border-border px-3 py-1.5 rounded-full ml-1.5 mb-1.5">
                                                                <Text className="text-xs text-slate-700" style={{ fontFamily: 'Tajawal-Medium' }}>{surah}</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                )}

                                                {student.review.type === 'text' && (
                                                    <Text className={`text-sm ${student.review.isCompleted ? 'text-emerald-700' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                                        {student.review.data}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>

                                        {/* Action Buttons */}
                                        <View className="flex-row-reverse gap-2">
                                            <TouchableOpacity
                                                onPress={() => toggleStudentProgress(student.id, 'lesson')}
                                                className={`flex-1 rounded-xl justify-center items-center border ${!student.lesson.isCompleted ? 'bg-primary border-primary' : 'bg-gray-100 border-gray-200'}`}
                                                style={{ height: 44 }}
                                            >
                                                <View className="flex-row items-center justify-center">
                                                    <Text className={`text-sm mr-2 ${!student.lesson.isCompleted ? 'text-white' : 'text-slate-400'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                                        {student.lesson.isCompleted ? 'تم التسميع' : 'أتم الدرس'}
                                                    </Text>
                                                    <Feather name={student.lesson.isCompleted ? "check" : "book-open"} size={15} color={!student.lesson.isCompleted ? "white" : "#94a3b8"} />
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => toggleStudentProgress(student.id, 'review')}
                                                className={`flex-1 rounded-xl justify-center items-center border ${!student.review.isCompleted ? 'bg-primary border-primary' : 'bg-gray-100 border-gray-200'}`}
                                                style={{ height: 44 }}
                                            >
                                                <View className="flex-row items-center justify-center">
                                                    <Text className={`text-sm mr-2 ${!student.review.isCompleted ? 'text-white' : 'text-slate-400'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                                        {student.review.isCompleted ? 'تم التسميع' : 'أتم المراجعة'}
                                                    </Text>
                                                    <Feather name={student.review.isCompleted ? "check" : "refresh-cw"} size={15} color={!student.review.isCompleted ? "white" : "#94a3b8"} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <View className="items-center justify-center py-10">
                                <Feather name="users" size={32} color="#cbd5e1" className="mb-3" />
                                <Text className="text-muted text-sm" style={{ fontFamily: 'Tajawal-Medium' }}>لا يوجد طلاب يطابقون بحثك أو الفلتر</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            <BottomNav role="teacher" activeTab="home" navigation={navigation} />

            {/* --- Filter Modal (Checkboxes Behavior) --- */}
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
                                <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تصفية دقيقة للتسميع</Text>
                                <TouchableOpacity onPress={() => setIsFilterModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                    <Feather name="x" size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <View className="space-y-3 mb-6">
                                {[
                                    { id: 'missing_lesson', label: 'لم يسمع الدرس' },
                                    { id: 'missing_review', label: 'لم يسمع المراجعة' },
                                    { id: 'missing_both', label: 'لم يسمع كلاهما (لم يحضر)' },
                                    { id: 'completed_both', label: 'أتم التسميع كامل (مراجعة ودرس)' }
                                ].map((opt) => {
                                    const isSelected = activeFilters.includes(opt.id as FilterStatus);
                                    return (
                                        <TouchableOpacity
                                            key={opt.id}
                                            activeOpacity={0.8}
                                            onPress={() => toggleFilterCheckbox(opt.id as FilterStatus)}
                                            className={`flex-row-reverse items-center justify-between p-4 rounded-xl border transition-colors ${isSelected ? 'bg-primary-light border-primary shadow-sm' : 'bg-white border-gray-100'
                                                }`}
                                        >
                                            <Text className={`text-sm ${isSelected ? 'text-primary' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                                {opt.label}
                                            </Text>

                                            {/* Square Checkbox UI */}
                                            <View className={`w-5 h-5 rounded-md border-2 items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                                                {isSelected && <Feather name="check" size={14} color="white" />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setIsFilterModalVisible(false)}
                                className="w-full bg-primary h-12 rounded-xl items-center justify-center shadow-sm"
                            >
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>تطبيق وإغلاق</Text>
                            </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

        </View>
    );
}