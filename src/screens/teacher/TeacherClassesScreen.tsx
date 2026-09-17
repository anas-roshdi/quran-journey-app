import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../../components/BottomNav';

interface TeacherClassData {
    id: string;
    title: string;
    badge: string;
    badgeType: 'online' | 'inperson';
    time: string;
    studentsCount: number;
    pendingRequests: number;
}

export default function TeacherClassesScreen({ navigation }: any) {
    const [classesList, setClassesList] = useState<TeacherClassData[]>([
        { id: '1', title: 'حلقة الإمام الشاطبي لإكمال حفظ القرآن الكريم والمراجعة', badge: 'عن بعد', badgeType: 'online', time: 'العصر (4:00 م - 6:00 م)', studentsCount: 15, pendingRequests: 3 },
        { id: '2', title: 'حلقة التجويد', badge: 'حضوري', badgeType: 'inperson', time: 'المغرب (6:30 م - 8:00 م)', studentsCount: 8, pendingRequests: 0 },
    ]);

    const [expandedTitleIds, setExpandedTitleIds] = useState<Record<string, boolean>>({});
    
    // Modals State
    const [selectedClass, setSelectedClass] = useState<TeacherClassData | null>(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const toggleTitleExpansion = (id: string) => {
        setExpandedTitleIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const openOptionsDropdown = (item: TeacherClassData, event: any) => {
        const { pageY } = event.nativeEvent;
        setDropdownPosition({ top: pageY - 15, left: 25 });
        setSelectedClass(item);
        setIsDropdownVisible(true);
    };

    const handleEditClass = () => {
        setIsDropdownVisible(false);
        if (selectedClass) {
            navigation.navigate('EditClass', { classData: selectedClass });
        }
    };

    const confirmDeleteAction = () => {
        setIsDropdownVisible(false);
        setTimeout(() => setIsDeleteModalVisible(true), 150);
    };

    const handleDeleteClass = () => {
        if (selectedClass) {
            setClassesList(prev => prev.filter(c => c.id !== selectedClass.id));
            setIsDeleteModalVisible(false);
            setSelectedClass(null);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="bg-card px-5 py-4 flex-row-reverse items-center justify-between border-b border-border shadow-sm z-10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-background rounded-full border border-border active:opacity-70">
                    <Feather color="#0f172a" name="chevron-right" size={24} />
                </TouchableOpacity>
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>إدارة الحلقات</Text>
                <View className="w-10"/>
            </View>

            <ScrollView className="p-5" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                
                <TouchableOpacity className="w-full bg-card border border-primary rounded-2xl p-4 flex-row-reverse items-center justify-between mb-6 shadow-sm active:bg-primary-light/30" onPress={() => navigation.navigate('CreateClass')}>
                    <View className="flex-row-reverse items-center gap-3">
                        <View className="w-10 h-10 rounded-xl bg-primary-light items-center justify-center">
                            <Feather color="#059669" name="plus" size={20} />
                        </View>
                        <Text className="text-foreground text-base" style={{ fontFamily: 'Tajawal-Bold' }}>إنشاء حلقة جديدة</Text>
                    </View>
                    <Feather color="#cbd5e1" name="chevron-left" size={18} />
                </TouchableOpacity>

                <View className="space-y-4">
                    {classesList.map((item) => (
                        <View className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4" key={item.id}>
                            <View className="flex-row-reverse items-start justify-between mb-4 w-full">
                                <View className="flex-row-reverse items-start flex-1 ml-2">
                                    <TouchableOpacity onPress={() => toggleTitleExpansion(item.id)} activeOpacity={0.8} className="flex-1">
                                        <Text className="text-base text-foreground text-right" numberOfLines={expandedTitleIds[item.id] ? 0 : 1} style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity className={`w-7 flex-shrink-0 h-7 items-center justify-center mr-2 relative rounded-full ${item.pendingRequests > 0 ? 'bg-destructive-light border-destructive' : 'bg-background border-border'}`}>
                                        <Feather color={item.pendingRequests > 0 ? '#e11d48' : '#94a3b8'} name="bell" size={13} />
                                        {item.pendingRequests > 0 && (
                                            <View className="absolute -top-1.5 -right-1.5 bg-destructive min-w-[16px] h-4 rounded-full items-center justify-center px-1 border border-white">
                                                <Text className="text-white text-[8px]" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, textAlignVertical: 'center' }}>{item.pendingRequests}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <View className="flex-row-reverse items-center gap-2 flex-shrink-0">
                                    <View className={`px-3 py-1 rounded-full border ${item.badgeType === 'online' ? 'bg-blue-50 border-blue-100' : 'bg-primary-light border-primary'}`}>
                                        <Text className={`text-xs ${item.badgeType === 'online' ? 'text-blue-600' : 'text-primary'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>{item.badge}</Text>
                                    </View>
                                    {/* Action Options Button */}
                                    <TouchableOpacity onPress={(e) => openOptionsDropdown(item, e)} className="p-1 active:bg-gray-50 rounded-full -ml-2">
                                        <Feather color="#94a3b8" name="more-vertical" size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="space-y-2 mb-4 items-end bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <View className="flex-row-reverse items-center justify-start w-full mb-1">
                                    <Feather className="ml-2" color="#94a3b8" name="clock" size={14} />
                                    <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>وقت الحلقة: <Text className="text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>{item.time}</Text></Text>
                                </View>
                                <View className="flex-row-reverse items-center justify-start w-full">
                                    <Feather className="ml-2" color="#94a3b8" name="users" size={14} />
                                    <Text className="text-sm text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>عدد الطلاب: <Text className="text-slate-700" style={{ fontFamily: 'Tajawal-Bold' }}>{item.studentsCount} طالب</Text></Text>
                                </View>
                            </View>

                            <View className="flex-col w-full">
                                {item.badgeType === 'online' && (
                                    <TouchableOpacity className="w-full bg-primary h-11 rounded-xl items-center justify-center mb-2 active:opacity-90 shadow-sm shadow-emerald-200">
                                        <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>دخول الحلقة / بدء الغرفة</Text>
                                    </TouchableOpacity>
                                )}
                                <View className="flex-row-reverse gap-2 w-full">
                                    <TouchableOpacity className="flex-1 bg-slate-800 h-11 rounded-xl items-center justify-center active:bg-slate-700 shadow-sm" onPress={() => navigation.navigate('ManageStudents')}>
                                        <Text adjustsFontSizeToFit className="text-white text-sm text-center" numberOfLines={1} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>إدارة الطلاب</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 bg-background border border-border h-11 rounded-xl items-center justify-center active:bg-background shadow-sm" onPress={() => navigation.navigate('TeacherAttendance')}>
                                        <Text adjustsFontSizeToFit className="text-slate-600 text-sm text-center" numberOfLines={1} style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>سجل الحضور</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <BottomNav activeTab="classes" navigation={navigation} role="teacher" />

            {/* Dropdown Options Modal */}
            <Modal animationType="fade" onRequestClose={() => setIsDropdownVisible(false)} transparent={true} visible={isDropdownVisible}>
                <TouchableOpacity activeOpacity={1} onPress={() => setIsDropdownVisible(false)} className="flex-1">
                    <View className="absolute bg-card rounded-2xl shadow-xl border border-border overflow-hidden" style={{ width: 160, left: dropdownPosition.left, top: dropdownPosition.top, elevation: 8 }}>
                        <TouchableOpacity activeOpacity={0.8} className="flex-row-reverse items-center justify-start px-4 py-3.5 active:bg-gray-50 border-b border-gray-50" onPress={handleEditClass}>
                            <Feather color="#3b82f6" name="edit-2" size={16} />
                            <Text className="text-sm text-blue-600 mr-2.5" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تعديل الحلقة</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} className="flex-row-reverse items-center justify-start px-4 py-3.5 active:bg-red-50" onPress={confirmDeleteAction}>
                            <Feather color="#ef4444" name="trash-2" size={16} />
                            <Text className="text-sm text-red-600 mr-2.5" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>حذف الحلقة</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal animationType="fade" onRequestClose={() => setIsDeleteModalVisible(false)} transparent={true} visible={isDeleteModalVisible}>
                <View className="flex-1 justify-center items-center px-6 bg-black/50">
                    <View className="bg-white w-full rounded-3xl p-6 items-center shadow-2xl">
                        <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4 border border-red-100">
                            <Feather color="#ef4444" name="alert-triangle" size={30} />
                        </View>
                        <Text className="text-xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>تأكيد الحذف</Text>
                        <Text className="text-sm text-slate-500 mb-8 text-center leading-relaxed" style={{ fontFamily: 'Tajawal-Medium' }}>
                            هل أنت متأكد من رغبتك في حذف حلقة ({selectedClass?.title}) بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.
                        </Text>
                        <View className="flex-row-reverse w-full justify-between mt-2 gap-3">
                            <TouchableOpacity activeOpacity={0.8} className="flex-1 h-12 bg-red-500 rounded-xl justify-center shadow-sm" onPress={handleDeleteClass}>
                                <Text className="text-white text-base text-center w-full" numberOfLines={1} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>نعم، حذف</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)} activeOpacity={0.8} className="flex-1 h-12 bg-gray-100 rounded-xl justify-center border border-gray-200">
                                <Text className="text-slate-700 text-base text-center w-full" numberOfLines={1} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>تراجع</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}