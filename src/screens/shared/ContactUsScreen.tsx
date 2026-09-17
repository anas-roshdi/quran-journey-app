import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function ContactUsScreen({ navigation }: any) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const handleSendMessage = () => {
        if (!subject || !message) return;
        // API Call to send message goes here
        setIsSuccessModalVisible(true);
    };

    const handleSuccessConfirm = () => {
        setIsSuccessModalVisible(false);
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="bg-card px-5 py-4 flex-row-reverse items-center justify-between border-b border-border shadow-sm z-10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-background rounded-full border border-border active:opacity-70">
                    <Feather color="#0f172a" name="chevron-right" size={24} />
                </TouchableOpacity>
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تواصل معنا</Text>
                <View className="w-10" />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    
                    {/* Quick Contact Cards */}
                    <View className="flex-row-reverse gap-3 mb-8 mt-2">
                        <TouchableOpacity activeOpacity={0.7} className="flex-1 bg-emerald-50 rounded-2xl p-4 items-center justify-center border border-emerald-100">
                            <Feather className="mb-2" color="#059669" name="message-circle" size={24} />
                            <Text className="text-emerald-700 text-sm mt-2" style={{ fontFamily: 'Tajawal-Bold' }}>واتساب</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} className="flex-1 bg-blue-50 rounded-2xl p-4 items-center justify-center border border-blue-100">
                            <Feather className="mb-2" color="#2563eb" name="mail" size={24} />
                            <Text className="text-blue-700 text-sm mt-2" style={{ fontFamily: 'Tajawal-Bold' }}>البريد</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} className="flex-1 bg-orange-50 rounded-2xl p-4 items-center justify-center border border-orange-100">
                            <Feather className="mb-2" color="#ea580c" name="phone-call" size={24} />
                            <Text className="text-orange-700 text-sm mt-2" style={{ fontFamily: 'Tajawal-Bold' }}>اتصال</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-lg text-foreground text-right mb-4" style={{ fontFamily: 'Tajawal-Bold' }}>إرسال رسالة</Text>
                    
                    {/* Form */}
                    <View className="space-y-4">
                        <View className="w-full">
                            <Text className="text-sm text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>الموضوع</Text>
                            <TextInput className="w-full h-12 bg-card border border-border rounded-xl px-4 text-right text-foreground" style={{ fontFamily: 'Tajawal-Medium' }} onChangeText={setSubject} placeholder="سبب التواصل (مثال: مشكلة تقنية، استفسار)" placeholderTextColor="#94a3b8" value={subject} />
                        </View>

                        <View className="w-full mt-4">
                            <Text className="text-sm text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>الرسالة</Text>
                            <TextInput className="w-full h-32 bg-card border border-border rounded-xl px-4 py-3 text-right text-foreground" style={{ fontFamily: 'Tajawal-Medium' }} multiline onChangeText={setMessage} placeholder="اكتب رسالتك هنا بوضوح..." placeholderTextColor="#94a3b8" textAlignVertical="top" value={message} />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity disabled={!subject || !message} activeOpacity={0.8} className={`w-full flex-row-reverse h-14 items-center justify-center mt-8 rounded-xl shadow-sm ${subject && message ? 'bg-primary' : 'bg-primary/50'}`} onPress={handleSendMessage}>
                        <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>إرسال الرسالة</Text>
                        <Feather className="mr-2" color="white" name="send" size={18} />
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success Modal */}
            <Modal animationType="fade" onRequestClose={() => setIsSuccessModalVisible(false)} transparent={true} visible={isSuccessModalVisible}>
                <View className="flex-1 justify-center items-center px-6 bg-black/50">
                    <View className="bg-card w-full rounded-3xl p-6 items-center shadow-2xl">
                        <View className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full items-center justify-center mb-5">
                            <Feather color="#10b981" name="check" size={40} />
                        </View>
                        <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>تم إرسال رسالتك بنجاح</Text>
                        <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                            شكراً لتواصلك معنا. سيقوم فريق الدعم بمراجعة رسالتك والرد عليك في أقرب وقت ممكن.
                        </Text>
                        <TouchableOpacity activeOpacity={0.8} className="w-full h-12 bg-primary rounded-xl items-center justify-center shadow-sm" onPress={handleSuccessConfirm}>
                            <Text className="text-white text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>العودة للإعدادات</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
