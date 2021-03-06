import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { JobModel } from 'src/models'
import { Translate, CompletedJobCard } from 'components/common'
import { monthWorkerEraningSelector, totalWorkerEraningSelector, countFinishedJobsByWorkerSelector, finishedJobsByWorkerSelector, finalizedJobsByWorkerSelector, pendingFinishJobsByWorkerSelector } from 'src/store/completedJobs'
import css from './CompletedJobs.scss'

const courseUsdLht = 18

class CompletedJobs extends React.Component {
  static propTypes = {
    finishedCount: PropTypes.number,
    finishedJobs: PropTypes.arrayOf(PropTypes.instanceOf(JobModel)),
    finalizedJobs: PropTypes.arrayOf(PropTypes.instanceOf(JobModel)),
    pendingFinishJobs: PropTypes.arrayOf(PropTypes.instanceOf(JobModel)),
    totalEarn: PropTypes.number,
    monthEarn: PropTypes.number,
  }
  render () {
    const { finishedCount, finishedJobs, finalizedJobs, pendingFinishJobs, totalEarn, monthEarn } = this.props
    return (
      <div className={css.main}>
        <div className={css.title}>
          <div className={css.titleText}><Translate value='nav.completedJobs' /></div>
          <div className={css.completedJobsStatsBlock}>

            <div className={css.blockCounterCompleted}>
              <div className={css.blockCounterCompletedCount}>
                {finishedCount}
              </div>
              <div className={css.blockCounterCompletedText}>
                Completed
              </div>
            </div>

            <div className={css.blockTotalEarned}>
              <div className={css.blockTotalEarnedLx}>
                <span className={css.lxIcon}>lh-light</span>
                <span className={css.earnedTotalLx}>{totalEarn}</span>
              </div>
              <div className={css.blockTotalEarnedUsd}>
                Earned Total (${courseUsdLht * totalEarn})
              </div>
            </div>

            <div className={css.blockMonthEarned}>
              <div className={css.blockTotalEarnedLx}>
                <span className={css.lxIcon}>lh-light</span>
                <span className={css.earnedMonthLx}>{monthEarn}</span>
              </div>
              <div className={css.blockTotalEarnedUsd}>
                Earned this month (${courseUsdLht * monthEarn})
              </div>
            </div>

          </div>
        </div>
        <div className={css.content}>
          {
            pendingFinishJobs.length > 0 && (
              <div className={css.invoiceSentTitle}>
                Invoice Sent
              </div>
            )
          }
          {
            pendingFinishJobs.map((job) => <CompletedJobCard key={job.id} job={job} />)
          }

          {
            finishedJobs.length > 0 && (
              <div className={css.completedTitle}>
                Completed
              </div>
            )
          }
          {
            finishedJobs.map((job) => <CompletedJobCard key={job.id} job={job} />)
          }

          {
            finalizedJobs.length > 0 && (
              <div className={css.finalizedTitle}>
                Finalized
              </div>
            )
          }
          {
            finalizedJobs.map((job) => <CompletedJobCard key={job.id} job={job} />)
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const finishedCount = countFinishedJobsByWorkerSelector(state)
  const finishedJobs = finishedJobsByWorkerSelector(state)
  const finalizedJobs = finalizedJobsByWorkerSelector(state)
  const pendingFinishJobs = pendingFinishJobsByWorkerSelector(state)
  const totalEarn = totalWorkerEraningSelector(state)
  const monthEarn = monthWorkerEraningSelector(state)
  return {
    finishedCount,
    finishedJobs,
    pendingFinishJobs,
    finalizedJobs,
    totalEarn,
    monthEarn,
  }
}

function mapDispatchToProps () {
  return {
    onPostOffer: () => { },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompletedJobs)
