import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { updateListingAPI } from '../api/marketplaceApi';
import { Picker } from '@react-native-picker/picker';
import { Feather, Ionicons } from '@expo/vector-icons';

const LOCATIONS = ['Colombo', 'Kandy', 'Gampaha', 'Kurunegala', 'Kalutara', 'Galle', 'Matara', 'Ratnapura', 'Anuradhapura', 'Jaffna', 'Batticaloa', 'Badulla'];
const BODY_TYPES = ['Sedan', 'Hatchback', 'SUV', 'Coupé', 'Van', 'Pickup', 'Jeep'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'Tiptronic'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const CONDITIONS = ['Used', 'New', 'Reconditioned'];
const STATUSES = ['Available', 'Sold'];

const EditListing = () => {
  const router = useRouter();
  const { vehicle } = useLocalSearchParams();
  const data = vehicle ? JSON.parse(vehicle) : {};

  const [make, setMake] = useState(data.make || '');
  const [model, setModel] = useState(data.model || '');
  const [year, setYear] = useState(String(data.year || ''));
  const [price, setPrice] = useState(String(data.price || ''));
  const [mileage, setMileage] = useState(String(data.mileage || ''));
  const [engineCapacity, setEngineCapacity] = useState(String(data.engineCapacity || ''));
  const [location, setLocation] = useState(data.location || LOCATIONS[0]);
  const [transmission, setTransmission] = useState(data.transmission || TRANSMISSIONS[0]);
  const [fuelType, setFuelType] = useState(data.fuelType || FUEL_TYPES[0]);
  const [bodyType, setBodyType] = useState(data.bodyType || BODY_TYPES[0]);
  const [condition, setCondition] = useState(data.condition || CONDITIONS[0]);
  const [status, setStatus] = useState(data.status || 'Available');
  const [description, setDescription] = useState(data.description || '');
  const [isNegotiable, setIsNegotiable] = useState(data.isNegotiable ?? true);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!make || !model || !year || !price) {
      Alert.alert('Missing Fields', 'Make, Model, Year and Price are required.');
      return;
    }
    setLoading(true);
    try {
      await updateListingAPI(data._id, {
        title: `${year} ${make} ${model}`, make, model,
        year: Number(year), price: Number(price), mileage: Number(mileage),
        engineCapacity: Number(engineCapacity), location, transmission,
        fuelType, bodyType, condition, status, description, isNegotiable,
      });
      Alert.alert('Success', 'Listing updated successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Update Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const PickerField = ({ label, icon, selectedValue, onValueChange, items }) => (
    <View style={styles.pickerContainer}>
      <View style={styles.pickerLabelRow}>
        <Ionicons name={icon} size={14} color="#636e72" />
        <Text style={styles.pickerLabel}>{label}</Text>
      </View>
      <View style={styles.pickerBox}>
        <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={styles.picker} dropdownIconColor="#636e72">
          {items.map(item => <Picker.Item key={item} label={item} value={item} />)}
        </Picker>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Edit Listing</Text>
      <Text style={styles.subText}>Modify your vehicle listing details</Text>

      <Text style={styles.sectionTitle}>Vehicle Information</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Make" placeholderTextColor="#b2bec3" value={make} onChangeText={setMake} />
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Model" placeholderTextColor="#b2bec3" value={model} onChangeText={setModel} />
      </View>
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Year" placeholderTextColor="#b2bec3" keyboardType="numeric" value={year} onChangeText={setYear} />
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Mileage (km)" placeholderTextColor="#b2bec3" keyboardType="numeric" value={mileage} onChangeText={setMileage} />
      </View>
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Price (Rs)" placeholderTextColor="#b2bec3" keyboardType="numeric" value={price} onChangeText={setPrice} />
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Engine CC" placeholderTextColor="#b2bec3" keyboardType="numeric" value={engineCapacity} onChangeText={setEngineCapacity} />
      </View>

      <Text style={styles.sectionTitle}>Specifications</Text>
      <View style={styles.row}>
        <PickerField label="Transmission" icon="cog-outline" selectedValue={transmission} onValueChange={setTransmission} items={TRANSMISSIONS} />
        <PickerField label="Fuel Type" icon="water-outline" selectedValue={fuelType} onValueChange={setFuelType} items={FUEL_TYPES} />
      </View>
      <View style={styles.row}>
        <PickerField label="Body Type" icon="cube-outline" selectedValue={bodyType} onValueChange={setBodyType} items={BODY_TYPES} />
        <PickerField label="Condition" icon="shield-checkmark-outline" selectedValue={condition} onValueChange={setCondition} items={CONDITIONS} />
      </View>
      <View style={styles.row}>
        <PickerField label="Location" icon="location-outline" selectedValue={location} onValueChange={setLocation} items={LOCATIONS} />
        <PickerField label="Status" icon="checkmark-circle-outline" selectedValue={status} onValueChange={setStatus} items={STATUSES} />
      </View>

      <TouchableOpacity
        style={[styles.negoBtn, isNegotiable && styles.negoBtnActive]}
        activeOpacity={0.7}
        onPress={() => setIsNegotiable(!isNegotiable)}
      >
        <Feather name={isNegotiable ? "check-circle" : "x-circle"} size={18} color={isNegotiable ? "#10ac84" : "#636e72"} />
        <Text style={[styles.negoTxt, isNegotiable && { color: '#10ac84' }]}>
          {isNegotiable ? 'Price is Negotiable' : 'Fixed Price'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Vehicle description"
        placeholderTextColor="#b2bec3"
        multiline numberOfLines={5}
        value={description} onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.updateBtn} activeOpacity={0.85} onPress={handleUpdate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : (
          <>
            <Feather name="save" size={18} color="#fff" />
            <Text style={styles.updateBtnTxt}>Save Changes</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginBottom: 4, letterSpacing: -0.3 },
  subText: { fontSize: 14, color: '#b2bec3', marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 12, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  input: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 15, color: '#1a1a2e', borderWidth: 1, borderColor: '#e9ecef' },
  textArea: { height: 110, textAlignVertical: 'top' },

  pickerContainer: { flex: 1, marginBottom: 12, marginHorizontal: 2 },
  pickerLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5 },
  pickerLabel: { fontSize: 12, color: '#636e72', fontWeight: '600' },
  pickerBox: { backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#e9ecef', height: 48, justifyContent: 'center', overflow: 'hidden' },
  picker: { height: 48, color: '#1a1a2e' },

  negoBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 12, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e9ecef', marginBottom: 16 },
  negoBtnActive: { backgroundColor: '#f0faf7', borderColor: '#10ac84' },
  negoTxt: { fontSize: 15, fontWeight: '700', color: '#636e72' },

  updateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#3498db', padding: 18, borderRadius: 14, ...Platform.select({ ios: { shadowColor: '#3498db', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }, android: { elevation: 4 } }) },
  updateBtnTxt: { color: '#fff', fontSize: 17, fontWeight: '700' }
});

export default EditListing;
