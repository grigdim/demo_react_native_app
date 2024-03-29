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
import React, {useState, useEffect, useMemo, useRef} from 'react';
import {selectToken, selectStoreId, selectStrId} from '../features/bootstrap';
import {useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import {useTranslation} from 'react-i18next';
import i18next from '../languages/i18n';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Table, Row} from 'react-native-table-component';
// import {ip} from '@env';

const StoreActivityScreen = () => {
  const {t} = useTranslation();
  const {width} = Dimensions.get('screen');
  const token = useSelector(selectToken);
  const storeId = useSelector(selectStoreId);
  const strId = useSelector(selectStrId);
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
  const [tableData, setTableData] = useState([]);
  const [activityCategoryArray, setActivityCategoryArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed
  // Calculate the range of items to display based on the current page and items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, tableData.length);
  const [itemsToDisplay, setItemsToDisplay] = useState(tableData.slice(0, 10));
  const [deviceArray, setDeviceArray] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(1);
  const [intaleBackOfficeSelected, setIntaleBackOfficeSelected] =
    useState(false);
  const [filters, setFilters] = useState({
    category: undefined,
    user: undefined,
    // device: 1,
    environment: undefined,
  });
  const [filteredData, setFilteredData] = useState([]);
  const categoryDropdownRef = useRef();
  const userDropdownRef = useRef();
  const deviceDropdownRef = useRef();

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
      // console.log(data.value.map(item => item.ActlogTyp_Name));
      setActivityCategoryArray(data.value.map(item => item.ActlogTyp_Name));
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
        `https://bo-api-gr.intalepoint.com/bo/POSSystems?$filter=POS_IsVisible eq true and POS_StrID eq ${strId} and POS_Name ne 'Backoffice'&$orderby=POS_Name desc`,
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
        // console.log(result);
        setUsersList(() =>
          result.map(user => ({userId: user.UserId, username: user.UserName})),
        );
      })
      .catch(error => console.log('error', error));
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
        `https://bo-api-gr.intalepoint.com/bo/ActivityLog?$select=ActLog_ID,ActLog_AttrValue,ActLog_AttrName,ActLog_Datetime,ActLog_UserID,ActLog_UserName,ActLog_SftID,ActLog_TypeID,ActLog_ActionID,ActLog_Description,ActLog_Platform,ActLog_ClientIP&$expand=ActivityLogType($select=ActLogTyp_ID,ActlogTyp_Name),ActivityLogAction($select=ActLogAct_ID,ActLogAct_Name),POSSystems($select=POS_Id,POS_StrID,POS_Name)&$filter=ActLog_Datetime ge ${fromDate
          .toISOString()
          .slice(0, 10)}T00%3A00%3A00%2B03%3A00 and ActLog_Datetime le ${toDate
          .toISOString()
          .slice(
            0,
            10,
          )}T23%3A59%3A59%2B02%3A00 and POSSystems%2FPOS_StrID%20in%20%28${strId}%29 and POSSystems%2FPOS_Id%20gt%200&$orderby=ActLog_ID asc`,
        requestOptions,
      );
      const data = await response.json();
      // console.log(data.value);

      setTableData(() => {
        let array = [];
        data.value.reverse().map(item => {
          array.push({
            username: item.ActLog_UserName,
            date: (() => {
              let date = new Date(item.ActLog_Datetime);
              return `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()} @ ${date.getHours()}:${
                date.getMinutes() < 10 ? '0' : ''
              }${date.getMinutes()}`;
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
    fetchPOSSystems();
    getUserIdFromToken();
  }, []);

  useEffect(() => {
    fetchStoreUsersList();
  }, [userId]);

  useEffect(() => {
    fetchActivityCategories();
  }, []);

  useEffect(() => {
    fetchDataFromApi();
  }, [fromDateFormatted, toDateFormatted, selectedDevice]);

  useEffect(() => {
    setFilteredData([...tableData]);
  }, [tableData]);

  useEffect(() => {
    setItemsToDisplay(filteredData.slice(startIndex, endIndex));
  }, [startIndex, endIndex, filteredData]);

  useEffect(() => {
    if (
      filters.user === undefined &&
      filters.environment === undefined &&
      filters.category === undefined
      // filters.device === undefined
    ) {
      setFilteredData([...tableData]);
    } else {
      for (const key in filters) {
        switch (key) {
          case 'environment':
            filters[key] !== undefined
              ? setFilteredData(() =>
                  tableData.filter(item => item.environment === filters[key]),
                )
              : null;
            break;
          case 'category':
            filters[key] !== undefined
              ? setFilteredData(prev =>
                  prev.filter(item => item.category === filters[key]),
                )
              : null;
            break;
          // case 'device':
          //   filters[key] !== undefined
          //     ? setFilteredData(prev =>
          //         prev.filter(item => item.environment === filters[key]),
          //       )
          //     : null;
          //   break;
          case 'user':
            filters[key] !== undefined
              ? setFilteredData(prev =>
                  prev.filter(item => item.user === filters[key]),
                )
              : null;
            break;
          default:
            console.log(`Unknown filter: ${key}`);
        }
      }
    }
  }, [filters]);

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
                <Text className="text-center text-white p-2">
                  Select a category
                </Text>
                <SelectDropdown
                  ref={categoryDropdownRef}
                  dropdownStyle={{
                    backgroundColor: 'lightgray',
                  }}
                  data={activityCategoryArray}
                  defaultValue={undefined}
                  defaultButtonText="Select a category"
                  onSelect={selectedItem => {
                    setFilters(prev => {
                      const newFilters = {...prev};
                      newFilters.category = selectedItem;
                      return newFilters;
                    });
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
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
                <Text className="text-center text-white p-2">
                  Select a user
                </Text>
                <SelectDropdown
                  ref={userDropdownRef}
                  dropdownStyle={{
                    backgroundColor: 'lightgray',
                  }}
                  data={
                    usersList.length > 0 &&
                    usersList.map(user => `${user.userId} || ${user.username}`)
                  }
                  defaultValue={undefined}
                  defaultButtonText="Select a user"
                  onSelect={selectedItem => {
                    setFilters(prev => {
                      const newFilters = {...prev};
                      newFilters.user = selectedItem.split('||')[1].trim();
                      return newFilters;
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
              <View>
                <Text className="text-center text-white p-2">
                  Select a device
                </Text>
                <SelectDropdown
                  dropdownStyle={{
                    backgroundColor: 'lightgray',
                  }}
                  ref={deviceDropdownRef}
                  data={deviceArray.map(item => item.POS_Name)}
                  defaultValue={1}
                  defaultButtonText="Select a device"
                  onSelect={selectedItem => {
                    setFilters(prev => {
                      const newFilters = {...prev};
                      newFilters.environment = selectedItem;
                      return newFilters;
                    });
                    setIntaleBackOfficeSelected(false);
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
                disabled={intaleBackOfficeSelected}
                className="flex-row space-x-2 items-center border p-2 rounded-full"
                style={{
                  borderColor: intaleBackOfficeSelected
                    ? 'rgb(0, 182, 240)'
                    : 'rgba(0, 182, 240, 0.6)',
                }}
                onPress={() => {
                  setFilters(prev => {
                    const newFilters = {...prev};
                    newFilters.environment = 'Backoffice';
                    return newFilters;
                  });
                  deviceDropdownRef.current.reset();
                  setIntaleBackOfficeSelected(!intaleBackOfficeSelected);
                }}>
                <Ionicons
                  name={intaleBackOfficeSelected ? 'eye' : 'eye-off'}
                  size={22}
                  color={
                    intaleBackOfficeSelected
                      ? 'rgb(0, 182, 240)'
                      : 'rgba(0, 182, 240, 0.6)'
                  }
                />
                <Text
                  style={{
                    color: intaleBackOfficeSelected
                      ? 'rgb(0, 182, 240)'
                      : 'rgba(0, 182, 240, 0.6)',
                  }}>
                  INTALE BACK OFFICE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row space-x-2 items-center border p-2 rounded-full border-red-500"
                onPress={() => {
                  setSelectedDevice(1);
                  setFilters({
                    category: undefined,
                    user: undefined,
                    environment: undefined,
                  });
                  categoryDropdownRef.current.reset();
                  userDropdownRef.current.reset();
                  deviceDropdownRef.current.reset();
                  setIntaleBackOfficeSelected(false);
                }}>
                <Text className="color-red-500">ΕΚΚΑΘΑΡΙΣΗ ΦΙΛΤΡΩΝ</Text>
              </TouchableOpacity>
            </View>
            {/*Filter View end*/}
            {/*Shift Table start*/}
            {loading ? (
              <ActivityIndicator color="rgb(34 211 238)" size="large" />
            ) : (
              tableData.length > 0 && (
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
                            widthArr={Object.entries(item).map(entry => 150)}
                            data={Object.entries(item).map(entry => {
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
                      disabled={endIndex >= filteredData.length}>
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
