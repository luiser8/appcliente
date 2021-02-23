import React, { useEffect, useState } from 'react';
import { Container, Card} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    SafeAreaView, ActivityIndicator,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions, Button, ToastAndroid,
} from 'react-native';
import '../../utils/Config';
import Layout from '../Layout/Header';
import Info from '../info/Info';
import Ingresar from '../session/Ingresar';
import Session from '../session/Session';

const FormaDePago = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [clienteId, setClienteId] = useState('');
    var [clienteId, setClienteId] = useState('');
    var [open, setOpen] = useState(false);
    var [pedidos, setPedidos] = useState([]);
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);
    const screenHeight = Dimensions.get('window').height;

    const establecer = async () => {
        let clienteId;
        try {
            clienteId = await AsyncStorage.getItem('ClienteId');
            setClienteId(clienteId);
            //await getPedidos(clienteId);

        } catch (e) {
            console.log(e);
        }

    }
    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }

    const changeOpenMap = (open) => {
        setOpenMap(open); setOpen(open);
    }
    const changeOpenInfo = (open) => {
        setOpenInfo(open); setOpen(open);
    }
    const changeOpenIngresar = (open) => {
        setOpenIngresar(open); setOpen(open);
    }

    useEffect(() => {
        establecer();
    }, []);
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ flex: 1, marginTop: deviceHeight * 0.00, backgroundColor: '#fff' }}>
                {open ? (
                    <>
                        {openInfo ? (
                            <Info openInfo={changeOpenInfo} />
                        ) : (
                                <></>
                            )}
                        {openMap ? (
                            <Session open={changeOpenMap} />
                        ) : (
                                <></>
                            )}
                        {openIngresar ? (
                            <Ingresar openIngresar={changeOpenIngresar} />
                        ) : (
                                <></>
                            )}
                    </>
                ) : (
                        <>
                            <Layout openInfo={changeOpenInfo} openMap={changeOpenMap} openIngresar={changeOpenIngresar} />
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Formas de Pago</Text>
                            <Container style={styles.container}>

                                <View style={{ Height: "auto", maxHeight: screenHeight }}>

                                            <ScrollView>

                                                <Card>
                                                <View style={{ flex: 1, marginTop: 140, alignItems:'center' }}>
                                                <Text>No hay formas de pago, por lo momentos pago contra entrega</Text>
                                            </View>
                                                    <TouchableOpacity>
                                                        <Button onPress={() => props.open(false)}  title={'Volver'}></Button>
                                                    </TouchableOpacity>
                                                </Card>
                                            </ScrollView>
                                        
                                           
                                </View>

                            </Container>
                        </>
                    )}
            </View>
        </SafeAreaView>
    );
};

var deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        padding: 14,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    um: {
        fontSize: 14,
        color: '#000',
    },
    tiempo: {
        fontSize: 14,
        color: '#0d47a1',
    },
    rosa: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#fbe9e7',
    },
    verde: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#e8f5e9',
    },
    azul: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#e3f2fd',
    },
    amarillo: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#fff3e0',
    },
    appButtonText: {
        fontSize: 14,
        color: "#000",
        alignSelf: "center",
        alignItems: 'center',
        margin: -16,
        fontWeight: 'bold'
    }
});

export default FormaDePago;
