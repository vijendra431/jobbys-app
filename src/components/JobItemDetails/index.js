import { Component } from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import { AiFillStar } from 'react-icons/ai'
import { MdLocationOn } from 'react-icons/md'
import { BsBriefcaseFill } from 'react-icons/bs'
import { FiExternalLink } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import Header from '../Header'

import './index.css'

const activeApiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  process: 'PROCESS',
}

const JobItemDetailsWrapper = () => {
  const { id } = useParams()
  return <JobItemDetails id={id} />
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: activeApiStatus.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({ apiStatus: activeApiStatus.process })
    const { id } = this.props

    const jobUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwtToken')
    const options = {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwtToken}` },
    }

    const response = await fetch(jobUrl, options)
    if (response.ok) {
      const data = await response.json()
      const jobData = data.job_details

      const updatedJobDetails = {
        companyLogoUrl: jobData.company_logo_url,
        companyWebsiteUrl: jobData.company_website_url,
        employmentType: jobData.employment_type,
        id: jobData.id,
        jobDescription: jobData.job_description,
        location: jobData.location,
        packagePerAnnum: jobData.package_per_annum,
        rating: jobData.rating,
        title: jobData.title,
        skills: jobData.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        lifeAtCompany: {
          description: jobData.life_at_company.description,
          imageUrl: jobData.life_at_company.image_url,
        },
      }

      const updatedSimilarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        apiStatus: activeApiStatus.success,
      })
    } else {
      this.setState({ apiStatus: activeApiStatus.failure })
    }
  }

  renderJobDetails = () => {
    const { jobDetails, similarJobs } = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills = [],
      lifeAtCompany = {},
    } = jobDetails

    return (
      <div className="job-details-page">
        <div className="job-details-card">
          <div className="job-top">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="job-middle">
            <div className="location-type">
              <div className="icon-text">
                <MdLocationOn className="job-icon" />
                <p className="job-text">{location}</p>
              </div>
              <div className="icon-text">
                <BsBriefcaseFill className="job-icon" />
                <p className="job-text">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr className="job-divider" />

          <div className="desc-header">
            <h2 className="desc-heading">Description</h2>
            {/* ✅ Fixed: anchor tag written on a single clean opening line */}
            <a
              href={companyWebsiteUrl}
              className="visit-link"
              target="_blank"
              rel="noreferrer"
            >
              Visit <FiExternalLink />
            </a>
          </div>

          <p className="job-description">{jobDescription}</p>

          <h2 className="desc-heading">Skills</h2>
          <ul className="skills-list">
            {skills.map(eachSkill => (
              <li key={eachSkill.name} className="skill-item">
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>

          <h2 className="desc-heading">Life at Company</h2>
          <div className="life-container">
            <p className="life-description">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-image"
            />
          </div>
        </div>

        <h2 className="similar-heading">Similar Jobs</h2>
        <ul className="similar-jobs-list">
          {similarJobs.map(eachJob => (
            <li key={eachJob.id} className="similar-job-card">
              <div className="job-top">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div>
                  <h3 className="job-title">{eachJob.title}</h3>
                  <div className="rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating">{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <h4 className="desc-heading">Description</h4>
              <p className="job-description">{eachJob.jobDescription}</p>
              <div className="icon-text">
                <MdLocationOn className="job-icon" />
                <p className="job-text">{eachJob.location}</p>
              </div>
              <div className="icon-text">
                <BsBriefcaseFill className="job-icon" />
                <p className="job-text">{eachJob.employmentType}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderSpinner = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllActivePages = () => {
    const { apiStatus } = this.state
    switch (apiStatus) {
      case activeApiStatus.success:
        return this.renderJobDetails()
      case activeApiStatus.failure:
        return this.renderFailureView()
      case activeApiStatus.process:
        return this.renderLoaderSpinner()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">
          {this.renderAllActivePages()}
        </div>
      </>
    )
  }
}

export default JobItemDetailsWrapper
