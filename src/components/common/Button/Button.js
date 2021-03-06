import { Translate } from 'components/common'
import PropTypes from 'prop-types'
import React from 'react'
import Image from '../Image/Image'
import css from './Button.scss'

export default class Button extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    buttonClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    type: PropTypes.string,
    onClick: PropTypes.func,
    error: PropTypes.string,
    color: PropTypes.string,
    mods: PropTypes.string,
    icon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        icon: PropTypes.string,
        color: PropTypes.string,
      }),
    ]),
    errorClassName: PropTypes.string,
  }

  static TYPES = {
    BUTTON: 'button',
    SUBMIT: 'submit',
    RESET: 'reset',
  }

  static MODS = {
    FLAT: css.flat,
    NORMAL: css.normal,
    INVERT: css.invert,
  }

  static defaultProps = {
    type: Button.TYPES.BUTTON,
    disabled: false,
    error: null,
    icon: null,
    mods: Button.MODS.NORMAL,
    isLoading: false,
  }

  static COLORS = {
    PRIMARY: 'primary',
  }

  handleClick = (e) => this.props.onClick
    ? this.props.onClick(e)
    : true

  renderButtonContent (){
    const { isLoading, icon, label, labelClassName } = this.props

    const labelClassNames = [ css.labelClassName ].concat(labelClassName)

    if (isLoading) {
      return <div className={css.spinner} />
    } else {
      return [
        icon && <Image key='0' className={css.icon} {...icon} />,
        label && <Translate key='1' className={labelClassNames.join(' ')} value={label} />,
      ]
    }
  }

  render () {
    const { type, disabled, className, buttonClassName, errorClassName, error, mods, color } = this.props
    const classNames = [ css.root ].concat(mods)
    const buttonClassNames = [ css.button ].concat(buttonClassName)
    const errorClassNames = [ css.error ].concat(errorClassName)
    className && classNames.push(className)
    disabled && classNames.push(css.disabled)
    color && classNames.push(css[ color ])

    return (
      <div className={classNames.join(' ')} title={this.props.title}>
        <button
          className={buttonClassNames.join(' ')}
          onClick={this.handleClick}
          type={type}
          disabled={disabled}
        >
          { this.renderButtonContent() }
        </button>
        {error && (
          <div className={errorClassNames.join(' ')}>{error}</div>
        )}
      </div>
    )
  }
}
