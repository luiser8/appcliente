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

const NuevaCuenta = (props) => {
    const { signIn } = React.useContext(AuthContext);
    var [clienteId, setClienteId] = useState(null);
    const [usuario, setUsuario] = useState('');
    const [cedula, setCedula] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [direccion, setDireccion] = useState('');
    const [password, setPassword] = useState('');
    var [errorPassword, setErrorPassword] = useState(false);
    var [errorCedula, setErrorCedula] = useState(false);
    var [errorNombres, setErrorNombres] = useState(false);
    var [errorApellidos, setErrorApellidos] = useState(false);
    var [errorNumeroCelular, setErrorNumeroCelular] = useState(false);
    var [errorDireccion, setErrorDireccion] = useState(false);
    var [errorCorreo, setErrorCorreo] = useState(false);
    var [sesionAbierta, setSesionAbierta] = useState(false);
    var [terminos, setTerminos] = useState(false);
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
    const getUser = async () => {
        try {
            await AsyncStorage.getItem('ClienteId').then(
                (value) => {
                    if(value !== undefined){
                        setClienteId(value); 
                    }else{
                        setClienteId(null); 
                    }
                }
            );
            
        } catch (e) {
            console.log(e);
        }
    }
    const changeSessionAbierta = (value) => {
        setSesionAbierta(value);
    }
    const changeTerminos = (value) => {
        setTerminos(value);
    }

    const changeOpenMap = (open) => {
        setOpenMap(open);setOpen(open); setIsOpen('map');
    }
    const changeOpenInfo = (open) => {
        setOpenInfo(open); setOpen(open);setIsOpen('info');
     
    }
    const changeOpenIngresar = (open) => {
        setOpenIngresar(open);setOpen(open);setIsOpen('ingresar');
    }

    const addCuenta = async () => {
        if(terminos){
            await fetch(`${global.config.appConfig.url.dev}POC_Cliente/Add`, {
                method: 'POST',
                headers: global.config.appConfig.headers.dev,
                body: JSON.stringify({
                    'ClienteId': props.cliente ? props.cliente : clienteId,
                    'Identificador': cedula,
                    'Nombres': nombres,
                    'Apellidos': apellidos,
                    'Password': password,
                    'Telefono': telefono,
                    'Email': correo,
                    'Direccion': direccion
                }),
                json: true
            }).then(response => {
                if (response.status >= 200 && response.status <= 299) {
                    return setCuenta(response.json());
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
        }else{
            toast('Por favor debes aceptar los terminos', 3000);
        }      
    }
    const setCuenta = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items) {
                items.forEach((item) => {
                    setUsuario(item.UsuarioId);
                    signIn({
                        'Mapa':false,
                        'ClienteId': item.ClienteId,
                        'UsuarioId': item.UsuarioId,
                        'Cedula': item.PPG_Persona.Identificador,
                        'Nombres': item.PPG_Persona.Nombres,
                        'Apellidos': item.PPG_Persona.Apellidos,
                        'Telefono': item.PPG_Persona.Telefono,
                        'Correo': item.PPG_Persona.Email,
                        'Direccion': item.PPG_Persona.Direccion
                    })
                    getUser(); props.cliente(item.ClienteId); alert(item.ClienteId)
                })     
            } 
        })
    }

useEffect(() => {
    getUser();
}, []);

    return (
        <View style={{ flex: 1, marginTop: deviceHeight * 0.00, backgroundColor:'#fff' }}>
            <Header openInfo={changeOpenInfo} openMap={changeOpenMap} openIngresar={changeOpenIngresar} />
            <Container style={styles.container}>
            <Card transparent>
                <View style={{marginTop:-14}}>
                    <Text style={styles.title}>Nueva Cuenta</Text>
                </View>
                <ScrollView>
                <View style={styles.form}>
                    {/* <Form> */}
                            <Item error={errorCedula ? true : false} floatingLabel>
                                <Label>Cédula</Label>
                                <Input placeholderTextColor="#666666" name="cedula" value={cedula} onChangeText={text => setCedula(text)} />
                            </Item>
                            <Item error={errorNombres ? true : false} floatingLabel>
                                <Label>Nombres</Label>
                                <Input placeholderTextColor="#666666" name="nombres" value={nombres} onChangeText={text => setNombres(text)} />
                            </Item>
                            <Item error={errorApellidos ? true : false} floatingLabel>
                                <Label>Apellidos</Label>
                                <Input placeholderTextColor="#666666" name="apellidos" value={apellidos} onChangeText={text => setApellidos(text)} />
                            </Item>
                            <Item error={errorNumeroCelular ? true : false} floatingLabel>
                                <Label>Número de Celular</Label>
                                <Input placeholderTextColor="#666666" name="telefono" value={telefono} onChangeText={text => setTelefono(text)} />
                            </Item>
                            <Item error={errorCorreo ? true : false} floatingLabel>
                                <Label>Correo Electrónico</Label>
                                <Input placeholderTextColor="#666666" name="correo" value={correo} onChangeText={text => setCorreo(text)} />
                            </Item>
                            <Item error={errorDireccion ? true : false} floatingLabel>
                                <Label>Dirección</Label>
                                <Input placeholderTextColor="#666666" name="direccion" value={direccion} onChangeText={text => setDireccion(text)} />
                            </Item>
                            <Item floatingLabel error={errorPassword ? true : false}>
                                <Label>Código de usuario (6 dígitos)</Label>
                                <Input secureTextEntry={true ? true : false} name="password" value={password} onChangeText={text => setPassword(text)} />
                            </Item>
                            
                            <Item>
                                <CheckBox 
                                style={{ borderColor: "blue" }}
                                value={sesionAbierta}
                                onValueChange={(event) => changeSessionAbierta(event)} />
                            <Label style={styles.label}>¿Desea que la sesión quede abierta en este dispositivo?</Label>
                            </Item>
                            <Item>
                                <CheckBox 
                                style={{ borderColor: "blue" }}
                                value={terminos}
                                onValueChange={(event) => changeTerminos(event)} />
                            <Label style={styles.label}>Acepta los términos y condiciones de uso de la plataforma</Label>
                            </Item>

                            <View>
                            <TouchableOpacity style={{ marginTop: 20 }}>
                                <Button title="Grabar" color="#3F51B5" onPress={() => addCuenta()}></Button>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginTop: 20 }}>
                                <Button title="Cancelar" color="#3F51B5" onPress={() => props.open(false)}></Button>
                            </TouchableOpacity>
                            </View>

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
        alignItems:'center',
        textAlign:'center',
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
    form:{
        marginTop:0
    },
    label:{
        fontSize:14,
        paddingTop: 6,
    },
});

export default NuevaCuenta;
