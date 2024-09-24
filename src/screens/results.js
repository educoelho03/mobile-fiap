import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export default function Results({ route }) {
    const { photoUri } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resultado da Foto</Text>
            {photoUri ? (
                <Image
                    source={{ uri: photoUri }}
                    style={styles.image}
                    onError={() => console.log('Erro ao carregar a imagem')}
                    resizeMode="contain"
                />
            ) : (
                <ActivityIndicator size="large" color="#fff" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '80%', // Ajuste a altura conforme necessário
        marginTop: 10,
    },
});
