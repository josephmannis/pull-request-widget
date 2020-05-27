import { styled } from 'uebersicht';
import { requestPrs } from './src/api.js'
import { createPr } from './src/model.js'
import { getContentForPrEvent, scrollbarStyle } from './src/viewUtil.js'

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

const getPrsFromResponse = (data) => {
  let prs = []
  data.viewer.pullRequests.nodes.forEach(pr => prs.push(createPr(pr)))
  return prs
}

const refreshPrs = (dispatch) => {
  requestPrs()
  .then(res => res.json())
  .then(res => dispatch({type: eventCreator.fetchSuceeded, data: getPrsFromResponse(res.data)}))
  .catch(error => dispatch({type: eventCreator.fetchFailed, error: error}))
}

export const command = async (dispatch) => refreshPrs(dispatch)

export const refreshFrequency = 600000; // 10m

export const className = `
  box-sizing: border-box;
  left: 2em;
  top: 2em;
  width: 30%;
  height: 60%;
`;

const Widget = styled.div`
  font-family: Avenir;
  background-color: transparent;
  color: white;
  overflow: auto;
  height: 100%;
  padding-right: 1em;
  ${scrollbarStyle};
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

const PullRequest = ({title, url, lastEvent}) => (
  <PullRequestWrapper>
    <h3><a href={url}>{title}</a></h3>
    { getContentForPrEvent(lastEvent) }
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
      <Refresh onClick={() => refreshPrs(dispatch)}>{'\u21BA'}</Refresh>
    </Header>
    <p>Updated at {state.updatedAt}</p>
    { state.error ? state.error : 
      state.pullRequests.map((pr, i) => <PullRequest key={i} title={pr.title} url={pr.url} lastEvent={pr.event}/>)
    }
  </Widget>
);
