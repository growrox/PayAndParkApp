import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HelloPage from "../../components/authScreens/HelloPage";
import Signup from "../../components/authScreens/Signup";
import Login from "../../components/authScreens/Login";
import VerifyOTP from "../../components/authScreens/VerifyOTP";
import Home from "../../components/assistant/dashboard/Home";

const Stack = createNativeStackNavigator();

const AuthStack = () => {

  const StackScreensUnauthenticated = [
    {
      screen: "HelloPage",
      component: HelloPage
    },
    {
      screen: "Login",
      component: Login
    },
    {
      screen: "Signup",
      component: Signup
    },
    {
      screen: "VerifyOTP",
      component: VerifyOTP
    }, 
  ]
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {StackScreensUnauthenticated.map((data, index) => {
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
      })}
    </Stack.Navigator>
  );
};

export default AuthStack;
