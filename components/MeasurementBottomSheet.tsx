import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HorizontalPicker from 'react-native-number-horizontal-picker';
import Animated from 'react-native-reanimated';

type MeasurementType = 'height' | 'weight';
type Unit = 'cm' | 'kg' | 'ft';

interface MeasurementBottomSheetProps {
  onSave: (type: MeasurementType, value: number) => Promise<void>;
}

export interface MeasurementBottomSheetRef {
  open: (type: MeasurementType, currentValue: number) => void;
  close: () => void;
}

const generateValues = (type: MeasurementType) => {
  if (type === 'height') {
    return Array.from({ length: 451 }, (_, i) => 30 + i * 0.25);
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
  const [selectedValue, setSelectedValue] = useState(50);

  useImperativeHandle(ref, () => ({
    open: (type: MeasurementType, currentValue: number) => {
      setMeasurementType(type);
      setUnit(type === 'height' ? 'cm' : 'kg');
      bottomSheetRef.current?.expand();
    },
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleSave = async () => {
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

  const title = measurementType === 'height' ? 'Your Height' : 'Your Weight';
  const isMetric = unit === 'cm' || unit === 'kg';

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
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
          <Animated.Text className={'text-4xl font-semibold text-gray-800'}>
            {selectedValue}
          </Animated.Text>
          <Text style={styles.unitLabel}>{unit}</Text>
        </View>

        {/* Horizontal Picker */}
        <HorizontalPicker
          minimumValue={0}
          maximumValue={200}
          focusValue={selectedValue}
          onChangeValue={(e) => setSelectedValue(e)}
        />
      </BottomSheetView>
    </BottomSheet>
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
});

MeasurementBottomSheet.displayName = 'MeasurementBottomSheet';
