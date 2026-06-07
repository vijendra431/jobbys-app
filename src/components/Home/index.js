import { useNavigate } from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const navigate = useNavigate()

  const onClickFindJobs = () => {
    navigate('/jobs')
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and potential.
          </p>
          <button type="button" className="find-jobs-button" onClick={onClickFindJobs}>
            Find Jobs
          </button>
        </div>
      </div>
    </>
  )
}

export default Home