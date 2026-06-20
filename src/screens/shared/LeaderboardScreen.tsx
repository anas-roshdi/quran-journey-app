import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';

// --- Interfaces ---
interface Student {
    rank: number;
    name: string;
    points: number;
    isCurrentUser?: boolean;
}

interface ClassLeaderboard {
    classId: string;
    className: string;
    topThree: Student[];
    others: Student[];
}

export default function LeaderboardScreen({ route, navigation }: any) {
    const userRole = route.params?.role || 'student';

    // Mock Data grouped by classes
    const leaderboardsData: ClassLeaderboard[] = [
        {
            classId: '1',
            className: 'حلقة الإمام الشاطبي',
            topThree: [
                { rank: 1, name: "عبدالله", points: 1200 },
                { rank: 2, name: "محمد", points: 1100 },
                { rank: 3, name: "يوسف", points: 1050 },
            ],
            others: [
                { rank: 4, name: "خالد العمري", points: 900 },
                { rank: 5, name: "أحمد محمود", points: 850, isCurrentUser: true },
                { rank: 6, name: "فهد السالم", points: 820 },
                { rank: 7, name: "سعود الحربي", points: 780 },
            ]
        },
        {
            classId: '2',
            className: 'حلقة التجويد',
            topThree: [
                { rank: 1, name: "أحمد محمود", points: 950, isCurrentUser: true }, // Current User is 1st!
                { rank: 2, name: "سالم", points: 890 },
                { rank: 3, name: "فيصل", points: 800 },
            ],
            others: [
                { rank: 4, name: "علي", points: 750 },
                { rank: 5, name: "عمر", points: 720 },
            ]
        }
    ];

    // State for Active Class and Dropdown Menu
    const [activeClassId, setActiveClassId] = useState<string>(leaderboardsData[0].classId);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    // Get active data
    const activeData = leaderboardsData.find(c => c.classId === activeClassId) || leaderboardsData[0];
    const currentUserData = activeData.others.find(s => s.isCurrentUser) || activeData.topThree.find(s => s.isCurrentUser);

    // --- Helper Functions for Podium Colors ---
    const getMedalColor = (rank: number) => {
        switch (rank) {
            case 1: return { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-500' };
            case 2: return { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-muted' };
            case 3: return { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-500' };
            default: return { bg: 'bg-background', border: 'border-border', text: 'text-gray-400' };
        }
    };

    const getPodiumHeight = (rank: number) => {
        switch (rank) {
            case 1: return 96;
            case 2: return 64;
            case 3: return 48;
            default: return 48;
        }
    };

    const displayOrder = [activeData.topThree[1], activeData.topThree[0], activeData.topThree[2]].filter(Boolean);

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header --- */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-center shadow-sm z-10">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>الترتيب</Text>
            </View>

            {/* --- Dropdown Modal --- */}
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
                                    <Text className="text-muted text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>اختر الحلقة</Text>
                                </View>
                                {leaderboardsData.map((cls, index) => (
                                    <TouchableOpacity
                                        key={cls.classId}
                                        onPress={() => {
                                            setActiveClassId(cls.classId);
                                            setIsDropdownVisible(false);
                                        }}
                                        className={`p-4 flex-row-reverse items-center justify-between ${index !== leaderboardsData.length - 1 ? 'border-b border-border' : ''
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

            <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>

                {/* --- Top 3 Podium Section with Integrated Dropdown --- */}
                <View className="bg-primary px-4 pt-4 pb-12 rounded-b-[40px] shadow-sm">

                    {/* Integrated Class Selector Dropdown */}
                    <TouchableOpacity
                        onPress={() => setIsDropdownVisible(true)}
                        activeOpacity={0.8}
                        className="flex-row items-center justify-center gap-2 mb-8 bg-emerald-600/50 self-center px-4 py-2 rounded-full border border-primary/50"
                    >
                        <Feather name="chevron-down" size={18} color="white" />
                        <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold' }}>
                            {activeData.className}
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-end justify-center gap-3">
                        {displayOrder.map((student) => {
                            const colors = getMedalColor(student.rank);
                            return (
                                <View key={student.rank} className="items-center flex-1">

                                    {student.rank === 1 && (
                                        <Feather name="award" size={28} color="#fbbf24" className="mb-1" />
                                    )}

                                    <View className={`rounded-full border-4 ${colors.border} ${colors.bg} items-center justify-center bg-card relative z-10 ${student.rank === 1 ? 'w-20 h-20 mb-2' : 'w-16 h-16 mb-2 mt-4'}`}>
                                        <Feather name="user" size={student.rank === 1 ? 32 : 24} color="#475569" />

                                        <View className={`absolute -bottom-3 w-7 h-7 rounded-full ${colors.bg} border-2 ${colors.border} items-center justify-center bg-card`}>
                                            <Text className={`text-xs ${colors.text}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>
                                                {student.rank}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text className="text-white text-sm mt-3 text-center" numberOfLines={1} style={{ fontFamily: 'Tajawal-Bold' }}>
                                        {student.name}
                                    </Text>

                                    {/* Highlight if current user is in Top 3 */}
                                    {student.isCurrentUser && (
                                        <View className="bg-card/20 px-2 py-0.5 rounded-full mt-1">
                                            <Text className="text-white text-[10px]" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>
                                                (أنت)
                                            </Text>
                                        </View>
                                    )}

                                    <View className="flex-row-reverse items-center justify-center gap-1 mt-1 mb-3">
                                        <Text className="text-emerald-100 text-[10px]" style={{ fontFamily: 'Tajawal-Medium' }}>{student.points} نقطة</Text>
                                    </View>

                                    <View
                                        className="w-full bg-card/20 rounded-t-xl items-center pt-3"
                                        style={{ height: getPodiumHeight(student.rank) }}
                                    >
                                        <Text className="text-white/80 text-xl" style={{ fontFamily: 'Tajawal-Bold' }}>{student.rank}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* --- Current User Highlight Card (Hidden for Teacher Role) --- */}
                {userRole !== 'teacher' && currentUserData && currentUserData.rank > 3 && (
                    <View className="px-5 -mt-6 relative z-20 mb-6">
                        <View className="bg-primary-light border-2 border-primary rounded-2xl p-4 shadow-sm">

                            <View className="absolute -top-3.5 left-0 right-0 items-center">
                                <View className="bg-primary px-4 py-1 rounded-full shadow-sm">
                                    <Text className="text-white text-xs" style={{ fontFamily: 'Tajawal-Bold' }}>
                                        {userRole === 'parent' ? 'ترتيب ابنك' : 'ترتيبك الحالي'}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row-reverse items-center justify-between mt-2">
                                <View className="flex-row-reverse items-center gap-3">
                                    <View className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                        <Text className="text-white font-bold text-lg">#{currentUserData.rank}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-foreground text-base" style={{ fontFamily: 'Tajawal-Bold' }}>{currentUserData.name}</Text>
                                        <Text className="text-primary text-xs" style={{ fontFamily: 'Tajawal-Medium' }}>استمر في التقدم!</Text>
                                    </View>
                                </View>

                                <View className="flex-row-reverse items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200">
                                    <Feather name="star" size={14} color="#d97706" />
                                    <Text className="text-amber-700 text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>
                                        {currentUserData.points} نقطة
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* --- Other Students List --- */}
                <View className={`px-5 ${(!currentUserData || currentUserData.rank <= 3 || userRole === 'teacher') ? 'mt-8' : ''}`}>
                    <Text className="text-slate-700 text-sm mb-4 text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                        {userRole === 'teacher' ? 'قائمة الطلاب' : 'المتصدرون الآخرون'}
                    </Text>

                    <View className="space-y-3">
                        {activeData.others.map((student) => (
                            <View
                                key={student.rank}
                                className={`bg-card rounded-xl p-3 shadow-sm flex-row-reverse items-center justify-between border ${student.isCurrentUser ? 'border-primary bg-primary-light/30' : 'border-border'}`}
                            >
                                <View className="flex-row-reverse items-center gap-3">
                                    <View className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                                        <Text className="text-muted text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>{student.rank}</Text>
                                    </View>
                                    <View className="w-10 h-10 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center">
                                        <Feather name="user" size={18} color="#94a3b8" />
                                    </View>
                                    <Text className="text-foreground text-sm" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        {student.name} {student.isCurrentUser && userRole === 'student' && '(أنت)'}
                                    </Text>
                                </View>

                                <View className="flex-row-reverse items-center gap-1">
                                    <Feather name="star" size={14} color="#fbbf24" />
                                    <Text className="text-slate-600 text-sm" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        {student.points} نقطة
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>

            <BottomNav role={userRole} activeTab="leaderboard" navigation={navigation} />

        </View>
    );
}