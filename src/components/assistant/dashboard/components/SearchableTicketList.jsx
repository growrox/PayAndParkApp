// SearchableTicketList.js
import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_LOG_OUT } from '../../../../redux/types';
import { Spinner } from '../../../../utils/Spinner';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { url } from '../../../../utils/url';

export default function SearchableTicketList({
    endpoint,
    navigation,
    renderItem,
    headerText,
    noDataText,
    searchPlaceholder,
    clearButtonText,
}) {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [isFetchingMore, setFetchingMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [isNoData, setNoData] = useState(false);
    const { token, userId, appLanguage, role } = useSelector(state => state.auth);
    const toast = useToast();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const fetchItems = useCallback(
        debounce(async (query, page) => {
            if (!query && role === 'supervisor') {
                setLoading(false);
                return
            }
            try {
                let pageSize = 10;
                console.log("endpoint", endpoint);
                const globalEndPoint = `${url}/api/v1/parking-assistant/global/tickets`
                const finalURL = `${query ? globalEndPoint : endpoint}?page=${page}&pageSize=${pageSize}&searchQuery=${query}`;
                const response = await fetch(finalURL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-client-source': 'app',
                        'userId': userId,
                        'Authorization': `Bearer ${token}`,
                        'client-language': appLanguage
                    },
                });

                const data = await response?.json();
                console.log("datadsfsdfsdfsdfsddf", data?.result?.data);


                if (response.status === 200) {
                    if (data?.result && data?.result?.data) {
                        setItems(page === 1 ? data?.result?.data : [...items, ...data?.result?.data]);
                    }
                } else if (response.status === 401 || response.status === 406) {
                    dispatch({
                        type: AUTH_LOG_OUT,
                        payload: {
                            token: "",
                            location: "",
                            role: "",
                            phoneNo: "",
                            userId: "",
                            name: ""
                        }
                    });
                } else {
                    const toastType = response.status >= 400 ? 'danger' : 'warning';
                    const messageData = response.status >= 400 ? data.error : data.message;
                    toast.show(messageData, { type: toastType, placement: 'top' });
                }
                if (data.message === "No items found" || data?.result?.data?.length !== pageSize) {
                    setNoData(true);
                } else {
                    setNoData(false);
                }
            } catch (error) {
                toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
                setLoading(false);
                setFetchingMore(false);
            } finally {
                setLoading(false);
                setFetchingMore(false);
            }
        }, 500),
        [items, appLanguage, dispatch, token, userId, toast]
    );

    useEffect(() => {
        fetchItems(searchQuery, pageNumber);
    }, [searchQuery, pageNumber]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setPageNumber(1);
        setItems([]);
    };

    const loadMoreItems = () => {
        if (isNoData || isFetchingMore) return;
        setFetchingMore(true);
        setPageNumber(prevPage => prevPage + 1);
    };

    return (
        <>

            <View style={styles.searchContainer}>
                <View style={styles.searchContainerChild}>
                    <Image source={require('../../../../utils/images/search.png')} style={styles.searchLogo} />
                    <TextInput
                        style={styles.searchBar}
                        placeholder={searchPlaceholder}
                        placeholderTextColor={'grey'}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>{clearButtonText}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
            {isLoading ? (
                <Spinner bottomMargin={30} />
            ) : (
                <>
                    {items?.length < 1 ? (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>{noDataText}</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item) => item._id}
                            onEndReached={loadMoreItems}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={isFetchingMore && <Spinner size={30} bottomMargin={10} />}
                            contentContainerStyle={styles.flatListContent}
                        />
                    )}
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({

    searchContainer: {
        padding: 16,
    },
    searchContainerChild: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 30,
    },
    searchLogo: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    clearButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        margin: 2,
    },
    clearButtonText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    flatListContent: {
        paddingBottom: 20,
    },
    noDataContainer: {
        borderWidth: 0.4,
        padding: 8,
        marginRight: 20,
        marginLeft: 20,
        marginTop: 0,
        borderColor: '#D0D0D0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        color: '#000',
    },
});
