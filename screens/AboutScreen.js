import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import DrawerHeader from './DrawerHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AboutScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity>
        <DrawerHeader />
      </TouchableOpacity>
      <View style={{ alignItems: 'center', marginTop: 25 }}>
        <Image
          source={require('../images/intale.png')}
          style={{ width: 175, height: 175 }}
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: 25, flex: 1, paddingHorizontal: 20 }}>
        <Text style={styles.middleText}>Your digital guide</Text>
        <Text style={styles.middleTextNoPadding}>Small retail is a daily battle.</Text>
        <Text style={styles.middleTextNoPadding}>In Intale we help you to win.</Text>
      </View>
      <View style={styles.bottomText}>
        <Text style={styles.text}>Made with </Text>
        <FontAwesome
          name="heart"
          size={20}
          color="rgb(209 26 26)"
        />
        <Text style={styles.text}> and </Text>
        <FontAwesome
          name="coffee"
          size={20}
          color="rgb(13 91 227)"
        />
        <Text style={styles.text}> in Athens</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  middleText: {
    fontSize: 17,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',  
  },
  middleTextNoPadding: {
    fontSize: 16, 
    textAlign: 'center',
    fontWeight: 'bold',  
  },
});

export default AboutScreen