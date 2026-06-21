import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BottomNavProps {
    role: 'student' | 'teacher' | 'parent';
    activeTab: 'home' | 'classes' | 'quran' | 'leaderboard' | 'profile' | 'requests' | 'tests' | 'children' | 'reports';
    navigation: any;
}

export default function BottomNav({ role, activeTab, navigation }: BottomNavProps) {

    // Color and font configuration helpers to keep layouts visually stable
    const getIconColor = (tabName: string) => activeTab === tabName ? '#10b981' : '#9ca3af';
    const getTextColor = (tabName: string) => activeTab === tabName ? 'text-primary' : 'text-gray-400';
    const getFontFamily = (tabName: string) => activeTab === tabName ? 'Tajawal-Bold' : 'Tajawal-Medium';

    return (
        <View className={`absolute bottom-0 left-0 right-0 bg-background border-t border-border flex-row justify-around items-center px-1 py-2 ${Platform.OS === 'ios' ? 'pb-8' : 'pb-3'}`}>

            {/* 1. Profile */}
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { role })} className="items-center justify-center flex-1">
                <Feather name="user" size={22} color={getIconColor('profile')} />
                <Text className={`text-[10px] mt-1 ${getTextColor('profile')}`} style={{ fontFamily: getFontFamily('profile') }}>حسابي</Text>
            </TouchableOpacity>

            {/* STUDENT TABS */}
            {role === 'student' && (
                <>
                    <TouchableOpacity onPress={() => navigation.navigate('MyClasses', { role: 'student' })} className="items-center justify-center flex-1">
                        <Feather name="users" size={22} color={getIconColor('classes')} />
                        <Text className={`text-[10px] mt-1 ${getTextColor('classes')}`} style={{ fontFamily: getFontFamily('classes') }}>حلقاتي</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={() => navigation.navigate('QuranReader')} className="items-center justify-center flex-1 -mt-5">
                        <View className={`w-14 h-14 rounded-full items-center justify-center shadow-lg border-4 border-border ${activeTab === 'quran' ? 'bg-emerald-600 shadow-emerald-400' : 'bg-primary shadow-emerald-300'}`}>
                            <Feather name="book-open" size={24} color="white" />
                        </View>
                        <Text className="text-[11px] text-primary mt-1" style={{ fontFamily: 'Tajawal-Bold' }}>المصحف</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')} className="items-center justify-center flex-1">
                        <Feather name="award" size={22} color={getIconColor('leaderboard')} />
                        <Text className={`text-[10px] mt-1 ${getTextColor('leaderboard')}`} style={{ fontFamily: getFontFamily('leaderboard') }}>الترتيب</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* TEACHER TABS */}
            {role === 'teacher' && (
                <>
                    <TouchableOpacity onPress={() => navigation.navigate('JoinRequests')} className="items-center justify-center flex-1">
                        <View className="items-center justify-center">
                            <View className="relative w-8 h-6 items-center justify-center">
                                <Feather name="clipboard" size={22} color={getIconColor('requests')} />
                                <View className="absolute -top-1 -right-1.5 bg-red-500 h-4 w-4 rounded-full items-center justify-center border border-white">
                                    <Text className="text-white text-[8px]" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 1 }}>3</Text>
                                </View>
                            </View>
                        </View>
                        <Text className={`text-[10px] mt-1 ${getTextColor('requests')}`} style={{ fontFamily: getFontFamily('requests') }}>الطلبات</Text>
                    </TouchableOpacity>

                    {/* تم استبدال 'حلقاتي' بـ 'الاختبارات' */}
                    <TouchableOpacity onPress={() => navigation.navigate('TeacherTests')} className="items-center justify-center flex-1">
                        <Feather name="check-square" size={22} color={getIconColor('tests')} />
                        <Text className={`text-[10px] mt-1 ${getTextColor('tests')}`} style={{ fontFamily: getFontFamily('tests') }}>الاختبارات</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* PARENT TABS */}
            {role === 'parent' && (
                <>
                    <TouchableOpacity onPress={() => navigation.navigate('ParentReports')} className="items-center justify-center flex-1">
                        <Feather name="file-text" size={22} color={getIconColor('reports')} />
                        <Text className={`text-[10px] mt-1 ${getTextColor('reports')}`} style={{ fontFamily: getFontFamily('reports') }}>التقارير</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('MyChildren')} className="items-center justify-center flex-1">
                        <Feather name="users" size={22} color={getIconColor('children')} />
                        <Text className={`text-[10px] mt-1 ${getTextColor('children')}`} style={{ fontFamily: getFontFamily('children') }}>الأبناء</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* 3. Home */}
            <TouchableOpacity
                onPress={() => {
                    if (role === 'teacher') navigation.navigate('TeacherDashboard');
                    else if (role === 'parent') navigation.navigate('ParentDashboard');
                    else navigation.navigate('Dashboard');
                }}
                className="items-center justify-center flex-1"
            >
                <Feather name="home" size={22} color={getIconColor('home')} />
                <Text className={`text-[10px] mt-1 ${getTextColor('home')}`} style={{ fontFamily: getFontFamily('home') }}>الرئيسية</Text>
            </TouchableOpacity>

        </View>
    );
}