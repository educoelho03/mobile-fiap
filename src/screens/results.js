import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Results({ route }) {
    const { photoUri } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resultado da Foto</Text>
            <Image source={{ uri: photoUri }} style={styles.image} />
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
        height: '100%',
        resizeMode: 'contain',
    },
});
