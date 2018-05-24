import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm , SubmissionError } from 'redux-form'
import { Button, Input, UserRow } from 'components/common'
import { WalletEntryModel } from 'src/models'
import { LoginSteps, validateSelectedWalletPassword } from 'src/store'

import css from './LoginForm.scss'

const FORM_LOGIN = 'form/login'

class LoginForm extends React.Component {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(WalletEntryModel),
    onChangeStep: PropTypes.func,
    walletsList: PropTypes.arrayOf(PropTypes.instanceOf(WalletEntryModel)),
    onClickForgotPassword: PropTypes.func,
  }

  onSubmit ({ password }, dispatch) {
    // TODO @ipavlenko: Reimplement using redux way
    // const { selectedWallet } = this.props
    // let web3 = Web3.getWeb3()
    //
    // try {
    //   web3.eth.accounts.wallet.decrypt(selectedWallet.encrypted, password)
    // } catch (e) {
    //   throw new SubmissionError({ password: 'Password does not match' })
    // }
    if (!dispatch(validateSelectedWalletPassword(password))){
      throw new SubmissionError({ password: 'Password does not match' })
    }
    
    

    return {
      password: password,
    }
  }

  navigateToSelectWallet () {
    const { onChangeStep } = this.props
    onChangeStep(LoginSteps.SelectWallet)
  }

  render () {
    const { handleSubmit, error, pristine, invalid, selectedWallet , walletsList, onClickForgotPassword } = this.props

    return (
      <form className={css.root} name={FORM_LOGIN} onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <div className={css.formHeader}>Log In</div>
        <div className={css.accountWrapper}>
          <UserRow
            title={selectedWallet && selectedWallet.name}
            onClick={this.navigateToSelectWallet.bind(this)}
          />
        </div>
        <Field
          className={css.row}
          component={Input}
          name='password'
          type='password'
          placeholder='Enter Password'
          autoComplete={false}
          mods={css.passwordField}
          errorMods={css.fieldError}
          inputMods={css.passwordFieldInput}
          lineEnabled={false}
          materialInput={false}
        />
        <Button
          className={css.row}
          buttonClassName={css.submitButton}
          type={Button.TYPES.SUBMIT}
          label='Login'
          primary
          disabled={pristine || invalid}
          error={error}
          mods={Button.MODS.INVERT}
        />
        <div>
          <button onClick={onClickForgotPassword} className={css.forgotPasswordLink}>
            Forgot your password?
          </button>
        </div>
      </form>
    )
  }
}

export default reduxForm({ form: FORM_LOGIN })(LoginForm)
