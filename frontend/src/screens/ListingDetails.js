import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Share, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { resolveImageUrl } from '../api/marketplaceApi';
import { Feather, Ionicons } from '@expo/vector-icons';

const ListingDetails = () => {
  const router = useRouter();
  const { vehicle } = useLocalSearchParams();
  const data = vehicle ? JSON.parse(vehicle) : null;

  if (!data) {
    return (
      <View style={styles.center}>
        <Feather name="alert-circle" size={48} color="#dfe6e9" />
        <Text style={styles.errorText}>Error loading listing details</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={16} color="#fff" />
          <Text style={styles.backBtnTxt}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUri = data.images && data.images.length > 0
    ? resolveImageUrl(data.images[0])
    : 'https://via.placeholder.com/400x300?text=Vehicle';

  const handleCall = () => {
    const phone = data.sellerId?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert("No Contact", "Seller has not provided a contact number.");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${data.year} ${data.make} ${data.model} for Rs. ${Number(data.price).toLocaleString()} on VehicleMarket!\n\n${data.location} · ${data.transmission} · ${data.fuelType} · ${data.engineCapacity}cc`,
      });
    } catch (error) { console.error(error); }
  };

  const SpecItem = ({ icon, label, value }) => (
    <View style={styles.specItem}>
      <Ionicons name={icon} size={16} color="#10ac84" style={{ marginBottom: 4 }} />
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value || '—'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: imageUri }} style={styles.heroImage} />

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{data.title || `${data.year} ${data.make} ${data.model}`}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={15} color="#636e72" />
          <Text style={styles.locationText}>{data.location || 'Unknown'} area</Text>
        </View>

        {/* Price Card */}
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.price}>Rs. {Number(data.price).toLocaleString()}</Text>
            {data.isNegotiable && (
              <View style={styles.negoBadgeRow}>
                <Feather name="check-circle" size={12} color="#10ac84" />
                <Text style={styles.negotiable}>Price Negotiable</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7} onPress={handleShare}>
            <Feather name="share" size={16} color="#1a1a2e" />
          </TouchableOpacity>
        </View>

        {/* Specifications Grid */}
        <Text style={styles.sectionTitle}>Specifications</Text>
        <View style={styles.specsGrid}>
          <SpecItem icon="car-sport-outline" label="Make" value={data.make} />
          <SpecItem icon="pricetag-outline" label="Model" value={data.model} />
          <SpecItem icon="calendar-outline" label="Year" value={data.year} />
          <SpecItem icon="speedometer-outline" label="Mileage" value={`${Number(data.mileage).toLocaleString()} km`} />
          <SpecItem icon="cog-outline" label="Transmission" value={data.transmission} />
          <SpecItem icon="water-outline" label="Fuel Type" value={data.fuelType} />
          <SpecItem icon="flash-outline" label="Engine" value={data.engineCapacity ? `${data.engineCapacity}cc` : '—'} />
          <SpecItem icon="cube-outline" label="Body Type" value={data.bodyType} />
          <SpecItem icon="shield-checkmark-outline" label="Condition" value={data.condition} />
          <SpecItem icon="checkmark-circle-outline" label="Status" value={data.status} />
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {data.description || 'No detailed description provided by the seller.'}
        </Text>

        {/* Seller Contact */}
        <Text style={styles.sectionTitle}>Seller</Text>
        <TouchableOpacity
          style={styles.sellerCard}
          activeOpacity={0.7}
          onPress={() => router.push({
            pathname: '/SellerProfile',
            params: { sellerId: data.sellerId?._id, sellerName: data.sellerId?.name, sellerPhone: data.sellerId?.phone }
          })}
        >
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>
                {data.sellerId?.name ? data.sellerId.name.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>{data.sellerId?.name || 'Private Seller'}</Text>
              <Text style={styles.sellerEmail}>{data.sellerId?.email || ''}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#b2bec3" />
          </View>
          <View style={styles.viewProfileRow}>
            <Feather name="external-link" size={12} color="#3498db" />
            <Text style={styles.viewProfile}>View all listings by this seller</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.callButton} activeOpacity={0.8} onPress={handleCall}>
          <Feather name="phone" size={20} color="#fff" />
          <Text style={styles.callButtonText}>Call {data.sellerId?.phone || 'Seller'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
  errorText: { fontSize: 16, color: '#636e72' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#3498db', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  backBtnTxt: { color: '#fff', fontWeight: '600' },

  heroImage: { width: '100%', height: 280, resizeMode: 'cover' },
  content: { padding: 20 },

  title: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginBottom: 6, letterSpacing: -0.3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 18 },
  locationText: { color: '#636e72', fontSize: 14 },

  priceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 14, marginBottom: 24, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 }, android: { elevation: 2 } }) },
  price: { fontSize: 26, color: '#e74c3c', fontWeight: '800' },
  negoBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  negotiable: { fontSize: 12, color: '#10ac84', fontWeight: '700' },
  shareBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f1f3f5', justifyContent: 'center', alignItems: 'center' },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e', marginBottom: 14 },

  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 24, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 }, android: { elevation: 2 } }) },
  specItem: { width: '50%', marginBottom: 18 },
  specLabel: { fontSize: 11, color: '#b2bec3', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: 2 },
  specValue: { fontSize: 15, color: '#1a1a2e', fontWeight: '700' },

  description: { fontSize: 15, color: '#4a4a4a', lineHeight: 24, backgroundColor: '#fff', padding: 18, borderRadius: 14, marginBottom: 24, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 }, android: { elevation: 2 } }) },

  sellerCard: { backgroundColor: '#fff', padding: 18, borderRadius: 14, marginBottom: 14, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 }, android: { elevation: 2 } }) },
  sellerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarTxt: { fontSize: 20, color: '#fff', fontWeight: '700' },
  sellerName: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  sellerEmail: { fontSize: 12, color: '#b2bec3', marginTop: 2 },
  viewProfileRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f3f5' },
  viewProfile: { fontSize: 13, color: '#3498db', fontWeight: '600' },

  callButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#10ac84', paddingVertical: 16, borderRadius: 30, ...Platform.select({ ios: { shadowColor: '#10ac84', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }, android: { elevation: 4 } }) },
  callButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' }
});

export default ListingDetails;
