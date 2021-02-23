import React, { useEffect, useState } from 'react';
import { Container, Content, Card, CardItem, Input, Label, Item, Tab, Tabs, Left, Thumbnail, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment, { locales } from 'moment';
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
import Detalle from './Detalle';
import Tipo from './Tipo';
import Locales from './Locales';
import Adicional from './Adicional';
import Orden from './Orden';

const Productos = (props) => {
    const [value, setValue] = React.useState('left');
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [activity, setActivity] = useState(false);
    var [msjRespuesta, setMsjRespuesta] = useState('');
    var [msjError, setMsjError] = useState('');
    var [productos, setProductos] = useState([]);
    var [clienteId, setClienteId] = useState('');
    var [incluir, setIncluir] = useState(false);
    var [fechaActual, setFechaActual] = useState(Moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
    var [fechaInicio, setfechaInicio] = useState(null);
    var [fechaFin, setfechaFin] = useState(null);
    var [fechaAdicional, setFechaAdicional] = useState();
    var [buscar, setBuscar] = useState('');
    var [orden, setOrden] = useState(0);
    var [tipo, setTipo] = useState(0);
    var [localCategoria, setLocalCategoria] = useState();
    var [fecha, setFecha] = useState('');
    var [errorBuscar, setErrorBuscar] = useState(false);
    var [openDetalle, setOpenDetalle] = useState(false);
    var [openFiltro, setOpenFiltro] = useState(false);
    var [openFiltroNro, setOpenFiltroNro] = useState(0);
    var [itemDetalle, setItemDetalle] = useState();
    var [open, setOpen] = useState(false);
    var [isOpenA, setIsOpenA] = useState(false);
    var [isOpenO, setIsOpenO] = useState(false);
    var [isOpenL, setIsOpenL] = useState(false);
    var [isOpenT, setIsOpenT] = useState(false);
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);

    const getUser = async () => {
        let clienteId;
        try {
            clienteId = await AsyncStorage.getItem('ClienteId');
            setClienteId(clienteId);
        } catch (e) {
            console.log(e);
        }
        setClienteId(clienteId);
    }
    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }
    const changeOrden = async (orden) => {
        setOrden(orden); await getProductos(orden); setIsOpenO(false);
    }
    const changeLocalCategoria = async (local) => {
        alert(local)
        setLocalCategoria(orden); setIsOpenL(false);
    }
    const changeFecha = async (orden, activo, fecha) => {
        setFechaAdicional(fecha);
        setOrden(orden); 
        //await getProductos(7, fecha); 
        changeFiltro(3, activo);
    }
    const changeTipo = async (tipo) => {
        setTipo(tipo); setIsOpenT(false); setOrden(8); await getProductos(8, tipo); 
    }
    const changeFiltro = (cual, open) => {
        if(open){setOpenFiltro(false);}else{setOpenFiltro(true);}
        switch (cual) {
            case 1: 
                setOpenFiltroNro(1); if(open){setIsOpenT(false);}else{setIsOpenT(true);}
                break;
            case 2: 
                setOpenFiltroNro(2); if(open){setIsOpenL(false);}else{setIsOpenL(true);}
                break;
            case 3: 
                setOpenFiltroNro(3); if(open){setIsOpenA(false);}else{setIsOpenA(true);}
                break;
            case 4: 
                setOpenFiltroNro(4); if(open){setIsOpenO(false);}else{setIsOpenO(true);}
                break;
            default:
                setOpenFiltroNro(0);
                break;
        }
    }
    const changeBuscar = () => {
        setBuscar(''); setProductos([]); setActivity(false); setOpenFiltroNro(0); setOpenFiltro(false);
    }
    const openDetalleComponent = (producto) => {
        if (producto) {
            setItemDetalle(producto);
            setOpenDetalle(true);
        } else {
            setOpenDetalle(false);
        }
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
    //Consultamos lista de Productos disponibles desde el api
    const getProductos = async (or) => {
        // if (buscar !== '') {
            setActivity(true); setProductos([]); setOpenFiltroNro(0); setOpenFiltro(false);
            var result = await fetch(`${global.config.appConfig.url.dev}PPN_Producto?clienteId=${clienteId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&criterio=${buscar}&retiro=${incluir ? 1 : 0}&orden=${or ? or : orden}`, {
                method: 'GET',
                headers: global.config.appConfig.headers.dev,
                json: true
            }).then(response => {
                if (response.status >= 200 && response.status <= 299) {
                   return response.json()
                } else { // si no se obtiene una respuesta
                    response.json().then((json) => {
                        const { Message, StrackTraceString } = json;
                    });
                    return null
                }
            }).catch(e => console.log(e))
            if (result == null) {
                return "Error get";
            } else {
                return promise(result)
            }
    }
    const promise = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items.length >= 1) {
                setMsjError(''); setMsjRespuesta(items.length); setProductos(req);
            } else if (items.length === 0) {
                setMsjError(items.length); setActivity(false);
            }
        })
    }
    useEffect(() => {
        getUser();
        // alert(Moment(fechaActual).subtract(-1, 'days').format('YYYY-MM-DD HH:mm:ss'))
        // alert(Moment(Moment().endOf('isoWeek')).subtract(-7, 'days').format('YYYY-MM-DD HH:mm:ss'))
        if(Moment().weekday() >= 5){
            setfechaInicio(Moment(fechaActual).subtract(-1, 'days').format('YYYY-MM-DD HH:mm:ss'));
            setfechaFin(Moment(Moment().endOf('isoWeek')).subtract(-7, 'days').format('YYYY-MM-DD HH:mm:ss'));
        }else{
            setfechaInicio(Moment(fechaActual).subtract(-1, 'days').format('YYYY-MM-DD HH:mm:ss'));
            setfechaFin(Moment(Moment().endOf('isoWeek')).subtract(-7, 'days').format('YYYY-MM-DD HH:mm:ss'));
        }
    }, []);

    return (
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
                        <Container style={styles.container}>

                            {openDetalle ? (
                                <Detalle item={itemDetalle} open={openDetalleComponent} />
                            ) : (
                                    <View>
                                        <Card transparent style={{ marginTop: -30 }}>
                                            <View>
                                                <View>
                                                    <Item error={errorBuscar ? true : false} floatingLabel style={{ borderColor: "black" }}>
                                                        <Label>¿Qué necesitas?</Label>
                                                        <Input placeholderTextColor="#666666" name="buscar" value={buscar} onChangeText={(text) => setBuscar(text)} />
                                                    </Item>
                                                    <TouchableOpacity>
                                                        <Button onPress={() => getProductos()} title="Buscar"></Button>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ marginTop: 10 }}>
                                                    <TouchableOpacity onPress={() => changeBuscar()}>
                                                        <Label style={{ fontSize: 14, textDecorationLine: 'underline' }}>Nueva busqueda</Label>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ marginTop: -24, alignItems: 'flex-end' }}>
                                                    <Item>
                                                        <CheckBox
                                                            value={incluir}
                                                            onValueChange={(event) => setIncluir(event)} />
                                                        <Label style={{ fontSize: 14 }}>Incluir retiro en tienda</Label>
                                                    </Item>
                                                </View>

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <TouchableOpacity style={styles.rosa} onPress={() => changeFiltro(1, isOpenT)}>
                                                            <Text style={styles.appButtonText}>Tipo
                                                                {isOpenT ? (
                                                                    <Icon name={'caret-up'} color="black" size={24} />
                                                                    ):(
                                                                    <Icon name={'caret-down'} color="black" size={24} />
                                                                )}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <TouchableOpacity style={styles.azul} onPress={() => changeFiltro(2, isOpenL)}>
                                                            <Text style={styles.appButtonText}>Locales
                                                                {isOpenL ? (
                                                                    <Icon name={'caret-up'} color="black" size={24} />
                                                                    ):(
                                                                    <Icon name={'caret-down'} color="black" size={24} />
                                                                )}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <TouchableOpacity style={styles.verde} onPress={() => changeFiltro(3, isOpenA)}>
                                                            <Text style={styles.appButtonText}>Adicional
                                                                {isOpenA ? (
                                                                    <Icon name={'caret-up'} color="black" size={24} />
                                                                    ):(
                                                                    <Icon name={'caret-down'} color="black" size={24} />
                                                                )}
                                                            </Text>
                                                        </TouchableOpacity >
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <TouchableOpacity style={styles.amarillo} onPress={() => changeFiltro(4, isOpenO)}>
                                                            <Text style={styles.appButtonText}>Orden 
                                                                {isOpenO ? (
                                                                    <Icon name={'caret-up'} color="black" size={24} />
                                                                    ):(
                                                                    <Icon name={'caret-down'} color="black" size={24} />
                                                                )}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </Card>
                                        {msjError !== '' ? (
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text>{msjError} registros</Text>
                                            </View>
                                        ) : (
                                                <></>
                                            )}
                                        <ScrollView>
                                            {openFiltro ? (
                                                <>
                                                    {openFiltroNro === 1 ? (<Tipo open={changeFiltro} user={clienteId} tipo={changeTipo} />) : (<></>)}
                                                    {openFiltroNro === 2 ? (<Locales open={changeFiltro} user={clienteId} local={changeLocalCategoria} />) : (<></>)}
                                                    {openFiltroNro === 3 ? (<Adicional open={changeFiltro} fecha={changeFecha} />) : (<></>)}
                                                    {openFiltroNro === 4 ? (<Orden open={changeFiltro} orden={changeOrden} />) : (<></>)}
                                                </>
                                            ) : (
                                                <View >
                                                        {(Object.keys(productos).length !== 0) ?
                                                                <ScrollView>
                                                                    <View style={{ alignItems: 'flex-end' }}>
                                                                        <Text>{msjRespuesta} registros</Text>
                                                                    </View>
 
                                                                    {productos.map((key, item) => (
                                                                        <Card key={item} style={{ flex: 1 }}>
                                                                            <ScrollView>
                                                                            <CardItem>
            
                                                                                <Thumbnail square large source={{ uri: `data:image/jpeg;base64,${productos[item].Image}` }} />
                                                                                <Left>
                                                                                    <TouchableOpacity onPress={() => openDetalleComponent(productos[item])}>
                                                                                        <Body>
                                                                                            <Text style={styles.titulo}>{productos[item].Nombre}</Text>
                                                                                            <Text>{productos[item].Local}</Text>
                                                                                            <Text style={styles.um}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(productos[item].Monto)} por cada {productos[item].UnidadMedida}</Text>
                                                                                            {productos[item].Retiro === 0 ? (
                                                                                                <Text style={styles.tiempo}>Entrega más próxima {Moment(productos[item].FechaHoraEntrega).format('DD-MM-YYYY LT')} </Text>
                                                                                            ) : (
                                                                                                    <Text style={styles.tiempo}>Retiro en tienda en cualquier momento </Text>
                                                                                                )}
                                                                                        </Body>
                                                                                    </TouchableOpacity>
                                                                                </Left>
                                                                                <TouchableOpacity onPress={() => openDetalleComponent(productos[item])}>
                                                                                    <Icon name={'chevron-right'} color="black" size={44} />
                                                                                </TouchableOpacity>
                                                                            </CardItem>
                                                                            </ScrollView>
                                                                        </Card>
                                                                        
                                                                    ))}
                                                                    {/* </ScrollView> */}
                                                                </ScrollView>
                                                            :
                                                            activity ? (
                                                                <View style={{ flex: 1, marginTop: 140 }}>
                                                                    <ActivityIndicator size={88} color="blue" />
                                                                </View>
                                                            ) : (
                                                                    <></>
                                                                )
                                                        }
                                                    </View>
                                                )}
                                        </ScrollView>
                                    </View>
                                )}
                        </Container>
                    </>
                )}
        </View>
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
        color: '#b71c1c',
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

export default Productos;
