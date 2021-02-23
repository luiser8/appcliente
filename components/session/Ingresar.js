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
import '../../utils/Config';
import { AuthContext } from '../../utils/Context';
import Header from '../Layout/Header';
import NuevaCuenta from './NuevaCuenta';

const Ingresar = (props) => {
    const { signIn } = React.useContext(AuthContext);
    var [openNuevaCuenta, setOpenNuevaCuenta] = useState(false);
    const [clienteId, setClienteId] = useState(props.cliente);
    var [user, setUser] = useState(null);
    var [usuarioId, setUsuarioId] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    var [errorPassword, setErrorPassword] = useState(false);
    var [errorEmail, setErrorEmail] = useState(false);
    var [open, setOpen] = useState(false);
    var [isOpen, setIsOpen] = useState('');
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;

    const establecer = async () => {
        try {
            await AsyncStorage.getItem('UsuarioId').then(
                (value) => {
                    if(value !== undefined){
                        setUsuarioId(value); 
                    }else{
                        setUsuarioId(null); 
                    }
                }
            );
            
        } catch (e) {
            console.log(e);
        }
    }
    const changeOpenNuevaCuenta = (open) => {
        setOpenNuevaCuenta(open); setOpen(open);
    }

    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
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
    //Funcion para enviar contraseña y contraseña al servidor comprobar datos para iniciar sesion
    const handleLogin = async () => {
        if (email !== '' && password !== '') {
            await fetch(`${global.config.appConfig.url.dev}POC_Cliente/Login`, {
                method: 'POST',
                headers: global.config.appConfig.headers.dev,
                body: JSON.stringify(
                    {
                        'ClienteId': clienteId,
                        'Email': email,
                        'Contrasena': password
                    }
                ),
                json: true
            }).then(response => {
                if (response.status >= 200 && response.status <= 299) {
                    return setLogin(response.json())
                }
                else { // si no se obtiene una respuesta
                    response.json().then((json) => {
                        const { Message, StrackTraceString } = json;
                        //setMessages(Message);
                        toast(Message, 3000)
                        /*setTimeout(() => {
                            setMessages('');
                        }, 2000)*/
                    });
                    return null
                }
            }).catch(e => {
                console.log(e);
            })
        } else {
            if (email === '') {
                setErrorEmail(true)
                toast('Error debes colocar tu email', 3000)
            }
            if (password === '') {
                setErrorPassword(true)
                toast('Error debes colocar contraseña', 3000)
            }
            if (email === '' && password === '') {
                toast('Error debes colocar tu email y contraseña', 3000)
            }
            setTimeout(() => {
                setErrorPassword(false); setErrorEmail(false); 
            }, 3000)
        }
    }
    //Recibe el request para obtener los datos a colocar en la session local
    const setLogin = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items) {
                if (items.Bloqueado !== 1) {
                    signIn({
                        'Mapa':false,
                        'ClienteId': items.ClienteId,
                        'UsuarioId': items.UsuarioId,
                        'Cedula': items.Identificador,
                        'Nombres': items.Nombres,
                        'Apellidos': items.Apellidos,
                        'Telefono': items.Telefono,
                        'Correo': items.Email,
                        'Direccion': items.Direccion
                    });
                    establecer(); props.user(items); setUser(items.UsuarioId);
                    props.openIngresar(false);
                }
            } else {
                signIn({ 'UsuarioId': items.UsuarioId, 'Usuario': 'Usuario no existe' })
            }
            
        })
        
    }

useEffect(() => {
    establecer();
}, []);

    return (
        <>
            {openNuevaCuenta ? (
                <NuevaCuenta open={changeOpenNuevaCuenta} cliente={clienteId} />
            ) : (
                    <View style={{ flex: 1, marginTop: deviceHeight * 0.00, backgroundColor: '#fff' }}>
                        <Header openInfo={changeOpenInfo} openMap={changeOpenMap} openIngresar={changeOpenIngresar}/>
                        <Container style={styles.container}>
                            <Card transparent>
                                <View style={{ padding: 20 }}>
                                    <Text style={styles.title}>Un gusto verte por aqui nuevamente</Text>
                                </View>
                                <View style={styles.form}>
                                    {/* <Form> */}
                                    <Text style={styles.subtitle}>Datos para abrir sesión</Text>
                                    <Item error={errorEmail ? true : false} floatingLabel>
                                        <Label>Correo electrónico</Label>
                                        <Input placeholderTextColor="#666666" name="email" value={email} onChangeText={text => setEmail(text)} />
                                    </Item>

                                    <Item floatingLabel error={errorPassword ? true : false}>
                                        <Label>Código de usuario (6 dígitos)</Label>
                                        <Input secureTextEntry={true ? true : false} name="password" value={password} onChangeText={text => setPassword(text)} />

                                    </Item>
                                    <View style={{ marginTop: 10 }}>
                                        <Text onPress={() => alert('ok')} style={{ textAlign: 'center', fontSize: 17, textDecorationLine: 'underline' }}>Olvidé la clave</Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text onPress={() => changeOpenNuevaCuenta(true)} style={{ textAlign: 'center', fontSize: 17, textDecorationLine: 'underline' }}>Crear nueva cuenta</Text>
                                    </View>

                                    <View>
                                        <TouchableOpacity style={{ marginTop: 20 }}>
                                            <Button title="Ingresar" color="#3F51B5" onPress={() => handleLogin()}></Button>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginTop: 20 }}>
                                            <Button title="Cancelar" color="#3F51B5" onPress={() => props.openIngresar(false)}></Button>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.nota}>Nota: Si no activaste seguridad en tu cuenta puedes dejar vacio el campo de clave</Text>
                                    {/* </Form> */}
                                </View>
                            </Card>
                        </Container>
                    </View>
                )}

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 14,
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
        fontSize: 18,
        fontWeight: 'bold',
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
        marginTop: 40
    }
});

export default Ingresar;
