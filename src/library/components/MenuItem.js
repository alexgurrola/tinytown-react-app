/* Menu Item Component
This component is a customized version of the Menu Item component from react-native-material-menu [https://github.com/mxck/react-native-material-menu].*/

import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import R from 'res/R';

const Touchable =
  Platform.OS === 'android' && Platform.Version >= 21
    ? TouchableNativeFeedback
    : TouchableHighlight;

/* Menu Item
============================================================================= */

class MenuItem extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    label: 'Menu item',
    disabled: false,
  };

  render() {
    const {
      label,
      disabled,
      onPress,
    } = this.props;
    return (
        <Touchable
          disabled={disabled}
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple(R.colors.sidewalkGray)}
          underlayColor={R.colors.snowGray}
        >
          <View style={[styles.container, disabled && { opacity: R.colors.disabled}]}>
            <View style={styles.assetContainer}>
              <View style={styles.iconContainer}>
                <R.Icon icon={this.props.icon} color={R.colors.graniteGray}></R.Icon>
              </View>
            </View>
            <Text
              numberOfLines={1}
              style={styles.label}
            >
              {label}
            </Text>
          </View>
        </Touchable>
  );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    width: 200,
    paddingHorizontal: 8,
    overflow: 'hidden'
  },

  assetContainer: {
    alignItems: "center",
    width: 48,
    marginRight: 8
  },

  iconContainer: {
    width: 24,
    height: 24
  },

  label: {
    width: 120,
    color: R.colors.graniteGray,
    ...R.typography.subheader3
  },

});

/* Export
============================================================================= */

export default MenuItem;