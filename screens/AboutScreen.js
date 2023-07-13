import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import DrawerHeader from './DrawerHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

const AboutScreen = () => {
  const { t, i18n } = useTranslation();

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
        <Text style={styles.middleText}>{t("yourDigitalGuideAboutScreen")}</Text>
        <Text style={styles.middleTextNoPadding}>{t("smallRetailAboutScreen")}</Text>
        <Text style={styles.middleTextNoPadding}>{t("inIntaleWeHelpAboutScreen")}</Text>
      </View>
      <View style={styles.bottomText}>
        <Text style={styles.text}> {t("madeWithAboutScreen")} </Text>
        <FontAwesome
          name="heart"
          size={20}
          color="rgb(209 26 26)"
        />
        <Text style={styles.text}> {t("andAboutScreen")} </Text>
        <FontAwesome
          name="coffee"
          size={20}
          color="rgb(40 143 251)"
        />
        <Text style={styles.text}> {t("inAthensAboutScreen")}</Text>
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