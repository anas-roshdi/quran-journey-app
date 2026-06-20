import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";

// --- بيانات وهمية للدروس (Mock Data) ---
const categories = ["الكل", "أحكام النون الساكنة", "أحكام الميم", "المدود", "مخارج الحروف"];

const tajweedLessons = [
    {
        id: "1",
        title: "الإظهار الحلقي",
        category: "أحكام النون الساكنة",
        brief: "نطق النون الساكنة أو التنوين واضحة من غير غنة إذا جاء بعدها أحد حروف الحلق (ء، هـ، ع، ح، غ، خ).",
        example: "مِنْ خَوْفٍ  -  مَنْ آمَنَ",
    },
    {
        id: "2",
        title: "الإدغام بغنة",
        category: "أحكام النون الساكنة",
        brief: "إدخال النون الساكنة أو التنوين في أحد حروف كلمة (ينمو) بحيث يصبحان حرفاً واحداً مشدداً مع بقاء الغنة.",
        example: "مَن يَعْمَلْ  -  مِن وَالٍ",
    },
    {
        id: "3",
        title: "المد المتصل",
        category: "المدود",
        brief: "أن يقع حرف المد وبعده همزة في كلمة واحدة، وحكمه الوجوب (يمد 4 أو 5 حركات).",
        example: "السَّمَاءَ  -  جِيءَ",
    },
    {
        id: "4",
        title: "الإخفاء الشفوي",
        category: "أحكام الميم",
        brief: "إخفاء الميم الساكنة مع بقاء الغنة إذا جاء بعدها حرف (الباء).",
        example: "تَرْمِيهِم بِحِجَارَةٍ",
    },
];

export default function LearnTajweedScreen({ navigation }: any) {
    const [activeCategory, setActiveCategory] = useState("الكل");
    const [searchQuery, setSearchQuery] = useState("");

    // تصفية الدروس بناءً على التصنيف والبحث
    const filteredLessons = tajweedLessons.filter((lesson) => {
        const matchesCategory = activeCategory === "الكل" || lesson.category === activeCategory;
        const matchesSearch = lesson.title.includes(searchQuery) || lesson.brief.includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Header --- */}
            <View className="flex-row-reverse items-center justify-between px-5 py-4 bg-card border-b border-border z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    تعلم التجويد
                </Text>
                {/* زر وهمي لحفظ التوازن البصري للشريط العلوي */}
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- Search Bar --- */}
                <View className="px-5 mt-6 mb-4">
                    <View className="flex-row-reverse items-center bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
                        <Feather name="search" size={20} color="#9ca3af" />
                        <TextInput
                            placeholder="ابحث عن حكم تجويدي..."
                            placeholderTextColor="#9ca3af"
                            className="flex-1 text-right text-foreground ml-3 text-sm"
                            style={{ fontFamily: 'Tajawal-Medium', textAlign: 'right' }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* --- Categories (Horizontal Scroll) --- */}
                <View className="mb-6">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: 'row-reverse',
                            paddingHorizontal: 20,
                            gap: 8
                        }}
                    >
                        {categories.map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full border ${activeCategory === category
                                        ? 'bg-primary border-primary'
                                        : 'bg-card border-border'
                                    }`}
                            >
                                <Text
                                    className={`text-sm ${activeCategory === category ? 'text-white' : 'text-slate-600'
                                        }`}
                                    style={{ fontFamily: 'Tajawal-Bold' }}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* --- Lesson Cards List --- */}
                <View className="px-5 space-y-4">
                    {filteredLessons.length > 0 ? (
                        filteredLessons.map((lesson) => (
                            <View key={lesson.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">

                                {/* عنوان الحكم وتصنيفه */}
                                <View className="p-5 border-b border-gray-50">
                                    <View className="flex-row-reverse items-center justify-between mb-2">
                                        <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {lesson.title}
                                        </Text>
                                        <View className="bg-primary-light px-2.5 py-1 rounded-md">
                                            <Text className="text-[10px] text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>
                                                {lesson.category}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-sm text-muted text-right leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        {lesson.brief}
                                    </Text>
                                </View>

                                {/* قسم المثال القرآني */}
                                <View className="bg-slate-50 p-4 flex-row-reverse items-center justify-between">
                                    <View className="items-end flex-1 mr-2">
                                        <Text className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Tajawal-Medium' }}>مثال توضيحي:</Text>
                                        <Text className="text-base text-emerald-800" style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {lesson.example}
                                        </Text>
                                    </View>
                                    <Feather name="book-open" size={24} color="#10b981" className="opacity-20 absolute left-4" />
                                </View>

                                {/* أزرار الإجراءات (Action Buttons) */}
                                <View className="flex-row-reverse p-3 gap-2 bg-card">
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        className="flex-1 bg-primary-light border border-primary rounded-xl py-2.5 flex-row-reverse items-center justify-center gap-2"
                                    >
                                        <Text className="text-primary text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>اقرأ التفاصيل</Text>
                                        <Feather name="file-text" size={16} color="#10b981" />
                                    </TouchableOpacity>

                                    {/* زر الاستماع الذي سنقوم ببرمجته لاحقاً */}
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        className="w-12 h-11 bg-card border border-border rounded-xl items-center justify-center shadow-sm"
                                    >
                                        <Feather name="volume-2" size={18} color="#0f172a" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="items-center justify-center py-10">
                            <Feather name="search" size={40} color="#cbd5e1" className="mb-4" />
                            <Text className="text-muted text-base" style={{ fontFamily: 'Tajawal-Medium' }}>
                                لم نجد نتائج مطابقة لبحثك
                            </Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}