import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createListing } from '../api/marketplaceApi';

// Import Expo Image Picker
import * as ImagePicker from 'expo-image-picker';

const CreateListing = () => {
  const router = useRouter();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null); 

  // ----- IMAGE PICKER LOGIC -----
  const pickImage = async () => {
    // Request permission (needed on some devices)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You've refused to allow this app to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Use literal string 'images' internally mapped in newer Expo SDKs
      allowsEditing: true,
      quality: 0.8,
    });
    
    // Updated logic for newer versions of expo-image-picker
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    // Form validation check
    if (!make || !model || !year || !price || !mileage) {
      Alert.alert('Missing Fields', 'Please fill out all mandatory fields.');
      return;
    }

    setLoading(true);
    
    // Construct Multi-part Form Data for hitting our API Endpoint
    const formData = new FormData();
    formData.append('title', `${year} ${make} ${model}`);
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('price', price);
    formData.append('mileage', mileage);
    if (description) formData.append('description', description);
    
    // Convert selected device image into File Payload for the backend Multer Middleware
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
      router.back(); // Navigate them back to the feed
    } catch (error) {
       Alert.alert('Network Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Sell Your Vehicle</Text>
      
      <TextInput style={styles.input} placeholder="Car Make (e.g. Honda)" placeholderTextColor="#999" value={make} onChangeText={setMake} />
      <TextInput style={styles.input} placeholder="Model (e.g. Civic)" placeholderTextColor="#999" value={model} onChangeText={setModel} />
      <TextInput style={styles.input} placeholder="Year (e.g. 2021)" placeholderTextColor="#999" keyboardType="numeric" value={year} onChangeText={setYear} />
      <TextInput style={styles.input} placeholder="Price in Rs." placeholderTextColor="#999" keyboardType="numeric" value={price} onChangeText={setPrice} />
      <TextInput style={styles.input} placeholder="Current Mileage" placeholderTextColor="#999" keyboardType="numeric" value={mileage} onChangeText={setMileage} />
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Detailed Description (Optional)" 
        placeholderTextColor="#999"
        multiline={true} 
        numberOfLines={4}
        value={description} 
        onChangeText={setDescription} 
      />

      <TouchableOpacity 
        style={styles.imageBtn} 
        onPress={pickImage}
      >
        <Text style={styles.imageBtnText}>{selectedImage ? '✅ Image Selected' : '📸 Select Vehicle Image'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Publish Listing</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: '800', marginBottom: 25, color: '#2c3e50' },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 16, marginBottom: 15, fontSize: 16, color: '#333' },
  textArea: { height: 120, textAlignVertical: 'top' },
  imageBtn: { backgroundColor: '#edf2f7', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 25, borderWidth: 2, borderColor: '#cbd5e0', borderStyle: 'dashed' },
  imageBtnText: { color: '#4a5568', fontSize: 16, fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#27ae60', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 4 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CreateListing;
