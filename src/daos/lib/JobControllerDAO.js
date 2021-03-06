// @flow
import BigNumber from 'bignumber.js'
import {
  JobPostedEvent,
  JobPausedEvent,
  JobResumedEvent,
  JobConfirmEndWorkEvent,
  JobStartWorkRequestedEvent,
  JobWorkStartedEvent,
} from 'src/models'
import {
  ipfsHashToBytes32,
} from 'src/utils'
import AbstractContractDAO from './AbstractContractDAO'

export default class JobControllerDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  async connect (web3, options) {
    if (this.isConnected) {
      this.disconnect()
    }
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] Connect')
    this.contract = new web3.eth.Contract(this.abi.abi, this.address, options)
    this.history = this.history != null // nil check
      ? new web3.eth.Contract(this.abi.abi, this.history, options)
      : this.contract

    this.jobPostedEmitter = this.history.events.JobPosted({})
      .on('data', this.handleJobPostedData.bind(this))
      .on('error', this.handleError.bind(this))
    this.jobResumeEmitter = this.history.events.WorkResumed({})
      .on('data', this.handleJobResumedData.bind(this))
      .on('error', this.handleError.bind(this))
    this.jobPausedEmitter = this.history.events.WorkPaused({})
      .on('data', this.handleJobPausedData.bind(this))
      .on('error', this.handleError.bind(this))
    this.jobConfirmEndWorkEmitter = this.history.events.WorkFinished({})
      .on('data', this.handleConfirmEndWorkData.bind(this))
      .on('error', this.handleError.bind(this))
    this.jobCanceledEmitter = this.history.events.JobCanceled({})
      .on('data', this.handleCancelJobData.bind(this))
      .on('error', this.handleError.bind(this))
    this.jobErrorCode = this.history.events.ErrorCode({})
      .on('data', this.handleErrorCodeData.bind(this))
      .on('error', this.handleError.bind(this))
    this.jobJobOfferAccepted = this.history.events.JobOfferAccepted({})
      .on('data', this.handleJobOfferAcceptedData.bind(this))
      .on('error', this.handleError.bind(this))
    this.jobJobOfferPosted = this.history.events.JobOfferPosted({})
      .on('data', this.handleJobOfferPostedData.bind(this))
      .on('error', this.handleError.bind(this))

    this.jobStartWorkRequestedEmitter = this.history.events.StartWorkRequested({})
      .on('data', this.handleJobStartWorkRequestedData.bind(this))
      .on('error', this.handleError.bind(this))
    this.jobWorkStartedEmitter = this.history.events.WorkStarted({})
      .on('data', this.handleJobWorkStartedData.bind(this))
      .on('error', this.handleError.bind(this))
    // this.jobClosedEmitter = this.contract.events.JobClosed({})
    //   .on('data', this.handleJobClosedData.bind(this))
    //   .on('error', this.handleError.bind(this))

    return this.token
  }

  disconnect () {
    if (this.isConnected) {
      this.jobCreatedEmitter.removeAllListeners()
      this.jobClosedEmitter.removeAllListeners()
      this.jobStartWorkRequestedEmitter.removeAllListeners()
      this.jobCreatedEmitter = null
      this.jobClosedEmitter = null
      this.jobStartWorkRequestedEmitter = null
      this.contract = null
      this.history = null
    }
  }

  get isConnected () {
    return this.contract != null // nil check
  }

  createPostJobTx (sender: String, flowType: Number, area: Number, category: Number, skills: Number, defaultPay: Number, detailsIPFSHash: String) {
    const data = this.contract.methods.postJob(flowType, area, category, skills, defaultPay, ipfsHashToBytes32(detailsIPFSHash)).encodeABI()
    return {
      from: sender,
      to: this.address,
      data,
    }
  }

  createPostJobOfferTx (sender: String, jobId: Number, rate: BigNumber, estimate: BigNumber, ontop: BigNumber) {
    const data = this.contract.methods.postJobOffer(jobId, rate, estimate, ontop).encodeABI()
    return {
      from: sender,
      to: this.address,
      data,
    }
  }

  createPostJobOfferWithPriceTx (sender: String, jobId: Number, fixedPrice: BigNumber) {
    const data = this.contract.methods.postJobOfferWithPrice(jobId, fixedPrice).encodeABI()
    return {
      from: sender,
      to: this.address,
      data,
    }
  }

  createResumeJobWorkTx (sender: String, jobId: Number) {
    const data = this.contract.methods.resumeWork(jobId).encodeABI()
    return {
      from: sender,
      to: this.address,
      data,
    }
  }

  createPauseJobWorkTx (sender: String, jobId: Number) {
    const data = this.contract.methods.pauseWork(jobId).encodeABI()
    return {
      from: sender,
      to: this.address,
      data,
    }
  }

  cancelJob (sender: String, jobId: Number) {
    // eslint-disable-next-line no-console
    console.log('cancelJob Start: ', jobId, sender)
    const data = this.contract.methods.cancelJob(jobId).encodeABI()
    return {
      from: sender,
      to: this.address,
      data,
    }
  }

  async acceptOffer (from, jobId, workerAddress, calculatedLockAmountForWorker) {
    const data = this.contract.methods.acceptOffer(jobId, workerAddress).encodeABI()
    return {
      from,
      to: this.address,
      data,
      value: +calculatedLockAmountForWorker,
    }
  }

  async calculateLockAmountFor (workerAddress, jobId) {
    return this.contract.methods.calculateLockAmountFor(workerAddress, jobId).call()
  }

  async startWork (from, jobId) {
    const data = this.contract.methods.startWork(jobId).encodeABI()
    return {
      from,
      to: this.address,
      data,
    }
  }

  async confirmStartWork (from, jobId) {
    const data = this.contract.methods.confirmStartWork(jobId).encodeABI()
    return {
      from,
      to: this.address,
      data,
    }
  }

  endWork (from, id) {
    const data = this.contract.methods.endWork(id).encodeABI()
    return {
      from,
      to: this.address,
      data,
    }
  }

  confirmEndWork (from, id) {
    const data = this.contract.methods.confirmEndWork(id).encodeABI()
    return {
      from,
      to: this.address,
      data,
    }
  }

  releasePayment (from, id) {
    const data = this.contract.methods.releasePayment(id).encodeABI()
    return {
      from,
      to: this.address,
      data,
    }
  }

  acceptWorkResults (sender: String, jobId: Number) {
    const data = this.contract.methods.acceptWorkResults(jobId).encodeABI()
    return {
      from: sender,
      to: this.address,
      data,
    }
  }

  rejectWorkResults (sender: String, jobId: Number) {
    const data = this.contract.methods.rejectWorkResults(jobId).encodeABI()
    return {
      from: sender,
      to: this.address,
      data,
    }
  }

  handleJobStartWorkRequestedData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] JobStartWorkRequested', data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('JobPosted', {
        data,
        event: new JobStartWorkRequestedEvent({
          key: `${data.transactionHash}/${data.logIndex}`,
          self: returnValues.self,
          jobId: Number(returnValues.jobId),
          at: Number(returnValues.at),
        }),
      })
    })
  }

  handleJobWorkStartedData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] JobStartWorkRequested', data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('JobPosted', {
        data,
        event: new JobWorkStartedEvent({
          key: `${data.transactionHash}/${data.logIndex}`,
          self: returnValues.self,
          jobId: Number(returnValues.jobId),
          at: Number(returnValues.at),
        }),
      })
    })
  }

  handleJobPostedData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] JobPosted', data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('JobPosted', {
        data,
        event: new JobPostedEvent({
          key: `${data.transactionHash}/${data.logIndex}`,
          self: returnValues.self,
          jobId: Number(returnValues.jobId),
          client: returnValues.client,
          skills: Number(returnValues.skills), // bit-mask,
          skillsArea: Number(returnValues.skillsArea),
          skillsCategory: Number(returnValues.skillsCategory),
          detailsIPFSHash: returnValues.detailsIPFSHash,
          bindStatus: returnValues.bindStatus,
        }),
      })
    })
  }

  handleJobResumedData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] JobResumed', data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('JobResumed', {
        data,
        event: new JobResumedEvent({
          key: `${data.transactionHash}/${data.logIndex}`,
          self: returnValues.self,
          jobId: Number(returnValues.jobId),
          resumedAt: new Date(returnValues.at),
        }),
      })
    })
  }

  handleJobPausedData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] JobPaused', data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('JobPaused', {
        data,
        event: new JobPausedEvent({
          key: `${data.transactionHash}/${data.logIndex}`,
          self: returnValues.self,
          jobId: Number(returnValues.jobId),
          pausedAt: new Date(returnValues.at),
        }),
      })
    })
  }

  handleConfirmEndWorkData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] ConfirmEndWork', data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('ConfirmEndWork', {
        data,
        event: new JobConfirmEndWorkEvent({
          key: `${data.transactionHash}/${data.logIndex}`,
          self: returnValues.self,
          jobId: Number(returnValues.jobId),
        }),
      })
    })
  }

  handleCancelJobData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] cancelJobData', data)
    const { returnValues } = data
    setImmediate(() => {
      this.emit('cancelJob', {
        data,
        event: new JobPausedEvent({
          key: `${data.transactionHash}/${data.logIndex}`,
          self: returnValues.self,
          jobId: Number(returnValues.jobId),
        }),
      })
    })
  }

  handleErrorCodeData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] ErrorCode', data)
  }

  handleJobOfferAcceptedData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] JobOfferAccepted', data)
  }

  handleJobOfferPostedData (data) {
    // eslint-disable-next-line no-console
    console.log('[JobControllerDAO] JobOfferPosted', data)
  }

  handleError (error) {
    // eslint-disable-next-line no-console
    console.error('[JobControllerDAO] Error in subscription', error)
  }
}
