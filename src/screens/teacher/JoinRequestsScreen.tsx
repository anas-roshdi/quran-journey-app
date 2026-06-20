import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar, Modal, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';

// --- Interfaces ---
type RequestStatus = 'pending' | 'accepted' | 'rejected';

interface JoinRequest {
    id: string;
    name: string;
    timestamp: string;
    classId: string;
    className: string;
    status: RequestStatus;
}

interface ClassOption {
    id: string;
    name: string;
}

export default function JoinRequestsScreen({ navigation }: any) {
    // --- Mock Data ---
    const [requests, setRequests] = useState<JoinRequest[]>([
        { id: '1', name: "عمر خالد", timestamp: "منذ ساعتين", classId: 'c1', className: "حلقة الإمام الشاطبي", status: 'pending' },
        { id: '2', name: "ياسر محمد", timestamp: "منذ ٣ ساعات", classId: 'c1', className: "حلقة الإمام الشاطبي", status: 'pending' },
        { id: '3', name: "عبدالرحمن فهد", timestamp: "أمس", classId: 'c2', className: "حلقة التجويد", status: 'pending' },
        { id: '4', name: "فيصل أحمد", timestamp: "قبل يومين", classId: 'c1', className: "حلقة الإمام الشاطبي", status: 'accepted' },
        { id: '5', name: "سالم الدوسري", timestamp: "قبل ٣ أيام", classId: 'c2', className: "حلقة التجويد", status: 'rejected' },
    ]);

    const classOptions: ClassOption[] = [
        { id: 'all', name: 'جميع الحلقات' },
        { id: 'c1', name: 'حلقة الإمام الشاطبي' },
        { id: 'c2', name: 'حلقة التجويد' },
    ];

    // --- State ---
    const [activeTab, setActiveTab] = useState<RequestStatus>('pending');
    const [selectedClassId, setSelectedClassId] = useState<string>('all');
    const [isClassDropdownVisible, setIsClassDropdownVisible] = useState(false);

    // --- Handlers ---
    const handleAction = (id: string, newStatus: RequestStatus) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    };

    // --- Derived Data ---
    const filteredRequests = requests.filter(req =>
        req.status === activeTab && (selectedClassId === 'all' || req.classId === selectedClassId)
    );

    const pendingCount = requests.filter(req => req.status === 'pending').length;

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40 }}
        >
            {/* --- Sticky Header --- */}
            <View className="bg-card px-5 py-4 flex-row items-center justify-center shadow-sm z-20 relative">
                <Text className="text-lg text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>طلبات الانضمام</Text>
            </View>

            {/* --- Status Tabs --- */}
            <View className="bg-card border-b border-border flex-row-reverse z-10 shadow-sm">
                <TouchableOpacity
                    onPress={() => setActiveTab('pending')}
                    className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'pending' ? 'border-primary' : 'border-transparent'}`}
                >
                    <View className="flex-row items-center justify-center gap-1.5">
                        {/* إزالة الـ Padding الوهمي من الكلمة نفسها لضبط المحاذاة مع الدائرة */}
                        <Text
                            className={`text-sm ${activeTab === 'pending' ? 'text-primary' : 'text-muted'}`}
                            style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}
                        >
                            معلقة
                        </Text>

                        {/* الدائرة والرقم مع قاعدة الـ lineHeight الذهبية */}
                        {pendingCount > 0 && (
                            <View
                                className="bg-destructive items-center justify-center rounded-full shadow-sm"
                                style={{ width: 20, height: 20 }}
                            >
                                <Text
                                    className="text-white text-center"
                                    style={{
                                        fontFamily: 'Tajawal-Bold',
                                        fontSize: 11,
                                        includeFontPadding: false,
                                        paddingTop: Platform.OS === 'android' ? 2 : 1,
                                    }}
                                >
                                    {pendingCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab('accepted')}
                    className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'accepted' ? 'border-primary' : 'border-transparent'}`}
                >
                    <Text className={`text-sm ${activeTab === 'accepted' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>مقبولة</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab('rejected')}
                    className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'rejected' ? 'border-primary' : 'border-transparent'}`}
                >
                    <Text className={`text-sm ${activeTab === 'rejected' ? 'text-primary' : 'text-muted'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>مرفوضة</Text>
                </TouchableOpacity>
            </View>

            {/* --- Main Content (Requests List) --- */}
            <ScrollView contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 20, paddingTop: 20 }}>

                {filteredRequests.length === 0 ? (
                    <View className="items-center justify-center py-20 opacity-50">
                        <Feather name="inbox" size={48} color="#94a3b8" />
                        <Text className="text-muted mt-4 text-sm" style={{ fontFamily: 'Tajawal-Medium' }}>
                            لا توجد طلبات في هذه القائمة
                        </Text>
                    </View>
                ) : (
                    <View className="flex-col gap-4">
                        {filteredRequests.map((request) => (
                            <View key={request.id} className="bg-card rounded-2xl p-4 border border-border shadow-sm">

                                {/* Top Row: Avatar, Name, Timestamp */}
                                <View className="flex-row-reverse items-center justify-between mb-4">
                                    <View className="flex-row-reverse items-center gap-3">
                                        <View className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <Feather name="user" size={20} color="#64748b" />
                                        </View>
                                        <Text className="text-base text-foreground" style={{ fontFamily: 'Tajawal-Bold' }}>
                                            {request.name}
                                        </Text>
                                    </View>
                                    <Text className="text-xs text-muted" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        {request.timestamp}
                                    </Text>
                                </View>

                                {/* Context Box */}
                                <View className="bg-background/80 rounded-xl p-3 mb-4 flex-row-reverse items-center gap-2 border border-border/50">
                                    <Feather name="book-open" size={16} color="#059669" />
                                    <Text className="text-sm text-slate-700 flex-1 text-right" style={{ fontFamily: 'Tajawal-Medium' }}>
                                        طلب الانضمام إلى: <Text style={{ fontFamily: 'Tajawal-Bold' }}>{request.className}</Text>
                                    </Text>
                                </View>

                                {/* Interactive Section based on Status */}
                                {request.status === 'pending' ? (
                                    <View className="flex-row-reverse gap-3">
                                        <TouchableOpacity
                                            onPress={() => handleAction(request.id, 'accepted')}
                                            activeOpacity={0.8}
                                            className="flex-1 bg-primary py-3 rounded-xl items-center justify-center shadow-sm shadow-emerald-200"
                                        >
                                            <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>قبول</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => handleAction(request.id, 'rejected')}
                                            activeOpacity={0.8}
                                            className="flex-1 bg-destructive-light border border-destructive py-3 rounded-xl items-center justify-center shadow-sm"
                                        >
                                            <Text className="text-rose-700 text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>رفض</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View className={`py-2 px-3 rounded-lg self-end flex-row-reverse items-center gap-2 ${request.status === 'accepted' ? 'bg-primary-light border border-primary' : 'bg-destructive-light border border-destructive'
                                        }`}>
                                        <Feather
                                            name={request.status === 'accepted' ? 'check-circle' : 'x-circle'}
                                            size={14}
                                            color={request.status === 'accepted' ? '#059669' : '#e11d48'}
                                        />
                                        <Text
                                            className={`text-xs ${request.status === 'accepted' ? 'text-primary' : 'text-rose-700'}`}
                                            style={{ fontFamily: 'Tajawal-Bold' }}
                                        >
                                            {request.status === 'accepted' ? 'تم القبول' : 'تم الرفض'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* --- Smart Floating Action Button for Filtering --- */}
            <View className="absolute bottom-24 left-5 z-20">
                <TouchableOpacity
                    onPress={() => setIsClassDropdownVisible(true)}
                    activeOpacity={0.9}
                    className={`bg-primary shadow-lg shadow-emerald-200 border border-primary flex-row-reverse items-center justify-center ${selectedClassId === 'all' ? 'w-14 h-14 rounded-full' : 'h-14 px-5 rounded-full gap-2'
                        }`}
                >
                    <Feather name="filter" size={20} color="white" />
                    {selectedClassId !== 'all' && (
                        <Text className="text-white text-sm" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false }}>
                            {classOptions.find(c => c.id === selectedClassId)?.name}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* --- Centered Dropdown Modal --- */}
            <Modal
                visible={isClassDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsClassDropdownVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsClassDropdownVisible(false)}>
                    <View className="flex-1 justify-center items-center bg-black/40 px-5">
                        <TouchableWithoutFeedback>
                            <View className="bg-card w-full rounded-2xl overflow-hidden shadow-lg">
                                <View className="bg-background p-4 border-b border-border items-center">
                                    <Text className="text-muted text-sm" style={{ fontFamily: 'Tajawal-Bold' }}>تصفية حسب الحلقة</Text>
                                </View>
                                {classOptions.map((option, index) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => {
                                            setSelectedClassId(option.id);
                                            setIsClassDropdownVisible(false);
                                        }}
                                        className={`p-4 flex-row-reverse items-center justify-between ${index !== classOptions.length - 1 ? 'border-b border-border' : ''
                                            }`}
                                    >
                                        <Text
                                            className={`text-base ${selectedClassId === option.id ? 'text-primary' : 'text-slate-700'}`}
                                            style={{ fontFamily: selectedClassId === option.id ? 'Tajawal-Bold' : 'Tajawal-Medium' }}
                                        >
                                            {option.name}
                                        </Text>
                                        {selectedClassId === option.id && (
                                            <Feather name="check" size={18} color="#059669" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* --- Reusable Dynamic Bottom Navigation --- */}
            <BottomNav role="teacher" activeTab="requests" navigation={navigation} />

        </View>
    );
}