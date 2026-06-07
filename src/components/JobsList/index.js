import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobsList = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="job-item">
        <div className="job-top">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h3 className="job-title">{title}</h3>
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
        <h4 className="desc-heading">Description</h4>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobsList
