import { View, Text, ScrollView, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import React from 'react';
import DrawerHeader from './DrawerHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { useInfo } from '../components/PersonalInfoTaken';

const hardCodedBrandName = 'SAKE A.E'
// const hardCodedVAT = '123456789'
// const hardCodedPrimaryEmail = 'dasasd@hotmail.com'
const hardCodedStoreId = '55589'
const hardCodedPos = '2'

const HelpScreen = () => {
  const { t, i18n } = useTranslation();
  const {vatNumber, primaryEmail}  = useInfo();

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity>
        <DrawerHeader />
      </TouchableOpacity>
      <View style={{ alignItems: 'flex-start', marginTop: 25, paddingHorizontal: 20 }}>
        <Text style={styles.text}>{t("titleHelpScreen")}</Text>
        <Text style={[styles.text, { marginTop: 10 }]}>{t("secondTitleHelpScreen")}</Text>
      </View>
      <View style={{ marginTop: 15, paddingHorizontal: 20, flex: 1 }}>

        <Text style={styles.capsText}>{t("callCenterHelpScreen")}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:2109211700')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="phone" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>{'  '}210 92 11 700</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>{t("emailHelpScreen")}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:help@intale.com')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="envelope" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>{'  '}help@intale.com</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>{t("manualHelpScreen")}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://guide.intalepoint.com/')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="book" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>{'  '}guide.intalepoint.com</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>{t("onlineCenterHelpScreen")}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://help.intalepoint.com/')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="life-ring" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>{'  '}help.intalepoint.com</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>{t("trainingVideosHelpScreen")}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/watch?v=oHJKl-3930k')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="youtube-play" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>{'  '}Youtube : Intale Inc.</Text>
          </Text>
        </TouchableOpacity>

      </View>
      <View style={{ marginBottom: 20, paddingHorizontal: 20 }}>
        <Text style={styles.bottomText}>{t("storeInformationHelpScreen")}</Text>
        <View style={{ marginTop: 15 }} >
          {/* <Text style={styles.infoText}>{t("brandHelpScreen")}:{'  '}
            <Text style={{ color: 'black' }}>
              {hardCodedBrandName}
            </Text>
          </Text> */}
          <Text style={styles.infoText}>{t("vatHelpScreen")}:{'  '}
            <Text style={{ color: 'black' }}>
              {vatNumber} 
            </Text>
          </Text>
          <Text style={styles.infoText}>{t("primaryEmailHelpScreen")}:{'  '}
            <Text style={{ color: 'black' }}>
              {primaryEmail} 
            </Text>
          </Text>
          {/* <Text style={styles.infoText}>{t("storeHelpScreen")}:{'  '}
            <Text style={{ color: 'black' }}>
              {hardCodedStoreId}
            </Text>
          </Text>
          <Text style={styles.infoText}>{t("posHelpScreen")}:{'  '}
            <Text style={{ color: 'black' }}>
              {hardCodedPos}
            </Text>
          </Text> */}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    paddingVertical: 2,
    fontWeight: 'bold'
  },
  infoText: {
    fontSize: 15,
    paddingVertical: 2,
    fontWeight: 'bold'
  },
  bottomText: {
    marginTop: 10,
    fontSize: 17,
    marginRight: 10,
    fontWeight: 'bold',
  },
  capsText: {
    marginTop: 15,
    fontSize: 17,
    marginRight: 10,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 16,
    marginTop: 5,
    marginRight: 10,
    fontWeight: 'bold',
  }
});


export default HelpScreen