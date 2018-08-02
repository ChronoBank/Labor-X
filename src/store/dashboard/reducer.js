import PropTypes from 'prop-types'
import ProfileModel from 'src/api/backend/model/ProfileModel'
import ProfileClientModel from 'src/api/backend/model/ProfileClientModel'
import ProfileWorkerModel from 'src/api/backend/model/ProfileWorkerModel'
import ProfileRecruiterModel from 'src/api/backend/model/ProfileRecruiterModel'
import {
  GET_PAGE_DATA_REQUEST,
  GET_PAGE_DATA_SUCCESS,
  GET_PAGE_DATA_FAILURE,

  GET_WORKER_TODO_JOBS_SUCCESS,
  GET_CLIENT_TODO_JOBS_SUCCESS,
} from "./actions"

export const TYPES = {
  pageDataLoading: PropTypes.bool,
  pageDataFailure: PropTypes.instanceOf(Error),
  workerTodoJobsLoading: PropTypes.bool,
  workerTodoJobsFailure: PropTypes.instanceOf(Error),
  pageData: PropTypes.shape({
    profile:  PropTypes.shape({
      profile: PropTypes.instanceOf(ProfileModel),
      client: PropTypes.instanceOf(ProfileClientModel),
      worker: PropTypes.instanceOf(ProfileWorkerModel),
      recruiter: PropTypes.instanceOf(ProfileRecruiterModel),
    }),
    workerTodoJobs: [],
    clientTodoJobs: [],
  }),
}

export const STATE = {
  pageData: null,
  pageDataLoading: true,
  pageDataFailure: null,
  workerTodoJobsLoading: true,
  workerTodoJobsFailure: null,
}

export default (state = STATE, { type, payload }) => {
  switch (type) {
    case GET_PAGE_DATA_REQUEST: return ({
      ...state,
      pageDataLoading: true,
    })
    case GET_PAGE_DATA_SUCCESS: return ({
      ...state,
      pageDataLoading: false,
      pageData: {
        ...state.pageData,
        ...payload,
      },
    })
    case GET_PAGE_DATA_FAILURE: return ({
      ...state,
      pageDataLoading: false,
      pageDataFailure: payload,
    })

    case GET_WORKER_TODO_JOBS_SUCCESS: return ({
      ...state,
      workerTodoJobsLoading: false,
      pageData: {
        ...state.pageData,
        workerTodoJobs: payload,
      },
    })

    case GET_CLIENT_TODO_JOBS_SUCCESS: return ({
      ...state,
      clientTodoJobsLoading: false,
      pageData: {
        ...state.pageData,
        clientTodoJobs: payload,
      },
    })

    default: return ({
      ...state,
    })
  }
}
