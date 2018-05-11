import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import bip39 from 'bip39'

import { Button, Input } from 'components/common'
import SignInModel from 'models/SignInModel'
import ethereumService from 'services/EthereumService'
import { LoginSteps } from 'store'
import validate from './validate'

import css from './MnemonicForm.scss'

const FORM_MNEMONIC = 'form/mnemonic'

const onSubmit = ({ mnemonic }) => {
  const address = ethereumService.createAddressFromMnemonic(mnemonic)

  return new SignInModel({
    isHD: true,
    address: address,
    method: SignInModel.METHODS.MNEMONIC,
    key: mnemonic,
  })
}

class MnemonicForm extends React.Component {
  static propTypes = {
    onChangeStep: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)
    console.log('test mnemonic: ', bip39.generateMnemonic())
  }

  render () {
    const { handleSubmit, error, pristine, invalid, onChangeStep } = this.props

    return (
      <form className={css.root} name={FORM_MNEMONIC} onSubmit={handleSubmit}>
        <h3 className={css.header}>Mnemonic form</h3>
        <Field
          className={css.row}
          component={Input}
          name='mnemonic'
          placeholder='Enter mnemonic'
          label='Enter mnemonic'
          autoComplete={false}
          mods={css.mnemonicField}
          materialInput={true}
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
        <div className={css.otherActions}>
          or
          <button className={css.backButton} onClick={() => onChangeStep(LoginSteps.SelectLoginMethod)}>back</button>
        </div>
      </form>
    )
  }
}

export default reduxForm({ form: FORM_MNEMONIC, validate, onSubmit })(MnemonicForm)
