import React from 'react'
import { connect } from 'react-redux'
import Head from 'next/head'

import { LoginActions } from 'src/components/layouts'
import { LoginOptions } from 'src/components/Login'
import Account404Dialog from 'src/content/lib/LoginContent/Account404Dialog'

import css from './index.scss'

class LoginPage extends React.Component {
  render () {
    return (
      <div className={css.root}>
        <Head>
          <title>LaborX</title>
          <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
          <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width' />
        </Head>
        <LoginActions contentClassName={css.contentGradient}>
          <LoginOptions />
        </LoginActions>
        <Account404Dialog />
      </div>
    )
  }
}

export default connect()(LoginPage)
