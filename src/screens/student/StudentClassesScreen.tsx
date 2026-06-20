import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';

interface ClassData {
    title: string;
    badge: string;
    badgeType: 'online' | 'inperson';
    teacher: string;
    time: string;
    attendance: number;
    nextTarget: string;
}

// Interface for pending join requests
interface PendingRequestData {
    id: string;
    title: string;
    teacher: string;
    time: string;
    type: 'online' | 'inperson';
}

export default function MyClassesScreen({ route, navigation }: any) {
    const userRole = route.params?.role || 'student';

    // Active classes list
    const classesList: ClassData[] = [
        {
            title: 'حلقة الإمام الشاطبي لإكمال حفظ القرآن الكريم والمراجعة الشاملة',
            badge: 'عن بعد',
            badgeType: 'online',
            teacher: 'أ. أحمد محمود',
            time: 'العصر (4:00 م - 6:00 م)',
            attendance: 98,
            nextTarget: 'إتمام الجزء ٢٩ ومراجعة أول ٥ أجزاء من القرآن الكريم',
        },
        {
            title: 'حلقة التجويد المبسط',
            badge: 'حضوري',
            badgeType: 'inperson',
            teacher: 'أ. خالد عبدالله',
            time: 'المغرب (6:30 م - 8:00 م)',
            attendance: 100,
            nextTarget: 'مخارج الحروف',
        },
    ];

    // Mock data for pending join requests, including one with a very long title
    const [pendingRequests, setPendingRequests] = useState<PendingRequestData[]>([
        {
            id: '1',
            title: 'حلقة الماهر بالقرآن الكريم للحفظ المكثف وتثبيت الحفظ السابق ومراجعة المتشابهات اللفظية',
            teacher: 'أ. عمر الفاروق',
            time: 'الفجر (5:00 ص - 6:30 ص)',
            type: 'online',
        }
    ]);

    // States to manage expansion status for active class titles and targets
    const [expandedTitleIndices, setExpandedTitleIndices] = useState<Record<number, boolean>>({});
    const [expandedTargetIndices, setExpandedTargetIndices] = useState<Record<number, boolean>>({});

    // --- NEW STATE: to manage expansion status for pending request titles based on ID ---
    const [expandedPendingTitleIds, setExpandedPendingTitleIds] = useState<Record<string, boolean>>({});

    // Functions to toggle expansion
    const toggleTitleExpansion = (index: number) => {
        setExpandedTitleIndices((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const toggleTargetExpansion = (index: number) => {
        setExpandedTargetIndices((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // --- NEW FUNCTION: to toggle expansion for pending request titles ---
    const togglePendingTitleExpansion = (id: string) => {
        setExpandedPendingTitleIds((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle expanded boolean
        }));
    };

    // Handler to cancel a pending join request
    const handleCancelRequest = (id: string) => {
        setPendingRequests((prev) => prev.filter(request => request.id !== id));
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* Header */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-center border-b border-border shadow-sm">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>حلقاتي</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="p-5" showsVerticalScrollIndicator={false}>

                {/* Join New Class Button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('JoinClass')}
                    activeOpacity={0.8}
                    className="w-full bg-card border border-primary rounded-2xl p-4 flex-row-reverse items-center justify-between mb-5 shadow-sm active:bg-primary-light/30"
                >
                    <View className="flex-row-reverse items-center gap-3">
                        <View className="w-10 h-10 rounded-xl bg-primary-light items-center justify-center">
                            <Feather name="plus" size={20} color="#059669" />
                        </View>
                        <Text className="text-foreground text-base" style={{ fontFamily: 'Tajawal-Bold' }}>
                            الانضمام لحلقة جديدة
                        </Text>
                    </View>
                    <Feather name="chevron-left" size={18} color="#cbd5e1" />
                </TouchableOpacity>

                {/* --- Section 1: Active Classes --- */}
                <View className="space-y-4 mb-6">
                    {classesList.map((item, index) => (
                        <View key={index} className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">

                            <View className="flex-row-reverse items-start justify-between mb-4 w-full">
                                <TouchableOpacity
                                    onPress={() => toggleTitleExpansion(index)}
                                    activeOpacity={0.8}
                                    className="flex-row-reverse items-start flex-1 ml-2"
                                >
                                    <Text
                                        className="text-base text-foreground text-right leading-relaxed"
                                        numberOfLines={expandedTitleIndices[index] ? 0 : 1}
                                        style={{ flexShrink: 1, fontFamily: 'Tajawal-Bold' }}
                                    >
                                        {item.title}
                                    </Text>
                                    <View className="w-7 h-7 bg-amber-50 rounded-full border border-amber-200 items-center justify-center mr-2 flex-shrink-0">
                                        <Feather name="award" size={13} color="#d97706" />
                                    </View>
                                </TouchableOpacity>

                                <View className="flex-row-reverse items-center gap-2 flex-shrink-0">
                                    <View className={`px-3 py-1 rounded-full ${item.badgeType === 'online' ? 'bg-blue-50 border border-blue-100' : 'bg-primary-light border border-primary'}`}>
                                        <Text
                                            className={`text-xs ${item.badgeType === 'online' ? 'text-blue-600' : 'text-primary'}`}
                                            style={{ fontFamily: 'Tajawal-Bold' }}
                                        >
                                            {item.badge}
                                        </Text>
                                    </View>
                                    <TouchableOpacity className="p-1 active:bg-background rounded-full">
                                        <Feather name="more-vertical" size={20} color="#94a3b8" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="space-y-2 mb-4 items-end">
                                <View className="flex-row-reverse items-center justify-start w-full mb-1">
                                    <Feather name="user" size={14} color="#94a3b8" className="ml-2" />
                                    <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        المعلم: <Text className="text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>{item.teacher}</Text>
                                    </Text>
                                </View>
                                <View className="flex-row-reverse items-center justify-start w-full">
                                    <Feather name="clock" size={14} color="#94a3b8" className="ml-2" />
                                    <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>{item.time}</Text>
                                </View>
                            </View>

                            <View className="border-t border-border my-3" />

                            <View className="mb-4 flex-row-reverse items-start justify-between w-full">
                                <View className="flex-row-reverse items-center">
                                    <Text className="text-sm text-gray-400" style={{ fontFamily: 'Tajawal-Medium' }}>نسبة حضورك: </Text>
                                    <Text className="text-sm text-slate-700 mr-1" style={{ fontFamily: 'Tajawal-Bold' }}>{item.attendance}%</Text>
                                </View>

                                <View className="w-[1px] h-4 bg-gray-200 mx-3 mt-1" />

                                <TouchableOpacity
                                    onPress={() => toggleTargetExpansion(index)}
                                    activeOpacity={0.8}
                                    className="flex-1 flex-row-reverse items-start"
                                >
                                    <Text className="text-sm text-gray-400" style={{ fontFamily: 'Tajawal-Medium' }}>الهدف: </Text>
                                    <Text
                                        className="text-sm text-primary mr-1 text-right flex-1 leading-relaxed"
                                        numberOfLines={expandedTargetIndices[index] ? 0 : 1}
                                        style={{ fontFamily: 'Tajawal-Bold' }}
                                    >
                                        {item.nextTarget}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row-reverse mt-2">
                                {item.badgeType === 'online' ? (
                                    <>
                                        <TouchableOpacity className="flex-1 bg-primary h-11 rounded-xl items-center justify-center ml-3 active:opacity-90">
                                            <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>دخول الحلقة</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-1 bg-primary-light border border-primary h-11 rounded-xl items-center justify-center active:bg-emerald-100">
                                            <Text className="text-primary text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>الورد اليومي</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity className="w-full bg-primary-light border border-primary h-11 rounded-xl items-center justify-center active:bg-emerald-100">
                                        <Text className="text-primary text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>الورد اليومي</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* --- Section 2: Pending Join Requests --- */}
                {pendingRequests.length > 0 && (
                    <View className="mt-4">
                        {/* Section Title */}
                        <Text className="text-base text-foreground mb-4 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                            طلبات انضمام قيد الانتظار
                        </Text>

                        {pendingRequests.map((request) => (
                            <View key={request.id} className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/20 shadow-sm mb-4">

                                {/* Request Header - UPDATED for dynamic title expansion */}
                                <View className="flex-row-reverse items-start justify-between mb-3 w-full">

                                    {/* (Touchable) Pending Title Group */}
                                    <TouchableOpacity
                                        onPress={() => togglePendingTitleExpansion(request.id)} // Toggle expansion on tap
                                        activeOpacity={0.8}
                                        className="flex-row-reverse items-start flex-1 ml-3" // items-start aligns title to top when expanded
                                    >
                                        <Text
                                            className="text-base text-foreground text-right flex-1 leading-relaxed"
                                            // Dynamically set numberOfLines based on expansion state from new state
                                            numberOfLines={expandedPendingTitleIds[request.id] ? 0 : 1}
                                            style={{ fontFamily: 'Tajawal-Bold' }}
                                        >
                                            {request.title}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Pending Status Badge (protected from squishing) */}
                                    <View className="bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full flex-shrink-0 ml-1">
                                        <Text className="text-amber-700 text-[10px]" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                            بانتظار موافقة المعلم
                                        </Text>
                                    </View>
                                </View>

                                {/* Request Details */}
                                <View className="space-y-1.5 items-end mb-4">
                                    <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        المعلم: <Text className="text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>{request.teacher}</Text>
                                    </Text>
                                    <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        التوقيت: <Text className="text-slate-600">{request.time}</Text>
                                    </Text>
                                    <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        النوع: <Text className="text-slate-600">{request.type === 'online' ? 'عن بعد' : 'حضوري'}</Text>
                                    </Text>
                                </View>

                                {/* Cancel Button */}
                                <TouchableOpacity
                                    onPress={() => handleCancelRequest(request.id)}
                                    activeOpacity={0.7}
                                    className="w-full h-10 border border-red-200 bg-red-50/50 rounded-xl flex-row items-center justify-center"
                                >
                                    <Text className="text-red-600 text-xs" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                        إلغاء طلب الانضمام
                                    </Text>
                                    <Feather name="trash-2" size={13} color="#dc2626" style={{ marginLeft: 6 }} />
                                </TouchableOpacity>

                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>

            <BottomNav role={userRole} activeTab="classes" navigation={navigation} />
        </View>
    );
}