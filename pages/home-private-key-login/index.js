import React from 'react'
import { connect } from 'react-redux'
import Redirect from 'react-router-dom/Redirect'

import HomePrivateKeyLoginContent from "src/content/lib/HomePrivateKeyLoginContent/HomePrivateKeyLoginContent";
import { currentAddressSelector } from "src/store/wallet/selectors";

export class HomePrivateKeyLoginPage extends React.Component {

  render () {
    return this.props.user ? <Redirect to='/dashboard' /> : <HomePrivateKeyLoginContent />
  }

}

const mapStateToProps = (state) => ({
  user: currentAddressSelector()(state),
})

export default connect(mapStateToProps)(HomePrivateKeyLoginPage)

