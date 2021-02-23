import React, { useEffect, useState } from 'react';
import { Container, Content, Card, CardItem, Left, Thumbnail, Body, Right } from 'native-base';
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

const Usuario = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [clienteId, setClienteId] = useState('');
    const [cedula, setCedula] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [direccion, setDireccion] = useState('');
    var [open, setOpen] = useState(false);
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);
    const screenHeight = Dimensions.get('window').height;
    const CARD_WIDTH = Dimensions.get('window').width * 1
    const CARD_HEIGHT = Dimensions.get('window').height * 1
    const SPACING_FOR_CARD_INSET = Dimensions.get('window').width * 0.1 - 40

    const establecer = async () => {
        let cedula; let nombres; let apellidos; let correo; let telef; let direccion;
        try {
            cedula = await AsyncStorage.getItem('Cedula');
            nombres = await AsyncStorage.getItem('Nombres');
            apellidos = await AsyncStorage.getItem('Apellidos');
            correo = await AsyncStorage.getItem('Correo');
            telef = await AsyncStorage.getItem('Telefono');
            direccion = await AsyncStorage.getItem('Direccion');
            setCedula(cedula); setNombres(nombres); setTelefono(telef); setApellidos(apellidos); setCorreo(correo); setDireccion(direccion);
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
                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Información de Usuario</Text>
                            <Container style={styles.container}>

                                <View style={{ Height: "auto", maxHeight: screenHeight }}>

                                    <ScrollView>
                                        <Card key={1} style={{ flex: 1 }}>
                                            <CardItem>

                                                <Left>
                                                    <TouchableOpacity>
                                                        <Body>
                                                            <View>
                                                                <Text style={styles.titulo}>Cédula / RUC: {cedula}</Text>
                                                                <Text style={styles.titulo}>Nombres: {nombres}</Text>
                                                                <Text style={styles.titulo}>Apellidos: {apellidos} </Text>
                                                                <Text style={styles.titulo}>Correo: {correo} </Text>
                                                                <Text style={styles.titulo}>Telefono: {telefono} </Text>
                                                                <Text style={styles.titulo}>Dirección: {direccion} </Text>
                                                            </View>

                                                        </Body>
                                                    </TouchableOpacity>

                                                </Left>

                                            </CardItem>

                                        </Card>

                                        <Card>

                                            <TouchableOpacity>
                                                <Button onPress={() => props.open(false)} title={'Volver'}></Button>
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

export default Usuario;
