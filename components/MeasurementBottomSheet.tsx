import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type MeasurementType = 'height' | 'weight';
type Unit = 'cm' | 'kg' | 'ft';

interface MeasurementBottomSheetProps {
  onSave: (type: MeasurementType, value: number) => Promise<void>;
}

export interface MeasurementBottomSheetRef {
  open: (type: MeasurementType, currentValue: number) => void;
  close: () => void;
}

const ITEM_WIDTH = 60;
const VISIBLE_ITEMS = 7;
const CONTAINER_WIDTH = ITEM_WIDTH * VISIBLE_ITEMS;

const generateValues = (type: MeasurementType) => {
  if (type === 'height') {
    return Array.from({ length: 151 }, (_, i) => 100 + i);
  } else {
    return Array.from({ length: 341 }, (_, i) => 30 + i * 0.5);
  }
};

export const MeasurementBottomSheet = forwardRef<
  MeasurementBottomSheetRef,
  MeasurementBottomSheetProps
>(({ onSave }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [measurementType, setMeasurementType] = useState<MeasurementType>('height');
  const [unit, setUnit] = useState<Unit>('cm');
  const [isSaving, setIsSaving] = useState(false);

  const values = useMemo(() => generateValues(measurementType), [measurementType]);
  const scrollX = useSharedValue(0);

  const snapPoints = useMemo(() => ['50%'], []);

  useImperativeHandle(ref, () => ({
    open: (type: MeasurementType, currentValue: number) => {
      setMeasurementType(type);
      setUnit(type === 'height' ? 'cm' : 'kg');
      const index = values.findIndex((v) => v >= currentValue);
      scrollX.value = (index >= 0 ? index : 0) * ITEM_WIDTH;
      bottomSheetRef.current?.expand();
    },
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleSave = async () => {
    const selectedIndex = Math.round(scrollX.value / ITEM_WIDTH);
    const selectedValue = values[selectedIndex] || values[0];

    setIsSaving(true);
    try {
      await onSave(measurementType, selectedValue);
      bottomSheetRef.current?.close();
    } catch (error) {
      console.error('Error saving measurement:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const gesture = Gesture.Pan()
    .onChange((event) => {
      scrollX.value = Math.max(
        0,
        Math.min(scrollX.value - event.changeX, (values.length - 1) * ITEM_WIDTH),
      );
    })
    .onEnd(() => {
      scrollX.value = withSpring(Math.round(scrollX.value / ITEM_WIDTH) * ITEM_WIDTH, {
        damping: 15,
        stiffness: 150,
      });
    });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -scrollX.value }],
    };
  });

  const title = measurementType === 'height' ? 'Your Height' : 'Your Weight';
  const isMetric = unit === 'cm' || unit === 'kg';

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.close()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.checkIcon}>✓</Text>
          </TouchableOpacity>
        </View>

        {/* Unit Toggle */}
        {measurementType === 'height' && (
          <View style={styles.unitToggle}>
            <TouchableOpacity
              onPress={() => setUnit('ft')}
              style={[styles.unitButton, !isMetric && styles.unitButtonActive]}>
              <Text style={[styles.unitButtonText, !isMetric && styles.unitButtonTextActive]}>
                Feet/Inches
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUnit('cm')}
              style={[styles.unitButton, isMetric && styles.unitButtonActive]}>
              <Text style={[styles.unitButtonText, isMetric && styles.unitButtonTextActive]}>
                Centimeters
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Current Value Display */}
        <View style={styles.valueDisplay}>
          <Animated.Text style={styles.currentValue}>
            {values[Math.round(scrollX.value / ITEM_WIDTH)] || values[0]}
          </Animated.Text>
          <Text style={styles.unitLabel}>{unit}</Text>
        </View>

        {/* Horizontal Picker */}
        <View style={styles.pickerWrapper}>
          <View style={styles.pickerContainer}>
            <GestureDetector gesture={gesture}>
              <Animated.View style={[styles.scrollContainer, containerAnimatedStyle]}>
                {values.map((value, index) => (
                  <PickerItem
                    key={`${value}-${index}`}
                    value={value}
                    index={index}
                    scrollX={scrollX}
                  />
                ))}
              </Animated.View>
            </GestureDetector>

            {/* Selection indicator line */}
            <View style={styles.selectionIndicator} pointerEvents="none" />
          </View>

          {/* Ruler marks */}
          <Animated.View
            style={[styles.rulerContainer, { transform: [{ translateX: -scrollX.value }] }]}
            pointerEvents="none">
            {values.map((_, index) => {
              const isMajor = index % 5 === 0;
              return (
                <View
                  key={index}
                  style={[
                    styles.rulerMark,
                    { left: index * ITEM_WIDTH + CONTAINER_WIDTH / 2 },
                    isMajor ? styles.rulerMarkMajor : styles.rulerMarkMinor,
                  ]}
                />
              );
            })}
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

interface PickerItemProps {
  value: number;
  index: number;
  scrollX: Animated.SharedValue<number>;
}

const PickerItem = React.memo(({ value, index, scrollX }: PickerItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const centerX = CONTAINER_WIDTH / 2;
    const itemX = index * ITEM_WIDTH;
    const distance = Math.abs(centerX - (itemX - scrollX.value));
    const maxDistance = ITEM_WIDTH * 3;

    const opacity = Math.max(0.2, 1 - (distance / maxDistance) * 0.8);
    const scale = Math.max(0.6, 1 - (distance / maxDistance) * 0.4);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.pickerItem, animatedStyle]}>
      <Text style={styles.pickerItemText}>{value}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  closeIcon: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: '300',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  checkIcon: {
    fontSize: 24,
    color: '#3B82F6',
    fontWeight: '600',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginTop: 8,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#ffffff',
  },
  unitButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  unitButtonTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  valueDisplay: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  currentValue: {
    fontSize: 72,
    fontWeight: '300',
    color: '#111827',
    letterSpacing: -2,
  },
  unitLabel: {
    fontSize: 20,
    color: '#6B7280',
    marginTop: -8,
  },
  pickerWrapper: {
    alignItems: 'center',
    marginTop: 16,
  },
  pickerContainer: {
    width: CONTAINER_WIDTH,
    height: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingLeft: CONTAINER_WIDTH / 2,
    paddingRight: CONTAINER_WIDTH / 2,
  },
  pickerItem: {
    width: ITEM_WIDTH,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: '#3B82F6',
    marginLeft: -1,
  },
  rulerContainer: {
    width: CONTAINER_WIDTH * 3,
    height: 40,
    position: 'relative',
    marginTop: 8,
  },
  rulerMark: {
    position: 'absolute',
    bottom: 0,
    width: 1,
    backgroundColor: '#D1D5DB',
  },
  rulerMarkMinor: {
    height: 8,
  },
  rulerMarkMajor: {
    height: 16,
    backgroundColor: '#9CA3AF',
  },
});

MeasurementBottomSheet.displayName = 'MeasurementBottomSheet';
