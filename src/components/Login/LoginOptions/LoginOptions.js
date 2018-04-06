import { Translate } from 'components/common'
import { MnemonicForm, PrivateKeyForm, WalletFileForm, SelectOption } from 'components/Login'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { signIn } from 'store/login/actions'
import css from './LoginOptions.scss'

function mapDispatchToProps (dispatch) {
  return {
    signIn: (signInModel) => dispatch(signIn(signInModel)),
  }
}

class LoginOptions extends React.Component {
  static propTypes = {
    signIn: PropTypes.func,
  }

  constructor () {
    super(...arguments)
    this.state = {
      step: SelectOption.STEP,
    }
  }

  handleChangeStep = (step) => this.setState({ step: step || SelectOption.STEP })

  handleSubmitSuccess = (signInModel) => this.props.signIn(signInModel)

  handleBackClick = () => this.handleChangeStep(null)

  render () {
    let component

    switch (this.state.step) {
      case MnemonicForm.STEP:
        component = (
          <MnemonicForm
            onChangeStep={this.handleChangeStep}
            onSubmitSuccess={this.handleSubmitSuccess}
          />
        )
        break
      case WalletFileForm.STEP:
        component = (
          <WalletFileForm
            onChangeStep={this.handleChangeStep}
            onSubmitSuccess={this.handleSubmitSuccess}
          />
        )
        break
      case PrivateKeyForm.STEP:
        component = (
          <PrivateKeyForm
            onChangeStep={this.handleChangeStep}
            onSubmitSuccess={this.handleSubmitSuccess}
          />
        )
        break
      default:
        component = (
          <SelectOption
            onChangeStep={this.handleChangeStep}
          />
        )
    }

    return (
      <div className={css.root}>
        <div className={css.content}>
          {component}
          {this.state.step !== SelectOption.STEP && (
            <div
              className={css.back}
              onClick={this.handleBackClick}
            >
              <Translate value='term.or' />
              <Translate className={css.link} value={`${this.constructor.name}.useDifferentLogInMethod`} />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(LoginOptions)
