import React from 'react';
import MainFeedTagList from './main-feed-tag-list.js';

export default class MainFeedJobItem extends React.Component {
  render() {
    return (
      <div>
        <div className="panel-post panel">
          <div className="panel-body job-post">
            <div className="job-title">
              <h3>
                <span className="glyphicon glyphicon-paperclip"></span>
                <a href='#'> {this.props.feedItemName}</a>
              </h3>
            </div>
            <div className="job-desc">
              <p>
                 {this.props.postData}
              </p>
            </div>
            <div className="row">
              <MainFeedTagList tags= {this.props.tags} />
              <div className="col-md-6">
                <div className="pull-right">
                  Ranking: <button type="button" className={this.props.rankingType} >
                  <span><img src="img/favicon.ico" className="best-fit-ico"/></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
