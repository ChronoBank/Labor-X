import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { WorkerStateModel, WORKER_STATE_AVALIABLE, WORKER_STATE_BUSY } from 'src/models'
import css from './WorkerState.scss'

export default class WorkerState extends React.Component {
  static propTypes = {
    state: PropTypes.instanceOf(WorkerStateModel),
    className: PropTypes.string,
  }

  render () {
    const { state, className } = this.props
    return (
      <div
        className={cn(css.root, className, {
          [css.busy]: state === WORKER_STATE_BUSY,
          [css.avaliable]: state === WORKER_STATE_AVALIABLE,
        })}
      >
        { state.name }
      </div>
    )
  }
}
