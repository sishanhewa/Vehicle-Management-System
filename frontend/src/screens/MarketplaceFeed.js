import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, StatusBar, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchListings, resolveImageUrl } from '../api/marketplaceApi';
import { AuthContext } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, Feather } from '@expo/vector-icons';

const MAKES = ['Any Make', 'Toyota', 'Honda', 'Suzuki', 'Nissan', 'Mitsubishi', 'Hyundai', 'Kia', 'Mercedes-Benz', 'BMW', 'Audi'];
const BODY_TYPES = ['Any Type', 'Sedan', 'Hatchback', 'SUV', 'Coupé', 'Van', 'Pickup', 'Jeep'];
const CONDITIONS = ['Any Condition', 'New', 'Used', 'Reconditioned'];
const LOCATIONS = ['Any City', 'Colombo', 'Kandy', 'Gampaha', 'Kurunegala', 'Kalutara', 'Galle', 'Matara', 'Ratnapura', 'Anuradhapura', 'Jaffna', 'Batticaloa', 'Badulla'];
const FUEL_TYPES = ['Any Fuel', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
const TRANSMISSIONS = ['Any Gear', 'Automatic', 'Manual', 'Tiptronic'];

const DEFAULT_FILTERS = {
  make: 'Any Make', model: '', bodyType: 'Any Type', condition: 'Any Condition',
  location: 'Any City', fuelType: 'Any Fuel', transmission: 'Any Gear',
  yearMin: '', yearMax: '', minPrice: '', maxPrice: ''
};

const MarketplaceFeed = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userInfo, logout } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [resultCount, setResultCount] = useState(0);

  useFocusEffect(
    useCallback(() => { loadVehicles(); }, [])
  );

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await fetchListings(filters);
      setVehicles(data);
      setResultCount(data.length);
    } catch (error) {
      console.error("Fetch Feed Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  const renderPickerRow = (stateKey, options) => (
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={filters[stateKey]}
        onValueChange={(v) => handleFilterChange(stateKey, v)}
        style={styles.picker}
        dropdownIconColor="#636e72"
      >
        {options.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
      </Picker>
    </View>
  );

  const renderItem = ({ item }) => {
    const imageUri = item.images && item.images.length > 0
      ? resolveImageUrl(item.images[0])
      : 'https://via.placeholder.com/400x200?text=No+Image';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/ListingDetails', params: { vehicleId: item._id, vehicle: JSON.stringify(item) } })}
      >
        <Image source={{ uri: imageUri }} style={styles.cardImage} />
        {item.isNegotiable && (
          <View style={styles.negoBadge}>
            <Text style={styles.negoBadgeTxt}>Negotiable</Text>
          </View>
        )}
        <View style={styles.cardBody}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.year} {item.make} {item.model}</Text>
            <Text style={styles.cardPrice}>Rs. {Number(item.price).toLocaleString()}</Text>
          </View>
          <View style={styles.cardLocationRow}>
            <Ionicons name="location-outline" size={13} color="#636e72" />
            <Text style={styles.cardLocation}>{item.location || 'Unknown'}</Text>
          </View>
          <View style={styles.cardTagRow}>
            <View style={styles.cardTag}>
              <Ionicons name="cog-outline" size={12} color="#636e72" />
              <Text style={styles.cardTagTxt}>{item.transmission}</Text>
            </View>
            <View style={styles.cardTag}>
              <Ionicons name="water-outline" size={12} color="#636e72" />
              <Text style={styles.cardTagTxt}>{item.fuelType}</Text>
            </View>
            <View style={styles.cardTag}>
              <Ionicons name="speedometer-outline" size={12} color="#636e72" />
              <Text style={styles.cardTagTxt}>{Number(item.mileage).toLocaleString()} km</Text>
            </View>
            {item.engineCapacity && (
              <View style={styles.cardTag}>
                <Ionicons name="flash-outline" size={12} color="#636e72" />
                <Text style={styles.cardTagTxt}>{item.engineCapacity}cc</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logo}>Vehicle<Text style={styles.logoAccent}>Market</Text></Text>
          {userInfo ? (
            <View style={styles.authRow}>
              <TouchableOpacity onPress={() => router.push('/ManageAds')} style={styles.myAdsBtn}>
                <Feather name="grid" size={15} color="#fff" />
                <Text style={styles.myAdsBtnTxt}>My Ads</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                <Feather name="log-out" size={16} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginBtn}>
              <Feather name="user" size={15} color="#fff" />
              <Text style={styles.loginBtnTxt}>Login</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.subHeader}>Find The Best Vehicle For You</Text>

        <TouchableOpacity
          style={styles.filterToggle}
          activeOpacity={0.7}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Feather name={showFilters ? "chevron-up" : "sliders"} size={16} color="#10ac84" />
          <Text style={styles.filterToggleTxt}>
            {showFilters ? 'Hide Filters' : 'Advanced Search'}
          </Text>
        </TouchableOpacity>

        {showFilters && (
          <View style={styles.filterBox}>
            <View style={styles.filterGrid}>
              {renderPickerRow('make', MAKES)}
              <TextInput style={styles.filterInput} placeholder="Model (e.g. Corolla)" placeholderTextColor="#b2bec3" value={filters.model} onChangeText={(v) => handleFilterChange('model', v)} />
              {renderPickerRow('bodyType', BODY_TYPES)}
              {renderPickerRow('condition', CONDITIONS)}
              {renderPickerRow('location', LOCATIONS)}
              {renderPickerRow('fuelType', FUEL_TYPES)}
              {renderPickerRow('transmission', TRANSMISSIONS)}
              <TextInput style={styles.filterInput} placeholder="Year Min" placeholderTextColor="#b2bec3" keyboardType="numeric" value={filters.yearMin} onChangeText={(v) => handleFilterChange('yearMin', v)} />
              <TextInput style={styles.filterInput} placeholder="Year Max" placeholderTextColor="#b2bec3" keyboardType="numeric" value={filters.yearMax} onChangeText={(v) => handleFilterChange('yearMax', v)} />
              <TextInput style={styles.filterInput} placeholder="Min Price (Rs)" placeholderTextColor="#b2bec3" keyboardType="numeric" value={filters.minPrice} onChangeText={(v) => handleFilterChange('minPrice', v)} />
              <TextInput style={styles.filterInput} placeholder="Max Price (Rs)" placeholderTextColor="#b2bec3" keyboardType="numeric" value={filters.maxPrice} onChangeText={(v) => handleFilterChange('maxPrice', v)} />
              <TouchableOpacity style={styles.searchBtn} activeOpacity={0.8} onPress={loadVehicles}>
                <Feather name="search" size={18} color="#fff" />
                <Text style={styles.searchBtnTxt}>Search Vehicles</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Result Bar */}
      {!loading && (
        <View style={styles.resultBar}>
          <Text style={styles.resultTxt}>{resultCount} vehicle{resultCount !== 1 ? 's' : ''} found</Text>
          <TouchableOpacity onPress={() => { clearFilters(); setTimeout(loadVehicles, 100); }} style={styles.clearRow}>
            <Feather name="x-circle" size={14} color="#e74c3c" />
            <Text style={styles.clearTxt}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#10ac84" />
          <Text style={styles.loaderTxt}>Loading vehicles...</Text>
        </View>
      ) : vehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-sport-outline" size={64} color="#dfe6e9" />
          <Text style={styles.emptyText}>No vehicles match your search</Text>
          <TouchableOpacity style={styles.clearAllBtn} onPress={() => { clearFilters(); setTimeout(loadVehicles, 100); }}>
            <Text style={styles.clearAllBtnTxt}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      {userInfo && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => router.push('/CreateListing')}>
          <Feather name="plus" size={26} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 }, android: { elevation: 4 } }) },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logo: { fontSize: 24, fontWeight: '800', color: '#1a1a2e', letterSpacing: -0.5 },
  logoAccent: { color: '#10ac84' },
  authRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  myAdsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1a1a2e', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  myAdsBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '600' },
  logoutBtn: { padding: 8, borderRadius: 20, backgroundColor: '#fff0f0' },
  loginBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10ac84', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  loginBtnTxt: { color: '#fff', fontWeight: '600', fontSize: 13 },

  subHeader: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', textAlign: 'center', marginBottom: 14 },
  filterToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, backgroundColor: '#f0faf7', borderRadius: 10, borderWidth: 1, borderColor: '#d4edda' },
  filterToggleTxt: { color: '#10ac84', fontWeight: '700', fontSize: 14 },

  // Filters
  filterBox: { marginTop: 14, backgroundColor: '#fafbfc', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e9ecef' },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerWrapper: { flex: 1, minWidth: '30%', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dee2e6', height: 46, justifyContent: 'center', overflow: 'hidden' },
  picker: { height: 46, color: '#2d3436' },
  filterInput: { flex: 1, minWidth: '30%', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dee2e6', paddingHorizontal: 14, height: 46, fontSize: 14, color: '#2d3436' },
  searchBtn: { flex: 1, minWidth: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#10ac84', borderRadius: 10, height: 48, marginTop: 4, ...Platform.select({ ios: { shadowColor: '#10ac84', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }, android: { elevation: 4 } }) },
  searchBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Result Bar
  resultBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  resultTxt: { color: '#636e72', fontSize: 13, fontWeight: '600' },
  clearRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearTxt: { color: '#e74c3c', fontSize: 13, fontWeight: '600' },

  // Loading & Empty
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderTxt: { marginTop: 12, color: '#b2bec3', fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#636e72', marginTop: 16, marginBottom: 20 },
  clearAllBtn: { backgroundColor: '#10ac84', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 25 },
  clearAllBtnTxt: { color: '#fff', fontWeight: '700' },

  // Cards
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12 }, android: { elevation: 3 } }) },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  negoBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(16, 172, 132, 0.9)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
  negoBadgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  cardBody: { padding: 16 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', flex: 1, marginRight: 10 },
  cardPrice: { fontSize: 17, color: '#e74c3c', fontWeight: '800' },
  cardLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  cardLocation: { fontSize: 13, color: '#636e72' },
  cardTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cardTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f1f3f5', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6 },
  cardTagTxt: { fontSize: 11, color: '#636e72', fontWeight: '600' },

  // FAB
  fab: { position: 'absolute', width: 56, height: 56, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 24, backgroundColor: '#10ac84', borderRadius: 28, ...Platform.select({ ios: { shadowColor: '#10ac84', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 }, android: { elevation: 8 } }) },
});

export default MarketplaceFeed;
