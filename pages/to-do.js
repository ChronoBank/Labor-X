import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { TodoContent } from 'src/content'
import { MainLayout } from 'src/components/layouts'
import { todoJobsSelector, resumeJobWork, pauseJobWork } from "src/store"
import { schemaFactory as jobSchemaFactory } from "src/models/app/JobModel"

const TODO = {
  feedbackCards: [
    {
      title: 'Move Stuff from A to B and C and D',
      jobName: 'Get Started Client',
      jobIcon: '/static/temp/get-started.png',
      recruiterName: 'Anna German Recruiter',
      recruiterIcon: '/static/temp/worker-3.jpg',
    },
  ],
}

class ToDoPage extends React.Component {
  static propTypes = {
    todoJobs: PropTypes.arrayOf(jobSchemaFactory()),
    resumeJobWork: PropTypes.func,
    pauseJobWork: PropTypes.func,
  }

  render () {
    const { resumeJobWork, pauseJobWork } = this.props

    return (
      <MainLayout jobName='nav.toDo'>
        <TodoContent {...TODO} resumeJobWork={resumeJobWork} pauseJobWork={pauseJobWork} todoJobs={this.props.todoJobs} />
      </MainLayout>
    )
  }
}

const mapStateToProps = state => ({
  todoJobs: todoJobsSelector()(state),
})

const mapDispatchToProps = dispatch => {

  return {
    resumeJobWork: (jobId: Number) => {
      dispatch(resumeJobWork(jobId))
    },
    pauseJobWork: (jobId: Number) => {
      dispatch(pauseJobWork(jobId))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToDoPage)

