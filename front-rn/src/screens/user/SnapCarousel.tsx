import { View, Dimensions, Animated, FlatList, StyleSheet } from 'react-native';
import React, { memo, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { forwardRef } from 'react';
// import { AppSettings } from '../config/AppSettings';

const width = Dimensions.get('window').width;

/**
 * @param {{itemSize: Number,
 * spacing: Number,
 * data: Array,
 * style: StyleSheet,
 * renderItem: Function,
 * onItemSnapped: Func,
 * keyExtractor: Func,
 * showIndicator: Boolean,
 * indicatorSpacing: Number,
 * dotSize: Number,
 * dotSelectedColor: String,
 * dotUnSelectedColor: String,
 * indicatorLastItem: Boolean
 * scaleEffect: Boolean,
 * }} props
 */
const SnapCarousel = (props, ref) => {
  useImperativeHandle(ref, () => {
    function scrollToFirst() {
      flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
    function scrollToIndex(index) {
      setTimeout(() => {
        flatListRef.current.scrollToOffset({
          animated: false,
          offset: index * props.itemSize,
        });
      }, 20);
    }
    function scrollToWallet(address) {
      data.forEach((item, index, arr) => {
        if (
          item.data &&
          (item.data.oneAddress === address || item.data.address === address)
        )
          scrollToIndex(index - 1);
        return;
      });
    }
    return {
      scrollToFirst,
      scrollToIndex,
      scrollToWallet,
    };
  });


  const flatListRef = useRef<FlatList>(null);
  const [currentItem, setCurrentItem] = useState(0);
  const [isOneFormat, setIsOneFormat] = useState(false);
  // const { appSettings } = useSelector(state => state.appSettingsReducer);

  // useEffect(() => {
  //   setIsOneFormat(appSettings.get(AppSettings.field.ONE_FORMAT));
  // }, [appSettings]);

  const offset = props.horizontalScroll ? (width - props.itemSize) / 2 : 0;

  const scrollX = useRef(new Animated.Value(0)).current;

  const data = useRef([]).current;

  data.splice(0, data.length);

  /** Add temp item for start offset */
  data.push({ id: 0 });

  props.data.forEach((item, index) => {
    data.push({ id: data.length, index: index, data: item });
  });

  /** Add temp item for end offset */
  data.push({ id: data.length });

  const onScroll = e => {
    if (Math.abs(scrollX.__getValue() - e.nativeEvent.contentOffset.x) > 0.5) {
      // console.log('scrollX: ', e.nativeEvent.contentOffset.x);
      scrollX.setValue(e.nativeEvent.contentOffset.x);
    }
  };

  const inputRange = [0, props.itemSize / 2, props.itemSize];

  const scaleX = scrollX.interpolate({
    inputRange,
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  scaleX.addListener(value => console.log('scale X', value));

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    return !item.data ? (
      <View key={index} style={{ width: offset, transform: [{ scaleX: 0 }] }} />
    ) : (
      <SnapItem
        key={index}
        itemSize={props.itemSize}
        spacing={props.spacing}
        currentItem={currentItem}
        item={item}
        index={index}
        itemView={props.renderItem(item.data, item.index)}
        horizontalScroll={props.horizontalScroll}
        scaleEffect={props.scaleEffect}
        scrollX={scrollX}
      />
    );
  };

  const handleItemLayout = (item, index) => ({
    length: item.id === 0 || item.id === data.length ? offset : props.itemSize,
    offset: index * props.itemSize,
    index,
  });

  const handleMomentumScrollEnd = e => {
    let currentNextItem = Math.round(
      e.nativeEvent.contentOffset.x / props.itemSize,
    );
    if (currentNextItem !== currentItem) {
      setCurrentItem(currentNextItem);
      props.onItemSnapped(data[currentNextItem + 1].index);
    }
  };

  const renderKey = (item, index) => index.toString();

  return (
    <View style={[props.style, { flexDirection: 'column' }]}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ alignItems: 'center' }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={data}
        horizontal={true}
        keyExtractor={renderKey}
        renderItem={renderItem}
        // pagingEnabled={true}
        getItemLayout={handleItemLayout}
        snapToInterval={props.itemSize}
        onScroll={onScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        disableIntervalMomentum={true}
        decelerationRate={0.9}
        overScrollMode="never"
      />
      {/* Indicator - (not render indicator if vertical*/}
      {props.showIndicator && props.horizontalScroll && data.length > 3 ? (
        <View
          style={[
            styles.dotStyle(props?.dotSize, props?.indicatorSpacing),
            styles.dotContainer,
          ]}>
          {props.data.map((item, index) => {
            return (
              <Indicator
                key={index}
                dotSize={props.dotSize ? props.dotSize : 6}
                dotSelectedColor={
                  props.dotSelectedColor ? props.dotSelectedColor : '#bdc3c7'
                }
                dotUnSelectedColor={
                  props.dotUnSelectedColor
                    ? props.dotUnSelectedColor
                    : '#7f8c8d'
                }
                itemSize={props.itemSize}
                currentItem={currentItem}
                item={item}
                index={index + 1}
                totalSize={props.data.length + 1}
                scrollX={scrollX}
                indicatorLastItem={props.indicatorLastItem}
              />
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

const SnapItem = React.memo(
  ({
    itemSize,
    spacing,
    currentItem,
    item,
    index,
    itemView,
    horizontalScroll,
    scaleEffect,
    scrollX,
  }) => {
    const inputRange = [
      (index - 2) * itemSize,
      (index - 1) * itemSize,
      index * itemSize,
    ];

    const indexNoOffset = index - 1;
    let scaleX, scaleY;

    const isAnimatingView =
      (currentItem - indexNoOffset <= 2 ||
        currentItem - indexNoOffset >= -2 ||
        currentItem === indexNoOffset) &&
      horizontalScroll;

    if (isAnimatingView) {
      scaleY = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: 'clamp',
      });

      scaleX = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: 'clamp',
      });
    }

    return (
      <Animated.View
        style={{
          width: itemSize,
          height: horizontalScroll ? '100%' : itemSize,
          transform:
            isAnimatingView && scaleEffect ? [{ scaleX }, { scaleY }] : [],
        }}>
        <View
          style={{
            marginHorizontal: horizontalScroll ? spacing : 0,
            marginVertical: horizontalScroll ? 0 : 0,
          }}>
          {itemView}
        </View>
      </Animated.View>
    );
  },
);

const Indicator = React.memo(
  ({
    itemSize,
    currentItem,
    dotSize,
    dotSelectedColor,
    dotUnSelectedColor,
    item,
    index,
    totalSize,
    scrollX,
    indicatorLastItem,
  }) => {
    const notAnimatingItem = !indicatorLastItem && index === totalSize;

    let multiple = 0;
    if (currentItem + 1 > totalSize) {
      // eslint-disable-next-line no-bitwise
      multiple = ~~(currentItem / totalSize);
    }

    const inputRange = [
      (totalSize * multiple + index - 2) * itemSize,
      (totalSize * multiple + index - 1) * itemSize,
      (totalSize * multiple + index) * itemSize,
    ];

    const indicatorWidth = scrollX.interpolate({
      inputRange,
      outputRange: [dotSize, notAnimatingItem ? dotSize : dotSize * 3, dotSize],
      extrapolate: 'clamp',
    });

    const color = scrollX.interpolate({
      inputRange,
      outputRange: [
        dotUnSelectedColor,
        notAnimatingItem ? dotUnSelectedColor : dotSelectedColor,
        dotUnSelectedColor,
      ],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          width: indicatorWidth,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
          marginHorizontal: dotSize / 2,
        }}
      />
    );
  },
);

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotStyle: (dotSize, indicatorSpacing) => ({
    height: dotSize,
    marginTop: indicatorSpacing || 10,
  }),
});

export default forwardRef(SnapCarousel);
