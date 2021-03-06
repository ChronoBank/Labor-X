import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { reduxForm, Field } from "redux-form"
import TextField from 'redux-form-material-ui-next/lib/TextField'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DeleteSvgIcon from '@material-ui/icons/Delete'
import InsertDriveFileSvgIcon from '@material-ui/icons/InsertDriveFile'
import LocationCitySvgIcon from '@material-ui/icons/LocationCity'
import DatePickerField from 'src/components/DatePickerField'
import ProfileModel, { VALIDATION_STATE, VALIDATION_STATE_TITLE } from "../../../api/backend/model/ProfileModel"
import AttachmentModel from "../../../api/backend/model/AttachmentModel"
import { VALIDATION_STATE_CLASS, VALIDATION_STATE_ICON } from "./index"
import { Icon } from "../../../components/common/index"
import css from './index.scss'
import {
  FORM_PASSPORT as FORM,
  submitPassport as submit,
  createPassportAttachment as createAttachment,
  getPassportAttachments as getAttachments,
  getPassportInitialValues as getInitialValues,
  resetPassport as reset,
} from './../../../store/general-profile'

const setupText = 'Upload requested documents which can support that the entered information is valid. Note that changing and saving information will require validation re-submit.'
const finalText = 'Great Job! You have successfully passed validation. Note that changing and saving information will require validation re-submit.'

const getSubmitValues = ({ passport, expirationDate, attachments }) => ({
  passport,
  expirationDate: expirationDate.toISOString(),
  attachments,
})

class PassportForm extends React.Component {

  static propTypes = {
    dirty: PropTypes.bool,
    validationComment: PropTypes.bool,
    handleSubmit: PropTypes.func,
    _reset: PropTypes.func,
    createAttachment: PropTypes.func,
    validationState: PropTypes.string,
    attachments: PropTypes.arrayOf(AttachmentModel),
  }

  handleResetClick = () => {
    // eslint-disable-next-line
    this.props._reset()
  }

  handleCreateAttachmentChange = (e) => {
    const file = e.currentTarget.files[0]
    if (file) {
      this.props.createAttachment(file)
      e.currentTarget.value = ''
    }
  }

  renderTitle () {
    return this.props.dirty ? VALIDATION_STATE_TITLE.INITIAL : VALIDATION_STATE_TITLE[this.props.validationState]
  }

  renderText () {
    return this.props.validationState === VALIDATION_STATE.SUCCESS && !this.props.dirty ? finalText : setupText
  }

  renderAttachment = (attachment) => {
    return (
      <ListItem key={attachment.id}>
        <ListItemIcon>
          <InsertDriveFileSvgIcon />
        </ListItemIcon>
        <ListItemText primary={attachment.name} />
        <ListItemSecondaryAction>
          <IconButton>
            <DeleteSvgIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  renderAttachments () {
    return (
      <List>
        { this.props.attachments.map(x => this.renderAttachment(x)) }
      </List>
    )
  }

  render () {
    return (
      <form className={css.card} onSubmit={this.props.handleSubmit}>
        <Field name='attachments' component='input' type='hidden' />
        <div className={css.cardWrapper}>
          <div>
            <div className={css.blockCircle}>
              <LocationCitySvgIcon />
            </div>
          </div>
          <div>
            <h3 className={css.cardTitle}>Identity Card</h3>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Field component={TextField} name='passport' label='Passport ID' className={css.field} />
              </Grid>
              <Grid item xs={6}>
                <Field component={DatePickerField} name='expirationDate' label='Expiration Date' className={css.field} />
              </Grid>
            </Grid>
            <div className={css.validationComment}>{ this.props.validationComment }</div>
          </div>
        </div>
        <ExpansionPanel style={{ width:'100%' }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <span className={classnames([css.cardActionTitle, VALIDATION_STATE_CLASS[this.props.validationState]])}>
              <Icon className={classnames([css.icon, VALIDATION_STATE_CLASS[this.props.validationState]])} {...VALIDATION_STATE_ICON[this.props.validationState]} />
              { this.renderTitle() }
            </span>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              { this.renderText() }
              <br />
              <br />
              { this.renderAttachments() }
              <br />
              <Button variant='contained' type='submit' style={{ marginRight: '1rem' }} >save & validate</Button>
              <Button variant='contained' type='button' style={{ marginRight: '1rem' }} onClick={this.handleResetClick} >reset</Button>
              <label htmlFor='passport-form-attachment-file-input'>
                <Button variant='contained' component='span'>upload documents</Button>
              </label>
              <input type='file' style={{ display:'none' }} onChange={this.handleCreateAttachmentChange} id='passport-form-attachment-file-input' />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </form>
    )
  }

}

PassportForm = reduxForm({ form: FORM })(PassportForm)

const mapStateToProps = (state, { profile }) => ({
  initialValues: getInitialValues(profile),
  attachments: [ ...((profile.submitted || profile.approved || {}).attachments || []), ...getAttachments(state) ],
  validationState: ProfileModel.getValidationState(profile),
  validationComment: ProfileModel.getValidationComment(profile),
})

const mapDispatchToProps = dispatch => ({
  onSubmit: (values) => dispatch(submit(getSubmitValues(values))),
  createAttachment: (file) => dispatch(createAttachment(file)),
  _reset: () => dispatch(reset()),
})

PassportForm = connect(mapStateToProps, mapDispatchToProps)(PassportForm)

export default PassportForm

