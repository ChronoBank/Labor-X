import React from 'react'
import PropTypes from 'prop-types'

import muiThemeable from 'material-ui/styles/muiThemeable'
import SelectField from 'material-ui/SelectField'

const profileThemeSelect = {
  underlineStyle: {
    bottom: 2,
  },
  underlineFocusStyle: {
    height: 1,
    borderWidth: 1,
    bottom: 2,
  },
  hintStyle: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  iconStyle: {
    width: 'auto',
    height: 'auto',
    top: 0,
    bottom: 0,
    padding: 0,
  },
  labelStyle: {
    color: 'blue',
  },
}

class WrapperSelect extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      value: PropTypes.string,
      name: PropTypes.string,
      onChange: PropTypes.func,
    }),
    label: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
    }),
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]),
    profileTheme:  PropTypes.shape({}), // custom styles for profileTheme
    muiTheme: PropTypes.shape({}),
  }

  handleOnChange = (event, index, value) => {
    this.props.input.onChange(value)
  }

  render () {

    const { input, label, meta, children, profileTheme, muiTheme, ...custom } = this.props

    const profileThemeCustom = { ...profileThemeSelect, ...profileTheme }

    return (
      <SelectField
        errorText={meta.touched && meta.error}
        style={profileThemeCustom.style}
        hintStyle={profileThemeCustom.hintStyle}
        underlineStyle={profileThemeCustom.underlineStyle}
        underlineFocusStyle={profileThemeCustom.underlineFocusStyle}
        iconStyle={profileThemeCustom.iconStyle}
        labelStyle={profileThemeCustom.labelStyle}
        {...input}
        onChange={this.handleOnChange}
        {...custom}
      >
        {children}
      </SelectField>
    )
  }
}

export default muiThemeable()(WrapperSelect)
