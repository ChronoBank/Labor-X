import React from 'react'
import PropTypes from 'prop-types'
import uniqid from 'uniqid'
import { Field } from 'redux-form'
import TextField from 'redux-form-material-ui/lib/TextField'
import Select from 'redux-form-material-ui/lib/Select'
import { MenuItem } from 'material-ui'
import Collapsible from 'react-collapsible'
import { ValidatedCheckbox, Link, Icon, Button } from 'src/components/common'
import { ProfileModel, CLIENT_TYPES_LIST, CLIENT_TYPES, ClientTypeModel } from 'src/models'
import css from './GeneralTab.scss'
import DatePickerField from "../../../../components/DatePickerField"

export default class GeneralTab extends React.Component {
  static propTypes = {
    generalProfile: PropTypes.instanceOf(ProfileModel),
    clientType: PropTypes.instanceOf(ClientTypeModel),
  }

  handleClickValidate = () => {
    // eslint-disable-next-line no-console
    console.log('---ClientProfileContent-GeneralTab handleClickValidate')
  }

  handleClickLogo = () => {
    // eslint-disable-next-line no-console
    console.log('---ClientProfileContent-GeneralTab handleClickLogo')
  }

  renderUpgardeTitle () {
    return (
      <div className={css.upgradeTitle}>
        <Icon
          icon={Icon.ICONS.SECURITY_UPGRADE}
          color={Icon.COLORS.RED}
          size={36}
        />
        <h3>Upgrade</h3>
      </div>
    )
  }

  renderOrganisationInfo () {
    return (
      <div className={css.block}>
        <h3>Organisation Info</h3>
        <div className={css.twoColumn}>
          <Field
            fullWidth
            component={TextField}
            name='name'
            label='Name'
          />
          <Field
            label='Registered In'
            openToYearSelection
            name='registered'
            component={DatePickerField}
          />
        </div>
        <div className={css.twoColumn}>
          <Field
            fullWidth
            component={TextField}
            name='website'
            label='Website'
          />
          <Field
            fullWidth
            component={TextField}
            name='email'
            label='Contact Email'
          />
        </div>
        <Field
          fullWidth
          component={TextField}
          name='description'
          label='Description'
          helperText='Write a few words about your organisation'
          multiLine
          rows={2}
        />
      </div>
    )
  }

  renderInfo () {
    return (
      <div className={css.block}>
        <h3>Info</h3>
        <div className={css.twoColumn}>
          <Field
            openToYearSelection
            name='registered'
            component={DatePickerField}
            label='Registered In'
          />
          <Field
            fullWidth
            component={TextField}
            name='website'
            label='Website'
          />
        </div>
        <Field
          fullWidth
          component={TextField}
          name='description'
          helperText='Write a few words about yourself'
          label='Description'
          multiLine
          rows={2}
        />
      </div>
    )
  }

  render () {
    const { generalProfile, clientType } = this.props
    return (
      <div className={css.content}>
        <div className={css.logoContainer} onClick={this.handleClickLogo}>
          <div className={css.logo}>
            <img src={generalProfile.ipfs.logo} alt='Logo' />
            <div className={css.overlay}>
              <Icon
                icon={Icon.ICONS.UPLOAD}
                color={Icon.COLORS.WHITE}
                size={24}
              />
              <p>UPLOAD PHOTO</p>
            </div>
          </div>
        </div>
        <div className={css.block}>
          <h3>Organisation Type</h3>
          <div className={css.twoColumn}>
            <Field
              displayEmpty
              // fullWidth
              component={Select}
              name='clientType'
              // hintText='Organisation Type'
            >
              <MenuItem key={uniqid()} value='' disabled>Organisation Type</MenuItem>
              {CLIENT_TYPES_LIST.map(type => (
                <MenuItem key={uniqid()} value={type}>{type.label}</MenuItem>
              ))}
            </Field>
            <div />
          </div>
        </div>
        { clientType === CLIENT_TYPES.ENTREPRENEUR ? this.renderInfo() : null }
        { clientType === CLIENT_TYPES.ORGANISATION ? this.renderOrganisationInfo() : null }
        <div className={css.block}>
          <h3>Currency</h3>
          <p>Selected currencies will be used for transactions. Need an advice? <Link className={css.link} href='/recommendations'>View our Recommendations</Link></p>
          <Field
            component={ValidatedCheckbox}
            name='currencyLhus'
            label='LHUS'
          />
          <Field
            component={ValidatedCheckbox}
            name='currencyBitcoin'
            label='Bitcoin'
          />
          <Field
            component={ValidatedCheckbox}
            name='currencyAnother'
            label='Another Currency'
          />
        </div>
        <Collapsible classParentString={css.upgradeBlock} trigger={this.renderUpgardeTitle()} >
          <div className={css.description}>
            <p>Upload any documents which can prove that the entered information is valid. Note that changing and saving information will require validation re-submit.</p>
          </div>
          <div className={css.documents}>
            <div className={css.documentEntry}>
              <Icon
                icon={Icon.ICONS.FILE}
                color={Icon.COLORS.BLACK}
                size={28}
              />
              <p>Licence.pdf</p>
              <Icon
                icon={Icon.ICONS.DELETE}
                color={Icon.COLORS.GREY30}
                size={28}
              />
            </div>
            <div className={css.documentEntry}>
              <Icon
                icon={Icon.ICONS.UPLOAD}
                color={Icon.COLORS.BLUE}
                size={28}
              />
              <p>Tax Certificate</p>
            </div>
            <div className={css.documentEntry}>
              <Icon
                icon={Icon.ICONS.UPLOAD}
                color={Icon.COLORS.BLUE}
                size={28}
              />
              <p>Other Documents</p>
            </div>
          </div>
          <Button
            className={css.validateButton}
            primary
            color={Button.COLORS.PRIMARY}
            label='Validate'
            onClick={this.handleClickValidate}
          />
        </Collapsible>
      </div>
    )
  }
}
