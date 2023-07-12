import { View, Text, ScrollView, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import React from 'react';
import DrawerHeader from './DrawerHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const hardCodedBrandName = 'SAKE A.E'
const hardCodedVAT = '123456789'
const hardCodedStoreId = '55589'
const hardCodedPos = '2'

const HelpScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity>
        <DrawerHeader />
      </TouchableOpacity>
      <View style={{ alignItems: 'flex-start', marginTop: 25, paddingHorizontal: 20 }}>
        <Text style={styles.text}>We are with you 24 hours a day, 7 days a week, 365 days a year</Text>
        <Text style={[styles.text, { marginTop: 10 }]}>Contact us with one of the following ways below and find out what you need</Text>
      </View>
      <View style={{ marginTop: 15, paddingHorizontal: 20, flex: 1}}>

        <Text style={styles.capsText}>CALL CENTER SUPPORT</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:2109211700')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="phone" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>  210 92 11 700</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>PROPOSAL COMMUNICATION E-MAIL</Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:help@intale.com')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="envelope" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>  help@intale.com</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>USAGE MANUAL</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://guide.intalepoint.com/')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="book" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>  guide.intalepoint.com</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>ONLINE SUPPORT CENTER</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://help.intalepoint.com/')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="life-ring" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>  help.intalepoint.com</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.capsText}>TRAINING VIDEOS</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/watch?v=oHJKl-3930k')}>
          <Text style={styles.detailsText}>
            <FontAwesome name="youtube-play" size={30} color="rgb(80 143 251)" style={{ marginRight: 5 }} />
            <Text>  Youtube : Intale Inc.</Text>
          </Text>
        </TouchableOpacity>

      </View>
      <View style={{ marginBottom: 20, paddingHorizontal: 20 }}>
        <Text style={styles.bottomText}>STORE INFORMATION</Text>
        <View style={{ marginTop: 15 }} >
          <Text style={styles.infoText}>BRAND NAME:{'  '}
            <Text style={{color:'black'}}>
              {hardCodedBrandName}
            </Text>
          </Text>
          <Text style={styles.infoText}>VAT:{'  '}
            <Text style={{color:'black'}}>
              {hardCodedVAT}
            </Text>
          </Text>
          <Text style={styles.infoText}>STORE ID:{'  '}
            <Text style={{color:'black'}}>
              {hardCodedStoreId}
            </Text>
          </Text>
          <Text style={styles.infoText}>POS:{'  '}
            <Text style={{color:'black'}}>
              {hardCodedPos}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    paddingVertical: 3,
    fontWeight: 'bold'
  },
  infoText: {
    fontSize: 14,
    paddingVertical: 3,
    fontWeight: 'bold'
  },
  bottomText: {
    marginTop: 10,
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  capsText: {
    marginTop: 15,
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  detailsText: {
    fontSize: 15,
    marginTop: 5,
    marginRight: 10,
    fontWeight: 'bold',
  }
});


export default HelpScreen