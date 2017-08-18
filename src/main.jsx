import ReactDOM from 'react-dom'
import React from 'react'
import NotificationSystem from 'react-notification-system'
// import Moment from "moment"
import "./main.css"

const imagesPath = require.context('./assets', false)

class Main extends React.Component {
  constructor() {
    super()
    this.state = {
      items: []
    }
  }

  handleGlobalActions(action, value1, value2) {
    switch (action) {
      case "notify":
        this.notificationSystem.addNotification({
          message: "hello",
          level: "info",
          autoDismiss: 5 })
        break
    }
  }

  render() {
    return (
      <div>
        <NotificationSystem ref={(notificationSystem) => { this.notificationSystem = notificationSystem }} style={notificationSystemStyle} />
        <div className="panel">
           hello world
        </div>
      </div>
    )
  }
}

const notificationSystemStyle = {
  NotificationItem: {
    DefaultStyle: { padding: "8px 10px 10px 10px" }
  }
}

const root = document.createElement("div")
root.setAttribute("id", "Main")
document.body.appendChild(root)
ReactDOM.render(<Main />, root)
