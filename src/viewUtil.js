import { prEventTypes } from './model.js'

const mapReviewStatusToContent = (status) => {
    switch(status) {
        case 'CHANGES_REQUESTED': return '😔 Changes Requested'
        case 'APPROVED': return '🥳 Approved!'
        case 'PENDING': return '😑 Review Pending'
        case 'COMMENTED': return '😳 Comments added'
        case 'DISMISSED': return '😶 Review dismissed'
        default: return ''
    }
}
  
const parseEventName = (event) => event.toLowerCase().replace('_', ' ')
  
export const getContentForPrEvent = (event) => {
    switch(event.type) {
        case prEventTypes.commitEvent:
          return '🙏 Changes submitted'
        case prEventTypes.reviewEvent:
          return `${mapReviewStatusToContent(event.state)}`
        case prEventTypes.reviewRequestedEvent:
          return `👋 ${parseEventName(event.type)}`
        default: 
            console.log(`Github Widget: A view for the latest event on the PR is not supported by this widget: ${event.type}`)
            return '👀 Changes ocurred' 
    }
}

export const scrollbarStyle = `
  /* width */
  ::-webkit-scrollbar {
    width: 9px;

  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgba(136, 136, 136, .23);
    border-radius: 1em;
    margin: 1em 0;
    border: 5px solid rgba(136,136,136,.23);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    transition: all .1s ease-in-out;
    background: #555;
  }
`