import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, StatusBar, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AvailableClass {
    id: string;
    title: string;
    type: 'online' | 'inperson';
    category: 'memorization' | 'tajweed';
    teacher: string;
    time: string;
    enrolled: number;
    capacity: number;
    target: string;
}

const availableClasses: AvailableClass[] = [
    {
        id: '1',
        title: 'حلقة الماهر بالقرآن (حفظ مكثف)',
        type: 'online',
        category: 'memorization',
        teacher: 'أ. عمر الفاروق',
        time: 'الفجر (5:00 ص - 6:30 ص)',
        enrolled: 12,
        capacity: 15,
        target: 'حفظ 5 أجزاء خلال الفصل الدراسي',
    },
    {
        id: '2',
        title: 'حلقة التبيان لإتقان التلاوة',
        type: 'inperson',
        category: 'tajweed',
        teacher: 'أ. صالح عبدالرحمن',
        time: 'المغرب (6:30 م - 8:00 م)',
        enrolled: 10,
        capacity: 10,
        target: 'إتقان أحكام التجويد العملية',
    },
    {
        id: '3',
        title: 'حلقة النور للمبتدئين',
        type: 'online',
        category: 'memorization',
        teacher: 'أ. فهد العتيبي',
        time: 'العصر (4:00 م - 5:30 م)',
        enrolled: 5,
        capacity: 20,
        target: 'تأسيس وحفظ جزء عم وتبارك',
    },
];

export default function JoinClassScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState<'all' | 'online' | 'inperson'>('all');
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'memorization' | 'tajweed'>('all');

    // State to track requested class IDs dynamically
    const [requestedClasses, setRequestedClasses] = useState<Record<string, boolean>>({});

    const isFilterActive = selectedType !== 'all' || selectedCategory !== 'all';

    // Handler to toggle join request state
    const handleJoinRequest = (id: string) => {
        setRequestedClasses((prev) => ({
            ...prev,
            [id]: true, // Mark this specific class ID as requested
        }));
    };

    const getFilteredClasses = () => {
        return availableClasses.filter((item) => {
            const matchesSearch = item.title.includes(searchQuery) || item.teacher.includes(searchQuery);
            const matchesType = selectedType === 'all' || item.type === selectedType;
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            return matchesSearch && matchesType && matchesCategory;
        });
    };

    const filteredClasses = getFilteredClasses();

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header Section --- */}
            <View className="bg-card px-5 py-4 flex-row-reverse items-center justify-between border-b border-border z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    استكشاف الحلقات
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- Search & Filter Bar --- */}
                <View className="px-5 mt-8 pt-4 mb-6 flex-row-reverse items-center gap-3">
                    <View className="flex-1 flex-row-reverse items-center bg-white border border-gray-200 rounded-xl px-4 h-12 shadow-sm">
                        <Feather name="search" size={20} color="#94a3b8" />
                        <TextInput
                            placeholder="ابحث باسم الحلقة أو المعلم..."
                            placeholderTextColor="#94a3b8"
                            className="flex-1 text-right text-foreground mr-3 text-sm h-full"
                            style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0 }}
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

                {/* --- Available Classes List --- */}
                <View className="px-5 space-y-4">
                    {filteredClasses.length > 0 ? (
                        filteredClasses.map((item) => {
                            const isFull = item.enrolled >= item.capacity;
                            const isRequested = requestedClasses[item.id]; // Check if already requested
                            const occupancyRate = (item.enrolled / item.capacity) * 100;

                            return (
                                <View key={item.id} className="bg-white rounded-2xl p-5 border border-border shadow-sm mb-4">

                                    <View className="flex-row-reverse items-start justify-between mb-4 w-full">
                                        <View className="flex-row-reverse items-start flex-1 ml-2">
                                            <View className="w-8 h-8 bg-emerald-50 rounded-full border border-emerald-100 items-center justify-center ml-3 flex-shrink-0">
                                                <Feather name={item.category === 'memorization' ? "book-open" : "mic"} size={14} color="#10b981" />
                                            </View>
                                            <Text className="text-base text-foreground text-right flex-1" style={{ fontFamily: 'Tajawal-Bold' }}>
                                                {item.title}
                                            </Text>
                                        </View>
                                        <View className={`px-2.5 py-1 rounded-full ${item.type === 'online' ? 'bg-blue-50 border border-blue-100' : 'bg-orange-50 border border-orange-100'}`}>
                                            <Text
                                                className={`text-[11px] ${item.type === 'online' ? 'text-blue-600' : 'text-orange-600'}`}
                                                style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}
                                            >
                                                {item.type === 'online' ? 'عن بعد' : 'حضوري'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="space-y-2 mb-4 items-end bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <View className="flex-row-reverse items-center justify-start w-full mb-1">
                                            <Feather name="user" size={14} color="#94a3b8" className="ml-2" />
                                            <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                                المعلم: <Text className="text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>{item.teacher}</Text>
                                            </Text>
                                        </View>
                                        <View className="flex-row-reverse items-center justify-start w-full mb-1">
                                            <Feather name="clock" size={14} color="#94a3b8" className="ml-2" />
                                            <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>{item.time}</Text>
                                        </View>
                                        <View className="flex-row-reverse items-center justify-start w-full">
                                            <Feather name="target" size={14} color="#94a3b8" className="ml-2" />
                                            <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }} numberOfLines={1}>
                                                الهدف: {item.target}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row-reverse items-center justify-between mt-2">

                                        <View className="flex-1 ml-4 items-end">
                                            <View className="flex-row-reverse items-center justify-between w-full mb-1.5">
                                                <Text className="text-[10px] text-gray-500" style={{ fontFamily: 'Tajawal-Medium' }}>المقاعد المتاحة</Text>
                                                <Text className="text-[10px] text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>
                                                    {item.enrolled} / {item.capacity}
                                                </Text>
                                            </View>
                                            <View className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex-row justify-end">
                                                <View
                                                    className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-primary'}`}
                                                    style={{ width: `${occupancyRate}%` }}
                                                />
                                            </View>
                                        </View>

                                        {/* Dynamic Action Button State */}
                                        <TouchableOpacity
                                            disabled={isFull || isRequested}
                                            onPress={() => handleJoinRequest(item.id)}
                                            activeOpacity={0.8}
                                            className={`px-5 h-11 rounded-xl flex-row-reverse items-center justify-center border shadow-sm ${isFull
                                                    ? 'bg-gray-100 border-gray-200'
                                                    : isRequested
                                                        ? 'bg-amber-50 border-amber-200' // Styling for submitted request
                                                        : 'bg-primary border-primary'
                                                }`}
                                        >
                                            <Text
                                                className={`text-sm ${isFull ? 'text-gray-400' : isRequested ? 'text-amber-600' : 'text-white'}`}
                                                style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}
                                            >
                                                {isFull ? 'مكتملة' : isRequested ? 'تم طلب الانضمام' : 'طلب انضمام'}
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View className="items-center justify-center py-20">
                            <Feather name="filter" size={40} color="#cbd5e1" className="mb-4" />
                            <Text className="text-muted text-base" style={{ fontFamily: 'Tajawal-Medium' }}>
                                لا توجد حلقات مطابقة للفلتر أو البحث
                            </Text>
                        </View>
                    )}
                </View>

            </ScrollView>

            {/* --- Filter Modal (Centered Dialog) --- */}
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
                                <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تصفية الحلقات</Text>
                                <TouchableOpacity onPress={() => setIsFilterModalVisible(false)} className="bg-gray-50 p-2 rounded-full">
                                    <Feather name="x" size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm text-slate-500 mb-3 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>نوع التواجد</Text>
                                <View className="flex-row-reverse flex-wrap gap-2.5">
                                    {[{ id: 'all', label: 'الكل' }, { id: 'online', label: 'عن بعد' }, { id: 'inperson', label: 'حضوري' }].map((opt) => (
                                        <TouchableOpacity
                                            key={opt.id}
                                            activeOpacity={0.8}
                                            onPress={() => setSelectedType(opt.id as any)}
                                            className={`px-6 py-2.5 rounded-full border ${selectedType === opt.id ? 'bg-primary border-primary shadow-sm' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`text-sm ${selectedType === opt.id ? 'text-white' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>{opt.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View className="mb-8">
                                <Text className="text-sm text-slate-500 mb-3 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>المسار التعليمي</Text>
                                <View className="flex-row-reverse flex-wrap gap-2.5">
                                    {[{ id: 'all', label: 'الكل' }, { id: 'memorization', label: 'مسار الحفظ' }, { id: 'tajweed', label: 'مسار التجويد' }].map((opt) => (
                                        <TouchableOpacity
                                            key={opt.id}
                                            activeOpacity={0.8}
                                            onPress={() => setSelectedCategory(opt.id as any)}
                                            className={`px-6 py-2.5 rounded-full border ${selectedCategory === opt.id ? 'bg-primary border-primary shadow-sm' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`text-sm ${selectedCategory === opt.id ? 'text-white' : 'text-slate-600'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>{opt.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View className="flex-row-reverse gap-3 pb-2">
                                <TouchableOpacity activeOpacity={0.8} onPress={() => setIsFilterModalVisible(false)} className="flex-1 bg-primary h-12 rounded-xl items-center justify-center shadow-sm border border-primary">
                                    <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>عرض النتائج</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => { setSelectedType('all'); setSelectedCategory('all'); }} className="w-24 bg-white border border-gray-200 h-12 rounded-xl items-center justify-center shadow-sm">
                                    <Text className="text-slate-600 text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>مسح</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}