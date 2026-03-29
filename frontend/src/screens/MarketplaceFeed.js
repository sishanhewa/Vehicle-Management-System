import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchListings } from '../api/marketplaceApi';
import { AuthContext } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

const MarketplaceFeed = () => {
  const router = useRouter();
  const { userInfo, logout } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Advanced Search State (8+ Fields)
  const [filters, setFilters] = useState({
    make: 'Any Make',
    model: '',
    bodyType: 'Any Type',
    condition: 'Any Condition',
    location: 'Any City',
    fuelType: 'Any Fuel',
    transmission: 'Any Gear',
    yearMin: '',
    yearMax: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await fetchListings(filters);
      setVehicles(data);
    } catch (error) {
      console.error("Fetch Feed Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
      <View style={styles.infoRow}>
         <View>
            <Text style={styles.title}>{item.year} {item.make} {item.model}</Text>
            <Text style={styles.locationTxt}>📍 {item.location}</Text>
         </View>
         <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
      </View>
      <View style={styles.tagRow}>
         <Text style={styles.tag}>{item.transmission}</Text>
         <Text style={styles.tag}>{item.fuelType}</Text>
         <Text style={styles.tag}>{item.mileage}km</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={styles.headerArea}>
        <View style={styles.topRow}>
          <Text style={styles.logo}>Vehicle<Text style={styles.logoRed}>Market</Text></Text>
          {userInfo ? (
            <View style={styles.authRow}>
              <TouchableOpacity onPress={() => router.push('/ManageAds')} style={styles.dashboardBtn}>
                <Text style={styles.dashboardBtnTxt}>Seller Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logout}><Text style={styles.logoutTxt}>Logout</Text></TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginBtn}>
              <Text style={styles.loginBtnTxt}>Login</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.subHeader}>Find The Best Vehicle For You</Text>

        {/* Advanced Filter Toggle */}
        <TouchableOpacity 
          style={styles.filterToggle} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleTxt}>
            {showFilters ? '▲ Hide Advanced Search' : '▼ Show Advanced Search Filters'}
          </Text>
        </TouchableOpacity>

        {showFilters && (
          <View style={styles.advancedFilterBox}>
            <View style={styles.filterGrid}>
              {/* Row 1 */}
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={filters.make} onValueChange={(v) => handleFilterChange('make', v)} style={styles.picker}>
                  <Picker.Item label="Any Make" value="Any Make" />
                  <Picker.Item label="Toyota" value="Toyota" />
                  <Picker.Item label="Honda" value="Honda" />
                  <Picker.Item label="Suzuki" value="Suzuki" />
                </Picker>
              </View>
              <TextInput style={styles.filterInput} placeholder="Model (Civic...)" value={filters.model} onChangeText={(v) => handleFilterChange('model', v)} />
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={filters.bodyType} onValueChange={(v) => handleFilterChange('bodyType', v)} style={styles.picker}>
                  <Picker.Item label="Any Type" value="Any Type" />
                  <Picker.Item label="Sedan" value="Sedan" />
                  <Picker.Item label="Hatchback" value="Hatchback" />
                  <Picker.Item label="SUV" value="SUV" />
                </Picker>
              </View>
              
              {/* Row 2 */}
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={filters.condition} onValueChange={(v) => handleFilterChange('condition', v)} style={styles.picker}>
                  <Picker.Item label="Any Condition" value="Any Condition" />
                  <Picker.Item label="Used" value="Used" />
                  <Picker.Item label="New" value="New" />
                </Picker>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={filters.location} onValueChange={(v) => handleFilterChange('location', v)} style={styles.picker}>
                  <Picker.Item label="Any City" value="Any City" />
                  <Picker.Item label="Colombo" value="Colombo" />
                  <Picker.Item label="Kandy" value="Kandy" />
                  <Picker.Item label="Gampaha" value="Gampaha" />
                </Picker>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={filters.fuelType} onValueChange={(v) => handleFilterChange('fuelType', v)} style={styles.picker}>
                  <Picker.Item label="Any Fuel" value="Any Fuel" />
                  <Picker.Item label="Petrol" value="Petrol" />
                  <Picker.Item label="Diesel" value="Diesel" />
                  <Picker.Item label="Hybrid" value="Hybrid" />
                </Picker>
              </View>

              {/* Row 3 */}
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={filters.transmission} onValueChange={(v) => handleFilterChange('transmission', v)} style={styles.picker}>
                  <Picker.Item label="Any Gear" value="Any Gear" />
                  <Picker.Item label="Automatic" value="Automatic" />
                  <Picker.Item label="Manual" value="Manual" />
                </Picker>
              </View>
              <TextInput style={styles.filterInput} placeholder="Year Min" keyboardType="numeric" value={filters.yearMin} onChangeText={(v) => handleFilterChange('yearMin', v)} />
              <TextInput style={styles.filterInput} placeholder="Year Max" keyboardType="numeric" value={filters.yearMax} onChangeText={(v) => handleFilterChange('yearMax', v)} />

              {/* Row 4 */}
              <TextInput style={styles.filterInput} placeholder="Min Price" keyboardType="numeric" value={filters.minPrice} onChangeText={(v) => handleFilterChange('minPrice', v)} />
              <TextInput style={styles.filterInput} placeholder="Max Price" keyboardType="numeric" value={filters.maxPrice} onChangeText={(v) => handleFilterChange('maxPrice', v)} />
              
              <TouchableOpacity style={styles.searchBtn} onPress={loadVehicles}>
                <Text style={styles.searchBtnTxt}>🔍 Search Vehicles</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {loading ? (
         <ActivityIndicator size="large" color="#10ac84" style={styles.loader} />
      ) : vehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No vehicles match your search.</Text>
          <TouchableOpacity onPress={() => setFilters({ make: 'Any Make', model: '', bodyType: 'Any Type', condition: 'Any Condition', location: 'Any City', fuelType: 'Any Fuel', transmission: 'Any Gear', yearMin: '', yearMax: '', minPrice: '', maxPrice: '' })}><Text style={styles.resetTxt}>Clear All Filters</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        />
      )}
      
      {userInfo && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/CreateListing')}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  headerArea: { padding: 15, backgroundColor: '#fff', elevation: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  logo: { fontSize: 22, fontWeight: '900', color: '#2d3436' },
  logoRed: { color: '#e74c3c' },
  authRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  dashboardBtn: { backgroundColor: '#2d3436', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  dashboardBtnTxt: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  logoutTxt: { color: '#e74c3c', fontSize: 12, fontWeight: 'bold' },
  loginBtn: { backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20 },
  loginBtnTxt: { color: '#fff', fontWeight: 'bold' },
  
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', textAlign: 'center', marginBottom: 10 },
  filterToggle: { padding: 10, backgroundColor: '#f1f2f6', borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  filterToggleTxt: { color: '#2f3542', fontWeight: 'bold', fontSize: 14 },

  advancedFilterBox: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ecf0f1' },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerWrapper: { flex: 1, minWidth: '30%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#dfe6e9', height: 45, justifyContent: 'center' },
  picker: { height: 45 },
  filterInput: { flex: 1, minWidth: '30%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#dfe6e9', paddingHorizontal: 10, height: 45 },
  searchBtn: { flex: 1, minWidth: '60%', backgroundColor: '#10ac84', borderRadius: 8, height: 45, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 5 },
  searchBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  loader: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#7f8c8d', marginBottom: 20 },
  resetTxt: { color: '#3498db', fontWeight: 'bold' },

  card: { backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', marginBottom: 20, elevation: 3 },
  image: { width: '100%', height: 200, resizeMode: 'cover' },
  infoRow: { paddingHorizontal: 15, paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', flex: 1 },
  locationTxt: { fontSize: 13, color: '#7f8c8d', marginTop: 3 },
  price: { fontSize: 18, color: '#e74c3c', fontWeight: 'bold' },
  tagRow: { flexDirection: 'row', padding: 15, gap: 10 },
  tag: { backgroundColor: '#f1f2f6', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 5, fontSize: 11, color: '#57606f', fontWeight: 'bold' },

  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#10ac84', borderRadius: 30, elevation: 6 },
  fabIcon: { fontSize: 32, color: 'white', lineHeight: 34 }
});

export default MarketplaceFeed;
