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
import {selectToken} from '../features/bootstrap';
import {useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import {useTranslation} from 'react-i18next';
import i18next from '../languages/i18n';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Table, Row} from 'react-native-table-component';

const StoreActivityScreen = () => {
  const {t, i18n} = useTranslation();
  const {width, height} = Dimensions.get('screen');
  const token = useSelector(selectToken);
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
  const [activityCategoryArray, setActivityCategoryArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed
  // Calculate the range of items to display based on the current page and items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, tableData.length);

  const itemsToDisplay = tableData.reverse().slice(startIndex, endIndex);

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

  const fetchActivityCategories = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('token', token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://bo-api-gr.intalepoint.com/bo/ActivityLogType?$select=ActLogTyp_ID,ActlogTyp_Name',
        requestOptions,
      );
      const data = await response.json();
      // console.log(data);
      setActivityCategoryArray(data.value);
    } catch (error) {
      console.log(error);
    }
  };

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
        'https://bo-api-gr.intalepoint.com/bo/ActivityLog?$select=ActLog_ID,ActLog_AttrValue,ActLog_AttrName,ActLog_Datetime,ActLog_UserID,ActLog_UserName,ActLog_SftID,ActLog_TypeID,ActLog_ActionID,ActLog_Description,ActLog_Platform,ActLog_ClientIP&$expand=ActivityLogType($select=ActLogTyp_ID,ActlogTyp_Name),ActivityLogAction($select=ActLogAct_ID,ActLogAct_Name),POSSystems($select=POS_Id,POS_StrID,POS_Name)&$filter=ActLog_Datetime ge 2023-10-30T00%3A00%3A00%2B03%3A00 and ActLog_Datetime le 2023-11-06T23%3A59%3A59%2B02%3A00 and POSSystems%2FPOS_StrID%20in%20%281%29 and POSSystems%2FPOS_Id%20gt%200&$orderby=ActLog_ID asc',
        requestOptions,
      );
      const data = await response.json();
      // console.log(data.value.filter(item => item.ActLog_ID === 306604));
      setDataFromApi(data.value);
      setTableData(() => {
        let array = [];
        data.value.reverse().map(item => {
          array.push({
            username: item.ActLog_UserName,
            date: (() => {
              let date = new Date(item.ActLog_Datetime);
              return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} @ ${date.getHours()}:${date.getMinutes()}`;
            })(),
            environment: item.POSSystems.POS_Name,
            category: item.ActivityLogType.ActlogTyp_Name,
            action: item.ActivityLogAction.ActLogAct_Name,
            description: item.ActLog_AttrValue,
          });
        });
        // console.log(array);
        return array;
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchActivityCategories();
  }, []);

  useEffect(() => {
    fetchDataFromApi();
  }, [fromDateFormatted, toDateFormatted]);

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
                  data={activityCategoryArray.map(item => item.ActlogTyp_Name)}
                  defaultValue={'Week'}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem);

                    // handleGroupByChange(selectedItem);
                    // setSelectedGroupByDate(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
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
                className="flex-row space-x-2 items-center border p-2 rounded-full border-red-500"
                onPress={() => {}}>
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
                          t('environment'),
                          t('category'),
                          t('action'),
                          t('description'),
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
                          fontSize: 14,
                          marginVertical: 3,
                        }}
                        widthArr={[150, 150, 150, 150, 150, 150]}
                      />
                      <View className="divide-y divide-gray-200 rounded-b-md">
                        {itemsToDisplay.map((item, index) => (
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
                            widthArr={Object.entries(item).map(
                              entry => 150,
                              150,
                              150,
                              150,
                              150,
                              150,
                            )}
                            data={Object.entries(item).map(entry => {
                              // console.log(entry);
                              return entry[1];
                            })}
                          />
                        ))}
                      </View>
                    </Table>
                  </ScrollView>
                  <View className="flex flex-row space-x-4 justify-center">
                    <TouchableOpacity
                      className="bg-slate-600 px-2 py-1 rounded-md color-white"
                      onPress={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}>
                      <Text className="color-white">Previous</Text>
                    </TouchableOpacity>
                    <Text className="bg-slate-600 px-2 py-1 rounded-full color-white">
                      {currentPage}
                    </Text>
                    <TouchableOpacity
                      className="bg-slate-600 px-2 py-1 rounded-md color-white"
                      onPress={() => setCurrentPage(currentPage + 1)}
                      disabled={endIndex >= tableData.length}>
                      <Text className="color-white">Next</Text>
                    </TouchableOpacity>
                  </View>
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

export default StoreActivityScreen;
