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
  const authorizedUser = true;
  const token = useSelector(selectToken);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectAllCategories, setSelectAllCategories] = useState(false);

  const [showSelectedCategories, setShowSelectedCategories] = useState(false);
  const [showSelectedSubCategories, setShowSelectedSubCategories] =
    useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [selectAllSubCategories, setSelectAllSubCategories] = useState(false);

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

  const fetchProductSubCategoryNamesFromTopProducts = async () => {
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
      try {
        const promises = selectedCategories.map(async category => {
          const response = await fetch(
            `http://${ip}:3000/bo/Reports/GetProductSubCategoryNamesFromTopProducts?productCategoryName=${category}`,
            requestOptions,
          );
          const data = await response.json();
          // console.log(data);
          let subArray = [];
          data.map(item => {
            subArray.push({
              subCategoryName: item,
              isChecked: false,
              isVisible: true,
            });
          });
          return {
            categoryName: category,
            subCategories: subArray,
            isVisible: true,
          };
        });
        const arr = await Promise.all(promises);
        setSubCategories(arr);
      } catch (error) {
        console.error('Error occurred while fetching subcategories:', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductSubCategoryNamesFromTopProducts();
  }, [selectedCategories]);

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
    setSelectedSubCategories(() => {
      // console.log(subCategories);
      let outerArr = [];
      subCategories.map(outerObj => {
        // console.log(outerObj.categoryName);
        let innerArr = [];
        outerObj.subCategories.map(innerObj => {
          if (innerObj.isChecked) {
            innerArr.push(innerObj.subCategoryName);
          }
        });
        if (innerArr.length > 0) {
          outerArr.push({
            categoryName: outerObj.categoryName,
            selectedSubCategories: innerArr,
          });
        }
      });
      return outerArr;
    });
  }, [subCategories]);

  useEffect(() => {
    fetchProductCategoryNamesFromBoApi();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {authorizedUser ? (
        loading ? (
          <ActivityIndicator
            color="rgb(34 211 238)"
            size="large"
            className="mx-auto my-auto"
          />
        ) : (
          <ScrollView
            className="bg-gray-300 space-y-2"
            contentContainerStyle={{
              alignItems: 'center',
            }}>
            <View
              className="rounded-md bg-white p-2 my-10 w-10/12 space-y-2"
              style={{elevation: 15}}>
              <TouchableOpacity
                className="items-center space-y-2"
                onPress={() => setCategoryModalVisible(true)}>
                <View>
                  {selectedCategories.length > 0 ? (
                    <Text className="underline text-xl font-extrabold">
                      Selected Categories
                    </Text>
                  ) : (
                    <Text className=" text-xl font-extrabold">
                      Press to choose a category
                    </Text>
                  )}
                </View>
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
              </TouchableOpacity>
            </View>
            <View
              className="rounded-md bg-white p-2 my-10 w-10/12 space-y-2"
              style={{elevation: 15}}>
              <TouchableOpacity
                className="items-center space-y-2"
                onPress={() => setSubCategoryModalVisible(true)}>
                <View>
                  {selectedSubCategories.length > 0 ? (
                    <Text className="underline text-xl font-extrabold">
                      Selected Sub Categories
                    </Text>
                  ) : (
                    <Text className=" text-xl font-extrabold">
                      Press to choose sub categories
                    </Text>
                  )}
                </View>
                {selectedSubCategories.length > 0 && (
                  <View className="">
                    {selectedSubCategories.map(item => {
                      return (
                        <View>
                          <View>
                            <Text>{item.categoryName}</Text>
                          </View>
                          {item.selectedSubCategories.map(innerItem => {
                            return (
                              <View className="flex-row items-center space-x-2">
                                <View>
                                  <Fontisto name="check" />
                                </View>
                                <View>
                                  <Text>{innerItem}</Text>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )
      ) : (
        <View
          className="mx-auto my-auto w-2/3 bg-white rounded-lg p-4"
          style={{elevation: 25}}>
          <Text className="text-center text-xl font-extrabold">
            You do not have access to this page. Press this to upgrade your
            subscription plan.
          </Text>
        </View>
      )}
      {/*Categories Modal start*/}
      <Modal visible={categoryModalVisible}>
        <View className="bg-gray-100 flex-1 items-center justify-center">
          {categories.length > 0 ? (
            <View className="space-y-2 items-center h-5/6 w-full">
              <View className="my-4">
                <Text
                  className="text-white text-xl font-extrabold border border-gray-500 p-2 rounded-md bg-gray-500"
                  style={{elevation: 25}}>
                  Available Categories
                </Text>
              </View>
              <ScrollView className="space-y-2 w-full">
                {categories.map((item, index) => {
                  if (item.isVisible) {
                    return (
                      <TouchableOpacity
                        key={index}
                        className="flex-row items-center space-x-2 mx-4"
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
                            color="black"
                          />
                        </View>
                        <View>
                          <Text className="text-lg text-black">
                            {item.name}
                          </Text>
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
                      className="border border-gray-500 bg-gray-500 rounded-xl p-2"
                      style={{elevation: 25}}>
                      <Text className="text-white text-lg">Show all</Text>
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
                              return updatedObj;
                            }
                            return obj;
                          });
                          return newState;
                        });
                      }}
                      className="border border-gray-500 p-2 rounded-md bg-gray-500"
                      style={{elevation: 25}}>
                      <Text className="text-white text-lg">Show selected</Text>
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
                        setSelectedCategories([]);
                      }}
                      className="border border-gray-500 bg-gray-500 rounded-xl p-2"
                      style={{elevation: 25}}>
                      <Text className="text-white text-lg">Unselect all</Text>
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
                      className="border border-gray-500 bg-gray-500 rounded-xl p-2"
                      style={{elevation: 25}}>
                      <Text className="text-white text-lg">Select all</Text>
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
      {/*Categories Modal end*/}
      {/*SubCategories Modal start*/}
      <Modal visible={subCategoryModalVisible}>
        <View className="bg-gray-100 flex-1 items-center justify-center">
          {subCategories.length > 0 ? (
            <View className="space-y-2 items-center h-5/6 w-full">
              <View className="my-4">
                <Text
                  className="text-white text-xl font-extrabold border border-gray-500 p-2 rounded-md bg-gray-500"
                  style={{elevation: 25}}>
                  Available Sub Categories
                </Text>
              </View>
              <ScrollView className="space-y-2 w-full">
                {subCategories.map((item, index) => {
                  if (item.isVisible) {
                    return (
                      <View key={index} className="mx-4">
                        <View>
                          <Text className="text-center text-xl font-bold">
                            {item.categoryName}
                          </Text>
                        </View>
                        <View className="items-start mb-2">
                          {item.subCategories.map((subCategory, subIndex) => {
                            if (subCategory.isVisible) {
                              return (
                                <TouchableOpacity
                                  key={subIndex}
                                  className="flex-row items-center space-x-2"
                                  onPress={() => {
                                    setSubCategories(prevState => {
                                      const newState = prevState.map(
                                        outerObj => {
                                          if (
                                            outerObj.categoryName ===
                                            item.categoryName
                                          ) {
                                            const updatedOuterObject = {
                                              ...outerObj,
                                            };
                                            updatedOuterObject.subCategories =
                                              outerObj.subCategories.map(
                                                innerObj => {
                                                  if (
                                                    innerObj.subCategoryName ===
                                                    subCategory.subCategoryName
                                                  ) {
                                                    const updatedInnerObject = {
                                                      ...innerObj,
                                                    };
                                                    updatedInnerObject.isChecked =
                                                      !updatedInnerObject.isChecked;
                                                    return updatedInnerObject;
                                                  }
                                                  return innerObj;
                                                },
                                              );
                                            return updatedOuterObject;
                                          }
                                          return outerObj;
                                        },
                                      );
                                      return newState;
                                    });
                                  }}>
                                  <View>
                                    <Fontisto
                                      name={
                                        subCategory.isChecked
                                          ? 'checkbox-active'
                                          : 'checkbox-passive'
                                      }
                                      color="black"
                                    />
                                  </View>
                                  <View>
                                    <Text className="text-black">
                                      {subCategory.subCategoryName}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              );
                            }
                          })}
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
              <View className="flex-row items-center justify-evenly w-full">
                <View>
                  {showSelectedSubCategories ? (
                    <TouchableOpacity
                      onPress={() => {
                        setShowSelectedSubCategories(false);
                        setSubCategories(prevState => {
                          const newState = prevState.map(outerObj => {
                            return {
                              categoryName: outerObj.categoryName,
                              isVisible: true,
                              subCategories: outerObj.subCategories.map(
                                innerObj => {
                                  const updatedInnerObject = {...innerObj};
                                  return {
                                    subCategoryName:
                                      updatedInnerObject.subCategoryName,
                                    isChecked: updatedInnerObject.isChecked,
                                    isVisible: true,
                                  };
                                },
                              ),
                            };
                          });
                          return newState;
                        });
                      }}
                      className="border border-gray-500 bg-gray-500 rounded-xl p-2"
                      style={{elevation: 25}}>
                      <Text className="text-white text-lg">Show all</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setShowSelectedSubCategories(true);
                        setSubCategories(prevState => {
                          const newState = prevState.map(outerObj => {
                            return {
                              categoryName: outerObj.categoryName,
                              isVisible: outerObj.subCategories.some(
                                item => item.isChecked === true,
                              )
                                ? true
                                : false,
                              subCategories: outerObj.subCategories.map(
                                innerObj => {
                                  const updatedInnerObject = {...innerObj};
                                  return {
                                    subCategoryName:
                                      updatedInnerObject.subCategoryName,
                                    isChecked: updatedInnerObject.isChecked,
                                    isVisible: updatedInnerObject.isChecked
                                      ? true
                                      : false,
                                  };
                                },
                              ),
                            };
                          });
                          return newState;
                        });
                      }}
                      className="border border-gray-500 p-2 rounded-md bg-gray-500"
                      style={{elevation: 25}}>
                      <Text className="text-white text-lg">Show selected</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View>
                  {selectAllSubCategories ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSubCategories(prevState => {
                          const newState = prevState.map(outerObj => ({
                            categoryName: outerObj.categoryName,
                            isVisible: outerObj.isVisible,
                            subCategories: outerObj.subCategories.map(item => ({
                              subCategoryName: item.subCategoryName,
                              isVisible: item.isVisible,
                              isChecked: false,
                            })),
                          }));
                          return newState;
                        });
                        setSelectAllSubCategories(false);
                      }}
                      className="border border-gray-500 bg-gray-500 rounded-xl p-2"
                      style={{elevation: 25}}>
                      <Text className="text-white text-lg">Unselect all</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setSubCategories(prevState => {
                          const newState = prevState.map(outerObj => ({
                            categoryName: outerObj.categoryName,
                            isVisible: outerObj.isVisible,
                            subCategories: outerObj.subCategories.map(item => ({
                              subCategoryName: item.subCategoryName,
                              isVisible: item.isVisible,
                              isChecked: true,
                            })),
                          }));
                          return newState;
                        });
                        setSelectedSubCategories(() => {
                          let arr = [];
                          subCategories.map(outerObj => {
                            arr.push({
                              categoryName: outerObj.categoryName,
                              selectedSubCategories: outerObj.subCategories.map(
                                innerObj => innerObj.subCategoryName,
                              ),
                            });
                          });
                          return arr;
                        });
                        setSelectAllSubCategories(true);
                      }}
                      className="border border-gray-500 bg-gray-500 rounded-xl p-2"
                      style={{elevation: 25}}>
                      <Text className="text-white text-lg">Select all</Text>
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
              onPress={() => setSubCategoryModalVisible(false)}
              className="w-full flex-row items-center space-x-4">
              <Fontisto name="close-a" size={20} />
              <Text className="text-2xl font-extrabold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/*SubCategories Modal end*/}
    </SafeAreaView>
  );
};

// const style = StyleSheet.create({
//   input: {
//     height: 40,
//     width: 300,
//     borderWidth: 1,
//     borderColor: 'white',
//     padding: 10,
//     color: 'black',
//     borderRadius: 5,
//     textAlign: 'center',
//   },
// });

export default SalesInsightsScreen;
