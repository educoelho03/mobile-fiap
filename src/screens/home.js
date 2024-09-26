import Voice from '@react-native-voice/voice';
import React, { useEffect, useRef, useState } from 'react';
import { LogBox, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import { Howl } from 'howler';

LogBox.ignoreLogs(["new NativeEventEmitter()"]);

export default function Home ({ navigation }) {
    const device = useCameraDevice("back");
    const [permission, setPermission] = useState(null);
    const cameraRef = useRef(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    
    Tts.setDefaultLanguage('pt-BR'); 
    Tts.setDefaultRate(0.5); // Define a velocidade de fala

    useEffect(() => {
        Tts.speak("Olá, bem vindo ao SmartCam, Aperte no centro da tela para acessar a câmera.")
    }, [])


    const checkPhoto = async (photoUrl) => {
        try {
            const response = await fetch("colocar aqui a URL", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ photoUri }),
            })

            const result = await response.json();
            console.log("Verificação da foto: ", result)

        } catch(error){
            console.error("Erro ao fazer a requisição: ", error)
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const cameraStatus = await requestPermission();
                const micStatus = await requestMicPermission();
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

    async function handleListening() {
        try {
            if (isListening) {
                await Voice.stop();
                setIsListening(false);
                console.log('Reconhecimento de voz parado.');
            } else {
                await Voice.start("pt-BR");
                setIsListening(true);
                console.log('Reconhecimento de voz iniciado.');
            }
        } catch (error) {
            console.log('Erro no reconhecimento de voz:', error);
        }
    }

    // const beepSound = new Howl({
    //     src: ['caminho/para/seu/beep.mp3'], // Insira o caminho para seu arquivo de som
    //     volume: 1.0, // Volume do som
    // });

    const capturePhoto = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePhoto({
                    flash: 'off',
                });
                console.log(photo);
                Tts.speak("Foto tirada com sucesso."); 

                // CHAMA A FUNCAO DE CHECKAR A FOTO.
                await checkPhoto(photo.path);

                navigation.navigate('Results', { photoUri: photo.path });
            } catch (error) {
                console.error('Erro ao tirar foto:', error);
            }
        }
    };

    function onSpeechResults(event) {
        const { value } = event;
        const text = value ?? [''];
        const recognizedText = text.join(' ').replace(',', ' ');
        console.log('Resultados do Reconhecimento de Voz:', recognizedText);
        
        if (recognizedText.toLowerCase().includes('abrir câmera')) {
            setShowCamera(true);
            Tts.speak("Você entrou na câmera, preparando para tirar uma foto em 3 segundos.");
            handleListening();

            // let beepCounting = 0;
            // const beepInterval = setInterval(() => {
            //     beepSound.play();
            //     beepCounting++;

            //     if(beepCounting >= 3){
            //         clearInterval(beepInterval)
            //         capturePhoto();
            //     }
            // }, 1000)

            setTimeout(() => {
                capturePhoto();
            }, 3000)
        } else {
            Tts.speak("Comando não reconhecido.")
        }
    }



    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    if (permission === null) return <SafeAreaView />;
    if (!device || !permission) return <SafeAreaView />;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.welcomeText}>
                    Bem-vindo ao SmartCam
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
                            orientation="portrait"
                        />
                        <TouchableOpacity
                            onPress={capturePhoto}
                            style={styles.captureButton}
                        >
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
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
    },
    welcomeText: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 20,
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
    captureButton: {
        backgroundColor: '#fff', 
        width: 90,               
        height: 90,              
        borderRadius: 45,        
        borderWidth: 8,          
        borderColor: '#A6A6A6',  
        position: 'absolute',
        bottom: 70,
        alignSelf: 'center'
    },
});