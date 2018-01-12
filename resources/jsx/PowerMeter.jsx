import React from 'react';
import Gauge from 'react-svg-gauge';
import PowerMeterBluetoothConnector from '../es6/Connector/PowerMeterBluetoothConnector';

class PowerMeter extends React.Component {

    constructor() {
        super();
        this.state = {
            power: 0,
            maxPower: 100,
            device: {
                deviceName: 'Unknown device',
                isPaired: false
            }
        };
        this.initConnection = this.initConnection.bind(this);
        this.powerChanged = this.powerChanged.bind(this);
        this.deviceConnected = this.deviceConnected.bind(this);
    }

    render() {
        return (
            <div className="row">
                <div className="jumbotron col-lg-5">
                    <h1>Tacx Flux Smart Trainer</h1>
                    <hr/>
                    <p>
                        <button
                            className={this.state.device.isPaired ? 'btn-disabled btn-lg' : 'btn btn-primary btn-lg'}
                            onClick={this.state.device.isPaired ? null : this.initConnection}
                        >
                            {this.state.device.isPaired ? 'Paired device: ' + this.state.device.name : 'Pair bluetooth device'}
                        </button>
                    </p>
                </div>
                <div className={this.state.device.isPaired ? 'jumbotron col-lg-6 col-lg-offset-1 text-center' : 'hidden'}>
                    <Gauge value={this.state.power}
                           max={this.state.maxPower}
                           width={400}
                           height={320}
                           label="Power (Watt)"/>
                </div>
            </div>
        );
    }

    powerChanged(powerWatt) {
        this.setState({
            power: powerWatt,
            maxPower: (this.state.maxPower < powerWatt) ? powerWatt : this.state.maxPower
        });
    }

    deviceConnected(device) {
        this.setState({
            device: {
                isPaired: true,
                name: device.name
            }
        });
    }

    initConnection() {
        return new PowerMeterBluetoothConnector(this.deviceConnected, this.powerChanged).connect();
    }

}

export default PowerMeter;
