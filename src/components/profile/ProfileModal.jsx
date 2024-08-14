import * as React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_LOG_OUT, ASSISTANT_CLOCK, APP_LANGUAGE } from '../../redux/types';
import { useToast } from 'react-native-toast-notifications';
import { url } from '../../utils/url';
import { Picker } from '@react-native-picker/picker';
import '../../translations/i18n'
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ProfileModal = ({ modalVisible, setModalVisible, headerText, secondaryHeaderText }) => {
    const { isClockedIn, userId, token, phoneNo, name, shiftDetails, role, code, appLanguage } = useSelector(state => state.auth)
    const [isLoading, setLoading] = React.useState(false)
    const toast = useToast();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const handleOutsidePress = () => {
        setModalVisible(false);
    };

    // React.useEffect(() => {
    //     console.log("appLanguage fromn profile", appLanguage);
    // }, [])

    const handleChangeLanguage = async (language) => {
        try {
            await i18n.changeLanguage(language);
            await AsyncStorage.setItem('language', language);
            dispatch({ type: APP_LANGUAGE, payload: { appLanguage: language } });
        } catch (error) {
            console.error("error on handleChangeLanguage", error);
        }
    };



    const handleClockin = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${url}/api/v1/attendance/clock-in/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'Authorization': `Bearer ${token}`,
                    'client-language': appLanguage,
                    'userId': userId
                },
            });

            const data = await response.json();
            console.log('clockin data', data);
            console.log("clockin status", response.status);

            if (response.status === 200) {
                dispatch({
                    type: ASSISTANT_CLOCK,
                    payload: {
                        isClockedIn: true,
                        shiftDetails: shiftDetails
                    }
                });
                toast.show(data.message, { type: 'success', placement: 'top' });
                // console.log("data.message success", data.message);
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
                const messageData = response.status >= 400 ? data.error : data.message
                // console.log('messageData', messageData);
                toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
        } catch (error) {
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('error.message', error.message);
        } finally {
            setLoading(false)
        }
    }


    const handleClockOut = async () => {
        setLoading(true)

        try {

            const response = await fetch(`${url}/api/v1/attendance/clock-out/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'userId': userId,
                    'Authorization': `Bearer ${token}`,
                    'client-language': appLanguage
                },
            });

            const data = await response.json();
            // console.log('clockout data', data);
            if (response.status === 200) {
                dispatch({
                    type: ASSISTANT_CLOCK,
                    payload: {
                        isClockedIn: false,
                        shiftDetails: shiftDetails

                    }
                });
                toast.show(data.message, { type: 'success', placement: 'top' });
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
                const messageData = response.status >= 400 ? data.error : data.message
                // console.log('messageData', messageData);
                toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
        } catch (error) {
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('data.message error', error.message)

        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        // console.log('Logged out');
        setModalVisible(false);
        dispatch({
            type: AUTH_LOG_OUT,
            payload: {
                token: "",
                location: "",
                role: "",
                phoneNo: "",
                userId: "",
                name: ""
            },
        });
        toast.show(t('You are logged out successfully!'), { type: 'warning' });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.modalContent}>
                            <View style={styles.header}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.profileTitle}>{headerText}</Text>
                                    <Text style={styles.assistanceTitle}>{secondaryHeaderText}</Text>
                                </View>
                                <View style={styles.rightHeader}>
                                    {secondaryHeaderText === 'ASSISTANT' && <TouchableOpacity
                                        style={{ ...styles.statusButton, borderColor: isClockedIn ? '#28a745' : '#c71f1f' }}
                                        onPress={() => { }}
                                    >
                                        <Text style={{ ...styles.statusText, color: isClockedIn ? '#28a745' : '#c71f1f', }}>{isClockedIn ? t('Online') : t('Offline')}</Text>
                                    </TouchableOpacity>}
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Text style={styles.closeButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.horizontalLine} />

                            <Text style={styles.profileName}>{name}</Text>
                            <View style={styles.phoneNumberContainer}>
                                <Image
                                    source={require('../../utils/images/homeAssistant/telephone.png')}
                                    style={styles.phoneIcon}
                                />
                                <Text style={styles.phoneNumber}>{phoneNo}</Text>

                            </View>

                            {role === 'assistant' && <><Text style={{ ...styles.phoneNumber, fontWeight: "700", fontSize: 13 }}>{shiftDetails?.name}</Text>
                                <View style={{ ...styles.phoneNumberContainer, marginTop: 2 }}>
                                    <Text style={styles.phoneNumber}> <Text style={{ fontWeight: '700' }}>{t("Start")}:</Text> {shiftDetails?.startTime}  </Text>
                                    <Text style={styles.phoneNumber}><Text style={{ fontWeight: '700' }}> {t("End")}: </Text>{shiftDetails?.endTime}</Text>
                                </View></>}

                            {role === 'supervisor' && <Text style={styles.phoneNumber}><Text style={{ fontWeight: '700' }}> Code: </Text>{code}</Text>}

                            <View style={styles.languagePicker}>
                                <Text style={styles.languageLabel}>{t("Language")}: </Text>
                                <Picker
                                    selectedValue={appLanguage || i18n.language}
                                    style={styles.picker}
                                    selectionColor={'red'}
                                    dropdownIconColor={'#000'}
                                    onValueChange={(itemValue) => handleChangeLanguage(itemValue)}
                                >
                                    <Picker.Item style={styles.pickerItem} label="English" value="en" />
                                    <Picker.Item style={styles.pickerItem} label="हिन्दी" value="hi" />
                                    <Picker.Item style={styles.pickerItem} label="मराठी" value="mr" />
                                </Picker>
                            </View>


                            <View style={{ ...styles.buttonContainer, ...(secondaryHeaderText === 'ASSISTANT' ? { justifyContent: 'space-between' } : { justifyContent: 'center' }) }}>
                                {(secondaryHeaderText !== 'SUPERVISOR' && secondaryHeaderText !== 'ACCOUNTANT') && <TouchableOpacity
                                    style={{ ...styles.clockInButton, backgroundColor: isClockedIn ? '#c71f1f' : '#28a745', }}
                                    disabled={isLoading}
                                    onPress={() => {
                                        isClockedIn ? handleClockOut() : handleClockin()
                                    }}
                                >
                                    {isLoading ? <ActivityIndicator size="small" color="#fff" /> :
                                        <Text disabled={isLoading} style={styles.clockInText}>{isClockedIn ? t("Clock Out") : t("Clock In")}</Text>}
                                </TouchableOpacity>}

                                <TouchableOpacity
                                    style={{
                                        ...styles.logoutButton, ...(secondaryHeaderText === 'ASSISTANT' ? { width: '45%', padding: 10 }
                                            : { width: '90%', padding: 12 })
                                    }}
                                    onPress={handleLogout}
                                >


                                    <Text style={styles.logoutButtonText}>{t("Log Out")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingVertical: 10,
    },
    languagePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 15
    },
    picker: {
        height: 52,
        width: 150,
    },
    pickerItem: {
        fontSize: 14,
        color: "#000"
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    assistanceTitle: {
        fontSize: 12,
        color: '#212121',
        fontWeight: '500',
        marginLeft: 5,
        marginTop: 4,
    },
    rightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusButton: {
        borderWidth: 1.5,
        paddingLeft: 6,
        paddingBottom: 1,
        paddingRight: 6,
        paddingTop: 1,
        borderRadius: 10,
        marginLeft: 10,
        marginTop: 4
    },
    statusText: {
        fontWeight: '500',
        fontSize: 11,
    },
    closeButton: {
        marginLeft: 4,
        padding: 5,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#000',
    },
    horizontalLine: {
        width: '100%',
        height: 1.1,
        backgroundColor: 'grey',
        marginVertical: 10,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
        marginTop: 5
    },
    phoneNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    phoneIcon: {
        width: 11,
        height: 11,
        marginRight: 5,
    },
    phoneNumber: {
        fontSize: 12,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '90%',
        marginTop: 10,
        marginBottom: 5
    },
    clockInButton: {
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        width: '45%',
    },
    clockInText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProfileModal;
