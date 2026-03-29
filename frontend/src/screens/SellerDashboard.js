import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchMyListings, deleteListingAPI, resolveImageUrl } from '../api/marketplaceApi';
import { AuthContext } from '../context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';

const SellerDashboard = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userInfo } = useContext(AuthContext);
  const [myVehicles, setMyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0 });

  useEffect(() => {
    if (!userInfo) {
      Alert.alert("Authentication Required", "You must log in to access the dashboard.");
      router.replace('/login');
    }
  }, [userInfo]);

  useFocusEffect(
    useCallback(() => {
      if (userInfo) loadMyAds();
    }, [userInfo])
  );

  const loadMyAds = async () => {
    setLoading(true);
    try {
      const data = await fetchMyListings();
      setMyVehicles(data);
      setStats({
        total: data.length,
        available: data.filter(v => v.status === 'Available').length,
        sold: data.filter(v => v.status === 'Sold').length,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not fetch your listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, title) => {
    Alert.alert("Delete Listing", `Permanently delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            await deleteListingAPI(id);
            setMyVehicles(prev => prev.filter(v => v._id !== id));
          } catch (error) {
            Alert.alert("Failed", error.message);
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => {
    const imageUri = item.images && item.images.length > 0
      ? resolveImageUrl(item.images[0])
      : 'https://via.placeholder.com/400x120?text=No+Image';

    return (
      <View style={styles.card}>
        <Image source={{ uri: imageUri }} style={styles.cardImage} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.year} {item.make} {item.model}</Text>
            <View style={[styles.statusBadge, item.status === 'Sold' && styles.soldBadge]}>
              <Text style={[styles.statusTxt, item.status === 'Sold' && styles.soldTxt]}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.cardPrice}>Rs. {Number(item.price).toLocaleString()}</Text>
          <View style={styles.cardMeta}>
            <Ionicons name="location-outline" size={13} color="#636e72" />
            <Text style={styles.cardMetaTxt}>{item.location}</Text>
            <Text style={styles.dot}>·</Text>
            <Ionicons name="cog-outline" size={13} color="#636e72" />
            <Text style={styles.cardMetaTxt}>{item.transmission}</Text>
            <Text style={styles.dot}>·</Text>
            <Ionicons name="water-outline" size={13} color="#636e72" />
            <Text style={styles.cardMetaTxt}>{item.fuelType}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editBtn}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/EditListing', params: { vehicle: JSON.stringify(item) } })}
            >
              <Feather name="edit-2" size={14} color="#fff" />
              <Text style={styles.actionTxt}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              activeOpacity={0.7}
              onPress={() => handleDelete(item._id, `${item.year} ${item.make} ${item.model}`)}
            >
              <Feather name="trash-2" size={14} color="#fff" />
              <Text style={styles.actionTxt}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loaderWrap, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#10ac84" />
        <Text style={styles.loaderTxt}>Loading your listings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Feather name="layers" size={20} color="#1a1a2e" />
          <Text style={styles.statNum}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, styles.statActive]}>
          <Feather name="check-circle" size={20} color="#10ac84" />
          <Text style={[styles.statNum, { color: '#10ac84' }]}>{stats.available}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statCard, styles.statSold]}>
          <Feather name="tag" size={20} color="#e67e22" />
          <Text style={[styles.statNum, { color: '#e67e22' }]}>{stats.sold}</Text>
          <Text style={styles.statLabel}>Sold</Text>
        </View>
      </View>

      {myVehicles.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="clipboard-outline" size={56} color="#dfe6e9" />
          <Text style={styles.emptyText}>You haven't posted any vehicles yet</Text>
          <TouchableOpacity style={styles.postBtn} activeOpacity={0.8} onPress={() => router.push('/CreateListing')}>
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.postBtnTxt}>Post Your First Ad</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myVehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => router.push('/CreateListing')}>
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  loaderTxt: { marginTop: 12, color: '#b2bec3', fontSize: 14 },

  statsRow: { flexDirection: 'row', padding: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 14, alignItems: 'center', gap: 4, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  statActive: { backgroundColor: '#f0faf7' },
  statSold: { backgroundColor: '#fef9f0' },
  statNum: { fontSize: 28, fontWeight: '800', color: '#1a1a2e' },
  statLabel: { fontSize: 12, color: '#636e72', fontWeight: '600' },

  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 14, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 }, android: { elevation: 2 } }) },
  cardImage: { width: '100%', height: 140, resizeMode: 'cover' },
  cardBody: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', flex: 1, marginRight: 8 },
  statusBadge: { backgroundColor: '#f0faf7', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  soldBadge: { backgroundColor: '#fef9f0' },
  statusTxt: { fontSize: 11, fontWeight: '700', color: '#10ac84' },
  soldTxt: { color: '#e67e22' },
  cardPrice: { fontSize: 17, color: '#e74c3c', fontWeight: '800', marginBottom: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  cardMetaTxt: { fontSize: 12, color: '#636e72' },
  dot: { color: '#b2bec3', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: '#3498db' },
  deleteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: '#e74c3c' },
  actionTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#636e72', marginTop: 16, marginBottom: 24 },
  postBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#10ac84', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 25 },
  postBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },

  fab: { position: 'absolute', width: 56, height: 56, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 24, backgroundColor: '#10ac84', borderRadius: 28, ...Platform.select({ ios: { shadowColor: '#10ac84', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 }, android: { elevation: 6 } }) },
});

export default SellerDashboard;
