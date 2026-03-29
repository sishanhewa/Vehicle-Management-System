import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createListing } from '../api/marketplaceApi';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';

const CreateListing = () => {
  const router = useRouter();
  const { userInfo } = useContext(AuthContext);

  // Core Data
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  
  // New Riyasewana Detailed Requirements
  const [location, setLocation] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('');
  const [transmission, setTransmission] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Petrol');
  const [bodyType, setBodyType] = useState('Sedan');
  
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 

  // Fast protection boot
  useEffect(() => {
    if (!userInfo) {
       Alert.alert("Authentication Required", "You must log in to create a listing");
       router.replace('/login');
    }
  }, [userInfo]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Please allow photo access to upload images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!make || !model || !year || !price || !mileage || !location || !engineCapacity || !bodyType) {
      Alert.alert('Missing Fields', 'Please carefully fill out all Riyasewana standard required fields.');
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', `${year} ${make} ${model}`);
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('price', price);
    formData.append('mileage', mileage);
    formData.append('location', location);
    formData.append('engineCapacity', engineCapacity);
    formData.append('transmission', transmission);
    formData.append('fuelType', fuelType);
    formData.append('bodyType', bodyType);
    formData.append('isNegotiable', 'true');
    
    if (description) formData.append('description', description);
    
    if (selectedImage) {
      formData.append('images', {
        uri: selectedImage.uri,
        type: 'image/jpeg', 
        name: `upload-${Date.now()}.jpg`,
      });
    }

    try {
      await createListing(formData);
      Alert.alert('Success', 'Vehicle Listing Live on Marketplace!');
      router.back(); 
    } catch (error) {
       Alert.alert('Network Error', error.message || 'Cannot upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Post Free Ad</Text>
      
      <View style={styles.row}>
        <TextInput style={[styles.input, {flex: 1, marginRight: 10}]} placeholder="Make (Toyota)" value={make} onChangeText={setMake} />
        <TextInput style={[styles.input, {flex: 1}]} placeholder="Model (Prius)" value={model} onChangeText={setModel} />
      </View>
      
      <TextInput style={styles.input} placeholder="Location (District/City)" value={location} onChangeText={setLocation} />
      
      <View style={styles.row}>
         <TextInput style={[styles.input, {flex: 1, marginRight: 10}]} placeholder="Year (2020)" keyboardType="numeric" value={year} onChangeText={setYear} />
         <TextInput style={[styles.input, {flex: 1}]} placeholder="Mileage (km)" keyboardType="numeric" value={mileage} onChangeText={setMileage} />
      </View>
      
      <TextInput style={styles.input} placeholder="Price (Rs)" keyboardType="numeric" value={price} onChangeText={setPrice} />
      
      <View style={styles.row}>
         <TextInput style={[styles.input, {flex: 1, marginRight: 10}]} placeholder="Engine CC (1500)" keyboardType="numeric" value={engineCapacity} onChangeText={setEngineCapacity} />
         <TextInput style={[styles.input, {flex: 1}]} placeholder="Body Type (Sedan)" value={bodyType} onChangeText={setBodyType} />
      </View>

      {/* Basic text surrogates for dropdowns since native Web UI select boxes fail on Expo Go */}
      <View style={styles.row}>
         <TextInput style={[styles.input, {flex: 1, marginRight: 10}]} placeholder="Gear (Auto/Manual)" value={transmission} onChangeText={setTransmission} />
         <TextInput style={[styles.input, {flex: 1}]} placeholder="Fuel (Petrol/Diesel)" value={fuelType} onChangeText={setFuelType} />
      </View>

      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Detailed Description (Optional)" 
        multiline={true} 
        numberOfLines={4}
        value={description} 
        onChangeText={setDescription} 
      />

      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <Text style={styles.imageBtnText}>{selectedImage ? '✅ Image Prepared for Upload' : '📸 Select Vehicle Image'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Post Listing Now</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: '800', marginBottom: 25, color: '#e74c3c' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  input: { backgroundColor: '#f2f2f2', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16, color: '#333' },
  textArea: { height: 100, textAlignVertical: 'top' },
  imageBtn: { backgroundColor: '#eaebed', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: '#bdc3c7', borderStyle: 'dashed' },
  imageBtnText: { color: '#2c3e50', fontSize: 16, fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#e74c3c', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 50, elevation: 4 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CreateListing;
