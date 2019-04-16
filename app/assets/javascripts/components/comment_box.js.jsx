class CommentBox extends React.Component{

    loadCommentsFromServer(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(result) {
        this.setState({data: result.data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  }

    handleCommentSubmit(comment){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: this.state.data.concat([data])});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    }

  constructor(props){
    super(props);
    this.state = {
      data: []
    };
  }
  
  componentDidMount(){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }
  
  
  render() {
    return (
      <div className="commentBox">
      <h1>Comments</h1>
      <CommentList data={this.state.data}/>
      <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
};

class CommentList extends React.Component{
  
  render() {
  const commentNodes = this.props.data.map(comment=>{
    return (
      <Comment author={comment.author}>
      {comment.text}
      </Comment>
      );
  });
    
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
};

class CommentForm extends React.Component{
  handleSubmit(e){
    e.preventDefault();
    const author = ReactDOM.findDOMNode(this.refs.author).value.trim();
    const text = ReactDOM.findDOMNode(this.refs.text).value.trim();
    if(!text || !author){
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    ReactDOM.findDOMNode(this.refs.author).value = '';
    ReactDOM.findDOMNode(this.refs.text).value = '';
    return;
  }
  render() {
    return (
      <form className="commentForm">
        <input type="text" placeholder="Your name" />
        <input type="text" placeholder="Say something..." />
        <input type="submit" value="Post" />
      </form>
      );
  }
};

class Comment extends React.Component{
  
  render(){
    const rawMarkup = marked(this.props.children.toString(), {sanitize: true})
    return(
    <div className="comment">
      <h3 className="commentAuthor">
      {this.props.author}
      </h3>
      <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
    </div>
    );
  }
};
