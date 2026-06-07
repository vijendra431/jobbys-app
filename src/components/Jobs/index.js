import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import {BsSearch} from 'react-icons/bs'
import JobsList from '../JobsList'
import './index.css'
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const activeApiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  process: 'PROCESS',
}

class Jobs extends Component {
  state = {
    selectedSalary: '',
    selectedEmployment: [],
    profileInfo: {},
    allJobsList: [],
    showLoader: false,
    apiStatus: activeApiStatus.initial,
    searchInput: '',
    profileApiStatus: activeApiStatus.initial,
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  handleRadio = event => {
    this.setState({selectedSalary: event.target.value}, this.getAllJobsData)
  }

  handleCheckbox = event => {
    const {value, checked} = event.target

    if (checked) {
      this.setState(
        prevState => ({
          selectedEmployment: [...prevState.selectedEmployment, value],
        }),
        this.getAllJobsData,
      )
    } else {
      this.setState(
        prevState => ({
          selectedEmployment: prevState.selectedEmployment.filter(
            eachItem => eachItem !== value,
          ),
        }),
        this.getAllJobsData,
      )
    }
  }

  componentDidMount() {
    this.getProfileData()
    this.getAllJobsData()
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: activeApiStatus.process})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwtToken')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(profileUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.setState({
        profileInfo: data.profile_details,
        profileApiStatus: activeApiStatus.success,
      })
    } else {
      this.setState({profileApiStatus: activeApiStatus.failure})
    }
  }

  getAllJobsData = async () => {
    const {searchInput, selectedEmployment, selectedSalary} = this.state
    this.setState({showLoader: true})
    const jobUrl = `https://apis.ccbp.in/jobs?search=${searchInput}&employment_type=${selectedEmployment.join(
      ',',
    )}&minimum_package=${selectedSalary}`
    const jwtToken = Cookies.get('jwtToken')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        allJobsList: updatedData,
        apiStatus: activeApiStatus.success,
        showLoader: false,
      })
    } else if (response.ok === false) {
      this.setState({apiStatus: activeApiStatus.failure, showLoader: false})
    }
  }

  onClickSearchInput = () => {
    this.getAllJobsData()
  }

  renderAllJobsList = () => {
    const {allJobsList, searchInput} = this.state

    if (allJobsList.length === 0) {
      return this.renderNoJobsView()
    }
    return (
      <div className="second-part">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchInput}
            onChange={this.onChangeSearchInput}
          />
          <button
            type="button"
            data-testid="searchButton"
            className="search-button"
            onClick={this.onClickSearchInput}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <ul>
          {allJobsList.map(eachJob => (
            <JobsList key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => {
    return (
      <div className="failure-container">
        <div className="failure-container2">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="failure-image"
          />
          <h1 className="failure-heading">Oops! Something Went Wrong </h1>
          <p className="failure-para">
            We cannot seem to find the page you are looking for
          </p>
          <button className="retry-button">Retry</button>
        </div>
      </div>
    )
  }

  renderLoaderSpinner = () => {
    return (
      <div className="loader-containers">
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      </div>
    )
  }

  renderNoJobsView = () => {
    return (
      <div className="no-jobs-container">
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />
          <h1 className="no-heading">No Jobs Found</h1>
          <p className="no-para">We could not find any jobs. Try otherjobs</p>
        </div>
      </div>
    )
  }

  renderAllActivePages = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case activeApiStatus.success:
        return this.renderAllJobsList()
      case activeApiStatus.failure:
        return this.renderFailureView()
      case activeApiStatus.process:
        return this.renderLoaderSpinner()
      default:
        return null
    }
  }

  renderProfilePage = () => {
    const {profileInfo, profileApiStatus} = this.state

    switch (profileApiStatus) {
      case activeApiStatus.success:
        return (
          <div className="profile-container">
            <img
              src={profileInfo.profile_image_url}
              alt="profile"
              className="profile-image"
            />
            <h2 className="profile-heading">{profileInfo.name}</h2>
            <p className="profile-description">{profileInfo.short_bio}</p>
          </div>
        )
      case activeApiStatus.failure:
        return (
          <div className="profile-failure-container">
            <button className="retry-profile" onClick={this.getProfileData}>
              Retry
            </button>
          </div>
        )
      case activeApiStatus.process:
        return this.renderLoaderSpinner()
      default:
        return null
    }
  }
  render() {
    const {selectedSalary, selectedEmployment, showLoader} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-container2">
            <div className="first-part">
              {this.renderProfilePage()}

              <hr className="line" />
              <div className="employment-container">
                <h2 className="emp-heading">Type of Employment</h2>
                <ul className="employment-items">
                  {employmentTypesList.map(eachEmployment => (
                    <li
                      className="list-emp"
                      key={eachEmployment.employmentTypeId}
                    >
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox-gap"
                          onChange={this.handleCheckbox}
                          value={eachEmployment.employmentTypeId}
                          checked={selectedEmployment.includes(
                            eachEmployment.employmentTypeId,
                          )}
                        />
                        {eachEmployment.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="line" />
              <div className="salaries-container">
                <ul className="salaries-list">
                  {salaryRangesList.map(eachSalary => (
                    <li key={eachSalary.salaryRangeId} className="list-emp">
                      <input
                        type="radio"
                        id={eachSalary.salaryRangeId}
                        value={eachSalary.salaryRangeId}
                        name="salary"
                        checked={selectedSalary === eachSalary.salaryRangeId}
                        onChange={this.handleRadio}
                        className="checkbox-gap"
                      />
                      <label htmlFor={eachSalary.salaryRangeId}>
                        {eachSalary.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="second-part-start"></div>
            {showLoader
              ? this.renderLoaderSpinner()
              : this.renderAllActivePages()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
