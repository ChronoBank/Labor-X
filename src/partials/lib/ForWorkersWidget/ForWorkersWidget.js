import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import { Widget } from 'src/components/common'
import {
  getWorkerTodoJobs,
  workerTodoJobsSelector,
} from 'src/store/dashboard'
import { SignerModel, JobModel } from 'src/models'
import css from './ForWorkersWidget.scss'

export class ForWorkersWidget extends React.Component {
  static propTypes = {
    signer: PropTypes.instanceOf(SignerModel).isRequired,
    getWorkerTodoJobs: PropTypes.func.isRequired,
    earliestDateJobs: PropTypes.arrayOf(PropTypes.instanceOf(JobModel)),
    earliestDate:  PropTypes.string,
  }

  componentDidMount () {
    this.props.getWorkerTodoJobs()
  }

  render () {
    const { earliestDateJobs, earliestDate, signer } = this.props
    return signer && (
      <div className={css.main}>
        <div className={css.row}>
          <Widget
            title='ui.dashboard.worker.startYourJobSearch'
            subtitle='ui.dashboard.worker.worker'
            actions={[
              {
                href: '/general-job-board',
                label: 'Visit general job board',
                isLink: true,
              },
              {
                href: '/job-boards',
                label: 'Browse job boards',
                isLink: true,
              },
            ]}
          >
            You may visit our General Job Board and start your search or
            browse Job Boards created by other network users.
          </Widget>
          <Widget
            href='/opportunities'
            title='ui.dashboard.worker.opportunities'
            subtitle='ui.dashboard.worker.worker'
            actions={[
              {
                href: '/opportunities',
                label: 'Opportunities',
                counter: { value: 135 },
                isLink: true,
              },
              {
                label: 'Offers',
                counter: { value: 3 },
                isLink: true,
              },
              {
                label: 'Applications',
                isLink: true,
              },
            ]}
          />
        </div>
        { earliestDateJobs.length > 0 ? (
          <div className={css.row}>
            <Widget
              title='ui.dashboard.worker.toDo'
              titlePlaceholder={earliestDate}
              subtitle='ui.dashboard.worker.worker'
              actions={
                earliestDateJobs.map(job => ({
                  label: job.ipfs.name,
                  date: moment(job.ipfs.period.since).format('h:mm A'),
                  isLink: true,
                }))
              }
            />
          </div>
        ) : null }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const workerTodoJobs = workerTodoJobsSelector(state)
  let earliestDate = null
  let earliestDateJobs = []
  if (workerTodoJobs) {
    workerTodoJobs.forEach(job => {
      const date = job.ipfs.period.since
      if (moment(date).isSame(earliestDate, 'day')) {
        earliestDateJobs = earliestDateJobs.concat(job)
      } else if (moment().diff(date, 'days') < 0 && (moment(date).isBefore(earliestDate, 'day') || earliestDate === null)) {
        earliestDate = date
        earliestDateJobs = [job]
      }
    })
  }
  return {
    earliestDateJobs,
    earliestDate: earliestDate === null ? null : moment(earliestDate).format('D MMM YYYY'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  getWorkerTodoJobs: () => dispatch(getWorkerTodoJobs(ownProps.signer.address)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForWorkersWidget)
