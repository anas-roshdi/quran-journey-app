import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Mock Data for Achievements
const userStats = {
    totalPoints: 1250,
    rank: 'مبادر 🌟',
    completedBadges: 4,
    totalBadges: 12
};

const badges = [
    { id: '1', title: 'البداية الموفقة', desc: 'حضور أول حلقة بنجاح', icon: 'flag', color: '#10b981', bg: 'bg-emerald-50', unlocked: true },
    { id: '2', title: 'حافظ جزء عم', desc: 'إتمام حفظ الجزء الثلاثون', icon: 'book-open', color: '#f59e0b', bg: 'bg-amber-50', unlocked: true },
    { id: '3', title: 'نجم الأسبوع', desc: 'الحصول على أعلى تقييم في الحلقة', icon: 'star', color: '#3b82f6', bg: 'bg-blue-50', unlocked: true },
    { id: '4', title: 'المواظب', desc: 'حضور 10 حلقات متتالية بدون غياب', icon: 'calendar', color: '#a855f7', bg: 'bg-purple-50', unlocked: true },
    { id: '5', title: 'الصوت الندي', desc: 'إتقان مخارج الحروف والتجويد', icon: 'mic', color: '#94a3b8', bg: 'bg-gray-100', unlocked: false },
    { id: '6', title: 'حافظ الزهراوين', desc: 'إتمام حفظ سورتي البقرة وآل عمران', icon: 'award', color: '#94a3b8', bg: 'bg-gray-100', unlocked: false },
    { id: '7', title: 'الرفيق الصالح', desc: 'دعوة صديق للتطبيق بنجاح', icon: 'users', color: '#94a3b8', bg: 'bg-gray-100', unlocked: false },
    { id: '8', title: 'ختمة القرآن', desc: 'إتمام حفظ القرآن الكريم كاملاً', icon: 'sun', color: '#94a3b8', bg: 'bg-gray-100', unlocked: false },
];

export default function AchievementsScreen({ navigation }: any) {
    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header --- */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-between border-b border-border z-10">
                <View className="w-10" />
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    الأوسمة والإنجازات
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- Hero Stats Section --- */}
                <View className="mx-5 mt-6 bg-primary rounded-3xl p-6 shadow-md shadow-primary/30 items-center border border-primary-light">
                    <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3 border-2 border-white/40">
                        <Feather name="award" size={32} color="white" />
                    </View>
                    <Text className="text-white text-3xl mb-1" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>
                        {userStats.totalPoints} <Text className="text-lg text-emerald-100">نقطة</Text>
                    </Text>
                    <Text className="text-emerald-50 text-sm mb-4" style={{ fontFamily: 'Tajawal-Medium' }}>
                        المستوى الحالي: {userStats.rank}
                    </Text>

                    {/* Progress Bar for Badges */}
                    <View className="w-full bg-black/20 rounded-2xl p-4 mt-2">
                        <View className="flex-row-reverse justify-between mb-2">
                            <Text className="text-white text-xs" style={{ fontFamily: 'Tajawal-Bold' }}>الأوسمة المكتسبة</Text>
                            <Text className="text-emerald-100 text-xs" style={{ fontFamily: 'Tajawal-Bold' }}>
                                {userStats.completedBadges} من {userStats.totalBadges}
                            </Text>
                        </View>
                        <View className="w-full h-2 bg-black/30 rounded-full overflow-hidden flex-row justify-end">
                            <View
                                className="h-full bg-white rounded-full"
                                style={{ width: `${(userStats.completedBadges / userStats.totalBadges) * 100}%` }}
                            />
                        </View>
                    </View>
                </View>

                {/* --- Badges Grid Section --- */}
                <View className="px-5 mt-8">
                    <Text className="text-base text-foreground mb-4 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                        لوحة الأوسمة
                    </Text>

                    <View className="flex-row-reverse flex-wrap justify-between">
                        {badges.map((badge) => (
                            <View
                                key={badge.id}
                                className={`w-[48%] bg-card rounded-2xl p-4 mb-4 border items-center text-center shadow-sm ${badge.unlocked ? 'border-border' : 'border-gray-100 opacity-60'
                                    }`}
                            >
                                {/* Lock Overlay for locked badges */}
                                {!badge.unlocked && (
                                    <View className="absolute top-2 right-2">
                                        <Feather name="lock" size={12} color="#cbd5e1" />
                                    </View>
                                )}

                                <View className={`w-14 h-14 rounded-full items-center justify-center mb-3 border ${badge.bg} ${badge.unlocked ? 'border-transparent' : 'border-gray-200'
                                    }`}>
                                    <Feather name={badge.icon as any} size={24} color={badge.color} />
                                </View>

                                <Text className="text-sm text-foreground text-center mb-1" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    {badge.title}
                                </Text>
                                <Text className="text-[10px] text-muted text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                    {badge.desc}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}