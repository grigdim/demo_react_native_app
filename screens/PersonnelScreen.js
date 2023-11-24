/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DrawerHeader from './DrawerHeader';
import React, {useState, useEffect, useMemo} from 'react';
import {selectToken, selectStoreId} from '../features/bootstrap';
import {useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import {useTranslation} from 'react-i18next';
import i18next from '../languages/i18n';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Table, Row} from 'react-native-table-component';
import {ip} from '@env';

const PersonnelScreen = () => {
  const {t, i18n} = useTranslation();
  const {width, height} = Dimensions.get('screen');
  const token = useSelector(selectToken);
  const storeId = useSelector(selectStoreId);
  const [userId, setUserId] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    return today;
  });
  const [fromDateFormatted, setFromDateFormatted] = useState(
    fromDate.toISOString().slice(0, 10).concat(' 00:00:00'),
  );
  const [toDate, setToDate] = useState(new Date());
  const [toDateFormatted, setToDateFormatted] = useState(
    toDate.toISOString().slice(0, 10).concat(' 23:59:59'),
  );
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [selectedGroupByDateValue, setSelectedGroupByDate] = useState('WEEK');
  const [dataFromApi, setDataFromApi] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [withDifferenceSelected, setWithDifferenceSelected] = useState(false);
  const [withMoreThanOneTriesSelected, setWithMoreThanOneTriesSelected] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [deviceArray, setDeviceArray] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(1);

  const handleGroupByChange = value => {
    let date = new Date();
    switch (value) {
      case t('day'):
        setFromDate(date);
        setFromDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 00:00:00');
        });
        setToDate(date);
        setToDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 23:59:59');
        });
        break;
      case t('week'):
        let oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        setFromDate(oneWeekAgo);
        setFromDateFormatted(() => {
          return oneWeekAgo.toISOString().slice(0, 10).concat(' 00:00:00');
        });
        setToDate(date);
        setToDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 23:59:59');
        });
        break;
      case t('month'):
        let oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        setFromDate(oneMonthAgo);
        setFromDateFormatted(() => {
          return oneMonthAgo.toISOString().slice(0, 10).concat(' 00:00:00');
        });
        setToDate(date);
        setToDateFormatted(() => {
          return date.toISOString().slice(0, 10).concat(' 23:59:59');
        });
        break;
      default:
        console.log('Value is not "a", "b", or "c"');
        break;
    }
  };

  const defaultSelectedGroupByDateValue = useMemo(() => {
    // console.log(filterByUser);
    switch (selectedGroupByDateValue) {
      case '':
        return '';
      case t('day'):
        return t('day');
      case t('week'):
        return t('week');
      case t('month'):
        return t('month');
      default:
        return t('week');
    }
  }, [selectedGroupByDateValue]);

  const fetchDataFromApi = async () => {
    setLoading(true);

    try {
      var myHeaders = new Headers();
      myHeaders.append('token', token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        `https://bo-api-gr.intalepoint.com/bo/Shifts?filter=POSSystems%2FPOS_StrID%20in%20%28${selectedDevice}%29 and Sft_Start ge ${fromDate
          .toISOString()
          .slice(0, 10)}T00%3A00%3A00%2B03%3A00 and Sft_Start le ${toDate
          .toISOString()
          .slice(0, 10)}T23%3A59%3A59%2B02%3A00`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setDataFromApi(data.value.reverse());
      setTableData(() => {
        let array = [];
        data.value.reverse().map(item => {
          array.push({
            username: item.Sft_Username,
            date: (() => {
              let date = new Date(item.Sft_Start);
              date.setHours(
                date.getHours() + parseInt(item.Sft_Start.slice(21, 22), 10),
              );
              return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date
                .toISOString()
                .slice(11, 16)}`;
            })(),
            duration:
              item.Sft_End === null
                ? 'Active'
                : (() => {
                    let startDate = new Date(item.Sft_Start).getTime();
                    let endDate = new Date(item.Sft_End).getTime();
                    // Calculate the duration in milliseconds
                    let durationInMilliseconds = endDate - startDate;

                    // Convert milliseconds to hours and minutes
                    let hours = Math.floor(
                      durationInMilliseconds / (1000 * 60 * 60),
                    );
                    let minutes = Math.floor(
                      (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60),
                    );

                    // Format the result as HH:MM
                    return `${String(hours).padStart(2, '0')}:${String(
                      minutes,
                    ).padStart(2, '0')}`;
                  })(),
            sftStart: item.Sft_CashStart,
            handover: item.Sft_CashHandOver,
            userClose: item.Sft_End === null ? '-' : item.Sft_TillCash,
            systemClose: item.Sft_End === null ? '-' : item.Sft_CashCheck,
            discrepancy:
              item.Sft_End === null
                ? '-'
                : item.Sft_TillCash - item.Sft_CashCheck,
            logoutAttempts: item.Sft_LogoutAttempts,
            environment: (() => {
              let environmentDevice = deviceArray.filter(
                device => device.Pos_StrID === selectedDevice,
              );
              return environmentDevice[0].POS_Name;
            })(),
          });
          // console.log(array);
        });
        return array;
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPOSSystems = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('token', token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        "https://bo-api-gr.intalepoint.com/bo/POSSystems?$filter=POS_IsVisible eq true and POS_StrID eq 1 and POS_Name ne 'Backoffice'&$orderby=POS_Name desc",
        requestOptions,
      );
      const data = await response.json();
      setDeviceArray(data.value);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserIdFromToken = async () => {
    var myHeaders = new Headers();
    myHeaders.append('token', token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      'https://bo-api-gr.intalepoint.com/bo/account/GetUserIdFromToken',
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        // console.log(result);
        setUserId(result);
      })
      .catch(error => console.log('error', error));
  };

  const fetchStoreUsersList = async () => {
    var myHeaders = new Headers();
    myHeaders.append('token', token);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `https://bo-api-gr.intalepoint.com/bo/account/GetStoreUsersListForSearch?userID=${userId}&storeID=${storeId}&includeCurrentUser=true`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setUsersList(() =>
          result.map(user => ({userId: user.UserId, username: user.UserName})),
        );
      })
      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    fetchPOSSystems();
    getUserIdFromToken();
  }, []);

  useEffect(() => {
    fetchStoreUsersList();
  }, [userId]);

  useEffect(() => {
    deviceArray.length > 0 && fetchDataFromApi();
  }, [fromDateFormatted, toDateFormatted, selectedDevice, deviceArray]);

  // useEffect(() => {
  //   console.log('filter by user', filterByUser);
  // }, [filterByUser]);

  // useEffect(() => {
  //   console.log('filter by device', filterByDevice);
  // }, [filterByDevice]);

  return (
    <View className="flex-1 bg-gray-300">
      <TouchableOpacity style={{width: width, zIndex: 1}}>
        <DrawerHeader />
      </TouchableOpacity>
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-300">
        <View className="w-full h-full space-y-3 mb-3" style={{elevation: 50}}>
          <ScrollView className="space-y-3">
            {/*Date picker start*/}
            <View className="space-y-1 my-2 mx-4">
              <View
                className="bg-gray-200 border rounded-sm h-11 justify-center"
                style={{elevation: 10}}>
                <SelectDropdown
                  dropdownStyle={{
                    backgroundColor: 'lightgray',
                  }}
                  buttonStyle={{
                    width: '100%',
                    height: '99%',
                    backgroundColor: 'rgb(229 231 235)',
                  }}
                  buttonTextStyle={{color: 'rgb(23 37 84)'}}
                  data={[t('day'), t('week'), t('month')]}
                  defaultValue={defaultSelectedGroupByDateValue}
                  onSelect={(selectedItem, index) => {
                    handleGroupByChange(selectedItem);
                    setSelectedGroupByDate(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                />
              </View>
              <TouchableOpacity
                className="bg-gray-200 border-solid border border-blue-950 rounded-sm p-2 flex-row justify-center space-x-1"
                style={{elevation: 50}}
                onPress={() => setOpenFromDate(true)}>
                <Text className="text-center text-base text-blue-950">
                  {t('fromDate')}:
                </Text>
                <DatePicker
                  locale={i18next.language}
                  modal
                  open={openFromDate}
                  date={fromDate}
                  mode={'date'}
                  onConfirm={date => {
                    const startRange1 = new Date(date.getFullYear(), 9, 29); // October 29th
                    const endRange1 = new Date(date.getFullYear() + 1, 2, 26); // March 26th of the following year

                    // Check if the date is within the first range (29 October to 26 March)
                    if (date >= startRange1 && date <= endRange1) {
                      date.setHours(date.getHours() + 2); // Add 3 hours
                    } else {
                      date.setHours(date.getHours() + 3); // Add 2 hours
                    }
                    setOpenFromDate(false);
                    setFromDate(date);
                    setFromDateFormatted(
                      date.toISOString().slice(0, 10).concat(' 00:00:00'),
                    );
                  }}
                  onCancel={() => {
                    setOpenFromDate(false);
                  }}
                  cancelText={t('cancel')}
                  confirmText={t('confirm')}
                  title={t('selectDate')}
                />
                {fromDateFormatted !== '' && (
                  <Text className="text-center text-base text-blue-950">
                    {fromDateFormatted}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{elevation: 50}}
                className="bg-gray-200 border-solid border border-blue-950 rounded-sm p-2 flex-row justify-center space-x-1"
                onPress={() => setOpenToDate(true)}>
                <Text className="text-center text-base text-blue-950">
                  {t('endDate')}:
                </Text>
                <DatePicker
                  locale={i18next.language}
                  modal
                  open={openToDate}
                  date={toDate}
                  mode={'date'}
                  onConfirm={date => {
                    const startRange1 = new Date(date.getFullYear(), 9, 29); // October 29th
                    const endRange1 = new Date(date.getFullYear() + 1, 2, 26); // March 26th of the following year

                    // Check if the date is within the first range (29 October to 26 March)
                    if (date >= startRange1 && date <= endRange1) {
                      date.setHours(date.getHours() + 2); // Add 3 hours
                    } else {
                      date.setHours(date.getHours() + 3); // Add 2 hours
                    }
                    setOpenToDate(false);
                    setToDate(date);
                    setToDateFormatted(
                      date.toISOString().slice(0, 10).concat(' 00:00:00'),
                    );
                  }}
                  onCancel={() => {
                    setOpenToDate(false);
                  }}
                  cancelText={t('cancel')}
                  confirmText={t('confirm')}
                  title={t('selectDate')}
                />
                {toDateFormatted !== '' && (
                  <Text className="text-center text-base text-blue-950">
                    {toDateFormatted}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {/*Date picker end*/}
            {/*Filter View Start*/}
            <View
              className="items-center space-y-5 py-5 mx-4 rounded-md"
              style={{backgroundColor: 'rgb(36, 48, 61)'}}>
              <View>
                <SelectDropdown
                  dropdownStyle={{
                    backgroundColor: 'lightgray',
                  }}
                  data={
                    usersList.length > 0 &&
                    usersList.map(user => `${user.userId} || ${user.username}`)
                  }
                  onSelect={selectedItem => {
                    setSelectedUser(selectedItem);
                  }}
                  buttonTextAfterSelection={selectedItem => {
                    return selectedItem;
                  }}
                  rowTextForSelection={item => {
                    return item;
                  }}
                  buttonStyle={{
                    backgroundColor: 'rgb(36, 48, 61)',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'rgb(0, 182, 240)',
                    width: '75%',
                  }}
                  buttonTextStyle={{color: 'rgb(0, 182, 240)'}}
                />
              </View>

              <View>
                <SelectDropdown
                  dropdownStyle={{
                    backgroundColor: 'lightgray',
                  }}
                  data={deviceArray.map(item => item.POS_Name)}
                  onSelect={selectedItem => {
                    setSelectedDevice(() => {
                      const devices = deviceArray.filter(
                        item => item.POS_Name === selectedItem,
                      );
                      return devices[0].Pos_StrID;
                    });
                  }}
                  buttonTextAfterSelection={selectedItem => {
                    return selectedItem;
                  }}
                  rowTextForSelection={item => {
                    return item;
                  }}
                  buttonStyle={{
                    backgroundColor: 'rgb(36, 48, 61)',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'rgb(0, 182, 240)',
                    width: '75%',
                  }}
                  buttonTextStyle={{color: 'rgb(0, 182, 240)'}}
                />
              </View>
              <TouchableOpacity
                className="flex-row space-x-2 items-center border p-2 rounded-full"
                style={{
                  borderColor: withDifferenceSelected
                    ? 'rgb(0, 182, 240)'
                    : 'rgba(0, 182, 240, 0.6)',
                }}
                onPress={() => {
                  setWithDifferenceSelected(!withDifferenceSelected);
                }}>
                <Ionicons
                  name={withDifferenceSelected ? 'eye' : 'eye-off'}
                  size={22}
                  color={
                    withDifferenceSelected
                      ? 'rgb(0, 182, 240)'
                      : 'rgba(0, 182, 240, 0.6)'
                  }
                />
                <Text
                  style={{
                    color: withDifferenceSelected
                      ? 'rgb(0, 182, 240)'
                      : 'rgba(0, 182, 240, 0.6)',
                  }}>
                  ΜΕ ΔΙΑΦΟΡΑ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row space-x-2 items-center border p-2 rounded-full"
                style={{
                  borderColor: withDifferenceSelected
                    ? 'rgb(0, 182, 240)'
                    : 'rgba(0, 182, 240, 0.6)',
                }}
                onPress={() => {
                  setWithMoreThanOneTriesSelected(
                    !withMoreThanOneTriesSelected,
                  );
                }}>
                <Ionicons
                  name={withMoreThanOneTriesSelected ? 'eye' : 'eye-off'}
                  size={22}
                  color={
                    withMoreThanOneTriesSelected
                      ? 'rgb(0, 182, 240)'
                      : 'rgba(0, 182, 240, 0.6)'
                  }
                />
                <Text
                  style={{
                    color: withMoreThanOneTriesSelected
                      ? 'rgb(0, 182, 240)'
                      : 'rgba(0, 182, 240, 0.6)',
                  }}>
                  ΜΕ ΠΑΝΩ ΑΠΟ ΜΙΑ ΠΡΟΣΠΑΘΕΙΑ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row space-x-2 items-center border p-2 rounded-full border-red-500"
                onPress={() => {
                  setSelectedUser('');
                  setSelectedDevice(1);
                  setWithDifferenceSelected(false);
                  setWithMoreThanOneTriesSelected(false);
                }}>
                <Text className="color-red-500">ΕΚΚΑΘΑΡΙΣΗ ΦΙΛΤΡΩΝ</Text>
              </TouchableOpacity>
            </View>
            {/*Filter View end*/}
            {/*Shift Table start*/}
            {loading ? (
              <ActivityIndicator color="rgb(34 211 238)" size="large" />
            ) : (
              dataFromApi.length > 0 && (
                <View className="space-y-2 px-2 mx-2">
                  <ScrollView horizontal className="pb-1">
                    <Table
                      style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderRadius: 5,
                      }}>
                      <Row
                        data={[
                          t('username'),
                          t('date'),
                          t('duration'),
                          t('sft_start'),
                          t('handover'),
                          t('user_close'),
                          t('system_close'),
                          t('discrepancy'),
                          t('attempts'),
                          t('environment'),
                        ]}
                        style={{
                          alignContent: 'center',
                          backgroundColor: 'rgb(0, 182, 240)',
                          // paddingRight: 2,
                          // paddingLeft: 2,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                        }}
                        textStyle={{
                          textAlign: 'center',
                          color: 'white',
                          fontSize: 12,
                          marginVertical: 3,
                        }}
                        widthArr={[
                          100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
                        ]}
                      />
                      <View className="divide-y divide-gray-200 rounded-b-md">
                        {tableData.reverse().map((item, index) => (
                          <Row
                            key={index}
                            style={{
                              alignContent: 'center',
                              paddingTop: 4,
                              paddingBottom: 4,
                              paddingLeft: 2,
                              paddingRight: 2,
                              height: 25,
                            }}
                            textStyle={{
                              textAlign: 'center',
                              fontSize: 12,
                              color: 'black',
                            }}
                            widthArr={Object.entries(item).map(entry => 100)}
                            data={Object.entries(item).map(entry => {
                              // console.log(entry);
                              return entry[1];
                            })}
                          />
                        ))}
                      </View>
                    </Table>
                  </ScrollView>
                </View>
              )
            )}
            {/*Shift Table end*/}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PersonnelScreen;
