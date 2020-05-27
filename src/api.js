const PROXY = 'http://127.0.0.1:41417/'
const BASE_URL = `${PROXY}https://api.github.com/graphql`
const GITHUB_KEY = ''

export const requestPrs = async () => {
  let prQuery = {
    query: `query { 
              viewer { 
                pullRequests(first: 20, states: [OPEN]) { 
                  nodes { 
                    url 
                    viewerDidAuthor 
                    reviewDecision 
                    title 
                    timelineItems(last: 1) {
                      nodes {
                        ...on PullRequestCommit {
                          commit {
                            message
                          }
                        }
                        ...on ReviewRequestedEvent {
                          requestedReviewer {
                            ...on User {
                              name
                            }
                          }
                        }
                        ...on PullRequestReview {
                          state
                        }
                      }
                    }
                  }
                }
              }
            }
          `
  }

  return fetch(BASE_URL, {
    method: 'POST',
    headers: {
        'Authorization': `bearer ${GITHUB_KEY}`
    },
    body: JSON.stringify(prQuery)
  })
}