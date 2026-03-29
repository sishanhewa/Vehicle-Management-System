import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ListingDetails = () => {
  const { vehicle } = useLocalSearchParams();
  const data = vehicle ? JSON.parse(vehicle) : null;

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Error loading listing details.</Text>
      </View>
    );
  }

  // Handle calling the seller natively
  const handleCall = () => {
    if (data.sellerId?.phone) {
      Linking.openURL(`tel:${data.sellerId.phone}`);
    } else {
      alert("Seller has not provided a contact number.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: data.images && data.images.length > 0 
          ? `http://10.0.2.2:5000${data.images[0]}` 
          : 'https://via.placeholder.com/400x300?text=Vehicle' }} 
        style={styles.image} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{data.title || `${data.year} ${data.make} ${data.model}`}</Text>
        <Text style={styles.location}>Posted in {data.location || 'Unknown'} area</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Rs. {data.price?.toLocaleString() || 'N/A'}</Text>
          {data.isNegotiable && <Text style={styles.negotiable}>(Negotiable)</Text>}
        </View>

        {/* Riyasewana-style Grid Specifications */}
        <View style={styles.specsGrid}>
           <View style={styles.specItem}>
              <Text style={styles.specLabel}>Make</Text>
              <Text style={styles.specValue}>{data.make}</Text>
           </View>
           <View style={styles.specItem}>
              <Text style={styles.specLabel}>Model</Text>
              <Text style={styles.specValue}>{data.model}</Text>
           </View>
           <View style={styles.specItem}>
              <Text style={styles.specLabel}>YOM</Text>
              <Text style={styles.specValue}>{data.year}</Text>
           </View>
           <View style={styles.specItem}>
              <Text style={styles.specLabel}>Mileage</Text>
              <Text style={styles.specValue}>{data.mileage} km</Text>
           </View>
           <View style={styles.specItem}>
              <Text style={styles.specLabel}>Transmission</Text>
              <Text style={styles.specValue}>{data.transmission || '-'}</Text>
           </View>
           <View style={styles.specItem}>
              <Text style={styles.specLabel}>Fuel</Text>
              <Text style={styles.specValue}>{data.fuelType || '-'}</Text>
           </View>
           <View style={styles.specItem}>
              <Text style={styles.specLabel}>Engine (cc)</Text>
              <Text style={styles.specValue}>{data.engineCapacity || '-'}</Text>
           </View>
           <View style={styles.specItem}>
              <Text style={styles.specLabel}>Condition</Text>
              <Text style={styles.specValue}>{data.condition || 'Used'}</Text>
           </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{data.description || 'No detailed description provided by the seller.'}</Text>
        
        {/* Contact Block */}
        <View style={styles.contactBlock}>
           <Text style={styles.sellerName}>Seller: {data.sellerId?.name || 'Private Seller'}</Text>
           <Text style={styles.sellerEmail}>{data.sellerId?.email || 'N/A'}</Text>
           <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Text style={styles.callButtonText}>📞 Call {data.sellerId?.phone || 'Seller'}</Text>
           </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 250 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  location: { color: '#7f8c8d', fontSize: 14, marginBottom: 15 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, backgroundColor: '#fff', padding: 15, borderRadius: 8, elevation: 2 },
  price: { fontSize: 24, color: '#c0392b', fontWeight: 'bold', marginRight: 10 },
  negotiable: { fontSize: 14, color: '#f39c12', fontWeight: 'bold' },
  
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', padding: 15, borderRadius: 8, elevation: 2, marginBottom: 25 },
  specItem: { width: '50%', marginBottom: 15 },
  specLabel: { fontSize: 12, color: '#7f8c8d', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 2 },
  specValue: { fontSize: 16, color: '#333', fontWeight: 'bold' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 30, backgroundColor: '#fff', padding: 15, borderRadius: 8, elevation: 2 },

  contactBlock: { backgroundColor: '#ecf0f1', padding: 20, borderRadius: 8, alignItems: 'center', marginBottom: 40 },
  sellerName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  sellerEmail: { fontSize: 14, color: '#7f8c8d', marginBottom: 15 },
  callButton: { backgroundColor: '#27ae60', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, width: '100%', alignItems: 'center', elevation: 3 },
  callButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default ListingDetails;
