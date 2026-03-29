import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchListings } from '../api/marketplaceApi';
import { AuthContext } from '../context/AuthContext';

const MarketplaceFeed = () => {
  const router = useRouter();
  const { userInfo, logout } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Filters
  const [searchMake, setSearchMake] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      // Pass the search filters elegantly
      const data = await fetchListings({ make: searchMake, location: searchLocation });
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
        <Text style={styles.details}>
          📍 {item.location} • {item.transmission} • {item.mileage}km
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Header & Search Area */}
      <View style={styles.headerArea}>
        {userInfo ? (
          <View style={styles.authRow}>
            <Text style={styles.welcomeTxt}>Welcome, {userInfo.name}</Text>
            <TouchableOpacity onPress={logout}><Text style={styles.authLink}>Logout</Text></TouchableOpacity>
          </View>
        ) : (
          <View style={styles.authRow}>
            <Text style={styles.welcomeTxt}>Guest Mode</Text>
            <TouchableOpacity onPress={() => router.push('/login')}><Text style={styles.authLink}>Login / Register</Text></TouchableOpacity>
          </View>
        )}

        <View style={styles.filterRow}>
           <TextInput 
             style={styles.filterInput} 
             placeholder="Search Make (e.g. Toyota)" 
             value={searchMake}
             onChangeText={setSearchMake}
           />
           <TextInput 
             style={styles.filterInput} 
             placeholder="City" 
             value={searchLocation}
             onChangeText={setSearchLocation}
           />
           <TouchableOpacity style={styles.searchBtn} onPress={loadVehicles}>
             <Text style={styles.searchBtnTxt}>Search</Text>
           </TouchableOpacity>
        </View>
      </View>

      {loading ? (
         <ActivityIndicator size="large" color="#e74c3c" style={styles.loader} />
      ) : vehicles.length === 0 ? (
        <Text style={styles.emptyText}>No vehicles match your search.</Text>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        />
      )}
      
      {/* Only show the Add Post button if the Seller is securely logged in */}
      {userInfo && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/CreateListing')}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  headerArea: { padding: 15, backgroundColor: '#fff', elevation: 4 },
  authRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  welcomeTxt: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  authLink: { color: '#e74c3c', fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', gap: 10 },
  filterInput: { flex: 1, backgroundColor: '#eaebed', borderRadius: 8, padding: 10 },
  searchBtn: { backgroundColor: '#e74c3c', padding: 12, borderRadius: 8, justifyContent: 'center' },
  searchBtnTxt: { color: '#fff', fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#7f8c8d' },
  card: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 15, elevation: 3 },
  image: { width: '100%', height: 180, resizeMode: 'cover' },
  infoContainer: { padding: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  price: { fontSize: 18, color: '#c0392b', fontWeight: 'bold', marginBottom: 6 },
  details: { color: '#7f8c8d', fontSize: 13 },
  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#27ae60', borderRadius: 30, elevation: 6 },
  fabIcon: { fontSize: 32, color: 'white', lineHeight: 34 }
});

export default MarketplaceFeed;
