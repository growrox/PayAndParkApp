import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from "react-native-image-picker";
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { url } from '../../../utils/url';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function CameraCapture({ onCapture, setIsCapturing }) {
    const { token, userId, isTicketCreated, isClockedIn } = useSelector(state => state.auth)



    const handleCapture = async () => {
        setIsCapturing(true)
        const options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            saveToPhotos: true,
        };

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

                    try {
                        // Upload the image using FormData
                        const formData = new FormData();
                        formData.append('image', {
                            uri: response.assets[0].uri,
                            type: response.assets[0].type,
                            name: response.assets[0].fileName,
                        });

                        formData.append('assistantID', userId)
                        // console.log("url", url);
                        const uploadResponse = await axios.post(`${url}/api/v1/parking-tickets/uploadParkingTicket`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'userId': userId,
                                'Authorization': `Bearer ${token}`
                            },
                        });

                        console.log('Upload Response:', uploadResponse.data);
                        onCapture(response.assets[0].uri, uploadResponse.data.path)
                        // Handle success or update UI accordingly
                    } catch (error) {
                        console.error('Upload Error:', error);
                        // Handle error or show an error message
                    }
                }
            });

            // }

        } else {
            Alert.alert('Camera Permission', 'Camera permission is required to take pictures.');
        }

        setTimeout(() => {
            setIsCapturing(false)

        }, 3000)

    };


    return (
        <TouchableOpacity onPress={handleCapture} style={styles.button}>
            <Text style={styles.buttonText}>Click to capture the vehicle image</Text>
        </TouchableOpacity>
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
