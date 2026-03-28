import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ListingDetails = () => {
  // Grab the vehicle object via expo-router parameters
  const params = useLocalSearchParams();
  const vehicle = JSON.parse(params.vehicle);

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: vehicle.images && vehicle.images.length > 0 
          ? `http://10.0.2.2:5000${vehicle.images[0]}` 
          : 'https://via.placeholder.com/400x300?text=Vehicle' }} 
        style={styles.image} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
        <Text style={styles.price}>Rs. {vehicle.price.toLocaleString()}</Text>
        
        <View style={styles.badgeRow}>
          <Text style={[styles.badge, { backgroundColor: '#e8f6f3', color: '#16a085' }]}>{vehicle.condition}</Text>
          <Text style={[styles.badge, { backgroundColor: '#ebf5fb', color: '#2980b9' }]}>{vehicle.status}</Text>
        </View>

        <View style={styles.specsCard}>
           <Text style={styles.specText}>• Mileage: {vehicle.mileage} miles</Text>
           <Text style={styles.specText}>• Listed On: {new Date(vehicle.createdAt).toLocaleDateString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{vehicle.description || "No description provided."}</Text>
        
        <TouchableOpacity style={styles.contactBtn}>
          <Text style={styles.contactBtnText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#2c3e50' },
  price: { fontSize: 24, color: '#27ae60', fontWeight: 'bold', marginTop: 10 },
  badgeRow: { flexDirection: 'row', marginTop: 15, marginBottom: 20 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 10, fontWeight: 'bold', overflow: 'hidden' },
  specsCard: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10, marginBottom: 25, borderWidth: 1, borderColor: '#ecf0f1' },
  specText: { fontSize: 16, marginBottom: 8, color: '#34495e', fontWeight: '500' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#2c3e50' },
  description: { fontSize: 16, color: '#555', lineHeight: 26, marginBottom: 40 },
  contactBtn: { backgroundColor: '#2980b9', padding: 18, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3 },
  contactBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default ListingDetails;
