/* Floating Action Button (FAB) Component
Usage: <FAB label={strings.button.gotoLocation} theme='green' icon='crosshairs' onPress={this.goToLocation} disabled={goingToLocation}/>
*/

import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View } from 'react-native';
import { create } from 'library/utils/normalize.js'
import R from 'res/R';

/* Switch styles
============================================================================= */

const getStyles = ({
  theme, branded
}) => {
  const containerStyles = [styles.container];
  const textStyles = [styles.text];
  let iconColor = R.colors.justWhite;

  if (theme === 'green') {
    containerStyles.push(styles.containerGreen);
    textStyles.push(styles.textGray);
    iconColor = R.colors.asphaltGray;
  } else if (theme === 'blue') {
    containerStyles.push(styles.containerBlue);
    textStyles.push(styles.textGray);
    iconColor = R.colors.asphaltGray;
  } else if (theme === 'red') {
    containerStyles.push(styles.containerRed);
  }

  if (branded) {
    textStyles.push(styles.textBranded);
  }

  return { containerStyles, iconColor, textStyles };
};

/* FAB
============================================================================= */

class FAB extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    theme: PropTypes.oneOf(['green', 'blue', 'red']),
    branded: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    label: 'Button Label',
    theme: 'default',
    branded: false,
    disabled: false
  };

  render() {
    const {
      label,
      theme,
      branded,
      onPress,
      disabled
    } = this.props;
    const { containerStyles, iconColor, textStyles } = getStyles({ theme, branded });
    return (
        <TouchableOpacity onPress={onPress} style={containerStyles} disabled={disabled}>
          <View style={styles.iconContainer}>
            <R.Icon icon={this.props.icon} color={iconColor}/>
          </View>
          <Text style={textStyles}>{label}</Text>
        </TouchableOpacity>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = create({
  
  // Containers
  container: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 20,
    paddingVertical: 12,
    borderRadius: R.shapes.radiusAll,
    backgroundColor: R.colors.asphaltGray,
    ...R.shapes.elevGray5
  },

  containerGreen: {
    backgroundColor: R.colors.grassGreen600,
    ...R.shapes.elevGreen5
  },

  containerBlue: {
    backgroundColor: R.colors.skyBlue600,
    ...R.shapes.elevBlue5
  },

  containerRed: {
    backgroundColor: R.colors.bubblegumRed600,
    ...R.shapes.elevRed5
  },

  // Icon
  iconContainer: {
    height: 24,
    width: 24,
    marginRight: 12
  },

  // Text
  text: {
    color: R.colors.justWhite,
    ...R.typography.subheader3
  },

  textGray: {
    color: R.colors.asphaltGray
  },

  textBranded: {
    ...R.typography.brandedButton
  }
})

/* Export
============================================================================= */

export default FAB;