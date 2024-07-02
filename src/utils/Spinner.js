import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

export const Spinner = ({ leftMargin = 0, rightMargin = 0, topMargin = 0, bottomMargin = 0, size = 70 }) => {
    return (
        <View style={{ ...styles.container, marginLeft: leftMargin, marginRight: rightMargin, marginTop: topMargin, marginBottom: bottomMargin }}>
            <ActivityIndicator size={size} color="#167afa" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
