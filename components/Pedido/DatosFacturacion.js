import React, { useEffect, useState } from 'react';
import { Container, Content, Card, CardItem, Input, Label, Item, Form } from 'native-base';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions, Button, ToastAndroid,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../../utils/Config';
import { AuthContext } from '../../utils/Context';
import Header from '../Layout/Header';

const DatosFacturacion = (props) => {
    var [clienteId, setClienteId] = useState(props.cliente);
    const [cedula, setCedula] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [direccion, setDireccion] = useState('');
    var [errorCedula, setErrorCedula] = useState(false);
    var [errorNombres, setErrorNombres] = useState(false);
    var [errorApellidos, setErrorApellidos] = useState(false);
    var [errorNumeroCelular, setErrorNumeroCelular] = useState(false);
    var [errorDireccion, setErrorDireccion] = useState(false);
    var [errorCorreo, setErrorCorreo] = useState(false);
    var [consumidor, setConsumidor] = useState(false);
    var [datosSession, setDatosSession] = useState(false);
    var [open, setOpen] = useState(false);
    var [isOpen, setIsOpen] = useState('');
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;

    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }

    //alert(props.edit)
    const changeConsumidor = async (event) => {
        if (event) {
            setConsumidor(event);
            try {
                await AsyncStorage.getItem('Cedula').then(
                    (value) => { setCedula(value) });
                await AsyncStorage.getItem('Nombres').then(
                    (value) => { setNombres(value) });
                await AsyncStorage.getItem('Apellidos').then(
                    (value) => { setApellidos(value) });
                await AsyncStorage.getItem('Correo').then(
                    (value) => { setCorreo(value) });
                await AsyncStorage.getItem('Telefono').then(
                    (value) => { setTelefono(value) });
                await AsyncStorage.getItem('Direccion').then(
                    (value) => { setDireccion(value) });

            } catch (e) {
                console.log(e);
            }
        } else {
            setConsumidor(event); setCedula(''); setNombres(''); setApellidos(''); setCorreo(''); setTelefono(''); setDireccion('');
        }
    }
    const changeDatosSesion = async (event) => {
        if (event) {
            setDatosSession(event);
            try {
                await AsyncStorage.getItem('Cedula').then(
                    (value) => { setCedula(value) });
                await AsyncStorage.getItem('Nombres').then(
                    (value) => { setNombres(value) });
                await AsyncStorage.getItem('Apellidos').then(
                    (value) => { setApellidos(value) });
                await AsyncStorage.getItem('Correo').then(
                    (value) => { setCorreo(value) });
                await AsyncStorage.getItem('Telefono').then(
                    (value) => { setTelefono(value) });
                await AsyncStorage.getItem('Direccion').then(
                    (value) => { setDireccion(value) });

            } catch (e) {
                console.log(e);
            }
        } else {
            setDatosSession(event); setCedula(''); setNombres(''); setApellidos(''); setCorreo(''); setTelefono(''); setDireccion('');
        }
    }
    const changeOpenMap = (open) => {
        setOpenMap(open); setOpen(open); setIsOpen('map');
    }
    const changeOpenInfo = (open) => {
        setOpenInfo(open); setOpen(open); setIsOpen('info');

    }
    const changeOpenIngresar = (open) => {
        setOpenIngresar(open); setOpen(open); setIsOpen('ingresar');
    }

    const addDatosFacturacion = async () => {
        if (true) {
            await fetch(`${global.config.appConfig.url.dev}POC_DatosFacturacion`, {
                method: 'POST',
                headers: global.config.appConfig.headers.dev,
                body: JSON.stringify({
                    'ClienteId': props.cliente ? props.cliente : clienteId,
                    'CedulaRUC': cedula,
                    'Nombres': nombres,
                    'Apellidos': apellidos,
                    'Telefono': telefono,
                    'Correo': correo,
                    'Consumidor': consumidor ? 1 : 0,
                    'Direccion': direccion
                }),
                json: true
            }).then(response => {
                if (response.status >= 200 && response.status <= 299) {
                    return props.data(response.json());
                }
                else { // si no se obtiene una respuesta
                    response.json().then((json) => {
                        const { Message, StrackTraceString } = json;
                    });
                    return null
                }
            }).catch(e => { console.log(e); });
            setTimeout(() => {
                props.open(false);
            }, 1000);
        } else {
            toast('Por favor debes aceptar los terminos', 3000);
        }
    }

    return (
        <View style={{ flex: 1, marginTop: deviceHeight * 0.00, backgroundColor: '#fff' }}>
            <Header openInfo={changeOpenInfo} openMap={changeOpenMap} openIngresar={changeOpenIngresar} />
            <Container style={styles.container}>
                <Card transparent>
                    <View style={{ marginTop: -18 }}>
                        <Text style={styles.title}>Datos Facturación</Text>
                    </View>
                    <ScrollView>
                        <View style={styles.form}>
                            {/* <Form> */}
                            <Item>
                                <CheckBox
                                    style={{ borderColor: "blue" }}
                                    value={consumidor}
                                    onValueChange={(event) => changeConsumidor(event)} />
                                <Label style={styles.label}>Consumidor final</Label>
                            </Item>
                            <Item>
                                <CheckBox
                                    style={{ borderColor: "blue" }}
                                    value={datosSession}
                                    onValueChange={(event) => changeDatosSesion(event)} />
                                <Label style={styles.label}>Mismos datos de la sesión</Label>
                            </Item>
                            {consumidor ? (
                                <>
                                    <View>
                                        <TouchableOpacity style={{ marginTop: 20 }}>
                                            <Button title="Grabar" color="#3F51B5" onPress={() => addDatosFacturacion()}></Button>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginTop: 20 }}>
                                            <Button title="Cancelar" color="#3F51B5" onPress={() => props.open(false)}></Button>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                    <>
                                        <Item style={{marginTop:8}} error={errorCedula ? true : false} floatingLabel>
                                            <Label>Cédula / RUC</Label>
                                            <Input placeholderTextColor="#666666" name="cedula" value={cedula} onChangeText={text => setCedula(text)} />
                                        </Item>
                                        <Item style={{marginTop:8}} error={errorNombres ? true : false} floatingLabel>
                                            <Label>Nombres</Label>
                                            <Input placeholderTextColor="#666666" name="nombres" value={nombres} onChangeText={text => setNombres(text)} />
                                        </Item>
                                        <Item style={{marginTop:8}} error={errorApellidos ? true : false} floatingLabel>
                                            <Label>Apellidos</Label>
                                            <Input placeholderTextColor="#666666" name="apellidos" value={apellidos} onChangeText={text => setApellidos(text)} />
                                        </Item>
                                        <Item style={{marginTop:8}} error={errorNumeroCelular ? true : false} floatingLabel>
                                            <Label>Número de Celular</Label>
                                            <Input placeholderTextColor="#666666" name="telefono" value={telefono} onChangeText={text => setTelefono(text)} />
                                        </Item>
                                        <Item style={{marginTop:8}} error={errorCorreo ? true : false} floatingLabel>
                                            <Label>Correo Electrónico</Label>
                                            <Input placeholderTextColor="#666666" name="correo" value={correo} onChangeText={text => setCorreo(text)} />
                                        </Item>
                                        <Item style={{marginTop:8}} error={errorDireccion ? true : false} floatingLabel>
                                            <Label>Dirección</Label>
                                            <Input placeholderTextColor="#666666" name="direccion" value={direccion} onChangeText={text => setDireccion(text)} />
                                        </Item>

                                        <View>
                                            <TouchableOpacity style={{ marginTop: 20 }}>
                                                <Button title="Grabar" color="#3F51B5" onPress={() => addDatosFacturacion()}></Button>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ marginTop: 20 }}>
                                                <Button title="Cancelar" color="#3F51B5" onPress={() => props.open(false)}></Button>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}


                            {/* </Form> */}
                        </View>
                    </ScrollView>
                </Card>
            </Container>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
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
        fontWeight: 'normal',
        alignItems: 'center',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'normal',
    },
    nota: {
        fontSize: 14,
        fontWeight: 'normal',
    },
    body: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    form: {
        marginTop: 22
    },
    label: {
        fontSize: 14,
        paddingTop: 6,
    },
});

export default DatosFacturacion;
