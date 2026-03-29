import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchMyListings, deleteListingAPI } from '../api/marketplaceApi';

const ManageAds = () => {
    const router = useRouter();
    const [myVehicles, setMyVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMyAds();
    }, []);

    const loadMyAds = async () => {
        setLoading(true);
        try {
            const data = await fetchMyListings();
            setMyVehicles(data);
        } catch (error) {
            console.error("Fetch My Ads Error: ", error);
            Alert.alert('Error', 'Could not fetch your active listings.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Ad",
            "Are you absolutely sure you want to permanently remove this vehicle from the marketplace?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete Permanent", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteListingAPI(id);
                            // Optimistically remove from state
                            setMyVehicles(prev => prev.filter(v => v._id !== id));
                            Alert.alert("Success", "Listing removed successfully.");
                        } catch (error) {
                            Alert.alert("Delete Failed", error.message);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={{ uri: item.images && item.images.length > 0 
                  ? `http://10.0.2.2:5000${item.images[0]}` 
                  : 'https://via.placeholder.com/400x200?text=No+Image' }} 
                style={styles.image} 
            />
            <View style={styles.info}>
                <Text style={styles.title}>{item.year} {item.make} {item.model}</Text>
                <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
                <Text style={styles.meta}>{item.location} • {item.status}</Text>
                
                <View style={styles.actions}>
                    <TouchableOpacity 
                        style={[styles.btn, styles.editBtn]} 
                        onPress={() => Alert.alert('Production Feature', 'The Edit Listing module is currently being finalized for the production build.')}
                    >
                        <Text style={styles.btnText}>Edit Ad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.btn, styles.deleteBtn]} 
                        onPress={() => handleDelete(item._id)}
                    >
                        <Text style={styles.btnText}>Delete Ad</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#e67e22" style={styles.loader} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Active Listings</Text>
            {myVehicles.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>You haven't posted any vehicles yet.</Text>
                    <TouchableOpacity style={styles.postBtn} onPress={() => router.push('/CreateListing')}>
                        <Text style={styles.postBtnTxt}>Post Your First Ad</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={myVehicles}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 15 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa' },
    header: { fontSize: 24, fontWeight: 'bold', padding: 20, color: '#2c3e50', textAlign: 'center' },
    loader: { flex: 1, justifyContent: 'center' },
    card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, overflow: 'hidden', elevation: 3 },
    image: { width: '100%', height: 120, resizeMode: 'cover' },
    info: { padding: 15 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
    price: { fontSize: 16, color: '#e74c3c', fontWeight: 'bold', marginVertical: 4 },
    meta: { fontSize: 12, color: '#7f8c8d', marginBottom: 15 },
    actions: { flexDirection: 'row', gap: 10 },
    btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    editBtn: { backgroundColor: '#3498db' },
    deleteBtn: { backgroundColor: '#e74c3c' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 20 },
    postBtn: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10 },
    postBtnTxt: { color: '#fff', fontWeight: 'bold' }
});

export default ManageAds;
