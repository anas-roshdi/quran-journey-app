import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";

const allNotifications = [
    { id: "1", type: "evaluation", title: "تم تقييم حفظك", desc: "أكملت سورة النبأ بتقييم 95%. المعلم ترك لك ملاحظة صوتية.", time: "منذ 10 دقائق", isRead: false },
    { id: "2", type: "challenge", title: "تحدي جديد بانتظارك", desc: "صديقك محمد أرسل لك دعوة لتحدي إكمال الآية.", time: "منذ ساعتين", isRead: false },
    { id: "3", type: "reminder", title: "تذكير بورد اليوم", desc: "لا تنسَ مراجعة الجزء الثامن والعشرين هذا المساء.", time: "أمس، 04:00 عصراً", isRead: true },
    { id: "4", type: "system", title: "ترقية المستوى", desc: "مبارك! لقد وصلت إلى مستوى (متقن) وكسبت 500 نقطة.", time: "منذ يومين", isRead: true },
    { id: "5", type: "schedule", title: "موعد اختبار شفوي", desc: "تم تأكيد موعد اختبارك غداً الساعة 5 عصراً بتوقيت مكة.", time: "منذ 3 أيام", isRead: true },
];

export default function NotificationsScreen({ navigation }: any) {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifs = filter === 'all'
        ? allNotifications
        : allNotifications.filter(n => !n.isRead);

    const getNotificationStyle = (type: string) => {
        switch (type) {
            case 'evaluation': return { icon: 'star', color: '#10b981', bg: 'bg-emerald-50' };
            case 'challenge': return { icon: 'zap', color: '#f97316', bg: 'bg-orange-50' };
            case 'schedule': return { icon: 'calendar', color: '#3b82f6', bg: 'bg-blue-50' };
            case 'system': return { icon: 'award', color: '#a855f7', bg: 'bg-purple-50' };
            default: return { icon: 'bell', color: '#64748b', bg: 'bg-gray-100' };
        }
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            <View className="flex-row items-center justify-between px-5 py-4 bg-card border-b border-border z-10">
                <View className="w-10" />
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    الإشعارات
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                <View className="mx-5 pt-6 flex-row-reverse gap-3 mb-6">
                    <TouchableOpacity
                        onPress={() => setFilter('all')}
                        className={`px-6 py-2.5 rounded-full border ${filter === 'all' ? 'bg-primary border-primary shadow-sm' : 'bg-card border-border'}`}
                    >
                        <Text className={`text-sm ${filter === 'all' ? 'text-white' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>الكل</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFilter('unread')}
                        className={`px-6 py-2.5 rounded-full border ${filter === 'unread' ? 'bg-primary border-primary shadow-sm' : 'bg-card border-border'}`}
                    >
                        <Text className={`text-sm ${filter === 'unread' ? 'text-white' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>غير مقروءة</Text>
                    </TouchableOpacity>
                </View>

                <View className="px-5">
                    {filteredNotifs.length > 0 ? (
                        filteredNotifs.map((notif) => {
                            const style = getNotificationStyle(notif.type);

                            // تعديل الحواف والخلفية لتبدو مفصولة ومنظمة
                            // غير مقروء: أبيض + ظل | مقروء: رمادي فاتح (نفس لون الشاشة) + حدود رمادية تفصلها
                            const cardBg = notif.isRead
                                ? 'bg-transparent border-gray-200'
                                : 'bg-card border-border shadow-sm';

                            return (
                                <TouchableOpacity
                                    key={notif.id}
                                    activeOpacity={0.7}
                                    className={`flex-row-reverse items-start p-4 mb-3 rounded-2xl border ${cardBg}`}
                                >
                                    <View className={`w-12 h-12 rounded-full items-center justify-center ml-3 ${style.bg}`}>
                                        <Feather name={style.icon as any} size={20} color={style.color} />
                                    </View>

                                    <View className="flex-1 items-end">
                                        <View className="flex-row-reverse items-center justify-between w-full mb-1">
                                            <Text className={`text-sm flex-1 text-right ${notif.isRead ? 'text-slate-600' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                                {notif.title}
                                            </Text>
                                            {!notif.isRead && <View className="w-2.5 h-2.5 bg-primary rounded-full ml-2" />}
                                        </View>
                                        <Text className={`text-xs text-right leading-relaxed mb-2 ${notif.isRead ? 'text-slate-400' : 'text-slate-500'}`} style={{ fontFamily: 'Tajawal-Medium' }}>
                                            {notif.desc}
                                        </Text>
                                        <View className="flex-row-reverse items-center gap-1">
                                            <Feather name="clock" size={10} color="#9ca3af" />
                                            <Text className="text-[10px] text-gray-400" style={{ fontFamily: 'Tajawal-Regular' }}>{notif.time}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    ) : (
                        <View className="items-center justify-center py-20">
                            <Feather name="bell-off" size={40} color="#cbd5e1" className="mb-4" />
                            <Text className="text-muted text-base" style={{ fontFamily: 'Tajawal-Medium' }}>
                                لا توجد إشعارات حالياً
                            </Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}