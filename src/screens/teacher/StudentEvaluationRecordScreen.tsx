import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

// --- Mock Data Interfaces ---
interface TestRecord {
    id: string;
    testTitle: string;
    amount: string;
    date: string;
    score: number; // النسبة المئوية
    status: 'ممتاز' | 'جيد جداً' | 'جيد' | 'إعادة';
}

// --- Mock Data ---
const studentTestHistory: TestRecord[] = [
    {
        id: 't3',
        testTitle: 'اختبار سورة تبارك',
        amount: 'نصف جزء',
        date: '28 مايو 2026',
        score: 98,
        status: 'ممتاز',
    },
    {
        id: 't4',
        testTitle: 'اختبار الزهراوين (البقرة وآل عمران)',
        amount: 'جزأين ونصف',
        date: '25 مايو 2026',
        score: 85,
        status: 'جيد جداً',
    },
    {
        id: 't1',
        testTitle: 'اختبار نهاية الجزء الثلاثون (عمّ)',
        amount: 'جزء كامل',
        date: '15 أبريل 2026',
        score: 95,
        status: 'ممتاز',
    },
];

export default function StudentEvaluationRecordScreen({ route, navigation }: any) {
    // استلام بيانات الطالب من الشاشة السابقة أو استخدام بيانات افتراضية
    const student = route?.params?.student || { name: 'عمر خالد عبدالله' };

    // دالة لتحديد لون حالة الاختبار
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'ممتاز': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'جيد جداً': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'جيد': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'إعادة': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}>

            {/* --- Header --- */}
            <View className="bg-card px-5 py-4 flex-row-reverse items-center justify-between border-b border-border shadow-sm z-10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-background rounded-full border border-border active:opacity-70">
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>سجل التقييم والاختبارات</Text>
                    <Text className="text-xs text-primary mt-1" style={{ fontFamily: 'Tajawal-Medium' }}>{student.name}</Text>
                </View>
                <View className="w-10" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- Section Title with Badge --- */}
                <View className="px-5 mt-6 mb-4 flex-row-reverse items-center justify-between">
                    <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>السجل التاريخي للاختبارات</Text>
                    <View className="bg-primary-light px-2.5 py-1 rounded-full border border-primary/20">
                        <Text className="text-primary text-[11px]" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                            {studentTestHistory.length} اختبارات
                        </Text>
                    </View>
                </View>

                {/* --- Tests Timeline List --- */}
                <View className="px-5 space-y-4">
                    {studentTestHistory.map((test) => {
                        const statusStyle = getStatusStyle(test.status);

                        return (
                            <View key={test.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">

                                {/* Header Row: Title & Score */}
                                <View className="flex-row-reverse items-start justify-between mb-4 border-b border-gray-50 pb-4">
                                    <View className="flex-1 items-end pl-2">
                                        <Text className="text-base text-foreground text-right leading-relaxed mb-1" style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {test.testTitle}
                                        </Text>
                                        <Text className="text-xs text-muted text-right" style={{ fontFamily: 'Tajawal-Medium' }}>
                                            المقدار: {test.amount}
                                        </Text>
                                    </View>

                                    {/* Score Circular Badge */}
                                    <View className="items-center justify-center bg-gray-50 border border-gray-100 w-12 h-12 rounded-full flex-shrink-0">
                                        <Text className="text-primary" style={{ fontFamily: 'Tajawal-Bold', fontSize: 16, includeFontPadding: false }}>
                                            {test.score}%
                                        </Text>
                                    </View>
                                </View>

                                {/* Footer Row: Date & Status */}
                                <View className="flex-row-reverse items-center justify-between">
                                    <View className="flex-row-reverse items-center gap-2">
                                        <View className="w-7 h-7 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                                            <Feather name="calendar" size={12} color="#94a3b8" />
                                        </View>
                                        <Text className="text-sm text-slate-700" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>
                                            {test.date}
                                        </Text>
                                    </View>

                                    <View className={`px-3 py-1 rounded-full border ${statusStyle.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('border-')).join(' ')}`}>
                                        <Text className={`text-xs ${statusStyle.split(' ').find(c => c.startsWith('text-'))}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                            {test.status}
                                        </Text>
                                    </View>
                                </View>

                            </View>
                        );
                    })}
                </View>

            </ScrollView>
        </View>
    );
}