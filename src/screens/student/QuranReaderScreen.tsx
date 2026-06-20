import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function QuranReaderScreen({ navigation }: any) {
    // مصفوفة الآيات المحدثة والمفصلة لدعم التظليل الفردي (Edge Cases)
    const verses = [
        {
            number: "١",
            text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهو عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
            // تظليل كلمة فردية لخطأ نطق (مثال)
            words: [
                { text: 'تَبَارَكَ الَّذِي', type: 'normal' },
                { text: 'بِيَدِهِ', type: 'pronunciation_error' }, // خطأ نطق
                { text: 'الْمُلْكُ وَهو عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', type: 'normal' }
            ],
            highlighted_verse: false,
        },
        {
            number: "٢",
            text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهو الْعَزِيزُ الْغَفُورُ",
            words: [{ text: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهو الْعَزِيزُ الْغَفُورُ', type: 'normal' }],
            highlighted_verse: true, // هذه الآية هي الورد الحالي
        },
        {
            number: "٣",
            text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
            // كشف الآية الثالثة مع كلمة منسية
            words: [
                { text: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن', type: 'normal' },
                { text: 'تَفَاوُتٍ', type: 'forgotten' }, // كلمة منسية
                { text: 'ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ', type: 'normal' }
            ],
            highlighted_verse: false,
        },
        {
            number: "٤",
            text: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهو حَسِيرٌ",
            words: [{ text: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهو حَسِيرٌ', type: 'normal' }],
            highlighted_verse: false,
        },
    ];

    // دالة ذكية لرسم الكلمات بتظليلها المناسب داخل الآية
    const renderVerseWords = (wordsArray: any[]) => {
        return wordsArray.map((word, index) => {
            let className = "text-right text-3xl leading-[55px] text-foreground"; // التنسيق الأساسي

            if (word.type === 'forgotten') {
                className += " bg-destructive-light text-destructive rounded-md px-1.5"; // تظليل أحمر منسي
            } else if (word.type === 'pronunciation_error') {
                className += " bg-orange-50 text-orange-700 rounded-md px-1.5"; // تظليل برتقالي خطأ نطق
            }

            return (
                <Text key={index} className={className} style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}>
                    {word.text}
                </Text>
            );
        });
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header --- */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-border">
                <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>الجزء ٢٩</Text>
                <Text className="text-xl text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>سورة الملك</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -mr-2">
                    <Feather name="chevron-right" size={28} color="#475569" />
                </TouchableOpacity>
            </View>

            {/* --- Reading Area --- */}
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 130 }}>

                {/* Bismillah */}
                <Text className="text-center text-2xl text-slate-700 mb-10" style={{ fontFamily: 'Tajawal-Bold' }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </Text>

                {/* Verses List */}
                <View className="space-y-8">
                    {verses.map((verse) => (
                        <View
                            key={verse.number}
                            // تظليل الآية الكاملة إذا كانت هي الورد الحالي
                            className={`rounded-xl transition-all ${verse.highlighted_verse ? "bg-primary-light/50 p-5 border border-primary" : "px-2"
                                }`}
                        >
                            <View className="flex-row justify-end flex-wrap">
                                {/* رسم الكلمات بشكل تفاعلي */}
                                {renderVerseWords(verse.words)}

                                {/* علامة ترقيم الآية محاطة بزخرفة كلاسيكية */}
                                <Text className="text-primary text-xl font-serif"> ﴿{verse.number}﴾</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* --- Floating Action Bar (Updated) --- */}
            <View className="absolute bottom-8 left-0 right-0 items-center">
                <View className="w-[90%] bg-card rounded-full shadow-lg shadow-gray-300 px-8 py-4 flex-row items-center justify-between border border-border">

                    {/* أيقونة حجم خط 'AA' أكثر وضوحاً */}
                    <TouchableOpacity className="items-center">
                        <Feather name="type" size={24} color="#94a3b8" />
                        <Text className="text-[10px] text-gray-400 mt-1" style={{ fontFamily: 'Tajawal-Regular' }}>حجم الخط</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center">
                        <Feather name="book-open" size={24} color="#94a3b8" />
                        <Text className="text-[10px] text-gray-400 mt-1" style={{ fontFamily: 'Tajawal-Regular' }}>التفسير</Text>
                    </TouchableOpacity>

                    {/* زر الميكروفون الأخضر الزمردي المركزي */}
                    <TouchableOpacity className="bg-primary p-4 rounded-full shadow-md shadow-emerald-200">
                        <Feather name="mic" size={24} color="white" />
                    </TouchableOpacity>

                </View>
            </View>

        </View>
    );
}