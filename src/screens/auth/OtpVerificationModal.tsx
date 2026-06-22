import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface OtpVerificationModalProps {
    visible: boolean;
    email: string;
    onClose: () => void;
    onVerify: (code: string) => void;
}

export default function OtpVerificationModal({ visible, email, onClose, onVerify }: OtpVerificationModalProps) {
    // --- OTP State & Refs ---
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    // --- Timer State ---
    const [timer, setTimer] = useState(59);
    const [canResend, setCanResend] = useState(false);

    // --- Timer Logic ---
    useEffect(() => {
        let interval: any;
        if (visible && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [visible, timer]);

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setCode(['', '', '', '']);
            setTimer(59);
            setCanResend(false);
            // Auto focus first input after a slight delay
            setTimeout(() => inputRefs.current[0]?.focus(), 300);
        }
    }, [visible]);

    // --- Handle Input Logic ---
    const handleOtpChange = (value: string, index: number) => {
        // السماح بالأرقام فقط
        const cleanValue = value.replace(/[^0-9]/g, '');

        const newCode = [...code];
        newCode[index] = cleanValue;
        setCode(newCode);

        // Auto-focus next input
        if (cleanValue && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Auto-focus previous input on Backspace if current is empty
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const isCodeComplete = code.every((digit) => digit !== '');
    const finalCode = code.join('');

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableOpacity
                activeOpacity={1}
                className="flex-1 justify-center items-center px-5 bg-black/60"
                onPress={Keyboard.dismiss} // إغلاق لوحة المفاتيح عند النقر خارجاً
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
                    className="w-full"
                >
                    <TouchableWithoutFeedback>
                        <View className="bg-card w-full rounded-3xl p-6 shadow-2xl items-center relative">

                            {/* --- Close Button --- */}
                            <TouchableOpacity
                                onPress={onClose}
                                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full items-center justify-center border border-gray-100 z-10"
                            >
                                <Feather name="x" size={18} color="#64748b" />
                            </TouchableOpacity>

                            {/* --- Header Icon --- */}
                            <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm mt-2">
                                <Feather name="shield" size={32} color="#3b82f6" />
                            </View>

                            {/* --- Texts --- */}
                            <Text className="text-2xl text-foreground mb-2 text-center" style={{ fontFamily: 'Tajawal-Bold' }}>
                                تأكيد الرمز
                            </Text>
                            <Text className="text-sm text-muted text-center leading-relaxed mb-6 px-2" style={{ fontFamily: 'Tajawal-Medium' }}>
                                أدخل الرمز المكون من 4 أرقام الذي أرسلناه للتو إلى:
                                {"\n"}
                                <Text className="text-primary" style={{ fontFamily: 'Tajawal-Bold' }}>{email}</Text>
                            </Text>

                            {/* --- OTP Inputs (LTR Direction for numbers) --- */}
                            <View className="flex-row justify-center gap-4 mb-8 w-full" style={{ direction: 'ltr' }}>
                                {code.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        className={`w-14 h-16 bg-white border-2 rounded-2xl text-center text-2xl text-foreground shadow-sm transition-colors ${digit ? 'border-primary bg-primary-light/10' : 'border-gray-200 focus:border-blue-400'}`}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(value) => handleOtpChange(value, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        style={{ fontFamily: 'Tajawal-Bold' }}
                                    />
                                ))}
                            </View>

                            {/* --- Verify Button --- */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => onVerify(finalCode)}
                                disabled={!isCodeComplete}
                                className={`w-full h-14 rounded-xl items-center justify-center shadow-sm mb-6 transition-colors ${isCodeComplete ? 'bg-primary' : 'bg-gray-300'}`}
                            >
                                <Text className="text-white text-base" style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 4 }}>
                                    تحقق والمتابعة
                                </Text>
                            </TouchableOpacity>

                            {/* --- Resend Timer --- */}
                            <View className="flex-row items-center justify-center">
                                <Text className="text-muted text-sm" style={{ fontFamily: 'Tajawal-Medium', includeFontPadding: false, marginTop: 2 }}>
                                    لم يصلك الرمز؟
                                </Text>
                                <TouchableOpacity
                                    disabled={!canResend}
                                    onPress={() => {
                                        setTimer(59);
                                        setCanResend(false);
                                        // منطق إعادة الإرسال هنا
                                    }}
                                    className="ml-2 px-2 py-1"
                                >
                                    <Text className={`text-sm ${canResend ? 'text-primary' : 'text-slate-400'}`} style={{ fontFamily: 'Tajawal-Bold', includeFontPadding: false, marginTop: 2 }}>
                                        {canResend ? 'إعادة الإرسال' : `إعادة الإرسال بعد 00:${timer.toString().padStart(2, '0')}`}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    );
}