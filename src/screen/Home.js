import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
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
  const minAmount = 500;
  const maxAmount = 5000000000;
  const minYear = 1;
  const maxYear = 12;
  const [allPools, setAllPools] = useState([]);
  const [amount, setAmount] = useState(minAmount);
  const [poolResult, setPoolResult] = useState(null);
  const [time, setTime] = useState(minYear);
  const [selectedPoolId, setSelectedPoolId] = useState('');
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
        showAlert(error?.message);
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
            <View style={styles.grayView}>
              <Text style={styles.grayViewText}>{formatedAmount(amount)}</Text>
            </View>
          </View>
          <Slider
            value={amount}
            onValueChange={valueData => setAmount(parseInt(valueData, 10))}
            thumbTintColor="#304FFE"
            minimumTrackTintColor="#304FFE"
            maximumTrackTintColor="#9EACDB"
            minimumValue={minAmount}
            maximumValue={maxAmount}
            style={styles.sliderStyle}
          />
          <View style={styles.sliderLableView}>
            <Text style={styles.sliderLableText}>
              Min : {formatedAmount(minAmount)}
            </Text>
            <Text style={styles.sliderLableText}>
              Max : {formatedAmount(maxAmount)}
            </Text>
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
            <View style={styles.grayView}>
              <Text style={styles.grayViewText}>
                {time} {time > 1 ? 'yrs' : 'yr'}
              </Text>
            </View>
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
            <Text style={styles.sliderLableText}>
              Min : {minYear} {minYear > 1 ? 'yrs' : 'yr'}
            </Text>
            <Text style={styles.sliderLableText}>Max : {maxYear} yrs</Text>
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
                  : '0.00'}
              </Text>
              <Text style={[styles.resultTextTwo, styles.textMT]}>
                {poolResult
                  ? poolResult?.resultData &&
                    poolResult?.resultData.at(-1).worthNowInUSD
                  : '0.00'}
              </Text>
            </View>
          </View>
          <View style={styles.perView}>
            <Text style={styles.perText}>
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
  grayView: {
    backgroundColor: '#F3F3F3',
    height: hp(3.5),
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: wp(18),
  },
  grayViewText: {
    fontSize: wp(3),
    color: '#252A48',
    fontFamily: 'DMSans-Bold',
  },
  sliderLableView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderLableText: {
    fontSize: wp(3.5),
    color: '#252A48',
    fontFamily: 'DMSans-Medium',
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
  },
  perText: {
    fontSize: wp(3.4),
    fontFamily: 'DMSans-Regular',
    color: '#2BA24C',
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
});
