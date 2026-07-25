import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function CreateClassScreen({ navigation }: any) {
    // Form state variables
    const [className, setClassName] = useState('');
    const [maxStudents, setMaxStudents] = useState('');
    const [classTime, setClassTime] = useState('');
    const [classType, setClassType] = useState<'online' | 'inperson'>('inperson');

    // Modal visibility state
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    // Handle form submission and show success modal
    const handleCreateClass = () => {
        // Validation and API call logic will go here
        console.log({ className, maxStudents, classTime, classType });

        // Show success modal upon creation
        setIsSuccessModalVisible(true);
    };

    // Handle modal confirmation and navigate back to classes screen
    const handleConfirmSuccess = () => {
        setIsSuccessModalVisible(false);
        navigation.goBack(); // Go back to TeacherClassesScreen
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* Sticky Header */}
            <View className="bg-card px-5 py-4 flex-row-reverse items-center justify-between border-b border-border shadow-sm z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-background rounded-full border border-border active:opacity-70"
                >
                    <Feather name="chevron-right" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                    إنشاء حلقة جديدة
                </Text>
                {/* Empty view to balance the header alignment */}
                <View className="w-10" />
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Container */}
                <View className="bg-card p-5 rounded-2xl border border-border shadow-sm space-y-5">

                    {/* Class Name Input */}
                    <View className="w-full">
                        <Text className="text-base text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>
                            اسم الحلقة
                        </Text>
                        <TextInput
                            value={className}
                            onChangeText={setClassName}
                            placeholder="مثال: حلقة الإمام الشاطبي"
                            placeholderTextColor="#94a3b8"
                            className="w-full h-12 bg-background border border-border rounded-xl px-4 text-right text-foreground"
                            style={{ fontFamily: 'Tajawal-Medium' }}
                        />
                    </View>

                    {/* Max Students Input */}
                    <View className="w-full mt-4">
                        <Text className="text-base text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>
                            الحد الأقصى للطلاب
                        </Text>
                        <TextInput
                            value={maxStudents}
                            onChangeText={setMaxStudents}
                            placeholder="مثال: 15"
                            placeholderTextColor="#94a3b8"
                            keyboardType="number-pad"
                            className="w-full h-12 bg-background border border-border rounded-xl px-4 text-right text-foreground"
                            style={{ fontFamily: 'Tajawal-Medium' }}
                        />
                    </View>

                    {/* Class Time Input */}
                    <View className="w-full mt-4">
                        <Text className="text-base text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>
                            وقت الحلقة
                        </Text>
                        <View className="relative justify-center">
                            <TextInput
                                value={classTime}
                                onChangeText={setClassTime}
                                placeholder="مثال: العصر (4:00 م - 6:00 م)"
                                placeholderTextColor="#94a3b8"
                                className="w-full h-12 bg-background border border-border rounded-xl px-4 pr-10 text-right text-foreground"
                                style={{ fontFamily: 'Tajawal-Medium' }}
                            />
                            <Feather name="clock" size={18} color="#94a3b8" style={{ position: 'absolute', right: 12 }} />
                        </View>
                    </View>

                    {/* Class Type Toggle (In-person vs Online) */}
                    <View className="w-full mt-4">
                        <Text className="text-base text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>
                            نوع الحلقة
                        </Text>
                        <View className="flex-row-reverse gap-3">
                            {/* In-person Option */}
                            <TouchableOpacity
                                onPress={() => setClassType('inperson')}
                                className={`flex-1 h-12 rounded-xl flex-row-reverse items-center justify-center border ${classType === 'inperson'
                                        ? 'bg-primary-light border-primary'
                                        : 'bg-background border-border'
                                    }`}
                            >
                                <Feather
                                    name="users"
                                    size={18}
                                    color={classType === 'inperson' ? '#059669' : '#94a3b8'}
                                    className="ml-2"
                                />
                                <Text
                                    className={classType === 'inperson' ? 'text-primary' : 'text-slate-500'}
                                    style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}
                                >
                                    حضوري
                                </Text>
                            </TouchableOpacity>

                            {/* Online Option */}
                            <TouchableOpacity
                                onPress={() => setClassType('online')}
                                className={`flex-1 h-12 rounded-xl flex-row-reverse items-center justify-center border ${classType === 'online'
                                        ? 'bg-blue-50 border-blue-400'
                                        : 'bg-background border-border'
                                    }`}
                            >
                                <Feather
                                    name="monitor"
                                    size={18}
                                    color={classType === 'online' ? '#2563eb' : '#94a3b8'}
                                    className="ml-2"
                                />
                                <Text
                                    className={classType === 'online' ? 'text-blue-600' : 'text-slate-500'}
                                    style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}
                                >
                                    عن بعد
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleCreateClass}
                    className="w-full bg-primary h-14 rounded-xl items-center justify-center mt-8 active:opacity-90 shadow-sm shadow-emerald-200"
                >
                    <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                        إعتماد وإنشاء الحلقة
                    </Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Success Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isSuccessModalVisible}
                onRequestClose={() => setIsSuccessModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center px-6 bg-black/50">
                    <View className="bg-card w-full rounded-3xl p-6 items-center shadow-2xl">
                        <View className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full items-center justify-center mb-5">
                            <Feather name="check" size={40} color="#10b981" />
                        </View>
                        <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                            تم إنشاء الحلقة بنجاح
                        </Text>
                        <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                            تم حفظ بيانات الحلقة الجديدة بنجاح وإضافتها إلى نظام إدارة الحلقات الخاص بك. يمكنك الآن البدء بإضافة الطلاب ومتابعة سجلاتهم.
                        </Text>
                        <TouchableOpacity
                            onPress={handleConfirmSuccess}
                            activeOpacity={0.8}
                            className="w-full h-12 bg-primary rounded-xl items-center justify-center shadow-sm"
                        >
                            <Text numberOfLines={1} className="text-white text-base text-center w-full" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                العودة لإدارة الحلقات
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}