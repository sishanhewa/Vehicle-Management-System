import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchListings } from '../api/marketplaceApi';

const MarketplaceFeed = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load the vehicles when the screen initially mounts
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await fetchListings();
      setVehicles(data);
    } catch (error) {
      console.error("Fetch Feed Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      // Navigate to detailed view screen onClick using Expo Router
      onPress={() => router.push({ pathname: '/ListingDetails', params: { vehicle: JSON.stringify(item) } })}
    >
      <Image 
        source={{ uri: item.images && item.images.length > 0 
          ? `http://10.0.2.2:5000${item.images[0]}` 
          : 'https://via.placeholder.com/400x200?text=No+Image' }} 
        style={styles.image} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.year} {item.make} {item.model}</Text>
        <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
        <Text style={styles.details}>{item.condition} | {item.mileage} miles</Text>
      </View>
    </TouchableOpacity>
  );

  // Loading UI indicator
  if (loading) return <ActivityIndicator size="large" color="#3498db" style={styles.loader} />;

  return (
    <View style={styles.container}>
      {vehicles.length === 0 ? (
        <Text style={styles.emptyText}>No vehicles available.</Text>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
      
      {/* Floating Action Button to post a new car */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/CreateListing')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  loader: { flex: 1, justifyContent: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#7f8c8d' },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 15, elevation: 5 },
  image: { width: '100%', height: 200, resizeMode: 'cover' },
  infoContainer: { padding: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: '#2c3e50' },
  price: { fontSize: 18, color: '#27ae60', fontWeight: 'bold', marginBottom: 5 },
  details: { color: '#7f8c8d', fontSize: 14 },
  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#2980b9', borderRadius: 30, elevation: 8 },
  fabIcon: { fontSize: 32, color: 'white', lineHeight: 34 }
});

export default MarketplaceFeed;
