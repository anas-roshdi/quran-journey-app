import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, StatusBar, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- Mock Data ---
const offlineChallenges = [
    { id: "1", title: "تحدي أكمل الآية", desc: "اختبر حفظك للجزء الثلاثون (10 أسئلة سريعة)", reward: 50, icon: "book-open", color: "#10b981", bg: "bg-emerald-50", locked: false },
    { id: "2", title: "أحكام التجويد السريعة", desc: "تحدي التعرف على أحكام النون الساكنة والتنوين", reward: 30, icon: "mic", color: "#3b82f6", bg: "bg-blue-50", locked: false },
    { id: "3", title: "تحدي معاني الكلمات", desc: "اختبر فهمك لتفسير غريب القرآن (جزء عم)", reward: 40, icon: "file-text", color: "#a855f7", bg: "bg-purple-50", locked: true },
];

const onlineChallenges = [
    {
        id: "1",
        title: "تحدي أكمل الآية",
        desc: "العب الآن ضد منافس عشوائي من نفس مستواك أو العب ضد صديق",
        reward: 100,
        icon: "zap",
        color: "#f97316",
        bg: "bg-orange-50",
        status: "يبحث عن منافس...", // تم استرجاع الحالة
        locked: false
    },
    {
        id: "2",
        title: "دوري الحلقة (فرسان القرآن)",
        desc: "مسابقة أسبوعية كبرى لجميع طلاب الحلقة",
        reward: 500,
        icon: "award",
        color: "#eab308",
        bg: "bg-yellow-50",
        status: "يبدأ غداً الساعة 5 عصراً",
        locked: true
    },
];

export default function ChallengesScreen({ navigation }: any) {
    const [activeTab, setActiveTab] = useState<'offline' | 'online'>('offline');
    const [isFriendModalVisible, setIsFriendModalVisible] = useState(false);
    const [friendCode, setFriendCode] = useState("");

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header --- */}
            <View className="flex-row items-center justify-between px-5 py-4 bg-card border-b border-border z-10">
                {/* عرض النقاط في اليسار */}
                <View className="flex-row items-center bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
                    <Feather name="star" size={14} color="#eab308" style={{ marginRight: 6 }} />
                    <Text className="text-yellow-600 text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>1,250</Text>
                </View>

                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    التحديات والمنافسات
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- Hero Card (مستوى اللاعب) --- */}
                <View className="mx-5 mt-6 bg-primary rounded-2xl p-5 shadow-sm border border-primary">
                    <View className="flex-row-reverse items-center justify-between mb-4">
                        <View className="items-end">
                            <Text className="text-emerald-100 text-xs mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>المستوى الحالي</Text>
                            <Text className="text-white text-2xl" style={{ fontFamily: 'Tajawal-Bold' }}>مبادر 🌟</Text>
                        </View>
                        <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center border-2 border-white/40">
                            <Feather name="shield" size={28} color="white" />
                        </View>
                    </View>

                    {/* شريط تقدم المستوى */}
                    <View className="w-full">
                        <View className="flex-row-reverse justify-between mb-2">
                            <Text className="text-emerald-100 text-xs" style={{ fontFamily: 'Tajawal-Medium' }}>التقدم للمستوى القادم (متقن)</Text>
                            <Text className="text-white text-xs" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>250 نقطة متبقية</Text>
                        </View>
                        <View className="w-full h-2 bg-black/20 rounded-full overflow-hidden flex-row justify-end">
                            <View className="h-full bg-white rounded-full w-3/4" />
                        </View>
                    </View>
                </View>

                {/* --- Tab Switcher --- */}
                <View className="mx-5 mt-6 bg-gray-100 p-1 rounded-xl flex-row mb-6">
                    <TouchableOpacity
                        onPress={() => setActiveTab('online')}
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'online' ? 'bg-card shadow-sm border border-border' : ''}`}
                    >
                        <View className="flex-row items-center gap-1.5">
                            <View className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
                            <Text className={`text-sm ${activeTab === 'online' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                منافسات أونلاين
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('offline')}
                        className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === 'offline' ? 'bg-card shadow-sm border border-border' : ''}`}
                    >
                        <Text className={`text-sm ${activeTab === 'offline' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                            تحديات فردية
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- Content: Offline Challenges --- */}
                {activeTab === 'offline' && (
                    <View className="px-5 space-y-4">
                        {offlineChallenges.map((challenge) => (
                            <View key={challenge.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm mb-4">
                                <View className="flex-row-reverse items-start justify-between mb-4">
                                    <View className="flex-row-reverse items-center gap-3 flex-1">
                                        <View className={`w-12 h-12 rounded-full items-center justify-center ${challenge.locked ? 'bg-gray-100' : challenge.bg}`}>
                                            <Feather name={challenge.locked ? "lock" : challenge.icon as any} size={22} color={challenge.locked ? "#9ca3af" : challenge.color} />
                                        </View>
                                        <View className="items-end flex-1 mr-1">
                                            <Text className={`text-base mb-1 text-right ${challenge.locked ? 'text-muted' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                                {challenge.title}
                                            </Text>
                                            <Text className="text-xs text-muted text-right leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                                {challenge.desc}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-row-reverse items-center justify-between mt-2">
                                    <View className="flex-row-reverse items-center bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                                        <Feather name="plus" size={12} color="#d97706" />
                                        <Text className="text-yellow-700 text-xs mr-1" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                            {challenge.reward} نقطة
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={challenge.locked ? 1 : 0.8}
                                        className={`px-6 h-11 rounded-xl flex-row-reverse items-center justify-center border ${challenge.locked ? 'bg-gray-50 border-gray-200' : 'bg-primary border-primary shadow-sm'
                                            }`}
                                    >
                                        <Text
                                            className={`text-sm ${challenge.locked ? 'text-gray-400' : 'text-white'}`}
                                            style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}
                                        >
                                            {challenge.locked ? 'قريباً' : 'ابدأ التحدي'}
                                        </Text>
                                        {!challenge.locked && <Feather name="play" size={14} color="white" style={{ marginRight: 6 }} />}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* --- Content: Online Challenges --- */}
                {activeTab === 'online' && (
                    <View className="px-5">
                        {onlineChallenges.map((challenge, index) => (
                            <React.Fragment key={challenge.id}>
                                <View className="bg-card p-5 rounded-2xl border border-border shadow-sm mb-4">
                                    <View className="flex-row-reverse items-start justify-between mb-5 border-b border-gray-50 pb-4">
                                        <View className="flex-row-reverse items-center gap-3 flex-1">
                                            <View className={`w-12 h-12 rounded-full items-center justify-center ${challenge.locked ? 'bg-gray-100' : challenge.bg}`}>
                                                <Feather name={challenge.locked ? "lock" : challenge.icon as any} size={22} color={challenge.locked ? "#9ca3af" : challenge.color} />
                                            </View>
                                            <View className="items-end flex-1 mr-1">
                                                <Text className={`text-base mb-1 text-right ${challenge.locked ? 'text-muted' : 'text-foreground'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                                    {challenge.title}
                                                </Text>
                                                <Text className="text-xs text-muted text-right leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                                    {challenge.desc}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* عرض الحالة المخصصة */}
                                    <View className="items-end w-full mb-3">
                                        <Text className="text-[10px] text-gray-400 mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>الحالة</Text>
                                        <Text className={`text-xs ${challenge.locked ? 'text-muted' : 'text-orange-600'}`} style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {challenge.status}
                                        </Text>
                                    </View>

                                    {/* الإجراءات */}
                                    {challenge.id === "1" ? (
                                        <View className="flex-row-reverse gap-3">
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                className="flex-1 h-11 rounded-xl flex-row-reverse items-center justify-center bg-orange-500 shadow-sm"
                                            >
                                                <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                                    لعب عشوائي
                                                </Text>
                                                <Feather name="zap" size={14} color="white" style={{ marginRight: 6 }} />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => setIsFriendModalVisible(true)}
                                                className="flex-1 h-11 rounded-xl flex-row-reverse items-center justify-center bg-orange-50 border border-orange-200"
                                            >
                                                <Text className="text-orange-600 text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                                    تحدي صديق
                                                </Text>
                                                <Feather name="users" size={14} color="#ea580c" style={{ marginRight: 6 }} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View className="flex-row justify-start w-full">
                                            <TouchableOpacity
                                                activeOpacity={challenge.locked ? 1 : 0.8}
                                                className={`px-8 h-11 w-full rounded-xl flex-row-reverse items-center justify-center border ${challenge.locked ? 'bg-gray-50 border-gray-200' : 'bg-orange-500 border-orange-500 shadow-sm'
                                                    }`}
                                            >
                                                <Text
                                                    className={`text-sm ${challenge.locked ? 'text-gray-400' : 'text-white'}`}
                                                    style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}
                                                >
                                                    {challenge.locked ? 'التسجيل مغلق' : 'العب الآن'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {/* الفاصل يعود هنا أسفل التحدي الأول فقط */}
                                {index === 0 && (
                                    <View className="flex-row items-center justify-center mb-5 mt-2">
                                        <View className="h-[1px] flex-1 bg-border" />
                                        <Text className="text-xs text-muted px-3" style={{ fontFamily: 'Tajawal-Medium' }}>أو شارك في البطولات</Text>
                                        <View className="h-[1px] flex-1 bg-border" />
                                    </View>
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                )}

            </ScrollView>

            {/* --- Friend Challenge Modal --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isFriendModalVisible}
                onRequestClose={() => setIsFriendModalVisible(false)}
            >
                <View
                    className="flex-1 justify-center items-center px-5"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <View className="bg-card w-full rounded-3xl p-6 shadow-lg">

                        <View className="flex-row-reverse items-center justify-between mb-6">
                            <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                                العب ضد صديق
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIsFriendModalVisible(false)}
                                className="p-2 bg-gray-50 rounded-full"
                            >
                                <Feather name="x" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-sm text-muted text-right mb-5" style={{ fontFamily: 'Tajawal-Medium', lineHeight: 22 }}>
                            أدخل كود صديقك لإرسال دعوة مباشرة، أو قم بمشاركة كودك الخاص ليلعب هو ضدك.
                        </Text>

                        {/* تم حل مشكلة قص النص هنا عبر تحديد الارتفاع وإلغاء حشوة أندرويد */}
                        <View className="bg-gray-50 border border-border rounded-xl px-4 h-12 mb-6 flex-row-reverse items-center">
                            <Feather name="hash" size={18} color="#94a3b8" />
                            <TextInput
                                placeholder="أدخل كود الصديق..."
                                placeholderTextColor="#94a3b8"
                                className="flex-1 text-right text-foreground mr-3 text-sm"
                                style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right', paddingVertical: 0 }}
                                value={friendCode}
                                onChangeText={setFriendCode}
                            />
                        </View>

                        <View className="space-y-3">
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className="w-full h-12 bg-primary rounded-xl flex-row-reverse items-center justify-center shadow-sm"
                            >
                                <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    إرسال دعوة
                                </Text>
                                <Feather name="send" size={14} color="white" style={{ marginRight: 8 }} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                className="w-full h-12 bg-white rounded-xl flex-row-reverse items-center justify-center border border-gray-200 mt-3"
                            >
                                <Text className="text-slate-700 text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    مشاركة كودي الخاص
                                </Text>
                                <Feather name="share-2" size={14} color="#334155" style={{ marginRight: 8 }} />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
}