import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight} from 'react-native';
import TRC from 'toto-react-components';

/**
 * Yes and No toggle. 
 * Params: 
 *  - label             : displays the provided label
 *  - onSelectionChange : feedback function(selection) where selection is going to be a string 'yes|no'
 */
export default class YesNoToggle extends Component {

    constructor(props) {
        super(props);

        this.state = {
            yes: props.value != null && props.value,
            no: props.value != null && !props.value
        }

        this.onPressYes = this.onPressYes.bind(this);
        this.onPressNo = this.onPressNo.bind(this);
    }

    onPressYes() {
        this.setState({
            yes: true, 
            no: false
        })

        if (this.props.onSelectionChange) this.props.onSelectionChange('yes');
    }

    onPressNo() {
        this.setState({
            yes: false, 
            no: true
        })
        
        if (this.props.onSelectionChange) this.props.onSelectionChange('no');
    }

    render() {

        let yesSelectedStyle = styles.buttonUnselected, imgYesSelectedStyle;
        if (this.state.yes) {
            yesSelectedStyle = styles.buttonSelected;
            imgYesSelectedStyle = styles.imgSelected;
        }

        let noSelectedStyle = styles.buttonUnselected, imgNoSelectedStyle;
        if (this.state.no) {
            noSelectedStyle = styles.buttonSelected;
            imgNoSelectedStyle = styles.imgSelected;
        }

        return (
            <View style={styles.container}>
                <Text style={styles.label}>{this.props.label}</Text>
                <View style={{flex: 1}}></View>
                <TouchableHighlight underlayColor={TRC.TotoTheme.theme.COLOR_THEME} style={[styles.button, yesSelectedStyle]} onPress={this.onPressYes}>
                    <Image source={require('../../img/tick.png')} style={[styles.img, imgYesSelectedStyle]}></Image>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={TRC.TotoTheme.theme.COLOR_THEME} style={[styles.button, noSelectedStyle]} onPress={this.onPressNo}>
                    <Image source={require('../../img/cross.png')} style={[styles.img, imgNoSelectedStyle]}></Image>
                </TouchableHighlight>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'flex-start',
        marginHorizontal: 12,
    },
    label: {
        color: TRC.TotoTheme.theme.COLOR_TEXT
    },
    button: {
        marginLeft: 12,
        height: 32, 
        width: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    }, 
    buttonUnselected: {
        borderColor: TRC.TotoTheme.theme.COLOR_TEXT,
        opacity: 0.3,
    },
    buttonSelected: {
        borderColor: TRC.TotoTheme.theme.COLOR_ACCENT, 
        opacity: 1
    },
    img: {
        width: 16, 
        height: 16, 
        tintColor: TRC.TotoTheme.theme.COLOR_TEXT
    },
    imgSelected: {
        tintColor: TRC.TotoTheme.theme.COLOR_ACCENT
    }
})