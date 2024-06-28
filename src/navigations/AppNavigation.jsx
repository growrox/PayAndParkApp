import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import Screens from './components/Screens';

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Screens>
                {/* <AppStack /> */}
                {/* <AuthStack /> */}
            </Screens>
        </NavigationContainer>
    )
}