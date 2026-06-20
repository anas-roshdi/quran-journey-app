import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';
import DashboardHeader from '../../components/DashboardHeader'; // المكون المشترك

// Interface defining the child's data structure
interface Child {
    id: string;
    name: string;
    todayLesson: string;
    todayReview: string;
    status: 'completed' | 'pending';
    teacherNote: string;
    planTarget: string;
    planRemaining: string;
    daysRemaining: number;
    attendance: number;
    points: number;
    rate: number;
}

export default function ParentDashboardScreen({ navigation }: any) {
    const [selectedChildId, setSelectedChildId] = useState<string>('1');

    // --- دوال الانتقال الخاصة بالشريط العلوي ---
    const handleProfilePress = () => {
        navigation.navigate('Profile', { role: 'parent' });
    };

    // Mock data for the parent's children
    const childrenData: Child[] = [
        {
            id: '1',
            name: 'عمر',
            todayLesson: 'سورة النبأ',
            todayReview: 'الجزء ٢٩',
            status: 'completed',
            teacherNote: 'قراءة ممتازة ومتقنة، أرجو مراجعة أحكام المد المتصل.',
            planTarget: 'سورة الملك إلى سورة المرسلات',
            planRemaining: 'سورة واحدة',
            daysRemaining: 4,
            attendance: 12,
            points: 450,
            rate: 95,
        },
        {
            id: '2',
            name: 'فاطمة',
            todayLesson: 'سورة الإنسان',
            todayReview: 'الجزء ٣٠',
            status: 'pending',
            teacherNote: 'بحاجة للمزيد من التكرار في الآيات الأخيرة.',
            planTarget: 'سورة المزمل إلى سورة الإنسان',
            planRemaining: 'سورتان',
            daysRemaining: 8,
            attendance: 10,
            points: 380,
            rate: 88,
        },
    ];

    // Fetch the active selected child data object
    const selectedChild = childrenData.find((c) => c.id === selectedChildId)!;

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header Section (Reusable Component) --- */}
            <View className="bg-card px-5 py-4 shadow-sm border-b border-border z-10">
                <DashboardHeader
                    title="السلام عليكم، أبو عمر"
                    subtitle="متابعة إنجاز الأبناء"
                    notificationCount={1}
                    onProfilePress={handleProfilePress}
                    onViewAllNotifications={() => navigation.navigate('Notifications')}
                />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

                <View className="px-5 py-6">

                    {/* --- 1. Children Switcher Tabs --- */}
                    <View className="mb-6 w-full">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="w-full"
                            contentContainerStyle={{
                                flexDirection: 'row-reverse',
                                flexGrow: 1,
                                justifyContent: 'flex-start',
                                gap: 12
                            }}
                        >
                            {childrenData.map((child) => (
                                <TouchableOpacity
                                    key={child.id}
                                    onPress={() => setSelectedChildId(child.id)}
                                    className={`px-6 py-3 rounded-xl border ${selectedChildId === child.id
                                        ? 'bg-primary-light border-primary'
                                        : 'bg-card border-border'
                                        }`}
                                >
                                    <Text
                                        className={`text-base ${selectedChildId === child.id ? 'text-primary' : 'text-slate-600'}`}
                                        style={{ fontFamily: 'Tajawal-Bold' }}
                                    >
                                        {child.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* --- 2. Selected Child's Daily Status Card --- */}
                    <View className="bg-card rounded-2xl shadow-sm p-5 mb-5 border border-border">
                        <View className="flex-row-reverse items-center justify-between mb-4 border-b border-border pb-2">
                            <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>متابعة اليوم</Text>

                            {selectedChild.status === 'completed' ? (
                                <View className="bg-primary-light px-3 py-1 rounded-full flex-row-reverse items-center gap-1">
                                    <Feather name="check-circle" size={14} color="#10b981" />
                                    <Text className="text-primary text-xs" style={{ fontFamily: 'Tajawal-Bold' }}>أتم التسميع</Text>
                                </View>
                            ) : (
                                <View className="bg-amber-50 px-3 py-1 rounded-full flex-row-reverse items-center gap-1">
                                    <Feather name="clock" size={14} color="#d97706" />
                                    <Text className="text-amber-700 text-xs" style={{ fontFamily: 'Tajawal-Bold' }}>في انتظار التسميع</Text>
                                </View>
                            )}
                        </View>

                        <View className="mb-4 space-y-3">
                            <View className="items-end w-full mb-3">
                                <Text className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>الدرس الجديد</Text>
                                <Text className="text-sm text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{selectedChild.todayLesson}</Text>
                            </View>

                            <View className="items-end w-full">
                                <Text className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>المراجعة</Text>
                                <Text className="text-sm text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{selectedChild.todayReview}</Text>
                            </View>
                        </View>

                        <View className="bg-background rounded-xl p-4 border border-border items-end">
                            <Text className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>ملاحظة المعلم</Text>
                            <Text className="text-slate-700 text-sm text-right leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                {selectedChild.teacherNote}
                            </Text>
                        </View>
                    </View>

                    {/* --- 3. Memorization Plan Card --- */}
                    <View className="bg-card rounded-2xl shadow-sm p-5 mb-5 border border-border">
                        <Text className="text-lg text-right text-foreground mb-4" style={{ fontFamily: 'Tajawal-Bold' }}>
                            خطة الحفظ والمراجعة
                        </Text>

                        <View className="space-y-4 mb-5">
                            <View className="items-end w-full mb-4">
                                <Text className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>الهدف الحالي</Text>
                                <Text className="text-sm text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{selectedChild.planTarget}</Text>
                            </View>

                            <View className="flex-row-reverse justify-between items-center w-full">
                                <View className="items-end flex-1">
                                    <Text className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>المقدار المتبقي</Text>
                                    <Text className="text-sm text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>{selectedChild.planRemaining}</Text>
                                </View>

                                <View className="w-[1px] h-8 bg-gray-100 mx-3" />

                                <View className="items-end flex-1">
                                    <Text className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>الأيام المتبقية للهدف</Text>
                                    <Text className="text-sm text-orange-500" style={{ fontFamily: 'Tajawal-Bold' }}>{selectedChild.daysRemaining} أيام</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="w-full bg-primary-light border border-primary rounded-xl items-center justify-center"
                            style={{ height: 42 }}
                        >
                            <Text className="text-primary text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>عرض التفاصيل</Text>
                        </TouchableOpacity>
                    </View>

                    {/* --- 4. Quick Stats Grid --- */}
                    <View className="flex-row-reverse justify-between gap-2">
                        <View className="flex-1 bg-card rounded-2xl p-4 shadow-sm border border-border items-center justify-center">
                            <Text className="text-2xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{selectedChild.attendance}</Text>
                            <Text className="text-[11px] text-gray-400 mt-1 text-center" style={{ fontFamily: 'Tajawal-Medium' }}>أيام الحضور</Text>
                        </View>

                        <View className="flex-1 bg-card rounded-2xl p-4 shadow-sm border border-border items-center justify-center">
                            <Text className="text-2xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>{selectedChild.points}</Text>
                            <Text className="text-[11px] text-gray-400 mt-1 text-center" style={{ fontFamily: 'Tajawal-Medium' }}>النقاط</Text>
                        </View>

                        <View className="flex-1 bg-card rounded-2xl p-4 shadow-sm border border-primary items-center justify-center">
                            <Text className="text-2xl text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>{selectedChild.rate}%</Text>
                            <Text className="text-[11px] text-gray-400 mt-1 text-center" style={{ fontFamily: 'Tajawal-Medium' }}>معدل الحفظ</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>

            <BottomNav role="parent" activeTab="home" navigation={navigation} />

        </View>
    );
}