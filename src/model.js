
/**
{ 
  title: string,
  url: string,
  event: {
    type: string,
    // commit message
    message?: string,

    // review state
    state?: string
  }
}
*/

export const prEventTypes = {
    reviewEvent: 'REVIEW_ADDED',
    reviewRequestedEvent: 'REVIEW_REQUESTED',
    commitEvent: 'COMMIT_ADDED',
    unknown: 'UKNOWN_EVENT'
}

export const createPr = (pullRequest) => {
  let pr = {
    title: pullRequest.title,
    url: pullRequest.url
  }
  // pr.viewerDidAuthor
  let timelineItem = pullRequest.timelineItems.nodes[0];
  if (timelineItem) {
    // A review was requested
    if (timelineItem.requestedReviewer) {
      pr = {
        ...pr,
        event: {
          type: prEventTypes.reviewRequestedEvent
        }
      }
    }
    // A commit was made
    else if (timelineItem.commit) {
      pr = {
        ...pr,
        event: {
          type: prEventTypes.commitEvent,
          message: timelineItem.message
        }
      }
    }
    // A review was completed
    else if (timelineItem.state) {
      pr = {
        ...pr,
        event: {
          type: prEventTypes.reviewEvent,
          state: timelineItem.state
        }
      }
    }
    // Unsupported PR Update
    else {
      pr = {
        ...pr,
        event: {
          type: prEventTypes.unknown
        }
      }
    }
  }

  return pr
}