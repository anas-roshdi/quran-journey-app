import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    onProfilePress: () => void;
    onViewAllNotifications: () => void;
    notificationCount?: number;
}

const quickNotifications = [
    { id: "1", title: "تم تقييم حفظك", desc: "حصلت على 95% في سورة النبأ", time: "الآن", isRead: false },
    { id: "2", title: "تحدي جديد متاح", desc: "هل أنت مستعد لمواجهة صديقك؟", time: "منذ ساعتين", isRead: false },
];

export default function DashboardHeader({
    title,
    subtitle,
    onProfilePress,
    onViewAllNotifications,
    notificationCount = 0
}: DashboardHeaderProps) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleViewAll = () => {
        setIsDropdownVisible(false);
        onViewAllNotifications();
    };

    return (
        <View className="flex-row-reverse items-center justify-between z-50">

            {/* --- الملف الشخصي --- */}
            <View className="flex-row-reverse items-center gap-3">
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onProfilePress}
                    className="w-12 h-12 rounded-full border-2 border-primary items-center justify-center bg-primary-light overflow-hidden"
                >
                    <Feather name="user" size={24} color="#10b981" />
                </TouchableOpacity>

                <View className="items-end">
                    <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                        {title}
                    </Text>
                    <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                        {subtitle}
                    </Text>
                </View>
            </View>

            {/* --- زر الإشعارات --- */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsDropdownVisible(true)}
                className="relative p-2 bg-background rounded-full border border-border"
            >
                <Feather name="bell" size={22} color="#475569" />
                {notificationCount > 0 && (
                    <View className="absolute top-0 right-0 bg-destructive h-4 w-4 rounded-full items-center justify-center border border-card">
                        <Text className="text-white text-[9px]" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                            {notificationCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* --- نافذة الإشعارات السريعة --- */}
            <Modal
                visible={isDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDropdownVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setIsDropdownVisible(false)}
                    className="flex-1"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
                >
                    {/* الحاوية الرئيسية للنافذة (تم تقريبها للأعلى left-4 و top-[65px]) */}
                    <TouchableOpacity
                        activeOpacity={1}
                        className="absolute top-[65px] left-4 w-64"
                        style={{ elevation: 10 }}
                    >
                        {/* المثلث الصغير الذي يشير للجرس (Pointer) */}
                        <View
                            className="absolute -top-1.5 left-4 w-4 h-4 bg-white border-t border-l border-gray-200 z-10"
                            style={{ transform: [{ rotate: '45deg' }] }}
                        />

                        {/* جسم النافذة الرئيسي */}
                        <View className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mt-1">
                            <View className="p-3 border-b border-gray-100 flex-row-reverse justify-between items-center bg-white">
                                <Text className="text-sm text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>الإشعارات الحديثة</Text>
                                <TouchableOpacity onPress={() => setIsDropdownVisible(false)} className="bg-gray-50 p-1.5 rounded-full">
                                    <Feather name="x" size={14} color="#64748b" />
                                </TouchableOpacity>
                            </View>

                            <View>
                                {quickNotifications.map((notif) => (
                                    <View key={notif.id} className="p-3 border-b border-gray-50 flex-row-reverse items-start gap-2 bg-white">
                                        <View className="w-7 h-7 rounded-full bg-primary-light items-center justify-center mt-1">
                                            <Feather name="bell" size={12} color="#10b981" />
                                        </View>
                                        <View className="flex-1 items-end">
                                            <Text className="text-xs text-foreground mb-1" style={{ fontFamily: 'Tajawal-Bold' }}>{notif.title}</Text>
                                            <Text className="text-[10px] text-muted text-right mb-1.5" style={{ fontFamily: 'Tajawal-Medium' }} numberOfLines={1}>{notif.desc}</Text>
                                            <Text className="text-[9px] text-gray-400" style={{ fontFamily: 'Tajawal-Regular' }}>{notif.time}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handleViewAll}
                                className="p-3 items-center justify-center bg-gray-50"
                            >
                                <Text className="text-primary text-xs" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>عرض جميع الإشعارات</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

        </View>
    );
}