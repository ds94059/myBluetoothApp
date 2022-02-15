import { Alert, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Button, Constructor } from 'react-native';
import { bleManager, requestLocationPermission } from '../App';
import { State, ScanMode } from 'react-native-ble-plx';
import { useState } from 'react';
let debugLog = "";
const devices: any[] = [];
//const deviceList: any[] = [];



export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [buttonList, setbuttonList] = useState([]);
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Button
                    onPress={() => onPressScan(buttonList, setbuttonList)}
                    title="scan"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <Button
                    onPress={() => onPressLog()}
                    title="log"
                    color="#841584"
                    accessibilityLabel="Print the logs."
                />
            </View>
            <View style={styles.listView}>
                {buttonList}
            </View>
        </View>
    );
}

const onPressScan = async (buttonList: any[], setbuttonList: any) => {
    console.log("Connect to XXX device.");
    const state = await bleManager.state();
    Alert.alert(state);
    debugLog += state + "\n";
    console.log(debugLog);
    if (state === State.PoweredOn) {
        //const permission = requestLocationPermission();
        //debugLog += permission;
        bleManager.startDeviceScan(null, { scanMode: ScanMode.LowLatency }, (error, device) => {
            if (error) {
                console.log(error)
                debugLog += error + "\n";
                return
            }

            if (device?.name) {
                if (!devices.find(name => name == device.name)) {
                    devices.push(device.name);
                    debugLog += "=============\n";
                    debugLog += "id: " + device?.id + "\n";
                    debugLog += "name: " + device?.name + "\n";
                    debugLog += "localname: " + device?.localName + "\n";
                    const newElement =
                        <Button
                            onPress={() => onPressDeviceName(device.name)}
                            title={device.name}
                            color="#841584"
                            accessibilityLabel="Connect to the device."
                        />
                    setbuttonList((buttonList: any) => [buttonList, newElement]);
                }
            }
            //bleManager.stopDeviceScan();
            // 在這裡對 device 進行操作...
        })
    }
}

const onPressLog = () => {
    Alert.alert("Log", debugLog);
}

const onPressDeviceName = (name: any) => {
    Alert.alert("Log", name);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    listView: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
