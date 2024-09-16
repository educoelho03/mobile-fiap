// Footer.js
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Footer = () => {
  const handleHistoricoPress = () => {
    Alert.alert("Histórico de Captura", "Abrindo histórico de captura...");
    // Navegar para a tela de histórico de captura
  };

  const handleConfiguracoesPress = () => {
    Alert.alert("Configurações", "Abrindo configurações...");
    
    // Navegar para a tela de configurações
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.button} onPress={handleHistoricoPress}>
        <Text style={styles.buttonText}>Histórico de Captura</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleConfiguracoesPress}>
        <Text style={styles.buttonText}>Configurações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Footer;
