import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import AssistantHome from '../../components/assistant/dashboard/Home';
import SupervisorHome from '../../components/supervisor/dashboard/Home';
import AuthStack from './AuthStack';
import { useSelector } from 'react-redux';
// import { clearPersistedState } from '../../utils/clearPersistedState';
import DrawerNavigator from './Drawer/DrawerNavigator';
import PaymentDetails from '../../components/assistant/ticketScreens/PaymentDetails';
import VehicleType from '../../components/assistant/ticketScreens/VehicleType';
import TimeSlot from '../../components/assistant/ticketScreens/TimeSlot';
import VehiclePaymentEntry from '../../components/assistant/ticketScreens/VehiclePaymentEntry';
import AllAssitantTickets from '../../components/assistant/dashboard/AllAssitantTickets';
import AssistantPage from '../../components/supervisor/assistanDetail/AssistantPage';
import SupervisorPage from '../../components/supervisor/supervisorDetail/SupervisorPage';


const Stack = createStackNavigator();


export default function Screens() {
    const { isAuthenticated, role } = useSelector(state => state.auth)
    // useEffect(() => {
    //     console.log(`isAuthenticated: ${isAuthenticated} , role: ${role}`);
    // }, [])

    const StackScreensAuthenticated = [
        {
            screen: "Home",
            component: role === 'assistant' ? AssistantHome : SupervisorHome
        },
        {
            screen: 'VehicleType',
            component: VehicleType
        },
        {
            screen: 'TimeSlot',
            component: TimeSlot
        },
        {
            screen: 'VehiclePaymentEntry',
            component: VehiclePaymentEntry
        },
        {
            screen: 'PaymentDetails',
            component: PaymentDetails
        },
        {
            screen: 'AllAssitantTickets',
            component: AllAssitantTickets
        },
        {
            screen: 'AssistantPage',
            component: AssistantPage
        },
        {
            screen: 'SupervisorPage',
            component: SupervisorPage
        },

    ]

    // useEffect(() => {
    //     console.log('isAuthenticated', isAuthenticated);
    //     // clearPersistedState()
    // }, [])


    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated == true ? (

                StackScreensAuthenticated.map((data, index) => {
                    // console.log('StackScreensAuthenticated gets hit');
                    return (
                        <Stack.Screen
                            name={data.screen}
                            component={data.component}
                            options={{
                                headerShown: false,
                            }}
                            key={index + 1}
                        />
                    )
                })

            ) : (
                <>
                    {/* {console.log('StackScreensAuthenticated not gets hit')} */}
                    <Stack.Screen
                        name="authStack"
                        component={AuthStack}
                        options={{
                            headerShown: false,
                        }}
                    />
                </>

            )}
        </Stack.Navigator>
    )
}

