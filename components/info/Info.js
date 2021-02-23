import React from 'react';
import { Card, CardItem } from 'native-base';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions, Button,
} from 'react-native';
import '../../utils/Config';

const Info = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;

    return (
        <View style={{ flex: 1, marginTop: deviceHeight * 0.17, backgroundColor: '#fff' }}>
            <Card transparent>
                <CardItem>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Image width={377} height={89} source={global.config.appConfig.images.local} />
                    </View>
                </CardItem>
                <CardItem>
                    <Text style={styles.title}>Bienvenido !!</Text>
                </CardItem>
                <CardItem>
                    <Text style={styles.body}>Pandemik es una plataforma que es concebida a consecuencia de la pandemia Covid-19, que propone
                    una nueva organización de negocios y clientes, para que se realicen pedidos de forma planificada.
                    Esto permite optimizar los costos y consecuentemente te puede llegar a tu casa los mismo productos,
                    con la misma calidad, pero con un menor precio.
                </Text>
                </CardItem>

                <CardItem>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>

                        <TouchableOpacity style={styles.appButtonContainer} onPress={() => props.openInfo(false)}>
                            <Text style={styles.appButtonText}>Regresar</Text>
                        </TouchableOpacity>
                    </View>

                </CardItem>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    appButtonContainer: {
        marginTop: 10,
        elevation: 8,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 26
    },
    appButtonText: {
        fontSize: 16,
        color: "#000",
        alignSelf: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    body: {
        fontSize: 16,
        fontWeight: 'normal',
    }
});

export default Info;
