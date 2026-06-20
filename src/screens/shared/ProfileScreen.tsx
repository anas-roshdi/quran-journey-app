import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar, Switch, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';

export default function ProfileScreen({ route, navigation }: any) {
    const userRole = route.params?.role || 'student';
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // حالة للتحكم في ظهور نافذة رمز ربط ولي الأمر
    const [isParentCodeModalVisible, setIsParentCodeModalVisible] = useState(false);
    const parentCode = "QRN-8X92"; // رمز تجريبي

    const getProfileData = () => {
        switch (userRole) {
            case 'teacher': return { name: "الشيخ محمد", email: "teacher@quran.com", badge: "معلم" };
            case 'parent': return { name: "أبو أحمد", email: "parent@example.com", badge: "ولي أمر" };
            default: return { name: "أحمد محمود", email: "ahmed@example.com", badge: "طالب" };
        }
    };
    const profileData = getProfileData();

    const SectionHeader = ({ title }: { title: string }) => (
        <View className="bg-background pt-6 pb-2 px-5">
            <Text className="text-xs text-muted text-right" style={{ fontFamily: 'Tajawal-Bold' }}>
                {title}
            </Text>
        </View>
    );

    const SettingsItem = ({ icon, label, isLast = false, onPress }: any) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`flex-row-reverse items-center bg-card px-5 py-4 ${!isLast ? 'border-b border-border' : ''}`}
        >
            <View className="w-9 h-9 rounded-lg bg-background flex items-center justify-center ml-3">
                <Feather name={icon} size={18} color="#475569" />
            </View>
            <Text className="flex-1 text-right text-foreground text-base" style={{ fontFamily: 'Tajawal-Medium' }}>
                {label}
            </Text>
            <Feather name="chevron-left" size={20} color="#cbd5e1" />
        </TouchableOpacity>
    );

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            <View className="bg-card px-5 py-4 flex-row items-center justify-center border-b border-border shadow-sm z-10">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>حسابي</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* --- Profile Summary --- */}
                <View className="bg-card items-center py-8 border-b border-border">
                    <View className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-3 border-4 border-emerald-50 shadow-sm">
                        <Feather name="user" size={32} color="#059669" />
                    </View>
                    <Text className="text-xl text-foreground mb-1" style={{ fontFamily: 'Tajawal-Bold' }}>
                        {profileData.name}
                    </Text>
                    <Text className="text-sm text-muted mb-3" style={{ fontFamily: 'Tajawal-Medium' }}>
                        {profileData.email}
                    </Text>
                    <View className="bg-primary-light border border-primary px-4 py-1 rounded-full">
                        <Text className="text-primary text-xs" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                            {profileData.badge}
                        </Text>
                    </View>
                </View>

                {/* --- Settings List --- */}
                <View className="border-b border-border">
                    <SectionHeader title="إعدادات الحساب" />
                    <SettingsItem onPress={() => navigation.navigate('EditProfile')} icon="user" label="تعديل البيانات" />
                    <SettingsItem onPress={() => navigation.navigate('ChangePassword')} icon="lock" label="تغيير كلمة المرور" isLast={true} />

                    {/* 1. Student Specific Settings */}
                    {userRole === 'student' && (
                        <>
                            <SectionHeader title="خاص بالطالب" />
                            {/* ربط شاشة الأوسمة */}
                            <SettingsItem onPress={() => navigation.navigate('Achievements')} icon="award" label="الأوسمة والإنجازات" />
                            {/* فتح النافذة المنبثقة للرمز */}
                            <SettingsItem onPress={() => setIsParentCodeModalVisible(true)} icon="link-2" label="رمز ربط ولي الأمر" isLast={true} />
                        </>
                    )}

                    {/* 2. Teacher Specific Settings */}
                    {userRole === 'teacher' && (
                        <>
                            <SectionHeader title="إدارة المعلم" />
                            <SettingsItem onPress={() => navigation.navigate('TeacherClasses')} icon="settings" label="إدارة الحلقات" />
                            <SettingsItem icon="archive" label="أرشيف التقارير" isLast={true} />
                        </>
                    )}

                    {/* 3. Parent Specific Settings */}
                    {userRole === 'parent' && (
                        <>
                            <SectionHeader title="إدارة ولي الأمر" />
                            <SettingsItem icon="users" label="إدارة الأبناء المضافين" />
                            <SettingsItem icon="mail" label="تفضيلات استلام التقارير" isLast={true} />
                        </>
                    )}

                    {/* --- Common Settings --- */}
                    <SectionHeader title="التفضيلات" />
                    <View className="flex-row-reverse items-center bg-card px-5 py-3.5 border-b border-border">
                        <View className="w-9 h-9 rounded-lg bg-background flex items-center justify-center ml-3">
                            <Feather name="bell" size={18} color="#475569" />
                        </View>
                        <Text className="flex-1 text-right text-foreground text-base" style={{ fontFamily: 'Tajawal-Medium' }}>الإشعارات</Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                            thumbColor={'#ffffff'}
                        />
                    </View>

                    <SectionHeader title="الدعم الفني" />
                    <SettingsItem icon="help-circle" label="الأسئلة الشائعة" />
                    <SettingsItem icon="message-square" label="تواصل معنا" isLast={true} />
                </View>

                {/* --- Logout Button --- */}
                <View className="mt-8 mb-4 px-5">
                    <TouchableOpacity
                        onPress={() => navigation.replace('Login')}
                        activeOpacity={0.8}
                        className="bg-card py-4 rounded-2xl border border-destructive flex-row-reverse justify-center items-center gap-2 shadow-sm"
                    >
                        <Feather name="log-out" size={18} color="#e11d48" />
                        <Text className="text-destructive text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>تسجيل الخروج</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomNav role={userRole} activeTab="profile" navigation={navigation} />

            {/* --- Parent Linking Code Modal --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isParentCodeModalVisible}
                onRequestClose={() => setIsParentCodeModalVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-center items-center px-5 bg-black/50"
                    onPress={() => setIsParentCodeModalVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <View className="bg-card w-full rounded-3xl p-6 shadow-2xl items-center">

                            <View className="w-16 h-16 bg-emerald-50 rounded-full items-center justify-center mb-4 border border-emerald-100">
                                <Feather name="link-2" size={28} color="#10b981" />
                            </View>

                            <Text className="text-xl text-foreground mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>
                                رمز ربط ولي الأمر
                            </Text>

                            <Text className="text-sm text-slate-500 text-center mb-6 leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                قم بمشاركة هذا الرمز مع ولي أمرك ليتمكن من متابعة تقدمك وتقارير حفظك داخل التطبيق.
                            </Text>

                            {/* Code Box */}
                            <View className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 items-center justify-center mb-6 border-dashed">
                                <Text className="text-3xl tracking-widest text-primary" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>
                                    {parentCode}
                                </Text>
                            </View>

                            {/* Actions */}
                            <View className="flex-row-reverse gap-3 w-full">
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    className="flex-1 bg-primary h-12 rounded-xl flex-row-reverse items-center justify-center shadow-sm"
                                >
                                    <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                        نسخ الرمز
                                    </Text>
                                    <Feather name="copy" size={16} color="white" style={{ marginRight: 8 }} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    className="flex-1 bg-white border border-gray-200 h-12 rounded-xl flex-row-reverse items-center justify-center shadow-sm"
                                >
                                    <Text className="text-slate-700 text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                        مشاركة
                                    </Text>
                                    <Feather name="share-2" size={16} color="#334155" style={{ marginRight: 8 }} />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}