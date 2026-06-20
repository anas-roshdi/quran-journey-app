import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';

// --- Interfaces ---
type AttendanceStatus = 'present' | 'absent' | 'upcoming';
type UpdateType = 'success' | 'needs_work';

interface DailyAttendance {
    day: string;
    status: AttendanceStatus;
}

interface UpdateItem {
    id: string;
    type: UpdateType;
    title: string;
    details: string;
    date: string;
}

interface ClassReportData {
    classId: string;
    className: string;
    attendance: DailyAttendance[];
    updates: UpdateItem[];
}

interface ChildReportData {
    id: string;
    name: string;
    classes: ClassReportData[];
}

export default function ParentReportsScreen({ navigation }: any) {
    // --- Mock Data ---
    const [childrenReports] = useState<ChildReportData[]>([
        {
            id: '1',
            name: "أحمد",
            classes: [
                {
                    classId: 'c1',
                    className: 'حلقة الإمام الشاطبي',
                    attendance: [
                        { day: "الأحد", status: "present" },
                        { day: "الإثنين", status: "present" },
                        { day: "الثلاثاء", status: "absent" },
                        { day: "الأربعاء", status: "present" },
                        { day: "الخميس", status: "upcoming" },
                    ],
                    updates: [
                        { id: 'u1', type: 'success', title: "حفظ جديد", details: "سورة الملك، كاملة", date: "اليوم" },
                        { id: 'u2', type: 'needs_work', title: "لم يتقن الحفظ", details: "سورة القلم، الآيات 1-15", date: "أمس" },
                        { id: 'u3', type: 'success', title: "إتمام مراجعة", details: "الجزء التاسع والعشرون", date: "منذ يومين" },
                    ]
                },
                {
                    classId: 'c2',
                    className: 'حلقة التجويد',
                    attendance: [
                        { day: "الأحد", status: "present" },
                        { day: "الإثنين", status: "present" },
                        { day: "الثلاثاء", status: "present" },
                        { day: "الأربعاء", status: "present" },
                        { day: "الخميس", status: "upcoming" },
                    ],
                    updates: [
                        { id: 'u4', type: 'success', title: "تطبيق أحكام", details: "أحكام النون الساكنة والتنوين", date: "أمس" },
                    ]
                }
            ]
        },
        {
            id: '2',
            name: "عمر",
            classes: [
                {
                    classId: 'c2',
                    className: 'حلقة التجويد',
                    attendance: [
                        { day: "الأحد", status: "present" },
                        { day: "الإثنين", status: "absent" },
                        { day: "الثلاثاء", status: "present" },
                        { day: "الأربعاء", status: "present" },
                        { day: "الخميس", status: "upcoming" },
                    ],
                    updates: [
                        { id: 'u5', type: 'success', title: "إتمام مراجعة", details: "سورة الكهف كاملة", date: "اليوم" },
                        { id: 'u6', type: 'success', title: "حفظ جديد", details: "سورة مريم، الآيات 1-30", date: "أمس" },
                    ]
                }
            ]
        },
    ]);

    // --- State ---
    const [selectedChildId, setSelectedChildId] = useState<string>(childrenReports[0].id);
    const [isClassDropdownVisible, setIsClassDropdownVisible] = useState(false);

    // Stores the selected class ID for each child
    const [selectedClasses, setSelectedClasses] = useState<Record<string, string>>({
        '1': 'c1',
        '2': 'c2',
    });

    // --- Derived Data ---
    const activeChild = childrenReports.find(c => c.id === selectedChildId) || childrenReports[0];
    const activeClassId = selectedClasses[activeChild.id];
    const activeReport = activeChild.classes.find(c => c.classId === activeClassId) || activeChild.classes[0];

    // --- Handlers ---
    const selectClassForChild = (childId: string, classId: string) => {
        setSelectedClasses(prev => ({ ...prev, [childId]: classId }));
        setIsClassDropdownVisible(false);
    };

    // --- View Helpers ---
    const getUpdateIcon = (type: UpdateType) => {
        switch (type) {
            case 'success': return <Feather name="check-circle" size={18} color="#059669" />;
            case 'needs_work': return <Feather name="alert-circle" size={18} color="#e11d48" />;
        }
    };

    const getIconBg = (type: UpdateType) => {
        switch (type) {
            case 'success': return 'bg-primary-light';
            case 'needs_work': return 'bg-destructive-light';
        }
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Sticky Header --- */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-center shadow-sm z-10">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>التقارير</Text>
            </View>

            {/* --- Child Selector Tabs --- */}
            <View className="px-5 pt-4 mb-2">
                <View className="flex-row-reverse justify-center gap-2">
                    {childrenReports.map((child) => (
                        <TouchableOpacity
                            key={child.id}
                            onPress={() => setSelectedChildId(child.id)}
                            activeOpacity={0.8}
                            className={`px-8 py-2 rounded-full border ${selectedChildId === child.id
                                ? 'bg-primary border-primary'
                                : 'bg-card border-border'
                                }`}
                        >
                            <Text
                                className={`text-sm ${selectedChildId === child.id ? 'text-white' : 'text-slate-600'}`}
                                style={{ fontFamily: 'Tajawal-Bold' }}
                            >
                                {child.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="px-5">

                {/* --- Smart Class Selector (Perfectly Centered Inline) --- */}
                <View className="mb-4 mt-2 flex-row-reverse justify-center">
                    <TouchableOpacity
                        onPress={() => activeChild.classes.length > 1 ? setIsClassDropdownVisible(true) : null}
                        activeOpacity={activeChild.classes.length > 1 ? 0.6 : 1}
                        className="flex-row-reverse items-center justify-center py-2"
                    >
                        {/* 1. Ghost Element for visual balance on the right */}
                        {activeChild.classes.length > 1 && (
                            <View className="w-5" />
                        )}

                        {/* 2. Centered Text */}
                        <Text className="text-foreground text-base mx-1.5 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                            {activeReport.className}
                        </Text>

                        {/* 3. Actual Icon on the left */}
                        {activeChild.classes.length > 1 && (
                            <View className="w-5 items-center justify-center">
                                <Feather name="chevron-down" size={18} color="#94a3b8" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* --- 1. Attendance Section --- */}
                <View className="mb-6">
                    <Text className="text-slate-700 text-sm mb-3 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                        معدل الحضور هذا الأسبوع
                    </Text>
                    <View className="bg-card rounded-2xl p-5 border border-border shadow-sm flex-row-reverse justify-between items-center">
                        {activeReport.attendance.map((day, index) => (
                            <View key={index} className="items-center gap-2">
                                <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                    {day.day}
                                </Text>
                                <View
                                    className={`w-9 h-9 rounded-full items-center justify-center ${day.status === 'present' ? 'bg-primary' :
                                        day.status === 'absent' ? 'bg-destructive' :
                                            'bg-gray-200'
                                        }`}
                                >
                                    {day.status === 'present' && <Feather name="check" size={16} color="white" />}
                                    {day.status === 'absent' && <Feather name="x" size={16} color="white" />}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* --- 2. Recent Updates Section --- */}
                <View>
                    <Text className="text-slate-700 text-sm mb-3 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                        آخر التحديثات
                    </Text>
                    <View className="bg-card rounded-2xl p-4 border border-border shadow-sm">
                        {activeReport.updates.map((update, index) => (
                            <View
                                key={update.id}
                                className={`flex-row-reverse items-start py-3 ${index !== activeReport.updates.length - 1 ? 'border-b border-border' : ''
                                    }`}
                            >
                                {/* Icon Column */}
                                <View className={`w-10 h-10 rounded-full items-center justify-center ml-3 ${getIconBg(update.type)}`}>
                                    {getUpdateIcon(update.type)}
                                </View>

                                {/* Content Column */}
                                <View className="flex-1 items-end mt-0.5">
                                    <View className="flex-row-reverse items-center justify-between w-full mb-1">
                                        <Text className="text-foreground text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {update.title}
                                        </Text>
                                        <Text className="text-muted text-xs" style={{ fontFamily: 'Tajawal-Medium' }}>
                                            {update.date}
                                        </Text>
                                    </View>
                                    <Text className="text-slate-600 text-sm text-right mt-0.5" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        {update.details}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>

            {/* --- Centered Dropdown Modal for Class Selection --- */}
            <Modal
                visible={isClassDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsClassDropdownVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsClassDropdownVisible(false)}>
                    <View className="flex-1 justify-center items-center bg-black/40 px-5">
                        <TouchableWithoutFeedback>
                            <View className="bg-card w-full rounded-2xl overflow-hidden shadow-lg">
                                <View className="bg-background p-4 border-b border-border items-center">
                                    <Text className="text-muted text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>
                                        اختر الحلقة
                                    </Text>
                                </View>
                                {activeChild.classes.map((cls, index) => (
                                    <TouchableOpacity
                                        key={cls.classId}
                                        onPress={() => selectClassForChild(activeChild.id, cls.classId)}
                                        className={`p-4 flex-row-reverse items-center justify-between ${index !== activeChild.classes.length - 1 ? 'border-b border-border' : ''
                                            }`}
                                    >
                                        <Text
                                            className={`text-base ${activeClassId === cls.classId ? 'text-primary' : 'text-slate-700'}`}
                                            style={{ fontFamily: activeClassId === cls.classId ? 'Tajawal-Bold' : 'Tajawal-Medium' }}
                                        >
                                            {cls.className}
                                        </Text>
                                        {activeClassId === cls.classId && (
                                            <Feather name="check" size={18} color="#059669" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <BottomNav role="parent" activeTab="reports" navigation={navigation} />

        </View>
    );
}