/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {selectToken} from '../features/bootstrap';
import {useSelector} from 'react-redux';
import {ip} from '@env';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';

const SalesInsightsScreen = () => {
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectAllCategories, setSelectAllCategories] = useState(false);
  const [showSelectedCategories, setShowSelectedCategories] = useState(false);
  const categoryInputRef = useRef(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);

  const fetchProductCategoryNamesFromBoApi = async () => {
    setLoading(true);
    if (__DEV__ && token) {
      var myHeaders = new Headers();
      myHeaders.append('Token', token);
      myHeaders.append('Content-Type', 'application/json');
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        `http://${ip}:3000/bo/Reports/GetProductCategoryNamesFromTopProducts`,
        requestOptions,
      );
      const data = await response.json();
      setCategories(() => {
        let arr = [];
        data.map(item => {
          arr.push({name: item, isChecked: false, isVisible: true});
        });
        return arr;
      });
    }
    setLoading(false);
    // end of request
  };

  useEffect(() => {
    setSelectedCategories(() => {
      let arr = [];
      categories.map(item => {
        if (item.isChecked) {
          arr.push(item.name);
        }
      });
      return arr;
    });
  }, [categories]);

  useEffect(() => {
    console.log('====================================');
    console.log(selectedCategories);
    console.log('====================================');
  }, [selectedCategories]);

  useEffect(() => {
    fetchProductCategoryNamesFromBoApi();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {loading ? (
        <ActivityIndicator
          color="rgb(34 211 238)"
          size="large"
          className="mx-auto my-auto"
        />
      ) : (
        <ScrollView
          className="bg-gray-200 space-y-2"
          contentContainerStyle={{
            alignItems: 'center',
          }}>
          <View
            className="rounded-md bg-white p-2 my-4 w-10/12 space-y-2"
            style={{elevation: 10}}>
            <TouchableOpacity
              className="items-center space-y-2"
              onPress={() => setCategoryModalVisible(true)}>
              <View>
                {selectedCategories.length > 0 ? (
                  <Text className="underline text-xl font-extrabold">
                    Selected Categories
                  </Text>
                ) : (
                  <Text className="underline text-xl font-extrabold">
                    Choose Category
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            {selectedCategories.length > 0 && (
              <View className="">
                {selectedCategories.map(item => {
                  return (
                    <View className="flex-row items-center space-x-2">
                      <View>
                        <Fontisto name="check" />
                      </View>
                      <View>
                        <Text>{item}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      )}
      <Modal visible={categoryModalVisible}>
        <View className="bg-gray-200 flex-1 items-center justify-center">
          {categories.length > 0 ? (
            <View className="space-y-2 items-center h-5/6 w-full">
              <View className="my-4">
                <Text className="text-xl font-extrabold border p-2 rounded-md">
                  Available Categories
                </Text>
              </View>
              <ScrollView className="space-y-2">
                {categories.map((item, index) => {
                  if (item.isVisible) {
                    return (
                      <TouchableOpacity
                        key={index}
                        className="flex-row items-center space-x-2"
                        onPress={() => {
                          setCategories(prevState => {
                            const newState = prevState.map(obj => {
                              if (obj.name === item.name) {
                                const updatedObj = {...obj};
                                updatedObj.isChecked = !updatedObj.isChecked;
                                return updatedObj;
                              }
                              return obj;
                            });
                            return newState;
                          });
                        }}>
                        <View>
                          <Fontisto
                            name={
                              item.isChecked
                                ? 'checkbox-active'
                                : 'checkbox-passive'
                            }
                          />
                        </View>
                        <View>
                          <Text className="text-lg">{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                })}
              </ScrollView>
              <View className="flex-row items-center justify-evenly w-full">
                <View>
                  {showSelectedCategories ? (
                    <TouchableOpacity
                      onPress={() => {
                        setShowSelectedCategories(false);
                        setCategories(prevState => {
                          const newState = prevState.map(obj => {
                            if (obj.isVisible === false) {
                              const updatedObj = {...obj};
                              updatedObj.isVisible = !updatedObj.isVisible;
                              return updatedObj;
                            }
                            return obj;
                          });
                          return newState;
                        });
                      }}
                      className="border rounded-xl p-2">
                      <Text className="text-lg">Show all</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setShowSelectedCategories(true);
                        setCategories(prevState => {
                          const newState = prevState.map(obj => {
                            if (!obj.isChecked) {
                              const updatedObj = {...obj};
                              updatedObj.isVisible = !updatedObj.isVisible;
                              console.log(
                                '====================================',
                              );
                              console.log(updatedObj);
                              console.log(
                                '====================================',
                              );
                              return updatedObj;
                            }
                            return obj;
                          });
                          return newState;
                        });
                      }}
                      className="border rounded-xl p-2">
                      <Text className="text-lg">Show selected</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View>
                  {selectAllCategories ? (
                    <TouchableOpacity
                      onPress={() => {
                        setCategories(() => {
                          let arr = [];
                          categories.map(item => {
                            arr.push({
                              name: item.name,
                              isChecked: false,
                              isVisible: true,
                            });
                          });
                          return arr;
                        });
                        setSelectAllCategories(false);
                      }}
                      className="border rounded-xl p-2">
                      <Text className="text-lg">Unselect all</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setCategories(() => {
                          let arr = [];
                          categories.map(item => {
                            arr.push({
                              name: item.name,
                              isChecked: true,
                              isVisible: true,
                            });
                          });
                          return arr;
                        });
                        setSelectAllCategories(true);
                      }}
                      className="border rounded-xl p-2">
                      <Text className="text-lg">Select all</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text className="text-xl font-extrabold">
                There is no data available
              </Text>
            </View>
          )}
          <View className="my-2  h-1/6 justify-center items-center">
            <TouchableOpacity
              onPress={() => setCategoryModalVisible(false)}
              className="w-full flex-row items-center space-x-4">
              <Fontisto name="close-a" size={20} />
              <Text className="text-2xl font-extrabold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    color: 'black',
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default SalesInsightsScreen;
