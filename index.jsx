
import { styled } from 'uebersicht';


const PROXY = 'http://127.0.0.1:41417/'
const BASE_URL = `${PROXY}https://api.github.com/graphql`
const GITHUB_KEY = ''

const eventCreator = {
  fetchSuceeded: 'FETCH_SUCCEEDED',
  fetchFailed: 'FETCH_FAILED'
}

const currentDate = () => {
  let date = new Date(Date.now());
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getHours() > 12 ? 'PM' : 'AM'}`
}

export const initialState = {
  pullRequests: [],
  error: '',
  updtedAt: currentDate()
}

export const updateState = (event, previousState) => {
    switch (event.type) {
        case eventCreator.fetchSuceeded: 
          return { pullRequests: event.data, updatedAt: currentDate() }
        case eventCreator.fetchFailed: 
          return {  updatedAt: currentDate(), error: 'Could not fetch PRs. Did you provide an API key?' }
        default: return previousState;
    }
};

const getPrsFromResponse = (data) => data.viewer.pullRequests.nodes.filter(pr => pr.viewerDidAuthor)

const requestPrs = async (dispatch) => {
  let prQuery = {
    query: "query { viewer { pullRequests(first: 20, states: [OPEN]) { nodes { url viewerDidAuthor reviewDecision title } } } }"
  }

  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${GITHUB_KEY}`
    },
    body: JSON.stringify(prQuery)
  })
  .then(res => res.json())
  .then(res => dispatch({type: eventCreator.fetchSuceeded, data: getPrsFromResponse(res.data)}))
  .catch(error => dispatch({type: eventCreator.fetchFailed, error: error}))
}

export const command = async (dispatch) => requestPrs(dispatch)

export const refreshFrequency = 600000; // 10m

export const className = `
  left: 2em;
  top: 2em;
  width: 30%;
  max-height: 50%;
`;

const Widget = styled.div`
  font-family: Avenir;
  background-color: transparent;
  color: white;
  border-radius: 14px;
`

const PullRequestWrapper = styled.div`
  border-bottom: .25px solid white; 
  padding: 2em 0;
  text-transform: capitalize;

  & a {
    text-decoration: none;
    color: white;
  }

  & h3 {
    margin-top: 0;
  }
`

const mapStatusToEmoji = (status) => {
  switch(status) {
    case 'CHANGES_REQUESTED':
      return '💢'
    case 'APPROVED':
      return '🎉'
    default: 
      return '👁'
  }
}

const getReviewDecisionText = (status) => {
  if (status) {
    return status.toLowerCase().replace('_', ' ')
  }

  return 'Awaiting Review'
}

const PullRequest = ({title, url, status}) => (
  <PullRequestWrapper>
    <h3><a href={url}>{title}</a></h3>
    {`${mapStatusToEmoji(status)} ${getReviewDecisionText(status)}`}
  </PullRequestWrapper>
)

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h1`
  margin: 0;
`

const Refresh = styled.button`
  padding: 0;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 1.5em;
`

export const render = (state, dispatch) => (
  <Widget>
    <Header>
      <Title> Open Pull Requests </Title>
      <Refresh onClick={() => requestPrs(dispatch)}>{'\u21BA'}</Refresh>
    </Header>
    <p>Updated at {state.updatedAt}</p>
    { state.error ? state.error : 
      state.pullRequests.map((pr, i) => <PullRequest key={i} title={pr.title} url={pr.url} status={pr.reviewDecision}/>)
    }
  </Widget>
);
