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
    Dimensions, ActivityIndicator,
} from 'react-native';
import { Container, Content, Card, CardItem, Input, Label, Item, Tab, Tabs, Left, Thumbnail, Body, Right } from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import '../../utils/Config';

const Tipo = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [clienteId, setClienteId] = useState(props.user);
    var [categoriaProd, setCategoriaProd] = useState([]);
    var [buscar, setBuscar] = useState('');
    var [tipoProducto, setTipoProducto] = useState(false);
    var [producto, setProducto] = useState(false);
    const screenHeight = Dimensions.get('window').height;

    const changeTipoProducto = (tipo, listCategoriaProd, tipoCat) => {
        //alert(JSON.stringify(listCategoriaProd))
        listCategoriaProd.map((key, item) => {
            const newV = listCategoriaProd[item].TipoProducto.map((key, item2) => {
                if(listCategoriaProd[item].TipoProducto[item2].TipoProductoId !== tipoCat){
                    return {
                        ...listCategoriaProd[item].TipoProducto[item2],
                        ProductoChecked:listCategoriaProd[item].TipoProducto[item2].ProductoChecked
                    }
                }
                if(listCategoriaProd[item].TipoProducto[item2].TipoProductoId === tipoCat){
                    const i = {
                        ...listCategoriaProd[item].TipoProducto[item2],
                        ProductoChecked: !listCategoriaProd[item].TipoProducto[item2].ProductoChecked
                    }
                    return i;
                }
                return item2;
            })
        })
    }
    const changeProducto = (event, prod) => {
        setProducto(event); alert(prod);
    }

    //Consultamos lista de Categoria, tipos de productos y productos desde el api
    const getCategoriaProd = async (cliente) => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Producto?clienteId=${cliente}`, {
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
            return setCategoriaProd(result)
        }
    }

    useEffect(() => {
        getCategoriaProd(clienteId);
    }, []);

    return (
        <SafeAreaView>
            <ScrollView>
            {(Object.keys(categoriaProd).length !== 0) ?
                <View style={styles.container}>
                    <Item floatingLabel style={{ borderColor: "black" }}>
                        <Label>Filtro de Tipos de Productos</Label>
                        <Input placeholderTextColor="#666666" name="buscar" value={buscar} onChangeText={(text) => setBuscar(text)} />
                    </Item>
                    <ScrollView>
                    {categoriaProd.filter((fil, key) => {
                        if(!buscar) return true
                        if (fil.Nombre.includes(buscar) || fil.Nombre.includes(buscar)) {
                            return true
                        }
                    }).map(item => (
                        <View key={item.TipoCategoriaId}>
                            <Text style={styles.textWrapper}>{item.Nombre}</Text>
                            {item.TipoProducto.map((key, cat) => (
                                <View key={cat} style={{ marginLeft: 30 }}>
                                    <Item>
                                        <CheckBox
                                            style={{ borderColor: "blue" }}
                                            value={item.TipoProducto[cat].ProductoChecked}
                                            onValueChange={(event) => changeTipoProducto(event, categoriaProd, item.TipoProducto[cat].TipoProductoId)} 
                                            />
                                        <Label>{item.TipoProducto[cat].Nombre}</Label>
                                    </Item>
                                        {item.TipoProducto[cat].Producto.map((key, prod) => (
                                            <View key={item.TipoProducto[cat].Producto[prod].ProductoId} style={{ marginLeft: 30 }}>
                                                <Item>
                                                    <CheckBox
                                                        style={{ borderColor: "blue" }}
                                                        value={producto}
                                                        onValueChange={(event) => changeProducto(event, item.TipoProducto[cat].Producto[prod].ProductoId)} />
                                                    <Label>{item.TipoProducto[cat].Producto[prod].Nombre}</Label>
                                                </Item>
                                        </View>
                                        ))}
                                </View>
                            ))}

                        </View>
                    ))}
                    
                        <View style={{ flex: 1, height: screenHeight * 0.3 }}>
                            <View style={{ alignItems: 'flex-start' }}>
                                <TouchableOpacity style={styles.appButtonContainer} onPress={() => props.open(1, true)}>
                                    <Text style={styles.appButtonText}>{'Cerrar'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <TouchableOpacity style={styles.appButtonContainer2} onPress={() => props.fecha(7, true)}>
                                    <Text style={styles.appButtonText}>{'Aplicar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </ScrollView>
                </View>
                :
                <View style={{ flex: 1, marginTop: 140 }}>
                    <ActivityIndicator size={88} color="blue" />
                </View>
            }
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    appButtonContainer: {
        marginTop: 4,
        paddingTop: 6,
        paddingBottom: 12,
        elevation: 2,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 36
    },
    appButtonContainer2: {
        marginTop: -36,
        paddingTop: 2,
        paddingBottom: 12,
        elevation: 2,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 36
    },
    appButtonText: {
        fontSize: 16,
        color: "#000",
        alignSelf: "center",
    },
    container: {
        padding: 8,
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
export default Tipo;
