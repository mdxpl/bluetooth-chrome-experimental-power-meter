import React from 'react';
import Gauge from 'react-svg-gauge';

class PowerMeter extends React.Component {

    constructor() {
        super();
        this.state = {
            power: 0,
            maxPower: 600,
            device: {
                deviceName: 'Unknown device',
                isPaired: false
            }
        };
    }

    render() {
        return (
                <div className="row">
                    <div className="jumbotron col-lg-5">
                        <h1>Tacx Flux Smart Trainer</h1>
                        <hr />
                        <p>
                            <button
                                className={this.state.device.isPaired ? 'btn btn-disabled btn-lg' : 'btn btn-primary btn-lg'}
                                onClick={this.state.device.isPaired ? null : this.initConnection.bind(this)}
                            >
                                {this.state.device.isPaired ? 'Paired device: ' + this.state.device.name : 'Pair bluetooth device'}
                            </button>
                        </p>
                    </div>
                    <div className="jumbotron col-lg-6 col-lg-offset-1 text-center">
                        <Gauge value={this.state.power} max={this.state.maxPower} width={400} height={320}
                               label="Power (Watt)"/>
                    </div>
            </div>
        );
    }

    onPowerChange(event) {
        const powerOffset = 12;
        let value = event.target.value;
        let power = parseInt(value.getUint8(powerOffset).toString());
        console.log('> Power:' + power);
        this.setState({power: power});
    }

    initConnection() {

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
                this.setState({device: {isPaired: true, name: server.device.name}});
                return server.getPrimaryService('cycling_power');
            })
            .then(service => {
                console.log('> Setting characteristic to cycling_power_measurement');
                return service.getCharacteristic('cycling_power_measurement');
            })
            .then(characteristic => {
                console.log('> Setup notifications');
                characteristic.startNotifications().then(() => {
                    characteristic.addEventListener('characteristicvaluechanged', this.onPowerChange.bind(this));
                });
            });
    }

}

export default PowerMeter;
