import React from 'react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import withRedux from 'next-redux-wrapper'
import Head from 'next/head'

import { LoginActions } from 'components/layouts'
import { LoginOptions } from 'components/Login'
import initialStore  from 'store'
import { bootstrap } from 'store/bootstrap'
import 'styles/globals/globals.scss'
import ethereumService from 'src/services/EthereumService'
import css from './index.scss'

// TODO @ipavlenko: Customize and move out
const theme = createMuiTheme({})

class Index extends React.Component {
  static getInitialProps ({ store }) {
    store.dispatch(bootstrap())
  }

  componentWillMount () {
    ethereumService.start()
  }

  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <div className={css.root}>
          <Head>
            <title>LaborX</title>
            <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
            <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width' />
          </Head>
          <LoginActions contentClassName={css.contentGradient}>
            <LoginOptions />
          </LoginActions>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default withRedux(initialStore, null)(Index)
