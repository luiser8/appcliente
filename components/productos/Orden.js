import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

const Orden = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <TouchableOpacity style={styles.buttons} onPress={() => props.orden(1)}>
                    <Text style={styles.textWrapper}>Primero el más barato</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons} onPress={() => props.orden(2)}>
                    <Text style={styles.textWrapper}>Primero el más caro</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons} onPress={() => props.orden(3)}>
                    <Text style={styles.textWrapper}>Primero el de despacho más pronto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons}>
                    <Text style={styles.textWrapper}>Primero el de despacho más tardío</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons}>
                    <Text style={styles.textWrapper}>Primero sin costo de despacho</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons}>
                    <Text style={styles.textWrapper}>Primero sin mínimo de venta</Text>
                </TouchableOpacity>
            </View>
            {/* <View style={{flex: 1}}> */}
            <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                    <TouchableOpacity style={styles.appButtonContainer} onPress={() => props.open(4, true)}>
                        <Text style={styles.appButtonText}>{'Cerrar'}</Text>
                    </TouchableOpacity>
                </View>
            {/* </View> */}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    appButtonContainer: {
        marginTop: 10,
        paddingTop:10,
        paddingBottom: 14,
        elevation: 4,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 24
    },
    appButtonText: {
        fontSize: 16,
        color: "#000",
        alignSelf: "center",
    },
    container: {
        padding: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    buttons: {
        padding: 10,
        fontSize: 18,
    },
    textWrapper: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
export default Orden;
