import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {wp, hp} from '../util/services';
import Slider from '@react-native-community/slider';
import {Dropdown} from 'react-native-element-dropdown';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import axios from '../api/axios';
import {formatedAmount, showAlert} from '../util/services';

const Home = () => {
  const TabArr = [
    {
      name: 'Every Week',
      value: 7,
    },
    {
      name: 'Every Month',
      value: 30,
    },
    {
      name: 'Every Year',
      value: 365,
    },
  ];
  const minAmount = 0;
  const maxAmount = 21000;
  const minYear = 0;
  const maxYear = 10;
  let amountArr = [0, 0, 0, 0, 0, 0, 0, 0];
  let timeArr = [0, 0, 0, 0, 0, 0];
  const [allPools, setAllPools] = useState([]);
  const [amount, setAmount] = useState(7000);
  const [poolResult, setPoolResult] = useState(null);
  const [time, setTime] = useState(3);
  const [selectedPoolId, setSelectedPoolId] = useState(11);
  const [loader, setLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TabArr[0].value);

  useEffect(() => {
    getallPools();
  }, []);

  const getallPools = () => {
    setLoader(true);
    axios
      .get('/api/product/all-pools')
      .then(res => {
        if (res.data?.success && res.data?.code === 200) {
          setAllPools(res.data.data.pools);
        } else {
          setAllPools([]);
        }
      })
      .catch(error => {
        setAllPools([]);
        console.log('error', error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const calCulateData = () => {
    let investmentCount;
    if (selectedTab === 7) {
      investmentCount = parseInt((364 * time) / selectedTab, 10);
    } else if (selectedTab === 30) {
      investmentCount = parseInt((360 * time) / selectedTab, 10);
    } else {
      investmentCount = parseInt((365 * time) / selectedTab, 10);
    }
    let reqData = {
      poolId: selectedPoolId,
      frqInDays: selectedTab,
      investmentCount: investmentCount,
      sipAmount: amount,
    };
    console.log('calculate req data', reqData);
    if (!selectedPoolId) {
      showAlert('Please select Invested In');
      return;
    }
    setLoader(true);
    axios
      .post('/api/product/calculator-for-pool', reqData)
      .then(res => {
        showAlert(res.data?.message);
        console.log('calculate res data', res);
        if (res.data?.success && res.data?.code === 200) {
          setPoolResult(res.data?.data?.result);
        } else {
          setPoolResult(null);
        }
      })
      .catch(error => {
        setPoolResult(null);
        showAlert('No result found');
        console.log('error', error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const InvestedInView = useCallback(() => {
    return (
      <View style={styles.investedInView}>
        <Text style={styles.fieldTitle}>Invested In</Text>
        <View style={styles.dropdownView}>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            iconColor="#252A48"
            itemTextStyle={styles.selectedTextStyle}
            data={allPools}
            maxHeight={300}
            search
            searchPlaceholder="Search..."
            labelField="poolName"
            valueField="id"
            placeholder={'Select item'}
            value={selectedPoolId}
            onChange={item => {
              setSelectedPoolId(item.id);
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }, [allPools, selectedPoolId]);

  return (
    <View style={styles.rootView}>
      <View style={styles.container}>
        <Text style={styles.topHeading}>Calculate Earnings</Text>

        {/* //------Amount Slider start------// */}
        <View style={styles.amountView}>
          <View style={styles.amountViewTop}>
            <Text style={styles.fieldTitle}>Invested Amount</Text>
            <TextInput
              style={styles.grayTextInput}
              value={amount.toString()}
              onChangeText={text => {
                if (text >= 0 && text < maxAmount) {
                  setAmount(text);
                }
              }}
              keyboardType="number-pad"
            />
          </View>
          <Slider
            value={parseFloat(amount) || 0}
            onValueChange={valueData => setAmount(parseInt(valueData, 10))}
            thumbTintColor="#304FFE"
            minimumTrackTintColor="#304FFE"
            maximumTrackTintColor="#9EACDB"
            minimumValue={minAmount}
            maximumValue={maxAmount}
            style={styles.sliderStyle}
          />
          <View style={styles.sliderLableView}>
            {amountArr.map((item, ind) => {
              let itemAmount = maxAmount * (ind / 7);
              return (
                <Text style={styles.sliderLableText}>
                  {formatedAmount(itemAmount)}
                </Text>
              );
            })}
          </View>
        </View>
        {/* //------Amount Slider end------// */}

        {/* //------Invested In start------// */}
        <InvestedInView />
        {/* //------Invested In end------// */}

        {/* //------Investment Timeline start------// */}
        <View style={styles.investmentTimelineView}>
          <Text style={styles.fieldTitle}>Investment Timeline</Text>
          <View style={styles.investmentTimelineTabSec}>
            {TabArr.map(item => {
              let selected = selectedTab === item.value;
              return (
                <TouchableOpacity
                  style={[
                    styles.tabView,
                    selected ? styles.activeTabColor : styles.inActiveTabColor,
                  ]}
                  onPress={() => setSelectedTab(item.value)}>
                  <Text
                    style={[
                      styles.tabText,
                      selected
                        ? styles.activeTabTextColor
                        : styles.inActiveTabTextColor,
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* //------Investment Timeline end------// */}

        {/* //------Invested From start------// */}
        <View style={styles.investedFromView}>
          <View style={styles.investedFromViewTop}>
            <Text style={styles.fieldTitle}>Invested From</Text>
            <TextInput
              style={styles.grayTextInput}
              value={time.toString() + (time > 1 ? ' yrs' : ' yr')}
              editable={false}
            />
          </View>
          <Slider
            value={time}
            onValueChange={valueData => setTime(parseInt(valueData, 10))}
            thumbTintColor="#304FFE"
            minimumTrackTintColor="#304FFE"
            maximumTrackTintColor="#9EACDB"
            minimumValue={minYear}
            maximumValue={maxYear}
            style={styles.sliderStyle}
          />
          <View style={styles.sliderLableView}>
            {timeArr.map((item, ind) => {
              let itemAmount = maxYear * (ind / 5);
              return (
                <Text style={[styles.sliderLableText, styles.w14]}>
                  {itemAmount === 0
                    ? 'Present'
                    : formatedAmount(itemAmount) + ' yrs'}
                </Text>
              );
            })}
          </View>
        </View>
        {/* //------Invested From end------// */}

        {/* //------Result sec start------// */}
        <View style={styles.resultSec}>
          <View style={styles.resultTextSec}>
            <View>
              <Text style={styles.fieldTitle}>Invested Money</Text>
              <Text style={[styles.fieldTitle, styles.textMT]}>
                Money you would have
              </Text>
            </View>
            <View style={styles.textViewRight}>
              <Text style={styles.resultTextOne}>
                {poolResult
                  ? poolResult?.resultData &&
                    poolResult?.resultData.at(-1).investedAmount
                  : '0.00'}{' '}
                USDT
              </Text>
              <Text style={[styles.resultTextTwo, styles.textMT]}>
                {poolResult
                  ? poolResult?.resultData &&
                    parseFloat(
                      poolResult?.resultData.at(-1).worthNowInUSD,
                    ).toFixed(2)
                  : '0.00'}{' '}
                USDT
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.perView,
              poolResult && poolResult?.absoluteReturns < 0
                ? styles.redBgcolor
                : {},
            ]}>
            {poolResult && poolResult?.absoluteReturns > 0 ? (
              <Image
                style={styles.icon}
                source={require('../assets/images/topGreen.png')}
              />
            ) : poolResult && poolResult?.absoluteReturns < 0 ? (
              <Image
                style={[styles.icon, styles.tintRed]}
                source={require('../assets/images/bottomArrow.png')}
              />
            ) : null}
            <Text
              style={[
                styles.perText,
                poolResult && poolResult?.absoluteReturns < 0
                  ? styles.redcolor
                  : {},
              ]}>
              {poolResult ? poolResult?.absoluteReturns + '%' : '0%'}
            </Text>
          </View>
        </View>
        {/* //------Result sec end------// */}

        {/* //----Calculate button------// */}
        <TouchableOpacity style={styles.btnView} onPress={calCulateData}>
          <Text style={styles.btnText}>Calculate</Text>
        </TouchableOpacity>
      </View>
      {/* //-----Loader----// */}
      <Spinner visible={loader} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  rootView: {
    backgroundColor: '#FFFF',
    flex: 1,
  },
  container: {
    width: wp(90),
    alignSelf: 'center',
  },
  topHeading: {
    fontSize: wp(4.5),
    color: '#252A48',
    fontFamily: 'DMSans-Bold',
    textAlign: 'center',
    marginTop: hp(3),
  },
  amountView: {
    marginTop: hp(3),
  },
  fieldTitle: {
    fontSize: wp(3.8),
    color: '#9EACDB',
    fontFamily: 'DMSans-Medium',
  },
  amountViewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grayTextInput: {
    backgroundColor: '#F3F3F3',
    padding: 0,
    height: hp(3.5),
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    minWidth: wp(18),
    fontSize: wp(3),
    color: '#252A48',
    fontFamily: 'DMSans-Bold',
    textAlign: 'center',
  },
  sliderLableView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderLableText: {
    fontSize: wp(3.8),
    color: '#000000',
    fontFamily: 'DMSans-Medium',
    textAlign: 'center',
    width: wp(11),
  },
  w14: {
    width: wp(14),
  },
  investedInView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(3.5),
  },

  dropdownView: {
    width: wp(65),
  },
  dropdown: {
    height: hp(5),
    backgroundColor: '#F3F3F3',
    paddingHorizontal: wp(5),
    borderRadius: wp(10),
  },
  placeholderStyle: {
    fontSize: wp(3.5),
    color: 'grey',
    fontFamily: 'DMSans-Bold',
  },
  selectedTextStyle: {
    fontSize: wp(3.5),
    color: '#252A48',
    fontFamily: 'DMSans-Bold',
  },
  iconStyle: {
    width: wp(5),
    height: wp(5),
  },
  inputSearchStyle: {
    height: hp(5),
    fontSize: wp(3.5),
    color: '#252A48',
    fontFamily: 'DMSans-Medium',
  },
  investmentTimelineView: {
    marginTop: hp(3.5),
  },
  investmentTimelineTabSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  tabView: {
    height: hp(5),
    width: wp(28),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(20),
  },
  tabText: {
    fontSize: wp(3.5),
    fontFamily: 'DMSans-Bold',
  },
  activeTabColor: {
    backgroundColor: '#304FFE',
  },
  activeTabTextColor: {
    color: '#FFFFFF',
  },
  inActiveTabColor: {
    backgroundColor: '#F3F3F3',
  },
  inActiveTabTextColor: {
    color: 'grey',
  },
  investedFromView: {
    marginTop: hp(3.5),
  },
  investedFromViewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultSec: {
    alignSelf: 'center',
    height: hp(17),
    justifyContent: 'center',
  },
  resultTextSec: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textViewRight: {
    marginLeft: wp(3),
  },
  resultTextOne: {
    fontSize: wp(4),
    fontFamily: 'DMSans-Bold',
    color: '#9EACDB',
  },
  resultTextTwo: {
    fontSize: wp(5),
    fontFamily: 'DMSans-Bold',
    color: '#2BA24C',
  },
  textMT: {
    marginTop: hp(1),
  },
  perView: {
    backgroundColor: 'rgba(0, 221, 154, 0.2)',
    padding: wp(1),
    paddingHorizontal: wp(2),
    borderRadius: wp(2),
    alignSelf: 'flex-end',
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perText: {
    fontSize: wp(3.4),
    fontFamily: 'DMSans-Regular',
    color: '#2BA24C',
  },
  redBgcolor: {
    backgroundColor: '#fa9b9b',
  },
  redcolor: {
    color: 'red',
  },
  btnView: {
    backgroundColor: '#304FFE',
    height: hp(5),
    width: wp(60),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2),
  },
  btnText: {
    fontSize: wp(4),
    fontFamily: 'DMSans-Medium',
    color: '#FFFF',
  },
  sliderStyle: {
    marginVertical: hp(1),
  },
  icon: {
    height: wp(2.5),
    width: wp(2.3),
    marginRight: wp(2),
    resizeMode: 'contain',
  },
  tintRed: {tintColor: 'red'},
});
