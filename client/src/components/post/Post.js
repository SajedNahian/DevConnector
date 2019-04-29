import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "./../common/Spinner";
import { getPost } from "../../actions/postActions";
import PostItem from "../posts/PostItem";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentFeed from "./CommentFeed";

class Post extends Component {
  componentWillMount() {
    this.props.getPost(this.props.match.params.id);
  }
  render() {
    const { post, loading } = this.props.post;
    let postContent;

    if (loading) {
      postContent = <Spinner />;
    } else {
      if (!post || Object.keys(post).length === 0) {
        postContent = (
          <div>
            <h1 className="display-4">Page Not Found</h1>
            <p>Sorry, that comment does not exist</p>
          </div>
        );
      } else {
        postContent = (
          <div>
            <PostItem post={post} showActions={false} />
            <CommentForm postId={post._id} />
            <CommentFeed comments={post.comments} postId={post._id} />
          </div>
        );
      }
    }
    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">
                Back to Feed
              </Link>
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPost }
)(Post);
