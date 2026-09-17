import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, LayoutAnimation, UIManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FaqScreen({ navigation }: any) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const faqs = [
        { id: '1', question: 'كيف يمكنني إضافة ابني لمتابعة حفظه؟', answer: 'يمكنك إضافة ابنك من خلال الذهاب إلى شاشة "متابعة الأبناء"، والنقر على "إضافة ابن جديد"، ثم إدخال رمز الربط الخاص به والذي يحصل عليه من حسابه.' },
        { id: '2', question: 'كيف أحصل على نقاط وأوسمة في التطبيق؟', answer: 'يحصل الطالب على النقاط والأوسمة بناءً على التزامه بالحضور، إتقان الحفظ، واجتياز الاختبارات. المعلم هو من يقوم بتقييم ومنح هذه النقاط.' },
        { id: '3', question: 'ماذا أفعل إذا نسيت كلمة المرور؟', answer: 'يمكنك النقر على "نسيت كلمة المرور" في شاشة تسجيل الدخول، وسيتم إرسال رمز تحقق إلى بريدك الإلكتروني لتعيين كلمة مرور جديدة.' },
        { id: '4', question: 'هل يمكنني التواصل مع المعلم مباشرة؟', answer: 'نعمل حالياً على إضافة ميزة المحادثات المباشرة. في الوقت الحالي، يمكنك متابعة ملاحظات المعلم اليومية من خلال سجل التقييم.' },
    ];

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="bg-card px-5 py-4 flex-row-reverse items-center justify-between border-b border-border shadow-sm z-10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-background rounded-full border border-border active:opacity-70">
                    <Feather color="#0f172a" name="chevron-right" size={24} />
                </TouchableOpacity>
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>الأسئلة الشائعة</Text>
                <View className="w-10" />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                <View className="items-center mb-8 mt-4">
                    <View className="w-20 h-20 bg-primary-light rounded-full items-center justify-center mb-4">
                        <Feather color="#059669" name="help-circle" size={36} />
                    </View>
                    <Text className="text-xl text-foreground text-center mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>كيف يمكننا مساعدتك؟</Text>
                    <Text className="text-sm text-slate-500 text-center" style={{ fontFamily: 'Tajawal-Medium' }}>ابحث عن إجابات لاستفساراتك الشائعة هنا</Text>
                </View>

                <View className="space-y-4">
                    {faqs.map((faq) => (
                        <View className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm" key={faq.id}>
                            <TouchableOpacity onPress={() => toggleExpand(faq.id)} 
                                activeOpacity={0.7} 
                                className="flex-row-reverse items-center justify-between p-4 bg-card"
                            >
                                <Text className="text-base text-foreground flex-1 text-right ml-4" style={{ fontFamily: 'Tajawal-Bold' }}>
                                    {faq.question}
                                </Text>
                                <Feather name={expandedId === faq.id ? "chevron-up" : "chevron-down"} color="#64748b" size={20} />
                            </TouchableOpacity>
                            {expandedId === faq.id && (
                                <View className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
                                    <Text className="text-sm text-slate-600 text-right leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        {faq.answer}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
