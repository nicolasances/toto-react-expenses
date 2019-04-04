import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Modal, Text} from 'react-native';
import TRC from 'toto-react-components';

import categoriesMap from 'TotoReactExpenses/js/util/CategoriesMap';

export default class CategorySelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    }

  }

  render() {

    let categoryImageSource, categoryImageColor, categoryLabel;
    if (this.props.category == null) {
      categoryImageSource = categoriesMap.get('VARIE').image;
      categoryImageColor = {tintColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT}
      categoryLabel = categoriesMap.get('VARIE').label;
    }
    else {
      categoryImageSource = categoriesMap.get(this.props.category).image;
      categoryImageColor = {tintColor: TRC.TotoTheme.theme.COLOR_TEXT}
      categoryLabel = categoriesMap.get(this.props.category).label;
    }

    let categoryButtons = [];

    categoriesMap.forEach((value, key) => {

      let k = 'CatNewEx' + Math.random();

      cat = (
        <Category key={k} image={value.image} label={value.label} selected={this.props.category == key} onPress={() => {this.props.onCategoryChange(key); this.setState({modalVisible: false})}} />
      )

      categoryButtons.push(cat);
    })

    return (
      <TouchableOpacity style={styles.categoryContainer} onPress={() => {this.setState({modalVisible: true})}}>
        <Image source={categoryImageSource} style={[styles.categoryImg, categoryImageColor]} />
        <Text style={styles.categoryLabel}>{categoryLabel}</Text>

        <Modal  animationType="slide" transparent={false} visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              {categoryButtons}
            </View>
            <View style={styles.buttonsContainer}>
              <TRC.TotoIconButton image={require('../../img/cross.png')} onPress={() => {this.setState({modalVisible: false})}} />
            </View>
          </View>
        </Modal>

      </TouchableOpacity>
    )
  }

}

/**
 * Category item
 */
class Category extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let selectedStyle = this.props.selected ? styles.selected : styles.unselected;
    let selectedImgStyle = this.props.selected ? styles.selectedImg : styles.unselectedImg;
    let selectedTextStyle = this.props.selected ? styles.selectedText : styles.unselectedText;

    return (
      <View style={styles.catSelectorContainer}>
        <TouchableOpacity style={[styles.imageContainer, selectedStyle]} onPress={this.props.onPress}>
          <Image source={this.props.image} style={[styles.image, selectedImgStyle]} />
        </TouchableOpacity>
        <Text style={[styles.label, selectedTextStyle]}>{this.props.label}</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  categoryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    justifyContent: 'center',
    paddingTop: 64,
  },
  buttonsContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  categoryImg: {
    width: 80,
    height: 80,
  },
  unselected: {
    borderColor: TRC.TotoTheme.theme.COLOR_THEME,
  },
  selected: {
    borderColor: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
  unselectedImg: {
    tintColor: TRC.TotoTheme.theme.COLOR_THEME,
  },
  selectedImg: {
    tintColor: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
  unselectedText: {
    color: TRC.TotoTheme.theme.COLOR_THEME,
  },
  selectedText: {
    color: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  catSelectorContainer: {
    alignItems: 'center',
    width: 72,
    height: 120,
    flexWrap: 'wrap',
    marginHorizontal: 12,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  categoryLabel: {
    fontSize: 18,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    textAlign: 'center',
    marginTop: 12,
  },
})
