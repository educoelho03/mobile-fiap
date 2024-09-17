import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function Results({ route }) {
    const { photoUri } = route.params; // Obtenha a URI da foto passada como parâmetro

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.resultsContainer}>
                <Text style={styles.resultText}>
                    Resultado da pesquisa:
                </Text>
            </View>
            {photoUri && (
                <Image
                    source={{ uri: photoUri }}
                    style={styles.productImage}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    resultsContainer: {
        marginBottom: 16,
    },
    resultText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    productImage: {
        width: 300,
        height: 300,
        borderRadius: 10,
        resizeMode: 'cover',
    },
});
