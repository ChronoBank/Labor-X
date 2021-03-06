import PropTypes from 'prop-types'
import React from 'react'
import cn from 'classnames'
import css from './Icon.scss'

export default class Icon extends React.PureComponent {
  static defaultTypes = {
    icon: '',
    size: 14,
  }

  static ICONS = {
    SECURITY: 'security',
    SECURITY_CHECK: 'security-check',
    SECURITY_SHIELD: 'security-shield',
    SECURITY_NONE: 'security-none',
    FILTER: 'filter',
    SECURITY_UPGRADE: 'security-upgrade',
    MESSAGE_WARNING: 'message-warning',
    DROP_1: 'drop-1',
    PHONE_EMAIL: 'phone-email',
    UPLOAD: 'upload',
    HOME: 'home',
    FILE: 'file',
    DELETE: 'delete',
    MESSAGE: 'message',
    CLOSE: 'close',
    CHECK: 'check',
    CHECK_CIRCLE: 'check-circle',
    CANCEL: 'cancel',
    STAR: 'star',
    RATING: 'rating',
    MORE: 'more',
    ADD_CIRCLE: 'add-circle',
    ADD: 'add',
    HELP: 'help',
    HELP_OUTLINE: 'help-outline',
    BACK: 'back',
    EDIT: 'edit',
    PROFILE: 'profile',
    NOTIFICATIONS: 'notifications',
    LHT_BOLD: 'lht-bold',
    LHT_LIGHT: 'lht-light',
    LHT_MEDIUM_1: 'lht-medium-1',
    LHT_MEDIUM_2: 'lht-medium-2',
    EMAIL: 'e-mail',
    COMPANY: 'company',
    SEARCH: 'search',
  }

  static COLORS = {
    BLACK: 'black',
    WHITE: 'white',
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green',
    GOLD: 'gold',
    GREY: 'grey',
    GREY30: 'grey30',
    GREY50: 'grey50',

    ERROR: 'error',
    WARN: 'warn',
  }

  static SETS = {
    SECURITY: {
      icon: Icon.ICONS.SECURITY,
      color: Icon.COLORS.GREEN,
    },
    SECURITY_CHECK: {
      icon: Icon.ICONS.SECURITY_CHECK,
      color: Icon.COLORS.GREEN,
    },
    SECURITY_SHIELD: {
      icon: Icon.ICONS.SECURITY_SHIELD,
      color: Icon.COLORS.RED,
    },
    SECURITY_NONE: {
      icon: Icon.ICONS.SECURITY_NONE,
      color: Icon.COLORS.RED,
    },
    CHECK: {
      icon: Icon.ICONS.CHECK,
      color: Icon.COLORS.WHITE,
    },
    STAR: {
      icon: Icon.ICONS.STAR,
      color: Icon.COLORS.GOLD,
    },
    HELP: {
      icon: Icon.ICONS.HELP,
      color: Icon.COLORS.BLUE,
    },
    HELP_OUTLINE: {
      icon: Icon.ICONS.HELP_OUTLINE,
      color: Icon.COLORS.BLUE,
    },
    HELP_INVERT: {
      icon: Icon.ICONS.HELP_OUTLINE,
      color: Icon.COLORS.WHITE,
    },
    BACK_WHITE: {
      icon: Icon.ICONS.BACK,
      color: Icon.COLORS.WHITE,
    },
    MESSAGE_WARNING: {
      icon: Icon.ICONS.MESSAGE_WARNING,
      color: Icon.COLORS.RED,
    },
    NOTIFICATIONS_ON: {
      icon: Icon.ICONS.NOTIFICATIONS,
      color: Icon.COLORS.BLUE,
    },
    NOTIFICATIONS_OFF: {
      icon: Icon.ICONS.NOTIFICATIONS,
      color: Icon.COLORS.GREY,
    },
    EMAIL_ON: {
      icon: Icon.ICONS.EMAIL,
      color: Icon.COLORS.BLUE,
    },
    EMAIL_OFF: {
      icon: Icon.ICONS.EMAIL,
      color: Icon.COLORS.GREY,
    },
  }

  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    icon: PropTypes.string,
    title: PropTypes.string,
    color: PropTypes.string,
    faded: PropTypes.bool,
    href: PropTypes.string,
    size: PropTypes.number,
  }

  render () {
    const { className, color, faded, icon, size, onClick } = this.props
    return (
      <i
        onClick={onClick}
        onKeyPress={onClick}
        tabIndex={0}
        role='button'
        style={size ? { fontSize: size } : null}
        className={cn([
          css.root,
          className,
          faded && css.faded,
          icon && css[`icon-${icon}`],
          color && css[color],
          onClick && css.clickable,
        ])}
      />
    )
  }
}
