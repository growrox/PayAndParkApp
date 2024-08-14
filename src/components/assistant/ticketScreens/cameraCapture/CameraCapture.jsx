import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from "react-native-image-picker";
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { url } from '../../../../utils/url';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Image } from 'react-native-compressor';
import { useTranslation } from 'react-i18next';


export default function CameraCapture({ onCapture, setIsCapturing }) {
    const { token, userId, isTicketCreated, isClockedIn, appLanguage } = useSelector(state => state.auth)
    const [capture, setCapture] = useState(false)

    const { t } = useTranslation();


    const handleCapture = async () => {
        try {
            setIsCapturing(true)
            setCapture(true)
            // const options = {
            //     mediaType: 'photo',
            //     maxWidth: 300,
            //     maxHeight: 550,
            //     quality: 1,
            //     saveToPhotos: true,
            // };

            let permissionStatus;
            if (Platform.OS === 'android') {
                permissionStatus = await request(PERMISSIONS.ANDROID.CAMERA);
            } else {
                permissionStatus = await request(PERMISSIONS.IOS.CAMERA);
            }

            if (permissionStatus === RESULTS.GRANTED) {
                // launchCamera = () => {
                let options = {
                    storageOptions: {
                        skipBackup: true,
                        path: 'images',
                    },
                };
                ImagePicker.launchCamera(options, async (response) => {

                    if (response.didCancel) {
                        // console.log('User cancelled image picker by pressing back button');

                    } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else if (response.customButton) {
                        // console.log('User selected custom button: ', response.customButton);
                        // Alert.alert(response.customButton);
                    } else {
                        const source = { uri: response.uri };
                        // console.log('image response...............', JSON.stringify(response));
                        // console.log("response.assets[0].uri, response.assets[0].type, response.assets[0].fileName",response.assets[0].uri, "      ",response.assets[0].type, "     ",response.assets[0].fileName);
                        // // this.setState({
                        // //     filePath: response,
                        // //     fileData: response.data,
                        // //     fileUri: response.uri
                        // // });

                        console.log("response.assets[0]", response.assets[0]);

                        const result = await Image.compress(response.assets[0].uri, {
                            compressionMethod: 'manual',
                            maxWidth: 1000,
                            quality: 0.8,
                        });

                        console.log("result IMAGE UPLOAD", result);

                        const formData = new FormData();
                        formData.append('image', {
                            uri: result,
                            type: response.assets[0].type,
                            name: response.assets[0].fileName,
                        });

                        formData.append('assistantID', userId)
                        // Upload the image using FormData
                        try {
                            // console.log("url", url);
                            const uploadResponse = await axios.post(`${url}/api/v1/parking-tickets/uploadParkingTicket`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'userId': userId,
                                    'Authorization': `Bearer ${token}`,
                                    'client-language': appLanguage
                                },
                            });

                            console.log('Upload Response.........:', uploadResponse.data);
                            onCapture(response.assets[0].uri, uploadResponse.data.path)
                        } catch (error) {
                            console.error('Upload Error:', error);
                            Alert.alert('Upload Failed', error);
                        }
                    }
                });

            } else {
                Alert.alert(t('Camera Permission'), t('Camera permission is required to take pictures.'));
            }
        } catch (error) {
            console.error('Upload Error or Camera Permission Error:', error);
            Alert.alert(t('Upload Error or Camera Permission Error:'), error);

        } finally {
            setCapture(false)
            setIsCapturing(false)
        }
    };


    return (
        <>
            <TouchableOpacity disabled={capture} onPress={handleCapture} style={styles.button}>
                {capture ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>{t("Click to capture the vehicle image")}</Text>
                )}
            </TouchableOpacity>
        </>

    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        // marginBottom: 26,
        // marginTop: 6
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
