import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';

// Interface defining the teacher's class data
interface TeacherClassData {
    id: string;
    title: string;
    badge: string;
    badgeType: 'online' | 'inperson';
    time: string;
    studentsCount: number;
    pendingRequests: number;
}

export default function TeacherClassesScreen({ navigation }: any) {

    // Mock data for classes
    const classesList: TeacherClassData[] = [
        {
            id: '1',
            title: 'حلقة الإمام الشاطبي لإكمال حفظ القرآن الكريم والمراجعة',
            badge: 'عن بعد',
            badgeType: 'online',
            time: 'العصر (4:00 م - 6:00 م)',
            studentsCount: 15,
            pendingRequests: 3,
        },
        {
            id: '2',
            title: 'حلقة التجويد',
            badge: 'حضوري',
            badgeType: 'inperson',
            time: 'المغرب (6:30 م - 8:00 م)',
            studentsCount: 8,
            pendingRequests: 0,
        },
    ];

    // State to manage expansion status for titles
    const [expandedTitleIds, setExpandedTitleIds] = useState<Record<string, boolean>>({});

    // Toggle function for text expansion
    const toggleTitleExpansion = (id: string) => {
        setExpandedTitleIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Sticky Header --- */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-center border-b border-border shadow-sm">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>إدارة الحلقات</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="p-5">

                {/* --- 1. Premium Create Class Button --- */}
                <TouchableOpacity
                    className="w-full bg-card border border-primary rounded-2xl p-4 flex-row-reverse items-center justify-between mb-5 shadow-sm active:bg-primary-light/30"
                >
                    <View className="flex-row-reverse items-center gap-3">
                        <View className="w-10 h-10 rounded-xl bg-primary-light items-center justify-center">
                            <Feather name="plus" size={20} color="#059669" />
                        </View>
                        <Text className="text-foreground text-base" style={{ fontFamily: 'Tajawal-Bold' }}>
                            إنشاء حلقة جديدة
                        </Text>
                    </View>
                    <Feather name="chevron-left" size={18} color="#cbd5e1" />
                </TouchableOpacity>

                {/* --- 2. Teacher Classes Feed --- */}
                <View className="space-y-4">
                    {classesList.map((item) => (
                        <View key={item.id} className="bg-card rounded-2xl p-5 border border-border shadow-sm">

                            <View className="flex-row-reverse items-start justify-between mb-4 w-full">

                                {/* Right Group: Title + Dynamic Notification Bell */}
                                <View className="flex-row-reverse items-start flex-1 ml-2">

                                    {/* Using flex-1 here forces the title container to take all available space, pushing the bell to a fixed left position */}
                                    <TouchableOpacity
                                        onPress={() => toggleTitleExpansion(item.id)}
                                        activeOpacity={0.8}
                                        className="flex-1"
                                    >
                                        <Text
                                            className="text-base text-foreground text-right"
                                            numberOfLines={expandedTitleIds[item.id] ? 0 : 1}
                                            style={{ fontFamily: 'Tajawal-Bold' }}
                                        >
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Smart Dynamic Notification Bell (Always Visible at a fixed position) */}
                                    <TouchableOpacity
                                        className={`w-7 h-7 rounded-full border items-center justify-center mr-2 flex-shrink-0 relative ${item.pendingRequests > 0
                                            ? 'bg-destructive-light border-destructive'
                                            : 'bg-background border-border'
                                            }`}
                                    >
                                        <Feather
                                            name="bell"
                                            size={13}
                                            color={item.pendingRequests > 0 ? '#e11d48' : '#94a3b8'}
                                        />

                                        {/* Small Red Numeric Badge - Only shows if requests > 0 */}
                                        {item.pendingRequests > 0 && (
                                            <View className="absolute -top-1.5 -right-1.5 bg-destructive min-w-[16px] h-4 rounded-full items-center justify-center px-1 border border-white">
                                                <Text
                                                    className="text-white text-[8px]"
                                                    style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, textAlignVertical: 'center' }}
                                                >
                                                    {item.pendingRequests}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {/* Left Group: Status Badge */}
                                <View className="flex-row-reverse items-center gap-2 flex-shrink-0">
                                    <View
                                        className={`px-3 py-1 rounded-full ${item.badgeType === 'online' ? 'bg-blue-50 border border-blue-100' : 'bg-primary-light border border-primary'
                                            }`}
                                    >
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

                            {/* Info Section */}
                            <View className="space-y-2 mb-3 items-end">
                                <View className="flex-row-reverse items-center justify-start w-full mb-1">
                                    <Feather name="clock" size={14} color="#94a3b8" className="ml-2" />
                                    <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        وقت الحلقة: <Text className="text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>{item.time}</Text>
                                    </Text>
                                </View>
                                <View className="flex-row-reverse items-center justify-start w-full">
                                    <Feather name="users" size={14} color="#94a3b8" className="ml-2" />
                                    <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        عدد الطلاب: <Text className="text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>{item.studentsCount} طالب</Text>
                                    </Text>
                                </View>
                            </View>

                            {/* Clean Divider */}
                            <View className="border-t border-border mt-2 mb-3" />

                            {/* Action Buttons */}
                            <View className="flex-col w-full">
                                {item.badgeType === 'online' && (
                                    <TouchableOpacity className="w-full bg-primary h-11 rounded-xl items-center justify-center mb-2 active:opacity-90 shadow-sm shadow-emerald-200">
                                        <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>دخول الحلقة / بدء الغرفة</Text>
                                    </TouchableOpacity>
                                )}

                                <View className="flex-row-reverse gap-2 w-full">
                                    <TouchableOpacity className="flex-1 bg-slate-800 h-11 rounded-xl items-center justify-center active:bg-slate-700 shadow-sm">
                                        <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>إدارة الطلاب</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className="flex-1 bg-background border border-border h-11 rounded-xl items-center justify-center active:bg-background">
                                        <Text className="text-slate-600 text-sm" style={{ fontFamily: 'Tajawal-Medium' }}>سجل الحضور</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    ))}
                </View>

            </ScrollView>

            <BottomNav role="teacher" activeTab="classes" navigation={navigation} />

        </View>
    );
}