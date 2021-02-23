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
import { Input, Label, Item } from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import '../../utils/Config';

const Locales = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [clienteId, setClienteId] = useState(props.user);
    var [localCategoria, setLocalCategoria] = useState([]);
    var [buscar, setBuscar] = useState('');

    //Consultamos lista de Locales con categoria desde el api
    const getLocalCategoria = async (cliente) => {
        var result = await fetch(`${global.config.appConfig.url.dev}PPN_Local?clienteId=${cliente}`, {
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
            return setLocalCategoria(result)
        }
    }

    useEffect(() => {
        getLocalCategoria(clienteId);
    }, []);

    return (
        <SafeAreaView>
            {(Object.keys(localCategoria).length !== 0) ?
                <ScrollView style={styles.container}>
                    <Item floatingLabel style={{ borderColor: "black" }}>
                        <Label>Filtro de Locales en Zona</Label>
                        <Input placeholderTextColor="#666666" name="buscar" value={buscar} onChangeText={(text) => setBuscar(text)} />
                    </Item>
                    {localCategoria.filter(fil => {
                        if(!buscar) return true
                        if (fil.Nombre.includes(buscar) || fil.Nombre.includes(buscar)) {
                            return true
                        }
                    }).map(item => (
                        <View key={item.LocalId}>
                            <Text style={styles.textWrapper}>{item.Nombre}</Text>
                            {item.Categoria.map((key, cat) => (
                                <View key={cat} style={{ marginLeft: 30 }}>
                                    <Item>
                                        <CheckBox
                                            style={{ borderColor: "blue" }}
                                            value={false}
                                            onValueChange={(event) => alert(event)} />
                                        <Label>{item.Categoria[cat].Nombre}</Label>
                                    </Item>
                                </View>
                            ))}
                        </View>
                    ))}
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'flex-start' }}>
                            <TouchableOpacity style={styles.appButtonContainer} onPress={() => props.open(2, true)}>
                                <Text style={styles.appButtonText}>{'Cerrar'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'flex-end', }}>
                            <TouchableOpacity style={styles.appButtonContainer2} onPress={() => props.fecha(7, true)}>
                                <Text style={styles.appButtonText}>{'Aplicar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                :
                <View style={{ flex: 1, marginTop: 140 }}>
                    <ActivityIndicator size={88} color="blue" />
                </View>
            }

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
export default Locales;
