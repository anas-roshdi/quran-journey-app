import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditClassScreen({ route, navigation }: any) {
    // Receive class data from navigation parameters
    const classData = route.params?.classData || {};

    // Form state variables pre-filled with existing data
    const [className, setClassName] = useState(classData.title || '');
    const [maxStudents, setMaxStudents] = useState(classData.studentsCount?.toString() || '');
    const [classTime, setClassTime] = useState(classData.time || '');
    const [classType, setClassType] = useState<'online' | 'inperson'>(classData.badgeType || 'inperson');

    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const handleUpdateClass = () => {
        // Validation and API call logic to update class will go here
        console.log("Updated Data:", { className, maxStudents, classTime, classType });
        setIsSuccessModalVisible(true);
    };

    const handleConfirmSuccess = () => {
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
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>تعديل الحلقة</Text>
                <View className="w-10"/>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40, padding: 20 }} showsVerticalScrollIndicator={false}>
                {/* Form Container */}
                <View className="bg-card p-5 rounded-2xl border border-border shadow-sm space-y-5">
                    
                    {/* Class Name Input */}
                    <View className="w-full">
                        <Text className="text-base text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>اسم الحلقة</Text>
                        <TextInput className="w-full h-12 bg-background border border-border rounded-xl px-4 text-right text-foreground" style={{ fontFamily: 'Tajawal-Medium' }} onChangeText={setClassName} placeholder="مثال: حلقة الإمام الشاطبي" placeholderTextColor="#94a3b8" value={className} />
                    </View>

                    {/* Max Students Input */}
                    <View className="w-full mt-4">
                        <Text className="text-base text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>الحد الأقصى للطلاب</Text>
                        <TextInput className="w-full h-12 bg-background border border-border rounded-xl px-4 text-right text-foreground" style={{ fontFamily: 'Tajawal-Medium' }} keyboardType="number-pad" onChangeText={setMaxStudents} placeholder="مثال: 15" placeholderTextColor="#94a3b8" value={maxStudents} />
                    </View>

                    {/* Class Time Input */}
                    <View className="w-full mt-4">
                        <Text className="text-base text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>وقت الحلقة</Text>
                        <View className="relative justify-center">
                            <TextInput className="w-full h-12 bg-background border border-border rounded-xl px-4 pr-10 text-right text-foreground" style={{ fontFamily: 'Tajawal-Medium' }} onChangeText={setClassTime} placeholder="مثال: العصر (4:00 م - 6:00 م)" placeholderTextColor="#94a3b8" value={classTime} />
                            <Feather style={{ position: 'absolute', right: 12 }} color="#94a3b8" name="clock" size={18} />
                        </View>
                    </View>

                    {/* Class Type Toggle */}
                    <View className="w-full mt-4">
                        <Text className="text-base text-foreground text-right mb-2" style={{ fontFamily: 'Tajawal-Bold' }}>نوع الحلقة</Text>
                        <View className="flex-row-reverse gap-3">
                            <TouchableOpacity onPress={() => setClassType('inperson')}
                                className={`flex-1 h-12 rounded-xl flex-row-reverse items-center justify-center border ${classType === 'inperson' ? 'bg-primary-light border-primary' : 'bg-background border-border'}`}
                            >
                                <Feather color={classType === 'inperson' ? '#059669' : '#94a3b8'} name="users" size={18} className="ml-2" />
                                <Text className={classType === 'inperson' ? 'text-primary' : 'text-slate-500'} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>حضوري</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setClassType('online')}
                                className={`flex-1 h-12 rounded-xl flex-row-reverse items-center justify-center border ${classType === 'online' ? 'bg-blue-50 border-blue-400' : 'bg-background border-border'}`}
                            >
                                <Feather color={classType === 'online' ? '#2563eb' : '#94a3b8'} name="monitor" size={18} className="ml-2" />
                                <Text className={classType === 'online' ? 'text-blue-600' : 'text-slate-500'} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>عن بعد</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity className="w-full bg-primary h-14 rounded-xl items-center justify-center mt-8 active:opacity-90 shadow-sm shadow-emerald-200" onPress={handleUpdateClass}>
                    <Text className="text-white text-lg" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>حفظ التعديلات</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Success Confirmation Modal */}
            <Modal animationType="fade" onRequestClose={() => setIsSuccessModalVisible(false)} transparent={true} visible={isSuccessModalVisible}>
                <View className="flex-1 justify-center items-center px-6 bg-black/50">
                    <View className="bg-card w-full rounded-3xl p-6 items-center shadow-2xl">
                        <View className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full items-center justify-center mb-5">
                            <Feather color="#10b981" name="check" size={40} />
                        </View>
                        <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>تم تعديل الحلقة بنجاح</Text>
                        <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>تم حفظ التعديلات على بيانات الحلقة بنجاح في النظام.</Text>
                        <TouchableOpacity activeOpacity={0.8} className="w-full h-12 bg-primary rounded-xl items-center justify-center shadow-sm" onPress={handleConfirmSuccess}>
                            <Text className="text-white text-base text-center w-full" numberOfLines={1} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>العودة لإدارة الحلقات</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
