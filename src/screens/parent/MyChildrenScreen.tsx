import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';

// --- Interfaces ---
interface ChildClassData {
    classId: string;
    className: string;
    points: number;
    rank: number;
    rankText: string;
}

interface ChildData {
    id: string;
    name: string;
    isPresent: boolean;
    classes: ChildClassData[];
}

export default function MyChildrenScreen({ navigation }: any) {
    // --- Mock Data ---
    const [childrenData] = useState<ChildData[]>([
        {
            id: '1',
            name: "أحمد",
            isPresent: true,
            classes: [
                { classId: 'c1', className: "حلقة الإمام الشاطبي", points: 850, rank: 5, rankText: "المركز الخامس" },
                { classId: 'c2', className: "حلقة التجويد", points: 920, rank: 2, rankText: "المركز الثاني" },
            ]
        },
        {
            id: '2',
            name: "عمر",
            isPresent: false,
            classes: [
                { classId: 'c2', className: "حلقة التجويد", points: 1200, rank: 1, rankText: "المركز الأول" },
            ]
        },
    ]);

    // --- State for Class Selection per Child ---
    // Stores the selected class ID for each child
    const [selectedClasses, setSelectedClasses] = useState<Record<string, string>>({
        '1': 'c1', // Default class for Ahmed
        '2': 'c2', // Default class for Omar
    });

    // --- Modal State ---
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [activeChildForDropdown, setActiveChildForDropdown] = useState<ChildData | null>(null);

    // --- Handlers ---
    const openClassDropdown = (child: ChildData) => {
        if (child.classes.length > 1) {
            setActiveChildForDropdown(child);
            setIsDropdownVisible(true);
        }
    };

    const selectClassForChild = (childId: string, classId: string) => {
        setSelectedClasses(prev => ({ ...prev, [childId]: classId }));
        setIsDropdownVisible(false);
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Sticky Header --- */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-center border-b border-border shadow-sm z-10">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>متابعة الأبناء</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="p-5">

                {/* --- Premium Add Child Button --- */}
                <TouchableOpacity
                    className="w-full bg-card border border-primary rounded-2xl p-4 flex-row-reverse items-center justify-between mb-5 shadow-sm active:bg-primary-light/30"
                >
                    <View className="flex-row-reverse items-center gap-3">
                        <View className="w-10 h-10 rounded-xl bg-primary-light items-center justify-center">
                            <Feather name="plus" size={20} color="#059669" />
                        </View>
                        <Text className="text-foreground text-base" style={{ fontFamily: 'Tajawal-Bold' }}>
                            إضافة ابن جديد
                        </Text>
                    </View>
                    <Feather name="chevron-left" size={18} color="#cbd5e1" />
                </TouchableOpacity>

                {/* --- Children Cards Feed --- */}
                <View className="space-y-4">
                    {childrenData.map((child) => {
                        // Get the currently selected class data for this child
                        const activeClassId = selectedClasses[child.id];
                        const activeClassData = child.classes.find(c => c.classId === activeClassId) || child.classes[0];
                        const isFirstPlace = activeClassData.rank === 1;

                        return (
                            <View key={child.id} className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">

                                {/* Top Row: Avatar, Name, Status Badge */}
                                <View className="flex-row-reverse items-start justify-between mb-4 w-full">
                                    <View className="flex-row-reverse items-center gap-3">
                                        <View className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <Feather name="user" size={22} color="#64748b" />
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{child.name}</Text>

                                            {/* Smart Class Selector Dropdown */}
                                            <TouchableOpacity
                                                onPress={() => openClassDropdown(child)}
                                                activeOpacity={child.classes.length > 1 ? 0.7 : 1}
                                                className="flex-row-reverse items-center gap-1 mt-0.5"
                                            >
                                                <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                                    {activeClassData.className}
                                                </Text>
                                                {child.classes.length > 1 && (
                                                    <Feather name="chevron-down" size={14} color="#94a3b8" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View className={`px-3 py-1 rounded-full ${child.isPresent ? 'bg-primary-light border border-primary' : 'bg-destructive-light border border-destructive'}`}>
                                        <Text className={`text-xs ${child.isPresent ? 'text-primary' : 'text-destructive'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {child.isPresent ? 'حاضر اليوم' : 'غائب'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Stats Row (Clean Minimalist Design from v0) */}
                                <View className="flex-row-reverse items-center justify-start gap-6 mb-4">
                                    {/* Points */}
                                    <View className="flex-row-reverse items-center gap-1.5">
                                        <Feather name="star" size={15} color="#059669" />
                                        <Text className="text-slate-700 text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {activeClassData.points} نقطة
                                        </Text>
                                    </View>

                                    {/* Rank */}
                                    <View className="flex-row-reverse items-center gap-1.5">
                                        <Feather name="award" size={15} color={isFirstPlace ? '#d97706' : '#059669'} />
                                        <Text className={`text-sm ${isFirstPlace ? 'text-amber-600' : 'text-slate-700'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {activeClassData.rankText}
                                        </Text>
                                    </View>
                                </View>

                                {/* Divider */}
                                <View className="border-t border-border mb-4" />

                                {/* Action Button */}
                                <TouchableOpacity className="w-full bg-primary h-11 rounded-xl items-center justify-center active:opacity-90 shadow-sm shadow-emerald-200">
                                    <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>عرض التفاصيل</Text>
                                </TouchableOpacity>

                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* --- Dropdown Modal for Class Selection --- */}
            <Modal
                visible={isDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDropdownVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
                    <View className="flex-1 justify-center items-center bg-black/40 px-5">
                        <TouchableWithoutFeedback>
                            <View className="bg-card w-full rounded-2xl overflow-hidden shadow-lg">
                                <View className="bg-background p-4 border-b border-border items-center">
                                    <Text className="text-muted text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>
                                        اختر حلقة الابن ({activeChildForDropdown?.name})
                                    </Text>
                                </View>
                                {activeChildForDropdown?.classes.map((cls, index) => (
                                    <TouchableOpacity
                                        key={cls.classId}
                                        onPress={() => selectClassForChild(activeChildForDropdown.id, cls.classId)}
                                        className={`p-4 flex-row-reverse items-center justify-between ${index !== activeChildForDropdown.classes.length - 1 ? 'border-b border-border' : ''
                                            }`}
                                    >
                                        <Text
                                            className={`text-base ${selectedClasses[activeChildForDropdown.id] === cls.classId ? 'text-primary' : 'text-slate-700'}`}
                                            style={{ fontFamily: selectedClasses[activeChildForDropdown.id] === cls.classId ? 'Tajawal-Bold' : 'Tajawal-Medium' }}
                                        >
                                            {cls.className}
                                        </Text>
                                        {selectedClasses[activeChildForDropdown.id] === cls.classId && (
                                            <Feather name="check" size={18} color="#059669" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* --- Reusable Dynamic Bottom Navigation --- */}
            <BottomNav role="parent" activeTab="children" navigation={navigation} />

        </View>
    );
}