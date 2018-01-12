class PowerMeterBluetoothConnector {

    previousPower;

    constructor(onDeviceConnectedCallback, onPowerChangeCallback) {
        this.onPowerChangeCallback = onPowerChangeCallback;
        this.onDeviceConnectedCallback = onDeviceConnectedCallback;
        this.onPowerChange = this.onPowerChange.bind(this);
    }

    connect() {
        navigator.bluetooth.requestDevice({
            filters: [{
                services: ['cycling_power'],
            }]
        })
            .then(device => {
                return device.gatt.connect();
            })
            .then(server => {
                console.log('> Setting primary service to cycling_power');
                this.onDeviceConnected(server.device);
                return server.getPrimaryService('cycling_power');
            })
            .then(service => {
                console.log('> Setting characteristic to cycling_power_measurement');
                return service.getCharacteristic('cycling_power_measurement');
            })
            .then(characteristic => {
                console.log('> Setup notifications');
                return characteristic.startNotifications();
            })
            .then(characteristic => {
                console.log('> Start listening on characteristicvaluechanged...');
                characteristic.addEventListener('characteristicvaluechanged', this.onPowerChange);
            });
    }

    onDeviceConnected(device) {
        console.log('> Connected device: ' + device.name);
        return this.onDeviceConnectedCallback(device);
    }

    onPowerChange(event) {
        const powerOffset = 12;
        const power = parseInt(event.target.value.getUint8(powerOffset).toString());
        if (power !== this.previousPower) {
            this.previousPower = power;
            console.log('> Power: ' + power);

            return this.onPowerChangeCallback(power);
        }
    }

}

export default PowerMeterBluetoothConnector;
