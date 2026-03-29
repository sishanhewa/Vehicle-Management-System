import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchListings, resolveImageUrl } from '../api/marketplaceApi';
import { Feather, Ionicons } from '@expo/vector-icons';

const SellerProfile = () => {
  const { sellerId, sellerName, sellerPhone } = useLocalSearchParams();
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerId) loadSellerVehicles();
  }, [sellerId]);

  const loadSellerVehicles = async () => {
    setLoading(true);
    try {
      const data = await fetchListings({ sellerId });
      setVehicles(data);
    } catch (error) {
      console.error("Fetch Seller Profile Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (sellerPhone) Linking.openURL(`tel:${sellerPhone}`);
  };

  const renderItem = ({ item }) => {
    const imageUri = item.images && item.images.length > 0
      ? resolveImageUrl(item.images[0])
      : 'https://via.placeholder.com/200x120?text=No+Image';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/ListingDetails', params: { vehicle: JSON.stringify(item) } })}
      >
        <Image source={{ uri: imageUri }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.year} {item.make} {item.model}</Text>
          <Text style={styles.cardPrice}>Rs. {Number(item.price).toLocaleString()}</Text>
          <View style={styles.cardMetaRow}>
            <Ionicons name="location-outline" size={12} color="#b2bec3" />
            <Text style={styles.cardMeta}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>
            {sellerName ? sellerName.charAt(0).toUpperCase() : 'S'}
          </Text>
        </View>
        <Text style={styles.name}>{sellerName || 'Verified Seller'}</Text>
        {sellerPhone && (
          <TouchableOpacity style={styles.callBtn} activeOpacity={0.7} onPress={handleCall}>
            <Feather name="phone" size={16} color="#fff" />
            <Text style={styles.callBtnTxt}>{sellerPhone}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.listingCount}>
          {loading ? '...' : `${vehicles.length} active listing${vehicles.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : vehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-sport-outline" size={48} color="#dfe6e9" />
          <Text style={styles.emptyText}>No active listings from this seller</Text>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  profileHeader: { paddingVertical: 30, paddingHorizontal: 20, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 3 } }) },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  avatarTxt: { fontSize: 30, color: '#fff', fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginBottom: 12 },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#10ac84', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 25, marginBottom: 10 },
  callBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  listingCount: { fontSize: 13, color: '#b2bec3', fontWeight: '600' },

  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginBottom: 12, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  cardImage: { width: '100%', height: 150, resizeMode: 'cover' },
  cardInfo: { padding: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  cardPrice: { fontSize: 15, color: '#e74c3c', fontWeight: '800', marginBottom: 4 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMeta: { fontSize: 12, color: '#b2bec3' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 15, color: '#636e72', marginTop: 12 }
});

export default SellerProfile;
