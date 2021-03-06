import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { push } from 'connected-react-router'
import { connect } from "react-redux"
import { Field, reduxForm, propTypes } from 'redux-form'
import { Select, Switch, TextField } from 'redux-form-material-ui-next'
import MenuItem from '@material-ui/core/MenuItem'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Autosuggest from 'react-autosuggest'
import t from "typy"

import { Image, Badge, Translate, NumberInput, Button, ValidatedCheckbox, Chip, Link, Tip } from 'src/components/common'
import { SignerModel, BoardModel, WORKFLOW_FIXED_PRICE, WORKFLOW_TM, SKILLS_LIST, SkillModel } from 'src/models'
import DatePickerField from 'src/components/DatePickerField'

import css from './CreateJobForm.scss'
import validate from './validate'

export const FORM_CREATE_JOB = 'form/createJob'

class CreateJobForm extends React.Component {
  static propTypes = {
    ...propTypes,
    signer: PropTypes.instanceOf(SignerModel).isRequired,
    isLoading: PropTypes.bool,
    hasBudget: PropTypes.bool,
    hasPeriod: PropTypes.bool,
    hasAddress: PropTypes.bool,
    allowCustomOffers: PropTypes.bool,
    startWorkAllowance: PropTypes.bool,
    flowType: PropTypes.number,
    boards: PropTypes.arrayOf(
      PropTypes.instanceOf(BoardModel)
    ),
    selectedBoard: PropTypes.instanceOf(BoardModel),
    push: PropTypes.func,
  }

  state = {
    tagSuggestions: [],
    tagValue: '',
    tags: [],
    hourlyRatingValue: 1,
  }

  // handleChangeJobBoard = (event, index, value) => this.setState({ jobBoardValue: value })
  handleChangeHourlyRating = (event, index, value) => this.setState({ hourlyRatingValue: value })
  // handleChangeState = (event, index, value) => this.setState({ stateValue: value })

  handleBack = () => {
    this.props.push('/job-types')
  }

  handleChangeBoard = () => {
    this.setState({ tags: [] })
  }

  handleSubmitForm = (values) => {
    this.props.onSubmit({
      ...values,
      selectedSkills: this.state.tags,
      categories: this.props.selectedBoard.tagsCategory,
      areas: Array.isArray(this.props.selectedBoard.tagsArea) ? this.props.selectedBoard.tagsArea : [this.props.selectedBoard.tagsArea],
    })
  }

  getTagsList () {
    return SKILLS_LIST
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    const tagsWithoutSelected = this.getTagsList().filter(tag => !this.state.tags.find(t => t.index === tag.index))

    return inputLength === 0 ? [] : tagsWithoutSelected.filter(tag =>
      tag.name.toLowerCase().indexOf(inputValue) !== -1
    )
  }

  getSuggestionValue = suggestion => {
    const { change } = this.props
    if (suggestion instanceof SkillModel && !this.state.tags.find(item => item.index === suggestion.index)) {

      const newTags = [...this.state.tags, suggestion]

      this.setState({ tags: newTags }, () => {
        change('tags', newTags)
      })
    }
    return ''
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      tagSuggestions: this.getSuggestions(value),
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      tagSuggestions: [],
    })
  }

  onSuggestionChange = (event, { newValue }) => {
    this.setState({
      tagValue: newValue,
    })
  }

  onRemoveTag (tag) {
    const { tags } = this.state
    const { change } = this.props

    const newTags = tags.filter(item => item.index !== tag.index)

    this.setState({ tags: newTags })

    change('tags', newTags)
  }

  renderSuggestion = suggestion => <div>{suggestion.name}</div>

  renderBudgetBlock = (hasBudget) => {
    if (!hasBudget) return null
    return (
      <div>
        <Field
          displayEmpty
          component={Select}
          name='flowType'
        >
          <MenuItem value='' disabled><Translate value='ui.createJob.flowType' /></MenuItem>
          <MenuItem value={1}>Hourly Based</MenuItem>
          <MenuItem value={2}>Fixed price</MenuItem>
        </Field>
        {this.props.flowType ? this.renderBudgetWidget() : null}
      </div>
    )
  }

  renderAddressBlock = (hasAddress) => {
    if (!hasAddress) return null
    return (
      <div>
        <FormControlLabel
          control={<Field color='primary' component={ValidatedCheckbox} name='companyAddress' />}
          label={<Translate value='ui.createJob.companyAddressLabel' />}
        />
        <div className={css.twoColumn}>
          <div className={css.addressColumn}>
            <Field
              className={css.inputSection}
              component={TextField}
              name='state'
              label='State'
            />
            <Field
              className={css.inputSection}
              component={TextField}
              name='zip'
              label='ZIP'
            />
            <Field
              className={css.inputSection}
              component={TextField}
              name='street'
              label='Street'
            />
          </div>
          <div className={css.addressColumn}>
            <Field
              className={css.inputSection}
              component={TextField}
              name='city'
              label='City'
            />
            <div className={css.twoColumn}>
              <Field
                className={css.inputSection}
                component={TextField}
                name='building'
                label='Building #'
              />
              <Field
                className={css.inputSection}
                component={TextField}
                name='suit'
                label='Suit'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderDeadlineBlock = (hasPeriod) => {
    if (!hasPeriod) return null
    return (
      <div className={css.twoColumn}>
        <div>
          <Field
            name='since'
            component={DatePickerField}
            label='Starts at'
          />
          <img className={css.calendar} src='/static/temp/calendar.png' alt='calendar' />
        </div>
        <div>
          <Field
            name='until'
            component={DatePickerField}
            label='Deadline'
          />
          <img className={css.calendar} src='/static/temp/calendar.png' alt='calendar' />
        </div>
      </div>
    )
  }

  renderBudgetWidgetTM = () => (
    <div className={css.budgetWidget}>
      <Field
        className={css.numberInput}
        component={NumberInput}
        name='hourlyRate'
        title='ui.createJob.hourlyRate'
        subtitle='USD 60.00'
        max={1000}
        min={0}
      />
      <Field
        className={css.numberInput}
        component={NumberInput}
        name='totalHours'
        title='ui.createJob.totalHours'
        subtitle={<span>USD 2,400.00<br />LHUS 80.00</span>}
        max={1000}
        min={0}
      />
    </div>
  )

  renderBudgetWidgetFixed = () => (
    <div className={css.budgetWidget}>
      <Field
        className={css.numberInput}
        component={NumberInput}
        name='fixedPrice'
        title='ui.createJob.fixedPrice'
        subtitle={<span>USD 2,400.00<br />LHUS 80.00</span>}
        max={1000}
        min={0}
      />
    </div>
  )

  renderBudgetWidget = () => {
    return (
      <div>
        {
          (() => {
            switch (+this.props.flowType) {
              case WORKFLOW_TM.index: return (
                this.renderBudgetWidgetTM()
              )
              case WORKFLOW_FIXED_PRICE.index: return (
                this.renderBudgetWidgetFixed()
              )
            }
          })()
        }
        <FormControlLabel
          control={<Field color='primary' component={ValidatedCheckbox} name='budgetApproximate' />}
          label={<Translate value='ui.createJob.budgetApproximateLabel' />}
        />
      </div>
    )
  }

  renderSelectedTagsArea = (board) => {
    if (!board) return null
    const { tagsArea } = board
    return Array.isArray(tagsArea) ?
      tagsArea.map(item => (
        <Chip showRemoveButton={false} value={item.name} key={item.index} />
      ))
      : <Chip showRemoveButton={false} value={tagsArea.name} key={tagsArea.index} />
  }

  renderTagsCategoryLabels = (board) => {
    if (!board) return null
    const { tagsCategory } = board
    return tagsCategory.map(item => (
      <Chip showRemoveButton={false} value={item.name} key={item.index} />
    ))
  }

  renderLoader = (isLoading) => {
    if (!isLoading) { return null }
    else { <CircularProgress className={css.submitProgress} size={24} /> }
  }

  renderJoinRequirementBlock = (props) => {
    const tagsCategory = t(props, "selectedBoard.tagsCategory").safeObject
    const rating = t(props, "selectedBoard.extra.rating").safeObject
    const validationLevel = t(props, "selectedBoard.extra.validationLevel").safeObject
    const endorsingSkills = t(props, "selectedBoard.ipfs.endorsingSkills").safeObject
    const joinRequirementIndex = t(props, "selectedBoard.ipfs.joinRequirement.index").safeObject
    if (joinRequirementIndex === 0) {
      return (
        <Fragment>
          <Tip
            position={Tip.POSITION.LEFT}
            tipContent={tagsCategory.map(item => item.name).join(', ')}
          >
            <Badge value='Only' title='terms.categories' />
          </Tip>
        </Fragment>
      )
    }
    if (joinRequirementIndex === 1) {
      return (
        <Fragment>
          <Badge value={rating + "+"} title='terms.rating' />
          <Badge value={validationLevel ? "" + validationLevel : "Any"} title='terms.validation' />
          <Badge value={endorsingSkills ? "Need" : "Any"} title='terms.endorsement' />
        </Fragment>
      )
    }
    return null
  }

  render () {
    const { isLoading, boards, hasBudget, hasPeriod, hasAddress, selectedBoard } = this.props
    return (
      <div className={css.main}>
        <form
          className={css.content}
          onSubmit={this.props.handleSubmit(this.handleSubmitForm)}
        >

          <div className={css.title}>
            <div className={css.titleBar}>
              <Button
                className={css.cancelButton}
                icon={Image.SETS.ARROW_BACK}
                type={Button.TYPES.SUBMIT}
                mods={Button.MODS.FLAT}
                onClick={this.handleBack}
              />
              <div className={css.titleBarRight}>
                <Button
                  className={css.helpButton}
                  icon={Image.SETS.HELP_INVERT}
                  mods={Button.MODS.FLAT}
                />
                {this.renderLoader(isLoading)}
                <Button
                  className={css.doneButton}
                  label='terms.done'
                  type={Button.TYPES.SUBMIT}
                  mods={Button.MODS.FLAT}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className={css.formContentWrapper}>

            <div className={css.headline}>
              <Field
                className={css.jobHeadline}
                component={TextField}
                placeholder='Enter Job Headline'
                InputProps={{ disableUnderline: true, classes: { root: css.jobHeadlineLabel } }}
                name='name'
              />
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.general' /></h3>
              </div>
              <div>
                <Field
                  className={css.inputSection}
                  component={TextField}
                  name='intro'
                  fullWidth
                  multiline
                  rows='2'
                  label={<Translate value='ui.createJob.intro' />}
                  placeholder='Write a few words about the position'
                />
                <Field
                  className={css.inputSection}
                  component={TextField}
                  name='responsibilities'
                  fullWidth
                  multiline
                  rows='2'
                  label={<Translate value='ui.createJob.responsibilities' />}
                  placeholder='Which responsibilities worker will have?'
                />
                <Field
                  className={css.inputSection}
                  component={TextField}
                  name='requirements'
                  fullWidth
                  multiline
                  rows='2'
                  label={<Translate value='ui.createJob.requirements' />}
                  placeholder='Which requirements should be met by worker?'
                />
                <Field
                  className={css.inputSection}
                  component={TextField}
                  name='conclusion'
                  fullWidth
                  rows='2'
                  label={<Translate value='ui.createJob.conclusion' />}
                  placeholder='Write any additional job related information about the position here'
                />
              </div>
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.jobBoard' /></h3>
              </div>
              <div>
                <div className={css.twoColumn}>
                  <Field
                    displayEmpty
                    component={Select}
                    name='board'
                    onChange={this.handleChangeBoard}
                  >
                    <MenuItem value='' disabled><Translate value='ui.createJob.jobBoard' /></MenuItem>
                    {boards.map(board => (
                      <MenuItem key={board.key} value={board.id}>{board.ipfs.name}</MenuItem>
                    ))}
                  </Field>
                  <div className={css.postFee}>
                    Post Fee (no-refund): LHT 1.00 (USD 30.00)
                  </div>
                </div>
                <div>
                  <div className={css.badgesContainer}>
                    <h4><Translate value='ui.createJob.badgesTitle' />f</h4>
                    <p><Translate value='ui.createJob.badgesSubtitle' /></p>
                    <div className={css.badges}>
                      {this.renderJoinRequirementBlock(this.props)}
                    </div>
                  </div>
                  <div className={css.hourlyRatingColumn}>
                    <Field
                      displayEmpty
                      component={Select}
                      value={this.state.hourlyRatingValue}
                      onChange={this.handleChangeHourlyRating}
                      name='hourlyRating'
                    >
                      <MenuItem value='' disabled>Force Worker Rating</MenuItem>
                      <MenuItem value={1}>Force Worker Rating 1</MenuItem>
                      <MenuItem value={2}>Force Worker Rating 1</MenuItem>
                      <MenuItem value={3}>Force Worker Rating 1</MenuItem>
                    </Field>
                    <div className={css.hourlyRating}>
                      <Translate className={css.hourlyRatingTitle} value='ui.createJob.hourlyRatingTitle' />
                      <img className={css.hourlyRatingGraph} src='/static/temp/avearage_rate.png' alt='avearage_rate' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.budget' /></h3>
                <div>
                  <Field
                    component={Switch}
                    name='hasBudget'
                    color='primary'
                  />
                </div>
              </div>
              <div className={css.description}>
                If you&apos;re not sure about the job budget yet you may set the module OFF.
                You may also select an hourly-based or fixed budget. In addition you may specify if the given budget is approximate.
                You&apos;ll be able to enter the budget before sending an offer to a worker or the offer is declined.
                If you&apos;d like to select a worker service please use <Link href='/hire-worker'>Hire a Worker</Link>.
              </div>
              {this.renderBudgetBlock(hasBudget)}
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.allowCustomOffers' /></h3>
                <div>
                  <Field
                    component={Switch}
                    name='allowCustomOffers'
                    color='primary'
                  />
                </div>
              </div>
              <div className={css.description}>
                If you&apos;d like to receive custom offers from Workers enable this section and
                you&apos;ll be able to review these offers along with all other Job Applicants.
              </div>
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.startWorkAllowance' /></h3>
                <div>
                  <Field
                    component={Switch}
                    name='startWorkAllowance'
                    color='primary'
                  />
                </div>
              </div>
              <div className={css.description}>
                Set this option ON if you&apos;d like to confirm the start of the work. Note that without your confirmation the Worker will not be able to track time.
              </div>
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.deadline' /></h3>
                <div>
                  <Field
                    component={Switch}
                    name='hasPeriod'
                    color='primary'
                  />
                </div>
              </div>
              <div className={css.description}>
                If disabled selected Worker will able to set start and end dates.
                Time the job can be started will be set by the Worker in both cases.
              </div>
              {this.renderDeadlineBlock(hasPeriod)}
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.address' /></h3>
                <div>
                  <Field
                    component={Switch}
                    name='hasAddress'
                    color='primary'
                  />
                </div>
              </div>
              {this.renderAddressBlock(hasAddress)}
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.area' /></h3>
              </div>
              <div className={css.tagsRow}>
                <div className={css.tags}>
                  {this.renderSelectedTagsArea(selectedBoard)}
                </div>
              </div>
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.category' /></h3>
              </div>
              <div className={css.tagsRow}>
                <div className={css.tags}>
                  {this.renderTagsCategoryLabels(selectedBoard)}
                </div>
              </div>
            </div>

            <div className={css.card}>
              <div className={css.cardHeading}>
                <h3><Translate value='ui.createJob.skills' /></h3>
              </div>
              <div className={css.tagsRow}>

                <Autosuggest
                  theme={{
                    input: css.autocompleteInput,
                    suggestionsContainer: css.suggestionsContainer,
                    suggestion: css.autocompleteSuggestion,
                  }}
                  suggestions={this.state.tagSuggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={this.getSuggestionValue}
                  renderSuggestion={this.renderSuggestion}
                  inputProps={{
                    placeholder: 'Find',
                    value: this.state.tagValue,
                    onChange: this.onSuggestionChange,
                  }}
                />
                <div className={css.tags}>
                  {this.state.tags.map(e => (
                    <Chip value={e.name} key={e.index} index={e.index} onRemove={this.handleRemoveSkill} />
                  ))}
                </div>
              </div>
            </div>

            <div className={css.card}>
              <FormControlLabel
                control={<Field color='primary' component={ValidatedCheckbox} name='legal' />}
                label={<Translate value='ui.createJob.legalAgreeLabel' />}
              />
            </div>

          </div>
        </form>
      </div>
    )
  }
}

CreateJobForm =  reduxForm({
  form: FORM_CREATE_JOB,
  validate,
})(CreateJobForm)

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url)),
})

export default connect(null, mapDispatchToProps)(CreateJobForm)
