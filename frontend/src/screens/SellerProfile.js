import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchListings } from '../api/marketplaceApi';

const SellerProfile = () => {
    const { sellerId, sellerName, sellerPhone } = useLocalSearchParams();
    const router = useRouter();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSellerVehicles();
    }, [sellerId]);

    const loadSellerVehicles = async () => {
        setLoading(true);
        try {
            // Fetch all listings for this specific seller ID
            // We'll need the backend to support ?sellerId= filter in getListings
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
          <View style={styles.info}>
            <Text style={styles.title}>{item.year} {item.make} {item.model}</Text>
            <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
          </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                   <Text style={styles.avatarTxt}>{sellerName ? sellerName.charAt(0) : 'S'}</Text>
                </View>
                <Text style={styles.name}>{sellerName || 'Verified Seller'}</Text>
                <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                   <Text style={styles.callBtnTxt}>📞 Contact Seller</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Listings by {sellerName || 'this Seller'}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#3498db" />
            ) : vehicles.length === 0 ? (
                <Text style={styles.empty}>No active listings found for this seller.</Text>
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    profileHeader: { padding: 30, alignItems: 'center', backgroundColor: '#f9f9f9', borderBottomWidth: 1, borderBottomColor: '#eee' },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    avatarTxt: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
    name: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15 },
    callBtn: { backgroundColor: '#2ecc71', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
    callBtnTxt: { color: '#fff', fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', padding: 20, color: '#2c3e50' },
    list: { padding: 10 },
    card: { flex: 0.5, margin: 5, backgroundColor: '#fff', borderRadius: 10, elevation: 3, overflow: 'hidden' },
    image: { width: '100%', height: 100 },
    info: { padding: 10 },
    title: { fontSize: 13, fontWeight: 'bold', color: '#333' },
    price: { fontSize: 13, color: '#e74c3c', fontWeight: 'bold' },
    empty: { textAlign: 'center', marginTop: 20, color: '#7f8c8d' }
});

export default SellerProfile;
