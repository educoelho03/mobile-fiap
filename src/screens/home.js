import React, { useEffect, useRef, useState } from 'react';
import { LogBox, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Footer from './Footer';

import Voice from '@react-native-voice/voice';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';

LogBox.ignoreLogs(["new NativeEventEmitter()"]);

export default function Home() {

    const device = useCameraDevice("back");
    const [permission, setPermission] = useState(null);  // Permissão inicial como null
    const cameraRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [search, setSearch] = useState('');
    const [isListening, setIsListening] = useState(false);

    // Obter permissões da câmera e do microfone
    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();

    useEffect(() => {
        (async () => {
            try {
                const cameraStatus = await requestPermission();
                const micStatus = await requestMicPermission();

                // Verifique se as permissões foram concedidas
                if (cameraStatus && micStatus) {
                    setPermission(true);
                } else {
                    setPermission(false);
                }
            } catch (error) {
                console.error('Erro ao solicitar permissões:', error);
                setPermission(false);
            }
        })();
    }, [requestPermission, requestMicPermission]);

    const startRecording = () => {
        if (cameraRef.current && device) {
            setIsRecording(true);
            cameraRef.current.startRecording({
                onRecordingFinished: (video) => {
                    console.log(video);
                },
                onRecordingError: (error) => {
                    console.log(error);
                }
            });
        }
    };

    const stopRecording = async () => {
        if (cameraRef.current) {
            await cameraRef.current.stopRecording();
            setIsRecording(false);
        }
    };

    const capturePhoto = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePhoto({
                    flash: 'off',
                });
                console.log(photo);
            } catch (error) {
                console.error('Erro ao tirar foto:', error);
            }
        }
    };

    function onSpeechResults(event) {
        const { value } = event;
        const text = value ?? [''];
        const recognizedText = text.join(' ').replace(',', ' ');
        setSearch(recognizedText);
        console.log('Resultados do Reconhecimento de Voz:', recognizedText);

        // Se o texto reconhecido contiver "abrir câmera", exibir a câmera
        if (recognizedText.toLowerCase().includes('abrir câmera')) {
            setShowCamera(true);
        }
    }

    async function handleListening() {
        try {
            if (isListening) {
                await Voice.stop();
                setIsListening(false);
                console.log('Reconhecimento de voz parado.');
            } else {
                setSearch("");
                await Voice.start("pt-BR");
                setIsListening(true);
                console.log('Reconhecimento de voz iniciado.');
            }
        } catch (error) {
            console.log('Erro no reconhecimento de voz:', error);
        }
    }

    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    // Renderize apenas se as permissões forem concedidas
    if (permission === null) return <SafeAreaView />;
    if (!device || !permission) return <SafeAreaView />;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.welcomeText}>
                    Bem-vindo ao FIAP x BOSCH Voice
                </Text>

                <TouchableOpacity 
                    style={styles.voiceButton} 
                    accessibilityLabel="Iniciar comando de voz"
                    accessibilityHint="Toque para começar a usar comandos de voz"
                    onPress={handleListening}
                >
                    <Icon name="mic" size={30} color="#fff" />
                    <Text style={styles.buttonText}>
                        {isListening ? "Gravando..." : "Iniciar reconhecimento de voz"}
                    </Text>
                </TouchableOpacity>

                {showCamera && (
                    <>
                        <Camera
                            style={StyleSheet.absoluteFill}
                            ref={cameraRef}
                            device={device}
                            isActive={true}
                            photo={true}
                            video={true}
                            audio={true}
                            orientation="portrait"
                            resizeMode='cover'
                        />

                        <TouchableOpacity
                            onPress={capturePhoto}
                            onPressIn={startRecording}
                            onPressOut={stopRecording}
                            style={[styles.recordButton, isRecording && styles.recording]}
                        />
                    </>
                )}
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60, // Espaço para o footer
    },
    welcomeText: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 20
    },
    resultText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
    },
    voiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff5722',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    recordButton: {
        backgroundColor: '#fff',  // Cor de fundo branca
        width: 90,                // Largura do botão
        height: 90,               // Altura do botão, igual à largura para garantir que seja redondo
        borderRadius: 45,         // Metade da largura/altura para tornar o botão redondo
        borderWidth: 8,           // Largura da borda
        borderColor: '#A6A6A6',   // Cor da borda
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center'
    },
    recording: {
        backgroundColor: 'red',   // Cor interna quando pressionado
    },
});
