import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';
import DashboardHeader from '../../components/DashboardHeader'; // استيراد الشريط الموحد

export default function DashboardScreen({ navigation }: any) {
    const [classState, setClassState] = useState('ACTIVE');
    const [reviewType, setReviewType] = useState('RANGE');

    const toggleClassState = () => {
        if (classState === 'ACTIVE') setClassState('WAITING');
        else if (classState === 'WAITING') setClassState('OFFLINE');
        else setClassState('ACTIVE');
    };

    const toggleReviewType = () => {
        if (reviewType === 'RANGE') setReviewType('MULTIPLE');
        else if (reviewType === 'MULTIPLE') setReviewType('TEXT');
        else setReviewType('RANGE');
    };

    // --- دوال الانتقال الخاصة بالشريط العلوي ---
    const handleProfilePress = () => {
        navigation.navigate('Profile', { role: 'student' });
    };


    const reviewRanges = [
        { start: 'سورة الناس', end: 'سورة العصر' },
        { start: 'سورة المرسلات', end: 'سورة المدثر' }
    ];
    const reviewSurahs = ['سورة يس', 'سورة الصافات', 'سورة ص', 'سورة الزمر'];

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header Section (Reusable Component) --- */}
            {/* وضعنا المكون داخل حاوية للحفاظ على شكل الشريط العلوي المتميز بخلفيته البيضاء والظل */}
            <View className="bg-card px-5 py-4 shadow-sm border-b border-border z-10">
                <DashboardHeader
                    title="السلام عليكم، أحمد"
                    subtitle="مستعد لإنجاز اليوم؟"
                    notificationCount={2}
                    onProfilePress={handleProfilePress}
                    onViewAllNotifications={() => navigation.navigate('Notifications')}
                />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* --- Main Dashboard Content --- */}
                <View className="px-5 py-6">

                    {/* 1. Gamification Hero Card */}
                    <View className="bg-primary rounded-2xl p-5 shadow-lg shadow-emerald-200 flex-row justify-between items-center mb-6">
                        <View className="items-center flex-1">
                            <Feather name="award" size={24} color="white" className="mb-2" />
                            <Text className="text-xl text-white mt-1" style={{ fontFamily: 'Tajawal-Bold' }}>مبادر</Text>
                            <Text className="text-xs text-emerald-100 mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>المستوى</Text>
                        </View>
                        <View className="w-[1px] h-12 bg-emerald-400" />
                        <View className="items-center flex-1">
                            <Feather name="zap" size={24} color="white" className="mb-2" />
                            <Text className="text-xl text-white mt-1" style={{ fontFamily: 'Tajawal-Bold' }}>7 أيام</Text>
                            <Text className="text-xs text-emerald-100 mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>الاستمرارية</Text>
                        </View>
                        <View className="w-[1px] h-12 bg-emerald-400" />
                        <View className="items-center flex-1">
                            <Feather name="star" size={24} color="white" className="mb-2" />
                            <Text className="text-xl text-white mt-1" style={{ fontFamily: 'Tajawal-Bold' }}>1,250</Text>
                            <Text className="text-xs text-emerald-100 mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>نقطة</Text>
                        </View>
                    </View>

                    {/* 2. Daily Task Card */}
                    <View className="bg-card rounded-2xl shadow-sm p-6 mb-6 border border-border">

                        <View className="flex-row-reverse items-center justify-between mb-5 border-b border-border pb-3">
                            <TouchableOpacity onPress={toggleClassState} activeOpacity={0.7} className="flex-1">
                                <Text className="text-lg text-right text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    ورد الحفظ اليومي
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleReviewType} activeOpacity={0.7}>
                                <Feather name="sliders" size={18} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        {/* Lesson Area */}
                        <View className="flex-row-reverse items-start mb-4">
                            <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center ml-3">
                                <Feather name="book-open" size={18} color="#059669" />
                            </View>
                            <View className="flex-1 pb-4 border-b border-border">
                                <Text className="text-right text-foreground text-sm mb-1" style={{ fontFamily: 'Tajawal-Bold' }}>الدرس الجديد</Text>
                                <Text className="text-right text-muted text-sm" style={{ fontFamily: 'Tajawal-Medium' }}>سورة الملك (الآيات 1 - 15)</Text>
                            </View>
                        </View>

                        {/* Review Area */}
                        <View className="flex-row-reverse items-start mb-6">
                            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center ml-3">
                                <Feather name="refresh-cw" size={18} color="#3b82f6" />
                            </View>
                            <View className="flex-1 pt-1">
                                <Text className="text-right text-foreground text-sm mb-1" style={{ fontFamily: 'Tajawal-Bold' }}>المراجعة</Text>

                                {reviewType === 'RANGE' && (
                                    <View className="mt-1">
                                        {reviewRanges.map((range, index) => (
                                            <View key={index} className="flex-row-reverse items-center justify-start mb-1">
                                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal-Medium' }}>{range.start}</Text>
                                                <Feather name="arrow-left" size={14} color="#d1d5db" className="mx-2" />
                                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal-Medium' }}>{range.end}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {reviewType === 'MULTIPLE' && (
                                    <View className="flex-row flex-wrap justify-end gap-1.5 mt-1">
                                        {reviewSurahs.map((surah, index) => (
                                            <View key={index} className="bg-background border border-border rounded-md px-2 py-1">
                                                <Text className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal-Medium' }}>{surah}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {reviewType === 'TEXT' && (
                                    <Text className="text-right text-gray-600 text-sm mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        الجزء التاسع والعشرون (كامل)
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Dynamic Class Button */}
                        {classState === 'ACTIVE' && (
                            <TouchableOpacity className="w-full bg-primary-light py-3.5 rounded-xl flex-row items-center justify-center gap-2 border border-primary">
                                <View className="bg-primary rounded-full p-1.5">
                                    <Feather name="mic" size={14} color="white" />
                                </View>
                                <Text className="text-primary text-base ml-1" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    دخول حلقة التسميع
                                </Text>
                            </TouchableOpacity>
                        )}

                        {classState === 'WAITING' && (
                            <View className="w-full bg-background py-3 rounded-xl flex-row items-center justify-center gap-2 border border-border">
                                <Feather name="clock" size={18} color="#9ca3af" />
                                <Text className="text-muted text-sm ml-1" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    يبدأ التسميع الساعة 4:00 عصراً
                                </Text>
                            </View>
                        )}

                        {classState === 'OFFLINE' && (
                            <View className="w-full bg-blue-50 py-3 rounded-xl flex-row items-center justify-center gap-2 border border-blue-100">
                                <Feather name="map-pin" size={18} color="#3b82f6" />
                                <Text className="text-blue-700 text-sm ml-1" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    هذه الحلقة حضورية (في المسجد)
                                </Text>
                            </View>
                        )}

                    </View>

                    {/* 3. Weekly Progress Section */}
                    <View className="bg-card rounded-xl shadow-sm p-5 border border-border mb-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-sm text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>80%</Text>
                            <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>إنجاز الأسبوع</Text>
                        </View>
                        <View className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex-row justify-end">
                            <View className="h-full bg-primary rounded-full w-4/5" />
                        </View>
                        <Text className="text-xs text-right text-muted mt-3" style={{ fontFamily: 'Tajawal-Regular' }}>
                            أكملت 4 من 5 أوراد هذا الأسبوع
                        </Text>
                    </View>

                    {/* 4. Quick Actions Grid */}
                    <Text className="text-lg text-right text-foreground mb-4" style={{ fontFamily: 'Tajawal-Bold' }}>
                        الوصول السريع
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                        <TouchableOpacity onPress={() => navigation.navigate('LearnTajweed')} className="bg-card w-[48%] p-4 rounded-xl shadow-sm border border-border items-center mb-4">
                            <View className="bg-blue-50 p-3 rounded-full mb-3">
                                <Feather name="headphones" size={24} color="#3b82f6" />
                            </View>
                            <Text className="text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تعلم التجويد</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Tests')} className="bg-card w-[48%] p-4 rounded-xl shadow-sm border border-border items-center mb-4">
                            <View className="bg-purple-50 p-3 rounded-full mb-3">
                                <Feather name="file-text" size={24} color="#a855f7" />
                            </View>
                            <Text className="text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>الاختبارات</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('MemorizationPlan')} className="bg-card w-[48%] p-4 rounded-xl shadow-sm border border-border items-center mb-4">
                            <View className="bg-orange-50 p-3 rounded-full mb-3">
                                <Feather name="map" size={24} color="#f97316" />
                            </View>
                            <Text className="text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>خطة الحفظ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Challenges')} className="bg-card w-[48%] p-4 rounded-xl shadow-sm border border-border items-center mb-4">
                            <View className="bg-destructive-light p-3 rounded-full mb-3">
                                <Feather name="target" size={24} color="#f43f5e" />
                            </View>
                            <Text className="text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>التحديات</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

            {/* --- Bottom Navigation Bar --- */}
            <BottomNav role="student" activeTab="home" navigation={navigation} />

        </View>
    );
}