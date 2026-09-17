import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

    // --- Add Child Modal State ---
    const [isAddChildModalVisible, setIsAddChildModalVisible] = useState(false);
    const [childCode, setChildCode] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

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
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* --- Sticky Header --- */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-center border-b border-border shadow-sm z-10">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>متابعة الأبناء</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="p-5">

                {/* --- Premium Add Child Button --- */}
                <TouchableOpacity
                    onPress={() => setIsAddChildModalVisible(true)}
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

            {/* --- Add Child Modal (Link by Code or Register) --- */}
            <Modal animationType="fade" onRequestClose={() => setIsAddChildModalVisible(false)} transparent={true} visible={isAddChildModalVisible}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <TouchableOpacity activeOpacity={1} className="flex-1 justify-center items-center px-5 bg-black/50" onPress={() => setIsAddChildModalVisible(false)}>
                        <TouchableWithoutFeedback>
                            <View className="bg-card w-full rounded-3xl p-6 shadow-2xl items-center">

                                <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4 border border-blue-100">
                                    <Feather color="#3b82f6" name="link" size={28} />
                                </View>

                                <Text className="text-xl text-foreground mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    ربط حساب الابن
                                </Text>

                                <Text className="text-sm text-slate-500 text-center mb-6 leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                    أدخل الرمز الخاص بابنك لربط حسابه ومتابعة حفظه. إذا لم يكن لديه حساب، يمكنك إنشاء حساب جديد له بالأسفل.
                                </Text>

                                {/* Code Input */}
                                <TextInput autoCapitalize="characters" className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-center text-lg text-primary tracking-widest mb-6" style={{ fontFamily: 'Tajawal-Bold' }} onChangeText={setChildCode} placeholder="أدخل الرمز هنا (مثال: A7X9P)" placeholderTextColor="#94a3b8" value={childCode} />

                                {/* Link Action Button */}
                                <TouchableOpacity activeOpacity={0.8} className="w-full bg-primary h-12 rounded-xl flex-row-reverse items-center justify-center shadow-sm mb-5" onPress={() => {
                                    // TODO: Implement linking logic API call here
                                    console.log("Linking child with code:", childCode);
                                    setIsAddChildModalVisible(false);
                                    setTimeout(() => setIsSuccessModalVisible(true), 300);
                                }}
                                >
                                    <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                        تأكيد وربط الحساب
                                    </Text>
                                </TouchableOpacity>

                                {/* Register New Account Option */}
                                <View className="flex-row-reverse items-center justify-center gap-1.5">
                                    <Text className="text-sm text-slate-500" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        ليس لديه حساب؟
                                    </Text>
                                    <TouchableOpacity onPress={() => {
                                        setIsAddChildModalVisible(false);
                                        navigation.navigate('Register');
                                    }}
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-sm text-primary underline" style={{ fontFamily: 'Tajawal-Bold' }}>
                                            سجل حساب جديد
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>

            {/* --- Success Confirmation Modal --- */}
            <Modal animationType="fade" onRequestClose={() => setIsSuccessModalVisible(false)} transparent={true} visible={isSuccessModalVisible}>
                <View className="flex-1 justify-center items-center px-6 bg-black/50">
                    <View className="bg-card w-full rounded-3xl p-6 items-center shadow-2xl">
                        <View className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full items-center justify-center mb-5">
                            <Feather color="#10b981" name="check" size={40} />
                        </View>
                        <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                            تم ربط الحساب بنجاح
                        </Text>
                        <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                            تم ربط حساب الابن بنجاح. يمكنك الآن متابعة تقدمه وإنجازاته في الحلقات من خلال قائمة أبنائك.
                        </Text>
                        <TouchableOpacity activeOpacity={0.8} className="w-full h-12 bg-primary rounded-xl items-center justify-center shadow-sm" onPress={() => setIsSuccessModalVisible(false)}>
                            <Text className="text-white text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                متابعة
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* --- Reusable Dynamic Bottom Navigation --- */}
            <BottomNav role="parent" activeTab="children" navigation={navigation} />

        </SafeAreaView>
    );
}