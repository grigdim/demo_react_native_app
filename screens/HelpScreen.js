/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import React from 'react';
import DrawerHeader from './DrawerHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import {useInfo} from '../components/PersonalInfoTaken';

const HelpScreen = () => {
  const {t, i18n} = useTranslation();
  const {domain, storeId} = useInfo();

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity>
        <DrawerHeader />
      </TouchableOpacity>
      <View
        style={{
          alignItems: 'flex-start',
          marginTop: 25,
          paddingHorizontal: 20,
        }}>
        <Text style={styles.text}>{t('titleHelpScreen')}</Text>
        <Text style={[styles.text, {marginTop: 10}]}>
          {t('secondTitleHelpScreen')}
        </Text>
      </View>
      <View style={{marginTop: 15, paddingHorizontal: 20, flex: 1}}>
        <Text style={styles.capsText}>{t('callCenterHelpScreen')}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:2109211700')}>
          <Text style={styles.detailsText}>
            <FontAwesome
              name="phone"
              size={30}
              color="rgb(80 143 251)"
              style={{marginRight: 5}}
            />
            <Text>{'  '}210 92 11 700</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>{t('emailHelpScreen')}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('mailto:help@intale.com')}>
          <Text style={styles.detailsText}>
            <FontAwesome
              name="envelope"
              size={30}
              color="rgb(80 143 251)"
              style={{marginRight: 5}}
            />
            <Text>{'  '}help@intale.com</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>{t('manualHelpScreen')}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://guide.intalepoint.com/')}>
          <Text style={styles.detailsText}>
            <FontAwesome
              name="book"
              size={30}
              color="rgb(80 143 251)"
              style={{marginRight: 5}}
            />
            <Text>{'  '}guide.intalepoint.com</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>{t('onlineCenterHelpScreen')}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://help.intalepoint.com/')}>
          <Text style={styles.detailsText}>
            <FontAwesome
              name="life-ring"
              size={30}
              color="rgb(80 143 251)"
              style={{marginRight: 5}}
            />
            <Text>{'  '}help.intalepoint.com</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>{t('trainingVideosHelpScreen')}</Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.youtube.com/watch?v=oHJKl-3930k')
          }>
          <Text style={styles.detailsText}>
            <FontAwesome
              name="youtube-play"
              size={30}
              color="rgb(80 143 251)"
              style={{marginRight: 5}}
            />
            <Text>{'  '}Youtube : Intale Inc.</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginBottom: 20, paddingHorizontal: 20}}>
        <Text style={styles.bottomText}>{t('storeInformationHelpScreen')}</Text>
        <View style={{marginTop: 15}}>
          <Text style={styles.infoText}>
            {t('domainHelpScreen')}:{'  '}
            <Text style={{color: 'black'}}>{domain}</Text>
          </Text>
          <Text style={styles.infoText}>
            {t('storeIdHelpScreen')}:{'  '}
            <Text style={{color: 'black'}}>{storeId}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 15,
    paddingVertical: 2,
    fontWeight: 'bold',
  },
  infoText: {
    color: 'gray',
    fontSize: 15,
    paddingVertical: 2,
    fontWeight: 'bold',
  },
  bottomText: {
    color: 'black',
    marginTop: 10,
    fontSize: 17,
    marginRight: 10,
    fontWeight: 'bold',
  },
  capsText: {
    color: 'black',
    marginTop: 15,
    fontSize: 17,
    marginRight: 10,
    fontWeight: 'bold',
  },
  detailsText: {
    color: 'gray',
    fontSize: 16,
    marginTop: 5,
    marginRight: 10,
    fontWeight: 'bold',
  },
});

export default HelpScreen;
