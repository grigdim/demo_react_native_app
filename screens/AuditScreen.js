/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, SafeAreaView, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {selectToken} from '../features/bootstrap';
import {useSelector} from 'react-redux';

const AuditScreen = () => {
  const token = useSelector(selectToken);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAuditData = async () => {
    setLoading(true);
    if (token) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://dev-bo-api-gr.azurewebsites.net/bo/Audits/GetInventoryDetails?auditIds=700',
        requestOptions,
      );
      const data = await response.json();
      setAudit(data);
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      {loading ? (
        <ActivityIndicator color="rgb(34 211 238)" size="large" />
      ) : (
        <View>
          <View
            className="py-2 px-5 my-5 bg-gray-200 border border-solid border-cyan-200 rounded-xl"
            style={{elevation: 10}}>
            <Text className="text-cyan-400 text-center font-bold text-3xl">
              Audit data
            </Text>
          </View>
          {audit.length > 0 && (
            <View>
              <View
                className="bg-gray-200 border border-solid border-cyan-200 rounded-xl p-2"
                style={{elevation: 10}}
                key={audit[0].Aud_ID}>
                <Text className="m-1 text-xl">ID: {audit[0].Aud_ID}</Text>
                <Text className="m-1 text-xl">
                  Started: {new Date(audit[0].Aud_Started).toLocaleString()}
                </Text>
                <Text className="m-1 text-xl">
                  Ended: {new Date(audit[0].Aud_Ended).toLocaleString()}
                </Text>
                <Text className="m-1 text-xl">
                  Products Count: {audit[0].Aud_ProdsCount}
                </Text>
                <Text className="m-1 text-xl">
                  Warehouse ID:{' '}
                  {audit[0].Aud_WhsID ? audit[0].Aud_WhsID : 'null'}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default AuditScreen;
